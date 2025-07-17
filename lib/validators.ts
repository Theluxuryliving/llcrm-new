// lib/validators.ts

export const validateLogin = (body: any) => {
  const { email, password } = body;

  if (typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, error: 'Invalid email address' };
  }

  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }

  return { valid: true, data: { email, password } };
};
