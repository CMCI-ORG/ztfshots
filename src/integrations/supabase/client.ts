// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://etejgkiqailkyikopwan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZWpna2lxYWlsa3lpa29wd2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MTM5NTcsImV4cCI6MjA1MDM4OTk1N30.UoIksdiMhlrVAO1a-piBLdYyDCpLXuphqR991ElbRts";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);