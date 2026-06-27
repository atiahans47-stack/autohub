#!/bin/bash

echo "Setting up Supabase database schema..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Link to your Supabase project
echo "Linking to Supabase project..."
supabase link --project-ref otafgrgxfafuzfxgprtg

# Run migrations
echo "Running database migrations..."
supabase db push

echo "Database schema setup complete!"
