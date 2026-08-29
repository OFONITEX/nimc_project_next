import { z } from 'zod';

export const ninVerifySchema = z.object({
  nin: z
    .string()
    .min(11, { message: 'NIN must be exactly 11 digits' })
    .max(11, { message: 'NIN must be exactly 11 digits' })
    .regex(/^\d+$/, { message: 'NIN must contain only numbers' }),
});

export type NinVerifyFormValues = z.infer<typeof ninVerifySchema>;

export const phoneVerifySchema = z.object({
  phoneNumber: z
    .string()
    .min(11, { message: 'Phone number must be at least 11 digits' })
    .max(14, { message: 'Phone number is too long' })
    .regex(/^[0-9+]+$/, { message: 'Invalid phone number format' }),
});

export type PhoneVerifyFormValues = z.infer<typeof phoneVerifySchema>;

export const demoVerifySchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  dob: z.string().min(1, { message: 'Date of birth is required' }),
  gender: z.enum(['male', 'female']),
});

export type DemoVerifyFormValues = z.infer<typeof demoVerifySchema>;

export const ninValidationSchema = z.object({
  nin: z
    .string()
    .min(11, { message: 'NIN must be exactly 11 digits' })
    .max(11, { message: 'NIN must be exactly 11 digits' })
    .regex(/^\d+$/, { message: 'NIN must contain only numbers' }),
  validationType: z.enum(['sim', 'no_record', 'modification']),
  trackingId: z.string().optional(),
});

export type NinValidationFormValues = z.infer<typeof ninValidationSchema>;

export const personalizationSchema = z.object({
  nin: z
    .string()
    .min(11, { message: 'NIN must be exactly 11 digits' })
    .max(11, { message: 'NIN must be exactly 11 digits' })
    .regex(/^\d+$/, { message: 'NIN must contain only numbers' }),
  format: z.enum(['v1_standard', 'v2_premium', 'plastic_card']),
});

export type PersonalizationFormValues = z.infer<typeof personalizationSchema>;

export const jambServiceSchema = z.object({
  nin: z
    .string()
    .min(11, { message: 'NIN must be exactly 11 digits' })
    .max(11, { message: 'NIN must be exactly 11 digits' })
    .regex(/^\d+$/, { message: 'NIN must contain only numbers' }),
  phoneNumber: z
    .string()
    .min(11, { message: 'Phone number must be at least 11 digits' })
    .max(14, { message: 'Phone number is too long' }),
});

export type JambServiceFormValues = z.infer<typeof jambServiceSchema>;
