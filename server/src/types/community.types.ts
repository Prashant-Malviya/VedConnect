import { CommunityRole } from "../models/community-member.model";

export interface CreateCommunityInput {
  name: string;
  description?: string;
  image?: string;
  isPrivate?: boolean;
  ownerId: string;
}

export interface UpdateCommunityInput {
  name?: string;
  description?: string;
  image?: string;
  isPrivate?: boolean;
}

export interface CommunityMemberSummary {
  id: string;
  name: string;
  email: string;
  role: CommunityRole;
}

export interface CommunitySummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isDefault: boolean;
  isPrivate: boolean;
  owner: { id: string; name: string };
  memberCount: number;
  conversationId: string;
  myRole: CommunityRole | null; // null if the requesting user isn't a member
  createdAt: Date;
}

export type { CommunityRole };
