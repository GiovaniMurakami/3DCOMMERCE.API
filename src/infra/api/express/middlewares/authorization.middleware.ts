import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "./token-authentication.middleware";
import { NextFunction, Response } from "express";

export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tokenPayload = req.tokenPayload;
    if (!tokenPayload) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!allowedRoles.includes(tokenPayload.userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
}
