import { Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? "default" : "ghost"}
          size="sm"
          className="flex items-center"
          onClick={() => handleLanguageChange(lang.code)}
          disabled={isLoading || isChanging}
        >
          <Flag className="h-4 w-4 mr-2" />
          <span>{lang.native_name}</span>
        </Button>
      ))}
    </div>
  );
}