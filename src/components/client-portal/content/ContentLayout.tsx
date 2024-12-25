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
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="p-6 shadow-sm bg-white/80 backdrop-blur-sm">
              {content ? (
                <DynamicContent pageKey={content.page_key} />
              ) : (
                children
              )}
            </Card>
          </div>
          <aside className="lg:col-span-4 space-y-6">
            <ContentSidebar />
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};