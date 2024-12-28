import { describe, it, expect } from 'vitest';
import { validateSubscriptionRequest, type SubscriptionRequest } from '@/components/subscription/form/useSubscription';

describe('Subscription Validation', () => {
  it('validates a valid subscription request', () => {
    const validRequest: SubscriptionRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      notify_new_quotes: true,
      notify_weekly_digest: true
    };

    const result = validateSubscriptionRequest(validRequest);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects empty name', () => {
    const invalidRequest: SubscriptionRequest = {
      name: '',
      email: 'john@example.com'
    };

    const result = validateSubscriptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Name is required');
  });

  it('rejects invalid email', () => {
    const invalidRequest: SubscriptionRequest = {
      name: 'John Doe',
      email: 'invalid-email'
    };

    const result = validateSubscriptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('valid email address');
  });

  it('validates WhatsApp subscription with phone', () => {
    const validRequest: SubscriptionRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      type: 'whatsapp',
      whatsapp_phone: '+1234567890'
    };

    const result = validateSubscriptionRequest(validRequest);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('rejects WhatsApp subscription without phone', () => {
    const invalidRequest: SubscriptionRequest = {
      name: 'John Doe',
      email: 'john@example.com',
      type: 'whatsapp'
    };

    const result = validateSubscriptionRequest(invalidRequest);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('WhatsApp phone number is required');
  });
});