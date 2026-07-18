import * as communityRepository from "../repositories/community.repository";
import * as conversationRepository from "../repositories/conversation.repository";
import * as messageRepository from "../repositories/message.repository";
import * as userRepository from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import {
  CreateCommunityInput,
  UpdateCommunityInput,
  CommunitySummary,
  CommunityMemberSummary,
} from "../types/community.types";
import { CommunityDocument } from "../models/community.model";
import { CommunityRole } from "../models/community-member.model";
import { joinUserToConversationRoom } from "../sockets";

const slugify = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "community";

const generateUniqueSlug = async (name: string): Promise<string> => {
  const base = slugify(name);
  let candidate = base;
  let suffix = 1;
  while (await communityRepository.findCommunityBySlug(candidate)) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  return candidate;
};

const toSummary = async (
  community: CommunityDocument & { _id: any },
  requestingUserId?: string
): Promise<CommunitySummary> => {
  const [memberCount, owner, myMembership] = await Promise.all([
    communityRepository.countMembers(community._id.toString()),
    community.owner ? userRepository.findUserById(community.owner.toString()) : Promise.resolve(null),
    requestingUserId
      ? communityRepository.findMembership(community._id.toString(), requestingUserId)
      : Promise.resolve(null),
  ]);

  return {
    id: community._id.toString(),
    name: community.name,
    slug: community.slug,
    description: community.description,
    image: community.image,
    isDefault: community.isDefault,
    isPrivate: community.settings.isPrivate,
    owner: { id: community.owner?.toString() || "", name: owner?.name || "VedConnect" },
    memberCount,
    conversationId: community.conversationId.toString(),
    myRole: myMembership?.role || null,
    createdAt: community.createdAt,
  };
};

// Called once at server startup - identical role to the old
// ensureCommunityConversation, but backed by a real Community document so
// it behaves like every other community from here on.
export const ensureDefaultCommunity = async () => {
  let community = await communityRepository.findDefaultCommunity();

  if (!community) {
    const conversation = await conversationRepository.createGroupConversation(
      communityRepository.GLOBAL_COMMUNITY_NAME
    );

    community = await communityRepository.createCommunity({
      name: communityRepository.GLOBAL_COMMUNITY_NAME,
      slug: communityRepository.GLOBAL_COMMUNITY_SLUG,
      description: "The default public space for every VedConnect member.",
      image: "",
      // No single owner - it belongs to everyone. owner is left undefined.
      isDefault: true,
      settings: { isPrivate: false },
      conversationId: conversation._id,
    } as Partial<CommunityDocument>);

    conversation.communityId = community._id as any;
    await conversation.save();
  }

  // Every existing user must already be a member (self-healing, mirrors old behavior).
  const allUserIds = await userRepository.findAllUserIds();
  for (const userId of allUserIds) {
    await communityRepository.addMember(community._id.toString(), userId, "member");
    await conversationRepository.addParticipant(community.conversationId.toString(), userId);
  }

  return community;
};

// Called after signup - every new user automatically joins the default community.
export const addUserToDefaultCommunity = async (userId: string) => {
  const community = await communityRepository.findDefaultCommunity();
  if (!community) return;
  await communityRepository.addMember(community._id.toString(), userId, "member");
  await conversationRepository.addParticipant(community.conversationId.toString(), userId);
};

export const createCommunity = async (input: CreateCommunityInput) => {
  if (!input.name?.trim()) {
    throw new AppError("Community name is required", 400);
  }

  const slug = await generateUniqueSlug(input.name);
  const conversation = await conversationRepository.createGroupConversation(input.name.trim());

  const community = await communityRepository.createCommunity({
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || "",
    image: input.image?.trim() || "",
    owner: input.ownerId as any,
    isDefault: false,
    settings: { isPrivate: Boolean(input.isPrivate) },
    conversationId: conversation._id,
  } as Partial<CommunityDocument>);

  conversation.communityId = community._id as any;
  await conversation.save();

  await communityRepository.addMember(community._id.toString(), input.ownerId, "owner");
  await conversationRepository.addParticipant(conversation._id.toString(), input.ownerId);
  joinUserToConversationRoom(input.ownerId, conversation._id.toString());

  return toSummary(community, input.ownerId);
};

const getCommunityOrThrow = async (communityId: string) => {
  const community = await communityRepository.findCommunityById(communityId);
  if (!community) {
    throw new AppError("Community not found", 404);
  }
  return community;
};

const assertRole = async (
  communityId: string,
  userId: string,
  allowed: CommunityRole[]
): Promise<CommunityRole> => {
  const membership = await communityRepository.findMembership(communityId, userId);
  if (!membership || !allowed.includes(membership.role)) {
    throw new AppError("You do not have permission to manage this community", 403);
  }
  return membership.role;
};

export const getCommunity = async (communityId: string, requestingUserId: string) => {
  const community = await getCommunityOrThrow(communityId);
  return toSummary(community, requestingUserId);
};

export const searchCommunities = async (query: string, requestingUserId: string) => {
  const communities = await communityRepository.searchPublicCommunities(query || "");
  return Promise.all(communities.map((c) => toSummary(c, requestingUserId)));
};

