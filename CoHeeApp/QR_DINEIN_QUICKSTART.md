# QR Dine-in Feature - Quick Start Guide

## 🎯 What's Been Built

A complete QR code-based dine-in ordering system that allows customers to:
1. **Scan QR codes** at restaurant tables
2. **Start dining sessions** automatically
3. **Order from their phones** with table-specific tracking
4. **View real-time session info** (table number, elapsed time)
5. **End sessions** when done

---

## 📦 Files Created

### Components
- `src/components/QRScanner.tsx` - Camera-based QR scanner with validation
- `src/components/TableHeader.tsx` - Table session info display with timer

### Screens
- `src/screens/QRScanScreen.tsx` - QR scanning entry point
- `src/screens/TableOrderScreen.tsx` - Table-specific menu ordering

### Services
- `src/services/table.service.ts` - Table and session management

### Data
- `src/data/menuItems.ts` - Sample menu items (18 items across 4 categories)

### Updated Files
- `src/contexts/AppContext.tsx` - Added table session state management
- `App.tsx` - Added QR scan and table order screens to navigation

### Documentation
- `docs/QR_DINE_IN.md` - Complete technical documentation
- `QR_DINEIN_QUICKSTART.md` - This quick start guide

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Pull the Code

```bash
cd C:\Users\user\Documents\CoHeeApp\CoHeeApp
git fetch origin
git checkout feature/qr-dine-in
git pull origin feature/qr-dine-in
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 3: Setup Database Tables

**Go to your Supabase Dashboard > SQL Editor and run:**

```sql
-- Create tables table
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id UUID,
  table_number TEXT NOT NULL,
  capacity INTEGER DEFAULT 4,
  qr_code_token TEXT UNIQUE,
  active_session_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table_sessions table
