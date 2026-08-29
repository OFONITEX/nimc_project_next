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

export const fullSignupSchema = z
  .object({
    surname: z.string().min(1, 'Surname is required'),
    firstname: z.string().min(1, 'First name is required'),
    othername: z.string().optional(),
    email: emailRule,
    password: passwordRule,
    password_confirmation: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  });

export type FullSignupValues = z.infer<typeof fullSignupSchema>;
