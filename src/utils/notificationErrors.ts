export enum NotificationErrorType {
  RATE_LIMIT = 'rate_limit',
  INVALID_EMAIL = 'invalid_email',
  VERIFICATION = 'verification',
  NETWORK = 'network',
  SERVICE = 'service',
  UNKNOWN = 'unknown'
}

export interface NotificationError {
  type: NotificationErrorType;
  message: string;
  retryable: boolean;
}

export const classifyError = (error: any): NotificationError => {
  const message = error?.message || 'Unknown error occurred';
  
  if (message.toLowerCase().includes('rate limit')) {
    return {
      type: NotificationErrorType.RATE_LIMIT,
      message: 'Rate limit exceeded. Notifications will be retried automatically.',
      retryable: true
    };
  }
  
  if (message.toLowerCase().includes('invalid email')) {
    return {
      type: NotificationErrorType.INVALID_EMAIL,
      message: 'Invalid email address detected.',
      retryable: false
    };
  }
  
  if (message.toLowerCase().includes('verification')) {
    return {
      type: NotificationErrorType.VERIFICATION,
      message: 'Email verification required.',
      retryable: true
    };
  }
  
  if (message.toLowerCase().includes('network') || message.toLowerCase().includes('timeout')) {
    return {
      type: NotificationErrorType.NETWORK,
      message: 'Network error occurred. Will retry automatically.',
      retryable: true
    };
  }
  
  if (message.toLowerCase().includes('service')) {
    return {
      type: NotificationErrorType.SERVICE,
      message: 'Service temporarily unavailable. Will retry automatically.',
      retryable: true
    };
  }
  
  return {
    type: NotificationErrorType.UNKNOWN,
    message: 'An unexpected error occurred.',
    retryable: true
  };
};

export const calculateNextRetryTime = (retryCount: number): Date => {
  // Exponential backoff: 5min, 15min, 45min, 2h, 6h
  const delayMinutes = Math.min(5 * Math.pow(3, retryCount), 360);
  const nextRetry = new Date();
  nextRetry.setMinutes(nextRetry.getMinutes() + delayMinutes);
  return nextRetry;
};