// Every community the user belongs to - the "My Communities" sidebar list.
export const listMyCommunities = async (userId: string) => {
  const communityIds = await communityRepository.findCommunityIdsForUser(userId);
  const communities = await Promise.all(
    communityIds.map((id) => communityRepository.findCommunityById(id))
  );
  const summaries = await Promise.all(
    communities.filter((c): c is NonNullable<typeof c> => Boolean(c)).map((c) => toSummary(c, userId))
  );
  // Default community first, then alphabetical - matches the old single-pinned-item UX.
  return summaries.sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
};

export const updateCommunity = async (
  communityId: string,
  userId: string,
  updates: UpdateCommunityInput
) => {
  const community = await getCommunityOrThrow(communityId);
  await assertRole(communityId, userId, ["owner", "admin"]);

  const patch: Partial<CommunityDocument> = {};
  if (updates.name?.trim()) patch.name = updates.name.trim();
  if (updates.description !== undefined) patch.description = updates.description.trim();
  if (updates.image !== undefined) patch.image = updates.image.trim();
  if (updates.isPrivate !== undefined) {
    patch.settings = { isPrivate: updates.isPrivate };
  }

  const updated = await communityRepository.updateCommunity(communityId, patch);
  if (!updated) throw new AppError("Community not found", 404);

  // Keep the conversation's display name in sync with the community name.
  if (patch.name) {
    await conversationRepository
      .findConversationById(community.conversationId.toString())
      .then((c) => c && Object.assign(c, { name: patch.name }).save());
  }

  return toSummary(updated, userId);
};

export const deleteCommunity = async (communityId: string, userId: string) => {
  const community = await getCommunityOrThrow(communityId);
  if (community.isDefault) {
    throw new AppError("The default community cannot be deleted", 400);
  }
  if (community.owner?.toString() !== userId) {
    throw new AppError("Only the owner can delete this community", 403);
  }

  await messageRepository.deleteMessagesForConversation(community.conversationId.toString());
  await conversationRepository.findConversationById(community.conversationId.toString()).then((c) =>
    c ? c.deleteOne() : null
  );
  await communityRepository.deleteCommunity(communityId);
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const community = await getCommunityOrThrow(communityId);
  if (community.settings.isPrivate) {
    throw new AppError("This community is invite-only", 403);
  }

  await communityRepository.addMember(communityId, userId, "member");
  await conversationRepository.addParticipant(community.conversationId.toString(), userId);
  joinUserToConversationRoom(userId, community.conversationId.toString());

  return toSummary(community, userId);
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const community = await getCommunityOrThrow(communityId);
  if (community.isDefault) {
    throw new AppError("You cannot leave the default community", 400);
  }
  if (community.owner?.toString() === userId) {
    throw new AppError("The owner cannot leave - delete the community instead, or transfer ownership first", 400);
  }

  await communityRepository.removeMember(communityId, userId);
  // Participants array intentionally left as-is for message history integrity;
  // the socket layer only routes live events, so leaving just stops future joins.
};

// Owner/admin action: add an existing user directly (an "invite" without a
// separate invite-link system, matching the current codebase's lack of email/SMS infra).
export const inviteMember = async (communityId: string, actingUserId: string, targetUserId: string) => {
  const community = await getCommunityOrThrow(communityId);
  await assertRole(communityId, actingUserId, ["owner", "admin"]);

  const targetUser = await userRepository.findUserById(targetUserId);
  if (!targetUser) {
    throw new AppError("User not found", 404);
  }

  await communityRepository.addMember(communityId, targetUserId, "member");
  await conversationRepository.addParticipant(community.conversationId.toString(), targetUserId);
  joinUserToConversationRoom(targetUserId, community.conversationId.toString());
};

export const listMembers = async (communityId: string): Promise<CommunityMemberSummary[]> => {
  await getCommunityOrThrow(communityId);
  const memberships = await communityRepository.listMembers(communityId);

  const users = await Promise.all(memberships.map((m) => userRepository.findUserById(m.userId.toString())));

  return memberships
    .map((m, i) => {
      const user = users[i];
      if (!user) return null;
      return { id: user._id.toString(), name: user.name, email: user.email, role: m.role };
    })
    .filter((m): m is CommunityMemberSummary => Boolean(m));
};

export const updateMemberRole = async (
  communityId: string,
  actingUserId: string,
  targetUserId: string,
  role: CommunityRole
) => {
  const community = await getCommunityOrThrow(communityId);
  if (community.owner?.toString() !== actingUserId) {
    throw new AppError("Only the owner can change member roles", 403);
  }
  if (targetUserId === community.owner?.toString()) {
    throw new AppError("The owner's role cannot be changed", 400);
  }
  if (role === "owner") {
    throw new AppError("Ownership transfer isn't supported yet", 400);
  }

  const updated = await communityRepository.updateMemberRole(communityId, targetUserId, role);
  if (!updated) throw new AppError("This user is not a member of the community", 404);
  return updated;
};

export const removeMember = async (communityId: string, actingUserId: string, targetUserId: string) => {
  const community = await getCommunityOrThrow(communityId);
  await assertRole(communityId, actingUserId, ["owner", "admin"]);

  if (targetUserId === community.owner?.toString()) {
    throw new AppError("The owner cannot be removed", 400);
  }

  await communityRepository.removeMember(communityId, targetUserId);
};

// Used by AIOrchestratorService to confirm a conversation is community-scoped
// and to find which community it belongs to (for logging/future per-community settings).
export const findCommunityByConversationId = async (conversationId: string) => {
  return communityRepository.findCommunityByConversationId(conversationId);
};
