const { createClient } = require('@supabase/supabase-js');

// copy the same URL and key that you use in src/utils/supabase.ts
const SUPABASE_URL = 'https://hmmfgqmkitmggbcphabd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbWZncW1raXRtZ2diY3BoYWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjExMDMsImV4cCI6MjA3NzMzNzEwM30.M_PSY0AHavV0dVrYdhSK3VeKquut_9obmbGJibtAUDA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const email = 'coheehk@gmail.com';   // use a real test user
  const password = 'Test1234!';

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('DATA:', data);
  console.log('ERROR:', error);
}

main();
