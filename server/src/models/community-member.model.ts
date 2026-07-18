import { Schema, model, Types } from "mongoose";

// Separate collection from Community so membership can grow to any size
// without bloating the Community document, and so both directions of
// lookup ("members of X" / "communities I'm in") are index-backed instead
// of scanning an embedded array.
export type CommunityRole = "owner" | "admin" | "member";

export interface CommunityMemberDocument {
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  role: CommunityRole;
  joinedAt: Date;
}

const communityMemberSchema = new Schema<CommunityMemberDocument>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "admin", "member"], default: "member" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// One membership row per (community, user) pair; also backs "am I a member" checks.
communityMemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });
// Backs "list every community this user belongs to".
communityMemberSchema.index({ userId: 1 });

export const CommunityMemberModel = model<CommunityMemberDocument>(
  "CommunityMember",
  communityMemberSchema
);
