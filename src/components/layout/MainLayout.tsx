import { Navigation } from "@/components/client-portal/Navigation";
import { Footer } from "@/components/client-portal/Footer";
import { useEffect } from "react";
import { trackVisitor } from "@/utils/analytics";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 px-2 sm:px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};