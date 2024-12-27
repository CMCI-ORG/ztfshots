import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

  const getFlagImage = (code: string) => {
    switch (code) {
      case 'en':
        return "https://flagcdn.com/w40/gb.png";
      case 'fr':
        return "https://flagcdn.com/w40/fr.png";
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? "default" : "ghost"}
          size="sm"
          className="flex items-center gap-2 px-2 py-1"
          onClick={() => handleLanguageChange(lang.code)}
          disabled={isLoading || isChanging}
        >
          <img 
            src={getFlagImage(lang.code)} 
            alt={`${lang.native_name} flag`}
            className="h-5 w-7 object-cover rounded-sm"
          />
        </Button>
      ))}
    </div>
  );
}