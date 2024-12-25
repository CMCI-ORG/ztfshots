import { RouteObject } from "react-router-dom";
import ClientPortal from "@/pages/ClientPortal";
import DynamicPage from "@/pages/DynamicPage";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ClientPortal />,
  },
  {
    path: "/about",
    element: <DynamicPage />,
  },
  {
    path: "/privacy",
    element: <DynamicPage />,
  },
  {
    path: "/terms",
    element: <DynamicPage />,
  },
  {
    path: "/contact",
    element: <DynamicPage />,
  },
  {
    path: "/:pageKey",
    element: <DynamicPage />,
  },
];

export default publicRoutes;
