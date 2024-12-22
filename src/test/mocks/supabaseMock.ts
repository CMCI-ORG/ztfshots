import { vi } from 'vitest';

export const createSupabaseMock = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({
          data: { role: 'admin' },
          error: null
        }),
        data: [{ id: '1', name: 'Test Author' }],
        error: null
      }),
      order: () => ({
        data: [{ id: '1', name: 'Test Author' }],
        error: null
      }),
      data: [{ id: '1', name: 'Test Author' }],
      error: null,
      single: () => ({
        data: { role: 'admin' },
        error: null
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1' }],
        error: null
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          data: [{ id: '1' }],
          error: null
        })
      })
    }),
    delete: () => ({
      eq: () => ({
        select: () => ({
          data: null,
          error: null
        })
      })
    })
  }),
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