CREATE TABLE IF NOT EXISTS public.table_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID REFERENCES public.tables ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_guests INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update orders table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES tables(id);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES table_sessions(id);
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'takeaway';
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tables_qr_token ON tables(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_sessions_table_status ON table_sessions(table_id, status);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tables viewable by everyone" ON tables FOR SELECT USING (true);
CREATE POLICY "Sessions viewable by everyone" ON table_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create sessions" ON table_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sessions" ON table_sessions FOR UPDATE USING (true);

-- Insert sample tables
INSERT INTO tables (table_number, capacity, qr_code_token) 
SELECT * FROM (
  VALUES 
    ('T01', 2, 'table-test-token-01'),
    ('T02', 2, 'table-test-token-02'),
    ('T03', 4, 'table-test-token-03'),
    ('T04', 4, 'table-test-token-04'),
    ('T05', 6, 'table-test-token-05')
) AS v(table_number, capacity, qr_code_token)
WHERE NOT EXISTS (
  SELECT 1 FROM tables WHERE table_number = v.table_number
);
```

### Step 4: Update HomeScreen to Add QR Button

**Edit `src/screens/HomeScreen.tsx`** and add this button somewhere in the main view:

```tsx
<TouchableOpacity 
  style={styles.qrButton}
  onPress={() => onNavigate('qrScan')}
>
  <Text style={styles.qrButtonText}>📱 Scan QR for Dine-in</Text>
</TouchableOpacity>
```

And add the style:

```tsx
qrButton: {
  backgroundColor: '#6F4E37',
  padding: 16,
  borderRadius: 12,
  marginHorizontal: 20,
  marginVertical: 10,
  alignItems: 'center',
},
qrButtonText: {
  color: '#FFF',
  fontSize: 18,
  fontWeight: '600',
},
```

### Step 5: Run the App

```bash
npm start
```

Then open in Expo Go on your phone.

---

## 🧪 Testing the Feature

### Option A: Test with Sample Token (Easiest)

1. Open app and login
2. Tap "Scan QR for Dine-in" button
3. When QR scanner opens, scan this test QR code:
   - **Generate QR for:** `coheeapp://table/main/T01/table-test-token-01`
   - Use https://www.qr-code-generator.com/
4. Scanner should recognize it and start table session
5. You'll see Table T01 screen with menu

### Option B: Create Real QR Codes

1. **Get table tokens from database:**
   ```sql
   SELECT table_number, qr_code_token FROM tables;
   ```

2. **Generate QR codes** for each table:
   - Format: `coheeapp://table/main/{TABLE_NUMBER}/{TOKEN}`
   - Example: `coheeapp://table/main/T01/table-test-token-01`
   - Use any QR generator online

3. **Print and place** at tables

### What to Test:

#### 1. QR Scanner
- [ ] Camera permission dialog appears
- [ ] Scanner shows targeting box
- [ ] Scans QR code successfully
- [ ] Shows error for invalid QR codes
- [ ] Can close scanner

#### 2. Table Session
- [ ] Session starts after QR scan
- [ ] Table number displays correctly
- [ ] Timer starts and counts up
- [ ] Can end session manually

#### 3. Ordering
- [ ] Menu items load correctly
- [ ] Can filter by category
- [ ] Can add items to cart
- [ ] Cart shows correct total
- [ ] Floating cart button appears
- [ ] Can view cart

#### 4. Checkout
- [ ] Can proceed to checkout
- [ ] Order includes table/session info
- [ ] Session ends after order

---

## 📊 Database Verification

Check your Supabase dashboard:

### Verify Tables Created
```sql
SELECT * FROM tables ORDER BY table_number;
```
Should show: T01, T02, T03, T04, T05

### Check Active Sessions
```sql
SELECT 
  ts.*,
  t.table_number
FROM table_sessions ts
JOIN tables t ON t.id = ts.table_id
WHERE ts.status = 'active';
```

### View Session History
```sql
SELECT 
  t.table_number,
  ts.status,
  ts.started_at,
  ts.ended_at,
  EXTRACT(EPOCH FROM (COALESCE(ts.ended_at, NOW()) - ts.started_at))/60 as duration_minutes
FROM table_sessions ts
JOIN tables t ON t.id = ts.table_id
ORDER BY ts.started_at DESC
LIMIT 10;
```

---

## 👀 Key Features Explained

### 1. QR Scanner Component
- Uses expo-camera for QR scanning
- Visual targeting box with corner indicators
- Validates QR code format before accepting
- Graceful permission handling

### 2. Table Service
- Manages all table operations via Supabase
- Handles session lifecycle (start/end)
- Prevents duplicate sessions
- Cleans up sessions properly

### 3. Session Timer
- Real-time elapsed time display
- Updates every second
- Formatted as MM:SS
- Visible in table header

### 4. Table Order Screen
- Category-filtered menu
- Quick add to cart
- Floating cart button (only shows when items in cart)
- Session info always visible

---

## 🛠️ Troubleshooting

### Camera Not Working
```bash
# Make sure camera package is installed
npm list expo-camera

# Reinstall if needed
npm install expo-camera@~16.0.0 --legacy-peer-deps
```

### QR Code Not Recognized
- Check format: `coheeapp://table/{location}/{number}/{token}`
- Verify token exists in database
- Ensure table is active (`is_active = true`)

### Session Not Starting
- Check Supabase connection in console
- Verify RLS policies allow INSERT
- Check table exists in database

### Menu Items Not Showing
- Verify `menuItems.ts` is imported in AppContext
- Check console for errors
- Ensure MENU_ITEMS array is exported

---

## 🚀 What's Next

### Immediate Tasks
1. Add "Scan QR" button to HomeScreen
2. Test on physical device
3. Generate QR codes for all tables
4. Print and laminate QR codes

### Short Term (1-2 weeks)
1. **Kitchen Display System** (web app)
   - Real-time order display
   - Table number shown
   - Order status management
   
2. **Admin Panel**
   - View all tables and sessions
   - Generate QR codes
   - Manage table availability
   - View analytics

3. **Enhanced Ordering**
   - Item customization options
   - Special instructions
   - Call waiter button
   - Split bill functionality

### Medium Term (2-4 weeks)
1. **Real-time Updates**
   - Order status via Supabase Realtime
   - Push notifications
   - Kitchen preparation time estimates

2. **Analytics**
   - Average dining time per table
   - Popular items by time of day
   - Table turnover rate
   - Revenue per table

---

## 📝 Notes

### QR Code Format
The app accepts two QR formats:
1. **Deep link:** `coheeapp://table/{location}/{number}/{token}`
2. **Simple:** `table-{id}-{token}`

The scanner validates and parses both formats.

### Session Management
- Sessions auto-start on QR scan
- Only one active session per table
- Sessions must be manually ended (or timeout after 4 hours)
- Ending session clears cart

### Order Types
Orders can now be:
- `takeaway` - Pre-order for pickup
- `dine-in` - Table service (linked to session)
- `marketplace` - Product delivery

---

## 📞 Support

If you encounter issues:

1. **Check console logs** for errors
2. **Verify Supabase** connection and schema
3. **Test with sample data** first
4. **Review documentation** in `docs/QR_DINE_IN.md`

---

## ✅ Checklist

- [ ] Code pulled from `feature/qr-dine-in` branch
- [ ] Dependencies installed
- [ ] Database tables created
- [ ] Sample tables inserted
- [ ] QR button added to HomeScreen
- [ ] App running on device
- [ ] Camera permission granted
- [ ] Test QR code generated
- [ ] Successfully scanned QR
- [ ] Table session started
- [ ] Menu items displayed
- [ ] Can add items to cart
- [ ] Session timer working
- [ ] Can end session

---

**Feature Status:** ✅ Ready for Testing

**Branch:** `feature/qr-dine-in`

**Ready to merge after:** Testing completed and QR button added to HomeScreen
