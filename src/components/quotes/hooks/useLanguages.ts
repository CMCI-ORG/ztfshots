import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LanguageOption } from "../types/translations";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      
      // Transform the data to match LanguageOption interface
      return data.map(lang => ({
        code: lang.code,
        name: lang.name,
        nativeName: lang.native_name // Map native_name to nativeName
      })) as LanguageOption[];
    },
  });
}