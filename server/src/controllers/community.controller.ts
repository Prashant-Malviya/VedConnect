import { Request, Response, NextFunction } from "express";
import * as communityService from "../services/community.service";
import { sendSuccess } from "../utils/response.util";

export const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image, isPrivate } = req.body;
    const community = await communityService.createCommunity({
      name,
      description,
      image,
      isPrivate,
      ownerId: req.user!.id,
    });
    sendSuccess(res, 201, "Community created", community);
  } catch (error) {
    next(error);
  }
};

// GET /api/communities?mine=true -> communities I'm in
// GET /api/communities?q=search  -> public communities matching "search"
export const listCommunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mine, q } = req.query;
    const communities =
      mine === "true"
        ? await communityService.listMyCommunities(req.user!.id)
        : await communityService.searchCommunities(String(q || ""), req.user!.id);
    sendSuccess(res, 200, "Communities fetched", communities);
  } catch (error) {
    next(error);
  }
};

export const getCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await communityService.getCommunity(req.params.id, req.user!.id);
    sendSuccess(res, 200, "Community fetched", community);
  } catch (error) {
    next(error);
  }
};

export const updateCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, image, isPrivate } = req.body;
    const community = await communityService.updateCommunity(req.params.id, req.user!.id, {
      name,
      description,
      image,
      isPrivate,
    });
    sendSuccess(res, 200, "Community updated", community);
  } catch (error) {
    next(error);
  }
};

export const deleteCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await communityService.deleteCommunity(req.params.id, req.user!.id);
    sendSuccess(res, 200, "Community deleted", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const joinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await communityService.joinCommunity(req.params.id, req.user!.id);
    sendSuccess(res, 200, "Joined community", community);
  } catch (error) {
    next(error);
  }
};

export const leaveCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await communityService.leaveCommunity(req.params.id, req.user!.id);
    sendSuccess(res, 200, "Left community", { id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const inviteMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;
    await communityService.inviteMember(req.params.id, req.user!.id, userId);
    sendSuccess(res, 200, "Member invited", { userId });
  } catch (error) {
    next(error);
  }
};

export const listMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const members = await communityService.listMembers(req.params.id);
    sendSuccess(res, 200, "Members fetched", members);
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const updated = await communityService.updateMemberRole(
      req.params.id,
      req.user!.id,
      req.params.userId,
      role
    );
    sendSuccess(res, 200, "Member role updated", updated);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await communityService.removeMember(req.params.id, req.user!.id, req.params.userId);
    sendSuccess(res, 200, "Member removed", { userId: req.params.userId });
  } catch (error) {
    next(error);
  }
};
