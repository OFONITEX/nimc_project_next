import { z } from 'zod';
import { emailRule } from './auth';

export const agentPricingSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  agentNinPrice: z.number().min(0, { message: 'Price cannot be negative' }),
  agentBvnPrice: z.number().min(0, { message: 'Price cannot be negative' }),
});

export type AgentPricingFormValues = z.infer<typeof agentPricingSchema>;

export const addAgentSchema = z.object({
  email: emailRule,
  role: z.enum(['admin', 'agent', 'operator']),
  agentNinPrice: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
  agentBvnPrice: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
});

export type AddAgentFormValues = z.infer<typeof addAgentSchema>;
