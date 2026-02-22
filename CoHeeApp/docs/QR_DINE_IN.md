# QR Dine-in Module

## Overview

The QR Dine-in module allows customers to scan QR codes at restaurant tables to start a dining session and order directly from their phones.

## Features

### 1. QR Code Scanning
- Camera-based QR scanner with visual guides
- Validates CoHeeApp table QR codes
- Handles permission requests gracefully
- Provides clear error messages

### 2. Table Session Management
- Automatic session creation when QR is scanned
- Real-time session timer display
- Session status tracking (active/completed/cancelled)
- Ability to end session manually

### 3. Table-Specific Ordering
- Category-filtered menu browsing
- Quick add-to-cart functionality
- Real-time cart updates
- Floating cart button with total

### 4. Order Tracking
- Orders linked to table sessions
- Kitchen display integration ready
- Real-time status updates

## Architecture

### Components

#### `QRScanner.tsx`
Reusable QR scanner component with:
- Camera permission handling
- QR code validation
- Visual scanning area with corner indicators
- Rescan functionality

#### `TableHeader.tsx`
Displays active table session info:
- Table number
- Session elapsed time (updates every second)
- End session button

#### `TableOrderScreen.tsx`
Main ordering interface for dine-in:
- Category filter tabs
- Menu items grid
- Floating cart button
- Session management

### Services

#### `table.service.ts`
Handles all table and session operations:

**Methods:**
- `verifyTableQR(token)` - Validates QR code token
- `getTableById(id)` - Fetches table details
- `getTableByNumber(number)` - Finds table by number
- `startSession(tableId, guestCount)` - Creates new session
- `endSession(sessionId)` - Completes session
- `getActiveSession(tableId)` - Retrieves current session
- `getAllTables()` - Lists all active tables
- `generateQRData(table)` - Creates QR code data string

### Context Updates

**AppContext.tsx** additions:
- `currentTableSession` - Active session state
- `menuItems` - Available menu items
- `startTableSession(tableInfo)` - Initiates session
- `endTableSession()` - Ends current session
- `showToast(message, type)` - Enhanced toast with types

## Database Schema

### Tables

