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

type PostgrestResponse<T> = Promise<MockResponse<T>> & {
  select: () => PostgrestResponse<T>;
  insert: (data: unknown) => PostgrestResponse<T>;
  update: (data: unknown) => PostgrestResponse<T>;
  upsert: (data: unknown) => PostgrestResponse<T>;
  delete: () => PostgrestResponse<T>;
  eq: (column: string, value: unknown) => PostgrestResponse<T>;
  order: (column: string) => PostgrestResponse<T>;
  single: () => PostgrestResponse<T>;
  match: (query: Record<string, unknown>) => PostgrestResponse<T>;
}

export const createSupabaseMock = (customMocks = {}) => {
  const createQueryBuilder = <T>(): PostgrestResponse<T> => {
    const mockBuilder = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      match: vi.fn().mockReturnThis(),
      then: (onfulfilled: any) => Promise.resolve(createMockResponse([], null)).then(onfulfilled),
      ...customMocks,
    };

    return mockBuilder as unknown as PostgrestResponse<T>;
  };

  const mockClient = {
    from: vi.fn().mockImplementation(() => createQueryBuilder()),
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