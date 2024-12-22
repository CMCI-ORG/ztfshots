import { vi } from 'vitest';

const createBaseMock = () => ({
  url: 'https://mock-url.com',
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
          single: () => ({
            data: { role: 'admin' },
            error: null
          }),
          data: [{ id: '1', name: 'Test Author' }],
          error: null
        }),
        order: () => ({
          ...baseMock,
          limit: () => ({
            ...baseMock,
            maybeSingle: () => ({
              data: { id: '1', name: 'Test Author' },
              error: null
            })
          }),
          data: [{ id: '1', name: 'Test Author' }],
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
          ...baseMock,
          select: () => ({
            data: [{ id: '1' }],
            error: null
          })
        })
      }),
      delete: () => ({
        ...baseMock,
        eq: () => ({
          ...baseMock,
          select: () => ({
            data: null,
            error: null
          })
        })
      })
    };
  },
  auth: {
    getUser: () => Promise.resolve({ 
      data: { 
        user: { 
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }, 
      error: null 
    }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })
  }
});