import { SubscriptionRequest } from "../validation.ts";

export function validateInputs(data: SubscriptionRequest): void {
  console.log("Validating subscription data:", data);

  if (!data.email) {
    throw new Error("Email is required");
  }

  if (!isValidEmail(data.email)) {
    throw new Error("Invalid email format");
  }

  if (!data.name) {
    throw new Error("Name is required");
  }

  if (data.name.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  if (data.whatsapp_phone && !isValidPhoneNumber(data.whatsapp_phone)) {
    throw new Error("Invalid WhatsApp phone number format");
  }

  console.log("Validation passed successfully");
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}