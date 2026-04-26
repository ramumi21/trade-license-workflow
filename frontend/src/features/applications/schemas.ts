import * as z from "zod";



export const Step1SelectionSchema = z.object({
  licenseType: z.string().min(1, "Please select a license type."),
});



// For file uploads, we need to handle FileList or custom file inputs

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB



export const Step2AttachmentsSchema = z.object({

  documentType: z.string().min(1, "Document type is required"),

  file: z.any()

    .refine((files) => files?.length === 1, "Document is required.")

    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`),

});



export const Step3PaymentSchema = z.object({

  amount: z.coerce.number().min(1, "Amount must be greater than 0"),

  currency: z.string().min(1, "Currency is required"),

  transactionId: z.string().min(1, "Transaction ID is required"),

});



export type Step1FormValues = z.infer<typeof Step1SelectionSchema>;

export type Step2FormValues = z.infer<typeof Step2AttachmentsSchema>;

export type Step3FormValues = z.infer<typeof Step3PaymentSchema>;



// Domain Types

export interface Application {

  id: string;

  applicantId: string;

  licenseType: string;

  status: string;

  paymentStatus: string;

  createdAt: string;

  updatedAt: string;

}