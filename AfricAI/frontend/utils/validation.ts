// utils/validation.ts

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters long.";
  // Add more checks like uppercase, number, symbol for higher security
  return null;
};

export const validateName = (name: string): string | null => {
    if (!name.trim()) return "Name is required.";
    return null;
}

export const validateCardNumber = (cardNumber: string): string | null => {
    if (!cardNumber) return "Card number is required.";
    const cleaned = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleaned)) return "Please enter a valid 16-digit card number.";
    return null;
};

export const validateExpiryDate = (expiryDate: string): string | null => {
    if (!expiryDate) return "Expiry date is required.";
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const match = expiryDate.match(expiryRegex);
    if (!match) return "Please use MM/YY format.";

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return "Card has expired.";
    }

    return null;
};

export const validateCVV = (cvv: string): string | null => {
    if (!cvv) return "CVV is required.";
    if (!/^\d{3,4}$/.test(cvv)) return "Please enter a valid 3 or 4-digit CVV.";
    return null;
};
