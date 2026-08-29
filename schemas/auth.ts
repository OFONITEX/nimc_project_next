import { z } from 'zod';

export const emailRule = z
  .string()
  .min(1, { message: 'Email address is required' })
  .email({ message: 'Please enter a valid email address' });

export const passwordRule = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters' });

export const loginSchema = z.object({
  email: emailRule,
  password: passwordRule,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: emailRule,
  password: passwordRule,
});

export type SignupFormValues = z.infer<typeof signupSchema>;
