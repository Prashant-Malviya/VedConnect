import { Router } from "express";
import {
  createCommunity,
  listCommunities,
  getCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
  inviteMember,
  listMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/community.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/communities", createCommunity);
router.get("/communities", listCommunities);
router.get("/communities/:id", getCommunity);
router.patch("/communities/:id", updateCommunity);
router.delete("/communities/:id", deleteCommunity);

router.post("/communities/:id/join", joinCommunity);
router.post("/communities/:id/leave", leaveCommunity);
router.post("/communities/:id/invite", inviteMember);

router.get("/communities/:id/members", listMembers);
router.patch("/communities/:id/members/:userId", updateMemberRole);
router.delete("/communities/:id/members/:userId", removeMember);

export default router;
