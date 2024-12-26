import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterContent } from "./filters/FilterContent";
import { MobileFilterTrigger } from "./filters/MobileFilterTrigger";

export const FilterSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileFilterTrigger />;
  }

  return (
    <div className="relative">
      <Sidebar className={`border-r transition-all duration-300 ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-2 z-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ArrowRightFromLine className="h-4 w-4" />
          ) : (
            <ArrowLeftFromLine className="h-4 w-4" />
          )}
        </Button>
        {!isCollapsed && <FilterContent />}
      </Sidebar>
    </div>
  );
};