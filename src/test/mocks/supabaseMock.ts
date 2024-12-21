import { vi } from 'vitest';
import type { PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

type MockResponse<T> = {
  data: T | null;
  error: Error | null;
  status: number;
  statusText: string;
}

export function createMockResponse<T>(data: T | null = null, error: Error | null = null): MockResponse<T> {
  return {
    data,
    error,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
  };
}

type MockSupabaseClient = Partial<SupabaseClient<Database>>;

type MockQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
  url: URL;
  headers: Record<string, string>;
}

export const createSupabaseMock = (customMocks = {}): MockSupabaseClient => ({
  from: (table: TableName) => ({
    select: vi.fn().mockImplementation(() => 
      Promise.resolve(createMockResponse([], null))
    ),
    insert: vi.fn().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    update: vi.fn().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    upsert: vi.fn().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    delete: vi.fn().mockImplementation(() => 
      Promise.resolve(createMockResponse(null, null))
    ),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    url: new URL('https://example.com'),
    headers: {},
    ...customMocks,
  }) as MockQueryBuilder,
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/test.jpg' } }),
    }),
  },
});

// Type guard for Supabase responses
export function isSupabaseResponse<T>(value: unknown): value is PostgrestResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'error' in value &&
    'status' in value &&
    'statusText' in value
  );
}