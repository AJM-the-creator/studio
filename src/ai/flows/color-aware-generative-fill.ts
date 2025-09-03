'use server';
/**
 * @fileOverview An AI agent that performs color-aware generative fills.
 *
 * - colorAwareGenerativeFill - A function that performs a color-aware generative fill.
 * - ColorAwareGenerativeFillInput - The input type for the colorAwareGenerativeFill function.
 * - ColorAwareGenerativeFillOutput - The return type for the colorAwareGenerativeFill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColorAwareGenerativeFillInputSchema = z.object({
  prompt: z.string().describe('The prompt for the generative fill.'),
  foregroundColor: z
    .string()
    .describe(
      'The current foreground color of the Photoshop document, as a hex code.'
    )
    .optional(),
  referenceImage: z
    .string()
    .describe(
      'A reference image to influence the generative fill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* per code guide */
    )
    .optional(),
  selectionArea: z
    .string()
    .describe('The selected area in the Photoshop document, as a JSON string.'),
});
export type ColorAwareGenerativeFillInput = z.infer<
  typeof ColorAwareGenerativeFillInputSchema
>;

const ColorAwareGenerativeFillOutputSchema = z.object({
  generatedImage: z
    .string()
    .describe(
      'The generated image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* per code guide */
    ),
});
export type ColorAwareGenerativeFillOutput = z.infer<
  typeof ColorAwareGenerativeFillOutputSchema
>;

export async function colorAwareGenerativeFill(
  input: ColorAwareGenerativeFillInput
): Promise<ColorAwareGenerativeFillOutput> {
  return colorAwareGenerativeFillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'colorAwareGenerativeFillPrompt',
  input: {schema: ColorAwareGenerativeFillInputSchema},
  output: {schema: ColorAwareGenerativeFillOutputSchema},
  prompt: `You are an AI assistant that performs generative fills for Photoshop documents.

  The user has provided the following prompt: {{{prompt}}}

  {{#if foregroundColor}}
  The current foreground color of the Photoshop document is {{{foregroundColor}}}.
  Please generate an image that seamlessly integrates with this color palette.
  {{/if}}

  {{#if referenceImage}}
  Here is a reference image to influence the generative fill: {{media url=referenceImage}}
  {{/if}}

  The selected area in the Photoshop document is: {{{selectionArea}}}

  Generate an image that satisfies the prompt and integrates with the existing color palette and reference image if provided.
  Return the generated image as a data URI.
  `,
});

const colorAwareGenerativeFillFlow = ai.defineFlow(
  {
    name: 'colorAwareGenerativeFillFlow',
    inputSchema: ColorAwareGenerativeFillInputSchema,
    outputSchema: ColorAwareGenerativeFillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
