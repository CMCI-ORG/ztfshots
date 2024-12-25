import { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContentSidebar } from "./ContentSidebar";

interface ContentLayoutProps {
  children: ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">{children}</div>
          <div className="w-full lg:w-[30%]">
            <ContentSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};