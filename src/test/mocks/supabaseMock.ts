import { vi } from 'vitest';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';
import { AuthError, User, Session } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];

// Create a properly typed base mock for PostgrestQueryBuilder
const createBaseMock = <T extends keyof Tables>() => {
  const baseBuilder = {
    url: new URL('https://example.com'),
    headers: {},
    schema: 'public',
    signal: undefined,
    // Core query methods
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    // Filter methods
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
    match: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    // Query modifiers
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    csv: vi.fn().mockReturnThis(),
    // Execution methods
    then: vi.fn().mockReturnThis(),
    throwOnError: vi.fn().mockReturnThis(),
    abortSignal: vi.fn().mockReturnThis()
  };

  return baseBuilder as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>;
};

export const createSupabaseMock = () => ({
  from: <T extends keyof Tables>(table: T) => {
    const baseMock = createBaseMock<T>();
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
    } as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>;
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-image.jpg' }, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test-image.jpg' } }))
    }))
  },
  auth: {
    signInWithPassword: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          role: 'authenticated'
        } as User,
        session: {
          access_token: 'test-token',
          refresh_token: 'test-refresh-token',
          expires_in: 3600,
          user: {
            id: '1',
            email: 'test@example.com',
            role: 'authenticated'
          }
        } as Session
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
        } as Session
      },
      error: null
    }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    }))
  }
});

export { createBaseMock };