import { User, Session } from '@supabase/supabase-js';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'test@example.com',
  phone: '',
  role: '',
  ...overrides,
});

export const createMockSession = (overrides?: Partial<Session>): Session => ({
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: createMockUser(),
  ...overrides,
});

// Create a class that extends Error to properly mock AuthError
class MockAuthError extends Error {
  status: number;
  code: string;
  protected __isAuthError: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = 400;
    this.code = 'invalid_request';
    this.__isAuthError = true;
  }
}

export const createMockAuthError = (message: string) => new MockAuthError(message);