import { supabase } from "@/integrations/supabase/client";

export const useSourceManagement = () => {
  const handleSource = async (sourceTitle: string, sourceUrl?: string) => {
    let sourceId = null;
    
    if (sourceTitle) {
      const { data: existingSource, error: sourceQueryError } = await supabase
        .from('sources')
        .select('id')
        .eq('title', sourceTitle)
        .maybeSingle();

      if (sourceQueryError) {
        console.error('Error querying source:', sourceQueryError);
        throw sourceQueryError;
      }

      if (existingSource) {
        sourceId = existingSource.id;
        if (sourceUrl) {
          await supabase
            .from('sources')
            .update({ url: sourceUrl })
            .eq('id', sourceId);
        }
      } else {
        const { data: newSource, error: sourceError } = await supabase
          .from('sources')
          .insert({
            title: sourceTitle,
            url: sourceUrl
          })
          .select('id')
          .single();

        if (sourceError) throw sourceError;
        sourceId = newSource.id;
      }
    }

    return sourceId;
  };

  return { handleSource };
};