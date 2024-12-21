import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        <h2 className="text-lg font-semibold">QuoteVerse</h2>
        <div className="flex-1">
          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search quotes..." className="pl-8" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};