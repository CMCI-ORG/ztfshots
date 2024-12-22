import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'] | keyof Database['public']['Views'];

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
  deleteBucket: vi.fn(),
  emptyBucket: vi.fn(),
  from: vi.fn().mockReturnValue({
    upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.com/test.jpg' } }),
  }),
};

interface MockQueryBuilder<T> {
  select: (columns?: string) => MockQueryBuilder<T>;
  insert: (data: unknown) => Promise<MockResponse<T>>;
  update: (data: unknown) => Promise<MockResponse<T>>;
  upsert: (data: unknown) => Promise<MockResponse<T>>;
  delete: () => Promise<MockResponse<T>>;
  eq: (column: string, value: unknown) => MockQueryBuilder<T>;
  order: (column: string) => MockQueryBuilder<T>;
  single: () => Promise<MockResponse<T>>;
  match: (query: Record<string, unknown>) => MockQueryBuilder<T>;
  then?: (onfulfilled?: (value: MockResponse<T>) => unknown) => Promise<unknown>;
}

export const createSupabaseMock = (customMocks = {}) => {
  const createQueryBuilder = <T>(): MockQueryBuilder<T> => {
    const defaultResponse = Promise.resolve(createMockResponse<T>(null));
    
    const mockBuilder: MockQueryBuilder<T> = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockImplementation((data) => {
        return Promise.resolve(createMockResponse(data as T));
      }),
      update: vi.fn().mockImplementation((data) => {
        return Promise.resolve(createMockResponse(data as T));
      }),
      upsert: vi.fn().mockReturnValue(defaultResponse),
      delete: vi.fn().mockReturnValue(defaultResponse),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnValue(defaultResponse),
      match: vi.fn().mockReturnThis(),
      ...customMocks,
    };

    return mockBuilder;
  };

  const mockClient = {
    from: vi.fn().mockImplementation((table: string) => createQueryBuilder()),
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