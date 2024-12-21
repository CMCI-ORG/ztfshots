import { vi } from 'vitest';

export const createSupabaseMock = (customMocks = {}) => ({
  select: vi.fn().mockResolvedValue({ data: [], error: null }),
  insert: vi.fn().mockResolvedValue({ data: null, error: null }),
  update: vi.fn().mockResolvedValue({ data: null, error: null }),
  upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  delete: vi.fn().mockResolvedValue({ data: null, error: null }),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  match: vi.fn().mockReturnThis(),
  url: new URL('https://example.com'),
  headers: {},
  ...customMocks,
});