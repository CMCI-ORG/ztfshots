import { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContentSidebar } from "./ContentSidebar";
import { DynamicContent } from "./DynamicContent";
import { Card } from "@/components/ui/card";

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
            <Card className="p-6 shadow-sm bg-white">
              {content ? (
                <DynamicContent pageKey={content.page_key} />
              ) : (
                children
              )}
            </Card>
          </div>
          <div className="w-full lg:w-[30%] space-y-6">
            <Card className="p-6 shadow-sm bg-white">
              <ContentSidebar />
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};