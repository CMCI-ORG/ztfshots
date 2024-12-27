import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function fetchQuotes(startDate: Date, endDate: Date) {
  const { data: quotes, error } = await supabase
    .from("quotes")
    .select(`
      *,
      authors:author_id(name),
      categories:category_id(name)
    `)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString())
    .eq("status", "live")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return quotes;
}

export async function createDigestRecord(startDate: Date, endDate: Date) {
  const { data, error } = await supabase
    .from("weekly_digests")
    .insert({
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      recipient_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDigestRecipientCount(digestId: string, count: number) {
  const { error } = await supabase
    .from("weekly_digests")
    .update({ recipient_count: count })
    .eq("id", digestId);

  if (error) throw error;
}