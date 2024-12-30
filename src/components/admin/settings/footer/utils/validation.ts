export const validateField = (value: any, type: string, fieldName: string) => {
  if (!value && type !== 'array') {
    return `${fieldName} is required`;
  }
  
  switch (type) {
    case 'string':
      if (typeof value !== 'string') {
        return `${fieldName} must be text`;
      }
      break;
    case 'number':
      if (isNaN(Number(value))) {
        return `${fieldName} must be a number`;
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
  }
  return true;
};