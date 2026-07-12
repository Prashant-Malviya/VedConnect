import { Router } from "express";
import { getConversations, getConversationMessages } from "../controllers/conversation.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/conversations", authenticate, getConversations);
router.get("/conversations/:id/messages", authenticate, getConversationMessages);

export default router;
