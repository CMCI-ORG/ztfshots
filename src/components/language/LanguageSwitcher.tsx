import { Languages } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  variant?: "select" | "dropdown";
}

export function LanguageSwitcher({ 
  currentLanguage, 
  onLanguageChange,
  variant = "select" 
}: LanguageSwitcherProps) {
  const [isChanging, setIsChanging] = useState(false);

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const currentLanguageDetails = languages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (code: string) => {
    try {
      setIsChanging(true);
      await onLanguageChange(code);
      const newLang = languages.find(lang => lang.code === code);
      toast.success(`Language changed to ${newLang?.native_name || code}`);
    } catch (error) {
      console.error("Failed to change language:", error);
      toast.error("Failed to change language. Please try again.");
    } finally {
      setIsChanging(false);
    }
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 px-0"
            disabled={isLoading || isChanging}
          >
            <Languages className={`h-4 w-4 ${isChanging ? 'animate-spin' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-row flex-wrap gap-1 p-2 min-w-[200px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`cursor-pointer flex-shrink-0 px-3 py-1.5 rounded-md ${
                currentLanguage === lang.code 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
            >
              <span>{lang.native_name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Select 
      value={currentLanguage} 
      onValueChange={handleLanguageChange}
      disabled={isLoading || isChanging}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {currentLanguageDetails?.native_name || currentLanguage}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.native_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}