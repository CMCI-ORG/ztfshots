export const validateField = (value: any, type: string, fieldName: string) => {
  if (!value || value === '') {
    return `${fieldName} is required`;
  }

  switch (type) {
    case 'string':
      if (typeof value !== 'string' || value.trim() === '') {
        return `${fieldName} must contain text`;
      }
      if (value.trim().length < 2) {
        return `${fieldName} must be at least 2 characters`;
      }
      break;
    case 'url':
      try {
        new URL(value);
      } catch {
        return `${fieldName} must be a valid URL`;
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${fieldName} must be a valid email address`;
      }
      break;
    case 'array':
      if (!Array.isArray(value) || value.length === 0) {
        return `At least one ${fieldName} item is required`;
      }
      break;
  }
  return true;
};