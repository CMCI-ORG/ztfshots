import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
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

// Create a more complete mock storage implementation
const mockStorage = {
  listBuckets: vi.fn(),
  getBucket: vi.fn(),
  createBucket: vi.fn(),
  updateBucket: vi.fn(),
  deleteBucket: vi.fn(),
  emptyBucket: vi.fn(),
  from: vi.fn().mockReturnValue({
    upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/test.jpg' } }),
  }),
};

interface PostgrestBuilder {
  select: () => PostgrestBuilder & Promise<MockResponse<unknown>>;
  insert: (data: unknown) => PostgrestBuilder & Promise<MockResponse<unknown>>;
  update: (data: unknown) => PostgrestBuilder & Promise<MockResponse<unknown>>;
  upsert: (data: unknown) => PostgrestBuilder & Promise<MockResponse<unknown>>;
  delete: () => PostgrestBuilder & Promise<MockResponse<unknown>>;
  eq: (column: string, value: unknown) => PostgrestBuilder;
  order: (column: string) => PostgrestBuilder;
  single: () => PostgrestBuilder;
  match: (query: Record<string, unknown>) => PostgrestBuilder;
}

export const createSupabaseMock = (customMocks = {}) => {
  const mockBuilder = {
    select: vi.fn().mockReturnThis().mockImplementation(() => 
      Promise.resolve(createMockResponse([], null))
    ),
    insert: vi.fn().mockReturnThis().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    update: vi.fn().mockReturnThis().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    upsert: vi.fn().mockReturnThis().mockImplementation((data: unknown) => 
      Promise.resolve(createMockResponse(data, null))
    ),
    delete: vi.fn().mockReturnThis().mockImplementation(() => 
      Promise.resolve(createMockResponse(null, null))
    ),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
    ...customMocks,
  };

  const mockQueryBuilder = {
    ...mockBuilder,
    then: (onfulfilled: any) => Promise.resolve(createMockResponse([], null)).then(onfulfilled),
  } as unknown as PostgrestBuilder;

  const mockClient = {
    from: vi.fn().mockImplementation(() => mockQueryBuilder),
    storage: mockStorage,
  } as unknown as SupabaseClient<Database>;

  return mockClient;
};

// Type guard for Supabase responses
export function isSupabaseResponse<T>(value: unknown): value is MockResponse<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'error' in value &&
    'status' in value &&
    'statusText' in value
  );
}