```sql
CREATE TABLE tables (
  id UUID PRIMARY KEY,
  table_number TEXT NOT NULL,
  location_id UUID,
  capacity INTEGER DEFAULT 4,
  qr_code_token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  active_session_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table Sessions

```sql
CREATE TABLE table_sessions (
  id UUID PRIMARY KEY,
  table_id UUID REFERENCES tables(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  total_guests INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Orders Update

Add to existing `orders` table:
```sql
ALTER TABLE orders 
ADD COLUMN table_id UUID REFERENCES tables(id),
ADD COLUMN session_id UUID REFERENCES table_sessions(id),
ADD COLUMN order_type TEXT DEFAULT 'takeaway'; -- 'takeaway', 'dine-in', 'marketplace'
```

## Setup Instructions

### 1. Install Dependencies

All required packages are already in `package.json`:
- `expo-camera` ~16.0.0 (for QR scanning)
- Camera permissions already configured

### 2. Database Setup

Run the SQL migrations in your Supabase dashboard:

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

-- Update orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS table_id UUID REFERENCES tables(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES table_sessions(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'takeaway';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tables_qr_token ON tables(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_sessions_table_status ON table_sessions(table_id, status);

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tables (public read)
CREATE POLICY "Tables are viewable by everyone" ON tables
  FOR SELECT USING (true);

-- RLS Policies for sessions (public create and read)
CREATE POLICY "Anyone can view sessions" ON table_sessions
  FOR SELECT USING (true);
  
CREATE POLICY "Anyone can create sessions" ON table_sessions
  FOR INSERT WITH CHECK (true);
  
CREATE POLICY "Anyone can update their session" ON table_sessions
  FOR UPDATE USING (true);
```

### 3. Seed Sample Tables

```sql
-- Insert sample tables
INSERT INTO tables (table_number, capacity, qr_code_token) VALUES
  ('T01', 2, 'QR-T01-' || gen_random_uuid()),
  ('T02', 2, 'QR-T02-' || gen_random_uuid()),
  ('T03', 4, 'QR-T03-' || gen_random_uuid()),
  ('T04', 4, 'QR-T04-' || gen_random_uuid()),
  ('T05', 6, 'QR-T05-' || gen_random_uuid()),
  ('T06', 6, 'QR-T06-' || gen_random_uuid()),
  ('T07', 8, 'QR-T07-' || gen_random_uuid()),
  ('T08', 2, 'QR-T08-' || gen_random_uuid());
```

### 4. Generate QR Codes

You can generate QR codes for your tables using:

**Option A: Online QR Generator**
1. Go to https://www.qr-code-generator.com/
2. Use format: `coheeapp://table/main/{TABLE_NUMBER}/{TOKEN}`
3. Print and laminate for each table

**Option B: Admin Tool (Coming Soon)**
We'll build an admin panel to:
- View all tables
- Generate printable QR codes
- Manage table status
- View active sessions

### 5. Update HomeScreen

Add "Scan QR for Dine-in" button to HomeScreen.tsx:

```tsx
<TouchableOpacity 
  style={styles.qrButton}
  onPress={() => onNavigate('qrScan')}
>
  <Text style={styles.qrButtonText}>📱 Scan QR for Dine-in</Text>
</TouchableOpacity>
```

## Usage Flow

### Customer Journey

1. **Customer sits at table**
   - Opens CoHeeApp
   - Taps "Scan QR for Dine-in" on home screen

2. **Scan QR Code**
   - Camera opens with scanning guide
   - Customer scans table QR code
   - App validates code and starts session

3. **Browse & Order**
   - Table session starts (timer begins)
   - Table number displayed in header
   - Browse menu by category
   - Add items to cart

4. **Checkout**
   - Review cart
   - Apply discounts if eligible
   - Complete payment
   - Order sent to kitchen

5. **Track Order**
   - View order status
   - Get notified when ready
   - Can add more items during session

6. **End Session**
   - Tap "End" button when done
   - Session closes
   - Table available for next customer

### Staff Flow

1. **Kitchen Receives Order**
   - Order shows on Kitchen Display System
   - Includes table number
   - Staff prepares order

2. **Deliver to Table**
   - Staff delivers based on table number
   - Customer can order more items

3. **Table Cleanup**
   - Customer ends session
   - Or staff can end from admin panel
   - Table marked as available

## Testing

### Manual Testing

1. **Test QR Scanner**
   ```bash
   # Generate test QR with table token from database
   SELECT qr_code_token FROM tables WHERE table_number = 'T01';
   ```
   - Scan QR code
   - Verify session starts
   - Check table header appears

2. **Test Session Management**
   - Start session
   - Verify timer counts up
   - Add items to cart
   - End session
   - Verify cart clears

3. **Test Ordering**
   - Browse categories
   - Add multiple items
   - View cart
   - Complete checkout

### Database Queries for Testing

```sql
-- View active sessions
SELECT 
  ts.id,
  t.table_number,
  ts.started_at,
  ts.status,
  EXTRACT(EPOCH FROM (NOW() - ts.started_at))/60 as minutes_elapsed
FROM table_sessions ts
JOIN tables t ON t.id = ts.table_id
WHERE ts.status = 'active';

-- View orders by table
SELECT 
  o.id,
  t.table_number,
  o.total,
  o.status,
  o.created_at
FROM orders o
JOIN tables t ON t.id = o.table_id
WHERE o.order_type = 'dine-in'
ORDER BY o.created_at DESC;

-- Get table availability
SELECT 
  t.table_number,
  t.capacity,
  CASE 
    WHEN t.active_session_id IS NULL THEN 'Available'
    ELSE 'Occupied'
  END as status
FROM tables t
WHERE t.is_active = true
ORDER BY t.table_number;
```

## Next Steps

### Immediate
1. ✅ QR Scanner Component
2. ✅ Table Session Management
3. ✅ Table Order Screen
4. ✅ Session Timer
5. Add "Scan QR" button to HomeScreen

### Short Term
1. Kitchen Display System (web app)
2. Real-time order status updates
3. Admin panel for table management
4. QR code generator/printer
5. Multi-location support

### Future Enhancements
1. Split bills
2. Call waiter button
3. Special requests/notes
4. Allergen information
5. Recommended items
6. Session history
7. Average dining time analytics

## Troubleshooting

### Camera Permission Issues
- **iOS**: Add to `info.plist`
  ```xml
  <key>NSCameraUsageDescription</key>
  <string>We need camera access to scan table QR codes</string>
  ```
- **Android**: Already configured in expo-camera

### QR Code Not Scanning
1. Check QR format matches: `coheeapp://table/{location}/{number}/{token}`
2. Verify token exists in database
3. Ensure table is marked as active
4. Check camera focus and lighting

### Session Not Starting
1. Check Supabase connection
2. Verify table exists in database
3. Check RLS policies allow insert
4. Review console logs for errors

### Toast Not Showing
- Verify Toast component is in App.tsx
- Check `toastMessage` in AppContext
- Ensure timeout is set (3000ms)

## API Reference

### Table Service Methods

```typescript
// Verify QR code and get table
await tableService.verifyTableQR(token: string): Promise<Table | null>

// Start a dining session
await tableService.startSession(
  tableId: string, 
  guestCount?: number
): Promise<TableSession | null>

// End current session
await tableService.endSession(
  sessionId: string
): Promise<boolean>

// Get active session for table
await tableService.getActiveSession(
  tableId: string
): Promise<TableSession | null>
```

### Context Methods

```typescript
// Start table session from QR data
await startTableSession(tableInfo: {
  tableId?: string;
  tableNumber?: string;
  token?: string;
}): Promise<TableSession | null>

// End current session
await endTableSession(): Promise<boolean>

// Show toast message
showToast(message: string, type?: 'success' | 'error' | 'info'): void
```

## Support

For issues or questions:
1. Check console logs for errors
2. Verify database schema is up to date
3. Test with sample tables
4. Review Supabase logs

---

**Built with ❤️ for CoHee Coffee Shop**
