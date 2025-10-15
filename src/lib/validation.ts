import { z } from 'zod';

// Phone number validation (international format)
export const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must be less than 15 digits')
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format');

// Email validation
export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters');

// Emergency contact validation
export const emergencyContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  relationship: z
    .string()
    .trim()
    .min(1, 'Relationship is required')
    .max(50, 'Relationship must be less than 50 characters'),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
});

export type EmergencyContactInput = z.infer<typeof emergencyContactSchema>;
