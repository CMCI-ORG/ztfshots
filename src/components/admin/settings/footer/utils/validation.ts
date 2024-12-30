export const validateField = (value: any, type: string, fieldName: string) => {
  // Check for empty or undefined values
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`;
  }

  switch (type) {
    case 'string':
      if (typeof value !== 'string' || value.trim() === '') {
        return `${fieldName} must contain text`;
      }
      break;
    case 'number':
      if (isNaN(Number(value))) {
        return `${fieldName} must be a valid number`;
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