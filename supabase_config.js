// ═══════════════════════════════════════════════════════════════
// Célula Ágape — Configuração do Supabase
// Substitua os valores abaixo com os dados do seu projeto Supabase
// ═══════════════════════════════════════════════════════════════

// 1. Acesse https://app.supabase.com
// 2. Selecione seu projeto
// 3. Vá em Settings > API
// 4. Copie a "Project URL" e a "anon public" key

const SUPABASE_URL = 'https://clvibzknsctfifrvepvq.supabase.co';        // ex: https://xyzxyz.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdmliemtuc2N0ZmlmcnZlcHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NzEwMzUsImV4cCI6MjA5MDU0NzAzNX0.4ITssYLA0exbGjP5kAKq69Ko6XonaTWX34VIcO5bhtQ'; // começa com "eyJ..."

// VAPID Public Key para Web Push Notifications
// Gere em: https://web-push-codelab.glitch.me/
// ou via: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = 'COLE_SUA_VAPID_PUBLIC_KEY_AQUI';
