import { supabase } from './src/utils/supabase';

async function main() {
  // change this to your test email/password from the dashboard
  const email = 'testuser@example.com';
  const password = 'Test1234!';

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log('DATA:', data);
  console.log('ERROR:', error);
}

main();
