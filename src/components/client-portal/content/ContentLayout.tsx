import { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContentSidebar } from "./ContentSidebar";
import { DynamicContent } from "./DynamicContent";

interface ContentLayoutProps {
  children?: ReactNode;
  content?: {
    id: string;
    page_key: string;
    title: string;
    content: string;
    meta_description?: string;
    rich_text_content?: any;
    sidebar_content?: any;
    created_at: string;
    updated_at: string;
  };
}

export const ContentLayout = ({ children, content }: ContentLayoutProps) => {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {content ? (
              <DynamicContent pageKey={content.page_key} />
            ) : (
              children
            )}
          </div>
          <div className="w-full lg:w-[30%]">
            <ContentSidebar />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};