import { z } from "zod";

// export const issueSchema = z.object({
//   title: z.string().min(1, "Title is required.").max(255),
//   description: z
//     .string()
//     .min(1, "Description is required.")
//     .max(65535),
// });

// import { z } from 'zod';
import { Status } from '@prisma/client';

export const issueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  // status: z.nativeEnum(Status, { errorMap: () => ({ message: 'Status is required' }) })
  status: z.nativeEnum(Status, { errorMap: () => ({ message: 'Invalid status' }) }).optional(), 
});

export const patchIssueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(255)
    .optional(),
  description: z
    .string()
    .min(1, "Description is required.")
    .max(65535)
    .optional(),
  assignedToUserId: z
    .string()
    .min(1, "AssignedToUserId is required.")
    .max(255)
    .optional()
    .nullable(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
});
