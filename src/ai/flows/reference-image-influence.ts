// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Enhances generative fills with reference image influence.
 *
 * @remarks
 * This file defines a Genkit flow that allows users to upload a reference image
 * to guide the generative fill process, aligning the generated content with
 * specific vision and style preferences. The flow takes a prompt and an image
 * data URI as input, and returns the updated image data URI with the applied
 * generative fill.
 *
 * @exports referenceImageInfluence
 * @exports ReferenceImageInfluenceInput
 * @exports ReferenceImageInfluenceOutput
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the reference image influence flow.
const ReferenceImageInfluenceInputSchema = z.object({
  prompt: z.string().describe('The prompt to guide the generative fill.'),
  referenceImageDataUri: z
    .string()
    .describe(
      'A reference image to influence the generative fill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type ReferenceImageInfluenceInput = z.infer<
  typeof ReferenceImageInfluenceInputSchema
>;

// Define the output schema for the reference image influence flow.
const ReferenceImageInfluenceOutputSchema = z.object({
  updatedImageDataUri: z
    .string()
    .describe(
      'The updated image data URI with the generative fill applied, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type ReferenceImageInfluenceOutput = z.infer<
  typeof ReferenceImageInfluenceOutputSchema
>;

// Define the reference image influence flow.
export async function referenceImageInfluence(
  input: ReferenceImageInfluenceInput
): Promise<ReferenceImageInfluenceOutput> {
  return referenceImageInfluenceFlow(input);
}

const referenceImageInfluencePrompt = ai.definePrompt({
  name: 'referenceImageInfluencePrompt',
  input: {schema: ReferenceImageInfluenceInputSchema},
  output: {schema: ReferenceImageInfluenceOutputSchema},
  prompt: `Apply generative fill to an image based on the following prompt and reference image.

Prompt: {{{prompt}}}

Reference Image: {{media url=referenceImageDataUri}}

Return the updated image as a data URI.
`,
});

const referenceImageInfluenceFlow = ai.defineFlow(
  {
    name: 'referenceImageInfluenceFlow',
    inputSchema: ReferenceImageInfluenceInputSchema,
    outputSchema: ReferenceImageInfluenceOutputSchema,
  },
  async input => {
    const {output} = await referenceImageInfluencePrompt(input);
    return output!;
  }
);
