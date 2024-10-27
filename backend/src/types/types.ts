import { Request } from "express";

export type UserRequest = Request & { userId?: string, user?: any };

export type AdminRequest = Request & { adminId?: string };
