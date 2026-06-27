const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const criticalTables = [
  'profiles',
  'payments',
  'chat_rooms',
  'chat_messages',
  'site_content',
  'users',
  'cars',
  'bookings',
  'sales',
  'messages',
  'reviews',
  'testimonials'
];

async function verifyTables() {
  console.log('Verifying tables in Supabase...\n');

  for (const table of criticalTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

verifyTables().then(() => {
  console.log('\nVerification complete.');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
