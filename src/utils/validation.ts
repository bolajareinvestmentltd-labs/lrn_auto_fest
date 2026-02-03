// Validation utilities for forms and data

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Nigerian format)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Accept: +234, 0, or formats like 08012345678, 07012345678
  const phoneRegex = /^(\+234|0)[7-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Validate name (minimum 2 characters)
 */
export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Validate business name (minimum 2 characters)
 */
export function validateBusinessName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 150;
}

/**
 * Validate required fields
 */
export function validateRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Validate form data for ticket purchase
 */
export function validateTicketPurchase(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!validateName(data.firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
  }

  if (!validateName(data.lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
  }

  if (!validatePhoneNumber(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid Nigerian phone number' });
  }

  return errors;
}

/**
 * Validate vendor booking form
 */
export function validateVendorForm(data: {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productType: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const validProductTypes = ['food', 'drink', 'eatables'];

  if (!validateBusinessName(data.businessName)) {
    errors.push({ field: 'businessName', message: 'Business name must be 2-150 characters' });
  }

  if (!validateName(data.contactPerson)) {
    errors.push({ field: 'contactPerson', message: 'Contact person name must be at least 2 characters' });
  }

  if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (!validatePhoneNumber(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid Nigerian phone number' });
  }

  if (!validProductTypes.includes(data.productType.toLowerCase())) {
    errors.push({ field: 'productType', message: 'Product type must be food, drink, or eatables' });
  }

  return errors;
}
