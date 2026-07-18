import { CommunityModel, CommunityDocument } from "../models/community.model";
import { CommunityMemberModel, CommunityRole } from "../models/community-member.model";

export const GLOBAL_COMMUNITY_SLUG = "global";
export const GLOBAL_COMMUNITY_NAME = "🌍 VedConnect Community";

export const findDefaultCommunity = async () => {
  return CommunityModel.findOne({ isDefault: true });
};

export const createCommunity = async (data: Partial<CommunityDocument>) => {
  return CommunityModel.create(data);
};

export const findCommunityById = async (communityId: string) => {
  return CommunityModel.findById(communityId);
};

export const findCommunityBySlug = async (slug: string) => {
  return CommunityModel.findOne({ slug });
};

export const findCommunityByConversationId = async (conversationId: string) => {
  return CommunityModel.findOne({ conversationId });
};

export const updateCommunity = async (communityId: string, updates: Partial<CommunityDocument>) => {
  return CommunityModel.findByIdAndUpdate(communityId, updates, { new: true });
};

export const deleteCommunity = async (communityId: string) => {
  await CommunityMemberModel.deleteMany({ communityId });
  return CommunityModel.findByIdAndDelete(communityId);
};

// Public search: public communities matching a text/name query, newest first.
export const searchPublicCommunities = async (query: string, limit = 30) => {
  const filter: Record<string, unknown> = { "settings.isPrivate": false };
  if (query.trim()) {
    filter.name = { $regex: query.trim(), $options: "i" };
  }
  return CommunityModel.find(filter).sort({ createdAt: -1 }).limit(limit);
};

export const countMembers = async (communityId: string) => {
  return CommunityMemberModel.countDocuments({ communityId });
};

export const findMembership = async (communityId: string, userId: string) => {
  return CommunityMemberModel.findOne({ communityId, userId });
};

export const addMember = async (communityId: string, userId: string, role: CommunityRole = "member") => {
  return CommunityMemberModel.findOneAndUpdate(
    { communityId, userId },
    { $setOnInsert: { role, joinedAt: new Date() } },
    { upsert: true, new: true }
  );
};

export const removeMember = async (communityId: string, userId: string) => {
  return CommunityMemberModel.findOneAndDelete({ communityId, userId });
};

export const updateMemberRole = async (communityId: string, userId: string, role: CommunityRole) => {
  return CommunityMemberModel.findOneAndUpdate({ communityId, userId }, { role }, { new: true });
};

export const listMembers = async (communityId: string) => {
  return CommunityMemberModel.find({ communityId }).sort({ joinedAt: 1 });
};

// Every community this user belongs to - drives the "My Communities" sidebar section.
export const findCommunityIdsForUser = async (userId: string) => {
  const memberships = await CommunityMemberModel.find({ userId }).select("communityId");
  return memberships.map((m) => m.communityId.toString());
};
