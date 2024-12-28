import { describe, it, expect } from 'vitest';
import { validateSubscriptionRequest } from '@/components/subscription/form/useSubscription';

describe('Subscription Validation', () => {
  it('validates a valid subscription request', () => {
    const validRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      notify_new_quotes: true,
      notify_weekly_digest: true
    };

    const result = validateSubscriptionRequest(validRequest);
    expect(result.isValid).toBe(true);
  });

  it('rejects empty name', () => {
    const invalidRequest = {
      name: '',
      email: 'john@example.com'
    };

    const result = validateSubscriptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Name');
  });

  it('rejects invalid email', () => {
    const invalidRequest = {
      name: 'John Doe',
      email: 'invalid-email'
    };

    const result = validateSubscriptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('email');
  });

  it('validates WhatsApp subscription with phone', () => {
    const validRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      type: 'whatsapp',
      whatsapp_phone: '+1234567890'
    };

    const result = validateSubscriptionRequest(validRequest);
    expect(result.isValid).toBe(true);
  });
});