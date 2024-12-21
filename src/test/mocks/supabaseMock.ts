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

// Create a more complete mock storage implementation
const mockStorage = {
  url: new URL('https://example.com'),
  headers: {},
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
  fetch: vi.fn(),
};

export const createSupabaseMock = (customMocks = {}) => {
  const mockQueryBuilder = {
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
  };

  const mockClient = {
    from: vi.fn().mockImplementation((table: TableName) => ({
      ...mockQueryBuilder,
      insert: mockQueryBuilder.insert,
      update: mockQueryBuilder.update,
    })),
    storage: mockStorage,
  } as unknown as SupabaseClient<Database>;

  return mockClient;
};

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