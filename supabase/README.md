# Supabase Database Setup

This directory contains database schema and migration files for CoHeeApp.

## Quick Setup

### Method 1: SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire contents of `schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for completion (should take 5-10 seconds)

### Method 2: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## What Gets Created

### Tables

1. **profiles** - User profile information
2. **products** - Menu items and marketplace products
3. **product_options** - Product customization options (size, milk, etc.)
4. **addresses** - User delivery addresses
5. **orders** - Order information (takeaway, dine-in, marketplace)
6. **order_items** - Individual items in orders
7. **payments** - Payment transactions
8. **tables** - Physical restaurant tables for dine-in
9. **table_sessions** - Active dining sessions
10. **reviews** - Product reviews and ratings

### Security

- Row Level Security (RLS) enabled on all tables
- Policies configured for:
  - Users can only view/edit their own data
  - Products are publicly viewable
  - Orders are private to the user
  - Reviews are public but only editable by creator

### Sample Data

- 8 sample products (coffee and food items)
- Product options (sizes, milk types)
- 5 sample tables with QR codes

## Verifying Setup

### Check Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see all 10 tables listed
3. Click on `products` table - should show 8 sample products

### Test Data Query

```sql
-- Check products
SELECT * FROM products;

-- Check product options
SELECT p.name, po.option_type, po.option_value, po.price_modifier
FROM products p
JOIN product_options po ON p.id = po.product_id
ORDER BY p.name, po.option_type;

-- Check tables
SELECT * FROM tables;
```

## Next Steps

1. Get your Supabase credentials from **Settings > API**
2. Copy to your `.env` file:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Start the app and test authentication

## Troubleshooting

### Error: "relation already exists"
- Tables already exist, skip or drop them first
- Run: `DROP TABLE IF EXISTS table_name CASCADE;`

### Error: "permission denied"
- Make sure you're logged into correct Supabase project
- Check that RLS policies are set correctly

### No sample data appearing
- Check if INSERT statements ran successfully
- Verify in SQL Editor: `SELECT COUNT(*) FROM products;`
