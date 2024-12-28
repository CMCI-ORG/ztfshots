import { MainLayout } from "@/components/layout/MainLayout";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Bell } from "lucide-react";

const Subscribe = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") || "email";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#2B4C7E]">
            Subscribe to Daily Inspiration
          </h1>
          
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </TabsTrigger>
              <TabsTrigger value="browser" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Browser</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <SubscriptionForm type="email" />
              </div>
            </TabsContent>

            <TabsContent value="whatsapp">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <SubscriptionForm type="whatsapp" />
              </div>
            </TabsContent>

            <TabsContent value="browser">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <SubscriptionForm type="browser" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscribe;