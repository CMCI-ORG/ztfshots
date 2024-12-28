export interface SubscriptionRequest {
  name: string;
  email: string;
  notify_new_quotes?: boolean;
  notify_weekly_digest?: boolean;
  notify_whatsapp?: boolean;
  whatsapp_phone?: string;
}

export function validateSubscriptionRequest(request: SubscriptionRequest) {
  if (!request.name || !request.email) {
    return { isValid: false, error: "Name and email are required fields" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  if (request.name.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  return { isValid: true };
}