import { RouteObject } from "react-router-dom";
import { authRoutes } from "./public/authRoutes";
import { contentRoutes } from "./public/contentRoutes";
import { infoRoutes } from "./public/infoRoutes";

export const publicRoutes: RouteObject[] = [
  ...authRoutes,
  ...contentRoutes,
  ...infoRoutes,
];