export const calculateNextRetryTime = (retryCount: number): Date => {
  // Exponential backoff: 5min, 15min, 45min, 2h, 6h
  const delayMinutes = Math.min(5 * Math.pow(3, retryCount), 360);
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
  return nextRetry;
};