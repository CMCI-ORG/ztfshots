import { vi } from 'vitest';

const createBaseMock = () => ({
  url: new URL('https://mock-url.com'),
  headers: {},
  select: vi.fn(),
  insert: vi.fn(),
  upsert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
  range: vi.fn(),
  single: vi.fn(),
  maybeSingle: vi.fn(),
  filter: vi.fn(),
  match: vi.fn(),
  throwOnError: vi.fn(),
  abortSignal: vi.fn(),
});

export const createSupabaseMock = () => ({
  from: () => {
    const baseMock = createBaseMock();
    return {
      ...baseMock,
      select: () => ({
        ...baseMock,
        eq: () => ({
          ...baseMock,
          data: [{ id: '1', name: 'Test Author', bio: 'Test Bio', image_url: 'https://example.com/image.jpg' }],
          error: null
        }),
        data: [{ id: '1', name: 'Test Author' }],
        error: null
      }),
      insert: () => ({
        ...baseMock,
        select: () => ({
          data: [{ id: '1' }],
          error: null
        })
      }),
      update: () => ({
        ...baseMock,
        eq: () => ({
          data: [{ id: '1' }],
          error: null
        })
      }),
      delete: () => ({
        ...baseMock,
        eq: () => ({
          data: null,
          error: null
        })
      })
    };
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-image.jpg' }, error: null }),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/test-image.jpg' } }))
    }))
  }
});