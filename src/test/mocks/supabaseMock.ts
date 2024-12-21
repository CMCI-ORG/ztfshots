import { vi } from 'vitest';
import type { SupabaseClient, PostgrestResponse, PostgrestSingleResponse, PostgrestFilterBuilder } from '@supabase/supabase-js';
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

type MockBuilder<T> = {
  select: () => MockBuilder<T>;
  insert: (data: unknown) => MockBuilder<T>;
  update: (data: unknown) => MockBuilder<T>;
  upsert: (data: unknown) => MockBuilder<T>;
  delete: () => MockBuilder<T>;
  eq: (column: string, value: unknown) => MockBuilder<T>;
  order: (column: string) => MockBuilder<T>;
  single: () => MockBuilder<T>;
  match: (query: Record<string, unknown>) => MockBuilder<T>;
  then: (onfulfilled: (value: MockResponse<T>) => any) => Promise<any>;
}

export const createSupabaseMock = (customMocks = {}) => {
  const createQueryBuilder = <T>(): MockBuilder<T> => {
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

    return mockBuilder as unknown as MockBuilder<T>;
  };

  const mockClient = {
    from: vi.fn().mockImplementation((table: string) => {
      const builder = createQueryBuilder();
      return {
        ...builder,
        select: vi.fn().mockReturnValue(builder),
        insert: vi.fn().mockReturnValue(builder),
        update: vi.fn().mockReturnValue(builder),
        upsert: vi.fn().mockReturnValue(builder),
        delete: vi.fn().mockReturnValue(builder),
      };
    }),
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