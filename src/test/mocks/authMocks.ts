import { User, Session, AuthError } from '@supabase/supabase-js';

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

export const createMockAuthError = (message: string): AuthError => ({
  name: 'AuthError',
  message,
  status: 400,
  code: 'invalid_request',
  __isAuthError: true,
});