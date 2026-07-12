import { Router } from "express";
import { postMessage } from "../controllers/message.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// GET history now lives on GET /api/conversations/:id/messages - a message
// no longer makes sense without knowing which conversation it belongs to.
router.post("/messages", authenticate, postMessage);

export default router;
