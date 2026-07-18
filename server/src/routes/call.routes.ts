import { Router } from "express";
import { getMyCallHistory } from "../controllers/call.controller";
import { getCallTranscript } from "../controllers/voice-ai.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/calls", getMyCallHistory);
router.get("/calls/:callId/transcript", getCallTranscript);

export default router;
