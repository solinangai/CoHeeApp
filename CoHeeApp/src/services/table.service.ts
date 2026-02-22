import { supabase } from '../utils/supabase';

export interface Table {
  id: string;
  table_number: string;
  location_id?: string;
  capacity: number;
  qr_code_token: string;
  is_active: boolean;
  active_session_id?: string;
}

export interface TableSession {
  id: string;
  table_id: string;
  tableNumber: string;
  started_at: Date;
  ended_at?: Date;
  status: 'active' | 'completed' | 'cancelled';
  total_guests?: number;
}

class TableService {
  /**
   * Verify table QR code and get table info
   */
  async verifyTableQR(token: string): Promise<Table | null> {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('qr_code_token', token)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error verifying table QR:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in verifyTableQR:', error);
      return null;
    }
  }

  /**
   * Get table by ID
   */
  async getTableById(tableId: string): Promise<Table | null> {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('id', tableId)
        .single();

      if (error) {
        console.error('Error getting table:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTableById:', error);
      return null;
    }
  }

  /**
   * Get table by table number
   */
  async getTableByNumber(tableNumber: string): Promise<Table | null> {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('table_number', tableNumber)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error getting table by number:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTableByNumber:', error);
      return null;
    }
  }

  /**
   * Start a new table session
   */
  async startSession(
    tableId: string,
    guestCount?: number
  ): Promise<TableSession | null> {
    try {
      // Check if table already has an active session
      const { data: existingSession } = await supabase
        .from('table_sessions')
        .select('*')
        .eq('table_id', tableId)
        .eq('status', 'active')
        .single();

      if (existingSession) {
        // Return existing active session
        const table = await this.getTableById(tableId);
        return {
          id: existingSession.id,
          table_id: tableId,
          tableNumber: table?.table_number || '',
          started_at: new Date(existingSession.started_at),
          status: 'active',
          total_guests: existingSession.total_guests,
        };
      }

      // Create new session
      const { data, error } = await supabase
        .from('table_sessions')
        .insert({
          table_id: tableId,
          total_guests: guestCount,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting session:', error);
        return null;
      }

      // Update table with active session
      await supabase
        .from('tables')
        .update({ active_session_id: data.id })
        .eq('id', tableId);

      const table = await this.getTableById(tableId);

      return {
        id: data.id,
        table_id: tableId,
        tableNumber: table?.table_number || '',
        started_at: new Date(data.started_at),
        status: 'active',
        total_guests: guestCount,
      };
    } catch (error) {
      console.error('Error in startSession:', error);
      return null;
    }
  }

  /**
   * End a table session
   */
  async endSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('table_sessions')
        .update({
          status: 'completed',
          ended_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error ending session:', error);
        return false;
      }

      // Clear active session from table
      const { data: session } = await supabase
        .from('table_sessions')
        .select('table_id')
        .eq('id', sessionId)
        .single();

      if (session) {
        await supabase
          .from('tables')
          .update({ active_session_id: null })
          .eq('id', session.table_id);
      }

      return true;
    } catch (error) {
      console.error('Error in endSession:', error);
      return false;
    }
  }

  /**
   * Get active session for a table
   */
  async getActiveSession(tableId: string): Promise<TableSession | null> {
    try {
      const { data, error } = await supabase
        .from('table_sessions')
        .select('*')
        .eq('table_id', tableId)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        return null;
      }

      const table = await this.getTableById(tableId);

      return {
        id: data.id,
        table_id: tableId,
        tableNumber: table?.table_number || '',
        started_at: new Date(data.started_at),
        status: 'active',
        total_guests: data.total_guests,
      };
    } catch (error) {
      console.error('Error in getActiveSession:', error);
      return null;
    }
  }

  /**
   * Get all tables
   */
  async getAllTables(): Promise<Table[]> {
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('is_active', true)
        .order('table_number');

      if (error) {
        console.error('Error getting all tables:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTables:', error);
      return [];
    }
  }

  /**
   * Generate QR code data for a table
   */
  generateQRData(table: Table): string {
    // Format: coheeapp://table/{location_id}/{table_number}/{token}
    return `coheeapp://table/${table.location_id || 'main'}/${table.table_number}/${table.qr_code_token}`;
  }
}

export const tableService = new TableService();
