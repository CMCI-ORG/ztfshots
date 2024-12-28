export interface SubscriptionRequest {
  name: string;
  email: string;
  nation?: string;
  notify_new_quotes?: boolean;
  notify_weekly_digest?: boolean;
  notify_whatsapp?: boolean;
  whatsapp_phone?: string;
  type?: 'email' | 'whatsapp' | 'browser';
}

export function validateSubscriptionRequest(request: SubscriptionRequest) {
  console.log("Validating subscription request:", request);

  if (!request.name || request.name.trim().length === 0) {
    return { isValid: false, error: "Name is required" };
  }

  if (!request.email || request.email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return { isValid: false, error: "Please provide a valid email address" };
  }

  if (request.type === 'whatsapp' && !request.whatsapp_phone) {
    return { isValid: false, error: "WhatsApp phone number is required for WhatsApp subscriptions" };
  }

  return { isValid: true, error: null };
}