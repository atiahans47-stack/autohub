import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

async function migrateSchema() {
  console.log('Starting automatic schema migration...');

  try {
    // Check if Supabase CLI is installed
    try {
      execSync('supabase --version', { stdio: 'inherit' });
      console.log('Supabase CLI is installed');
    } catch {
      console.log('Installing Supabase CLI...');
      execSync('npm install -g supabase', { stdio: 'inherit' });
    }

    // Create supabase directory structure if it doesn't exist
    const supabaseDir = join(process.cwd(), 'supabase');
    const migrationsDir = join(supabaseDir, 'migrations');

    if (!existsSync(migrationsDir)) {
      console.log('Creating Supabase migrations directory...');
      execSync(`mkdir -p "${migrationsDir}"`, { stdio: 'inherit' });
    }

    // Copy schema to migrations directory
    const schemaPath = join(process.cwd(), 'supabase-schema.sql');
    const migrationPath = join(migrationsDir, '20240525000000_initial_schema.sql');

    console.log('Copying schema to migrations directory...');
    const schema = readFileSync(schemaPath, 'utf-8');
    writeFileSync(migrationPath, schema);

    // Link to Supabase project
    console.log('Linking to Supabase project...');
    try {
      execSync('supabase link --project-ref otafgrgxfafuzfxgprtg', { stdio: 'inherit' });
    } catch {
      console.log('Already linked to project or link failed, continuing...');
    }

    // Push migrations
    console.log('Pushing database migrations...');
    execSync('supabase db push', { stdio: 'inherit' });

    console.log('\n========================================');
    console.log('SCHEMA MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n========================================');
    console.error('AUTOMATIC MIGRATION FAILED');
    console.error('========================================');
    console.error('\nError:', error);
    console.error('\nPlease migrate manually:');
    console.error('1. Go to https://supabase.com/dashboard');
    console.error('2. Select your project (otafgrgxfafuzfxgprtg)');
    console.error('3. Click on "SQL Editor" in the left sidebar');
    console.error('4. Click "New Query"');
    console.error('5. Copy the content from supabase-schema.sql');
    console.error('6. Paste it into the SQL Editor');
    console.error('7. Click "Run" to execute the migration');
    console.error('========================================\n');
    process.exit(1);
  }
}

migrateSchema();
