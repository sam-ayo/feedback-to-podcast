// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://oevsjdzovtkuriioibci.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ldnNqZHpvdnRrdXJpaW9pYmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMjY5MzEsImV4cCI6MjA1NTgwMjkzMX0.J_cyC0WVAFdo2E-soap3g-v2qlb1Dj6EmoTbMTMt2oo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);