// src/ai/flows/improve-ocr-quality.ts
'use server';

/**
 * @fileOverview A flow to improve the quality of OCR-extracted text.
 *
 * - improveOcrQuality - A function that takes OCR-extracted text and refines it.
 * - ImproveOcrQualityInput - The input type for the improveOcrQuality function.
 * - ImproveOcrQualityOutput - The return type for the improveOcrQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveOcrQualityInputSchema = z.object({
  ocrText: z
    .string()
    .describe('The OCR-extracted text that needs to be refined.'),
});
export type ImproveOcrQualityInput = z.infer<typeof ImproveOcrQualityInputSchema>;

const ImproveOcrQualityOutputSchema = z.object({
  refinedText: z
    .string()
    .describe('The refined text, with errors corrected and improved readability.'),
});
export type ImproveOcrQualityOutput = z.infer<typeof ImproveOcrQualityOutputSchema>;

export async function improveOcrQuality(input: ImproveOcrQualityInput): Promise<ImproveOcrQualityOutput> {
  return improveOcrQualityFlow(input);
}

const improveOcrQualityPrompt = ai.definePrompt({
  name: 'improveOcrQualityPrompt',
  input: {schema: ImproveOcrQualityInputSchema},
  output: {schema: ImproveOcrQualityOutputSchema},
  prompt: `You are an AI expert in refining text extracted from OCR (Optical Character Recognition) to correct errors, improve readability, and apply contextual understanding.

  Please review the following OCR-extracted text and provide a refined version. Focus on correcting common OCR errors and make sure it is completely accurate.

  Here is the OCR-extracted text:
  {{ocrText}}`,
});

const improveOcrQualityFlow = ai.defineFlow(
  {
    name: 'improveOcrQualityFlow',
    inputSchema: ImproveOcrQualityInputSchema,
    outputSchema: ImproveOcrQualityOutputSchema,
  },
  async input => {
    const {output} = await improveOcrQualityPrompt(input);
    return output!;
  }
);
