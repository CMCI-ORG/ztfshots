import { vi } from 'vitest';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';

// Base mock for common PostgrestQueryBuilder methods
const createBaseMock = () => ({
  url: new URL('https://mock-url.com'),
  headers: {},
  schema: 'public',
  signal: undefined,
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  like: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  containedBy: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  overlap: vi.fn().mockReturnThis(),
  adjacent: vi.fn().mockReturnThis(),
  match: vi.fn().mockReturnThis(),
  not: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  filter: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockReturnThis(),
  csv: vi.fn().mockReturnThis(),
  then: vi.fn().mockReturnThis(),
  throwOnError: vi.fn().mockReturnThis(),
  abortSignal: vi.fn().mockReturnThis(),
  execute: vi.fn().mockReturnThis(),
  count: vi.fn().mockReturnThis()
});

// Define valid table names from the Database type
type SupabaseTable = keyof Database['public']['Tables'];

export const createSupabaseMock = () => ({
  from: (table: SupabaseTable) => {
    const baseMock = createBaseMock();
    return {
      ...baseMock,
      select: (query?: string) => ({
        ...baseMock,
        order: (column: string, options?: { ascending?: boolean }) => ({
          data: [{
            id: '1',
            name: 'Test Data',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }],
          error: null
        }),
        single: () => ({
          data: {
            id: '1',
            name: 'Test Data',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null
        }),
        eq: (column: string, value: any) => ({
          data: [{
            id: '1',
            name: 'Test Data',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }],
          error: null
        })
      }),
      insert: (values: any) => ({
        ...baseMock,
        select: () => ({
          data: [{ id: '1', ...values }],
          error: null
        })
      }),
      update: (values: any) => ({
        ...baseMock,
        eq: (column: string, value: any) => ({
          data: [{ id: '1', ...values }],
          error: null
        })
      }),
      delete: () => ({
        ...baseMock,
        eq: (column: string, value: any) => ({
          data: null,
          error: null
        })
      })
    } as unknown as PostgrestQueryBuilder<Database['public'], Database['public']['Tables'][SupabaseTable]>;
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-image.jpg' }, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test-image.jpg' } }))
    }))
  },
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: null, error: null })
  },
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'authenticated'
        },
        session: {
          access_token: 'test-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'authenticated'
          }
        }
      },
      error: null
    }),
    signInWithOAuth: vi.fn(),
    getSession: vi.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'test-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'authenticated'
          }
        }
      },
      error: null
    }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  }
});

export { createBaseMock };