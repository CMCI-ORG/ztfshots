import { SubscriptionRequest } from "../validation";

export const validateInputs = (subscriptionData: SubscriptionRequest) => {
  console.log("Validating subscription data:", subscriptionData);

  if (!subscriptionData.email || !subscriptionData.name) {
    throw new Error("Email and name are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(subscriptionData.email)) {
    throw new Error("Invalid email format");
  }
};