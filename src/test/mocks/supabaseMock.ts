import { vi } from 'vitest';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { Database } from '@/integrations/supabase/types';

// Define valid table names from the Database type, excluding views
type SupabaseTable = Exclude<keyof Database['public']['Tables'], 'category_quote_counts'>;

const createBaseMock = () => ({
  url: new URL('https://mock-url.com'),
  headers: {},
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
  likeAllOf: vi.fn().mockReturnThis(),
  likeAnyOf: vi.fn().mockReturnThis(),
  ilikeAllOf: vi.fn().mockReturnThis(),
  ilikeAnyOf: vi.fn().mockReturnThis(),
});

export const createSupabaseMock = () => ({
  from: vi.fn((table: SupabaseTable) => {
    const baseMock = createBaseMock();
    return {
      ...baseMock,
      select: vi.fn((query = '*') => ({
        ...baseMock,
        eq: vi.fn(() => ({
          ...baseMock,
          order: vi.fn(() => ({
            data: [{
              id: '1',
              name: 'Test Template',
              language: 'en',
              content: 'Test content',
              status: 'pending',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }],
            error: null
          }))
        }))
      })),
      insert: vi.fn((values) => ({
        ...baseMock,
        select: vi.fn(() => ({
          data: [{ id: '1' }],
          error: null
        }))
      })),
      update: vi.fn((values) => ({
        ...baseMock,
        eq: vi.fn(() => ({
          data: [{ id: '1' }],
          error: null
        }))
      })),
      delete: vi.fn(() => ({
        ...baseMock,
        eq: vi.fn(() => ({
          data: null,
          error: null
        }))
      }))
    } as unknown as PostgrestQueryBuilder<Database['public'], Database['public']['Tables'][SupabaseTable]>;
  }),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-image.jpg' }, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test-image.jpg' } }))
    }))
  },
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: null, error: null })
  }
});

export { createBaseMock };