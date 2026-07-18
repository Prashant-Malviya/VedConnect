import { Request, Response, NextFunction } from "express";
import * as callService from "../services/call.service";
import * as transcriptService from "../services/voice/TranscriptService";
import { AppError } from "../utils/app-error";
import { sendSuccess } from "../utils/response.util";

export const getCallTranscript = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { callId } = req.params;
    const session = callService.getSession(callId);

    // Only an actual participant may read a call's transcript, and only
    // while the call is live - there's nothing to fetch once it's ended,
    // since the transcript is cleared alongside the call (see
    // VoiceAIService.cleanupCall).
    if (!session || (session.callerId !== req.user!.id && session.receiverId !== req.user!.id)) {
      throw new AppError("Call not found or already ended", 404);
    }

    sendSuccess(res, 200, "Transcript fetched", transcriptService.getTranscript(callId));
  } catch (error) {
    next(error);
  }
};
