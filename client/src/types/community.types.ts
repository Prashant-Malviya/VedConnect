export type CommunityRole = "owner" | "admin" | "member";

export interface Community {
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
  myRole: CommunityRole | null;
  createdAt: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: CommunityRole;
}
