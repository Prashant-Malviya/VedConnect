import { Router } from "express";
import { getMyCallHistory } from "../controllers/call.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);
router.get("/calls", getMyCallHistory);

export default router;
