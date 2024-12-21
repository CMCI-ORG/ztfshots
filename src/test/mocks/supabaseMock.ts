import { vi } from 'vitest';
import type { PostgrestResponse, PostgrestSingleResponse, PostgrestFilterBuilder } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

interface MockResponse<T> extends PostgrestResponse<T> {
  data: T | null;
  error: Error | null;
}

export function createMockResponse<T>(data: T | null = null, error: Error | null = null): MockResponse<T> {
  return {
    data,
    error,
    count: data ? (Array.isArray(data) ? data.length : 1) : null,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK',
  };
}

export const createSupabaseMock = (customMocks = {}) => ({
  from: vi.fn((table: TableName) => ({
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
    ...customMocks,
  })),
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