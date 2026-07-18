import { Schema, model, Types } from "mongoose";

// A Community is a user-created (or the single default/global) group.
// Membership and roles live in CommunityMember, NOT here, to avoid an
// unbounded array on this document and to make "communities I'm in" and
// "members of this community" both cheap, indexed queries.
export interface CommunitySettings {
  isPrivate: boolean; // private communities don't show up in public search and require an invite
}

export interface CommunityDocument {
  name: string;
  slug: string;
  description: string;
  image: string; // URL - empty string means "no custom image, use initials"
  owner?: Types.ObjectId; // undefined only for the default/global community, which has no single owner
  isDefault: boolean; // true only for the single bootstrap "Global Community"
  settings: CommunitySettings;
  conversationId: Types.ObjectId; // the group Conversation this community chats in
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema = new Schema<CommunityDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, default: "", maxlength: 500 },
    image: { type: String, trim: true, default: "" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    isDefault: { type: Boolean, default: false },
    settings: {
      isPrivate: { type: Boolean, default: false },
    },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
  },
  { timestamps: true }
);

communitySchema.index({ name: "text", description: "text" }); // powers community search

export const CommunityModel = model<CommunityDocument>("Community", communitySchema);
