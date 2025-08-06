// utilsHelper/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://deabethqbhuwfoyvgubr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYWJldGhxYmh1d2ZveXZndWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTAxMzUsImV4cCI6MjA2OTg2NjEzNX0.YOAI8uEodkkH74u23ex4AipQ-nON97jXBg0OI7MORmk";

export const supabase = createClient(supabaseUrl, supabaseKey);
