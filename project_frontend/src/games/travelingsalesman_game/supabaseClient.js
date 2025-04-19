// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://utnftazcykytpjmjomzi.supabase.co';  // replace with your actual Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bmZ0YXpjeWt5dHBqbWpvbXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzUwMzMsImV4cCI6MjA2MDA1MTAzM30.Bgnnd6tmnGwIiBEtdfuinkSvpbZxBycIZIX0Z69iSK0';         // replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
