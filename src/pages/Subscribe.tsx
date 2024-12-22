import { MainLayout } from "@/components/layout/MainLayout";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";

export default function Subscribe() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold text-[#8B5CF6]">
            Stay Inspired Every Day
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Subscribe to ZTFShots and receive daily quotes that will uplift your spirit and strengthen your faith. 
            Each day, you'll get a carefully selected quote from Prof. Z.T. Fomum's teachings sent directly to your inbox.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
          <SubscriptionForm />
        </div>
      </div>
    </MainLayout>
  );
}