import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold text-[#8B5CF6]">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            Sorry, we couldn't find the page you're looking for. Please check the URL or return to the homepage.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => navigate("/")} variant="default">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;