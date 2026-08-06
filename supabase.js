const SUPABASE_URL = "https://syqkiubtwshrxplefgek.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5cWtpdWJ0d3NocnhwbGVmZ2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzU0NzAsImV4cCI6MjEwMTYxMTQ3MH0.njHz2QdPS3hTZyhm5T-IRnPqTDzlk4cUtCS4godW8Mw";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
