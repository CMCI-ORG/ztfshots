import { HeroSection } from "@/components/client-portal/HeroSection";
import { QuickLinks } from "@/components/client-portal/QuickLinks";
import { MainLayout } from "@/components/layout/MainLayout";

const ClientPortal = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEF7CD] bg-opacity-20">
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <QuickLinks />
        </main>
      </div>
    </MainLayout>
  );
};

export default ClientPortal;