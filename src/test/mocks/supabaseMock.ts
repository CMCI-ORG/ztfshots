import { vi } from 'vitest';
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';
import { AuthError, User, Session } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];

// Create a properly typed base mock for PostgrestQueryBuilder
const createBaseMock = <T extends keyof Tables>() => ({
  url: new URL('https://example.com'),
  headers: {},
  schema: 'public',
  signal: undefined,
  select: vi.fn().mockReturnThis() as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>['select'],
  insert: vi.fn().mockReturnThis() as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>['insert'],
  upsert: vi.fn().mockReturnThis() as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>['upsert'],
  update: vi.fn().mockReturnThis() as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>['update'],
  delete: vi.fn().mockReturnThis() as unknown as PostgrestQueryBuilder<Database['public'], Tables[T]>['delete'],
  eq: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['eq'],
  neq: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['neq'],
  gt: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['gt'],
  gte: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['gte'],
  lt: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['lt'],
  lte: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['lte'],
  like: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['like'],
  ilike: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['ilike'],
  is: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['is'],
  in: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['in'],
  contains: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['contains'],
  containedBy: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['containedBy'],
  range: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['range'],
  overlap: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['overlap'],
  adjacent: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['adjacent'],
  match: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['match'],
  not: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['not'],
  or: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['or'],
  filter: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['filter'],
  order: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['order'],
  limit: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['limit'],
  offset: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['offset'],
  single: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['single'],
  maybeSingle: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['maybeSingle'],
  csv: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['csv'],
  then: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['then'],
  throwOnError: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['throwOnError'],
  abortSignal: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['abortSignal'],
  execute: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['execute'],
  count: vi.fn().mockReturnThis() as unknown as PostgrestFilterBuilder<Database['public'], Tables[T], Tables[T]['Row']>['count']
});

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