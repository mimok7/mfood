(async()=>{
  const { createClient } = require('@supabase/supabase-js');
  const url='https://fowplozegvxzsifiexwh.supabase.co';
  const anon='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvd3Bsb3plZ3Z4enNpZmlleHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NzQ1MjEsImV4cCI6MjA3MzQ1MDUyMX0.N_1C6YCoXwrx2-6nu8Ax1-JxWjms1x2VPrWff0lgLy8';
  const sb = createClient(url, anon);
  const email='test+dev@example.com', pass='Testpass123!';
  try {
    const r = await sb.auth.signInWithPassword({ email, password: pass });
    console.log('signIn err', r.error);
    const token = r.data?.session?.access_token;
    if(!token){ console.log('no token'); return }
    const resp = await fetch('http://localhost:3000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    console.log('status', resp.status);
    console.log(await resp.text());
  } catch (e) { console.error(e) }
})();
