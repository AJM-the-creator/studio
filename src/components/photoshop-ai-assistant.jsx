"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ImageIcon,
  Loader2,
  Paintbrush,
  RectangleHorizontal,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { colorAwareGenerativeFill } from "@/ai/flows/color-aware-generative-fill";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  prompt: z.string().min(1, { message: "Please enter a prompt." }),
  useColor: z.boolean().default(false),
  color: z.string().optional(),
  referenceImage: z.any().optional(),
  useSelection: z.boolean().default(true),
});

const SELECTION_AREA_JSON = JSON.stringify({
  x: 50,
  y: 50,
  width: 400,
  height: 300,
  unit: "pixels",
});

const readFileAsDataUri = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function PhotoshopAiAssistant() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      useColor: false,
      color: "#1E90FF",
      useSelection: true,
    },
  });

  const useColorValue = form.watch("useColor");
  const fileRef = form.register("referenceImage");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  async function onSubmit(values) {
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      let referenceImageDataUri = undefined;
      if (values.referenceImage && values.referenceImage.length > 0) {
        const file = values.referenceImage[0];
        if (file instanceof File) {
          referenceImageDataUri = await readFileAsDataUri(file);
        }
      }

      const result = await colorAwareGenerativeFill({
        prompt: values.prompt,
        foregroundColor: values.useColor ? values.color : undefined,
        referenceImage: referenceImageDataUri,
        selectionArea: values.useSelection ? SELECTION_AREA_JSON : "{}",
      });

      if (result.generatedImage) {
        setGeneratedImage(result.generatedImage);
        toast({
            title: "Success!",
            description: "Your image has been generated and placed.",
          });
      } else {
        throw new Error("AI failed to generate an image.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          "An error occurred while generating the image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <Card className="w-full overflow-hidden shadow-2xl">
        <CardHeader className="flex flex-row items-start gap-4 bg-card-foreground/5 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">
              Photoshop AI Assistant
            </CardTitle>
            <CardDescription>
              Use generative fill to create content from a text prompt.
            </CardDescription>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 p-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Prompt
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'a majestic lion wearing a crown'"
                        className="min-h-24 resize-none text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="useColor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2 text-base">
                            <Paintbrush className="h-4 w-4" /> Color Integration
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {useColorValue && (
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="color" className="h-12 w-full" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <FormField
                    control={form.control}
                    name="useSelection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2 text-base">
                            <RectangleHorizontal className="h-4 w-4" /> Use
                            Selection
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-readonly
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormDescription>
                        Simulates an active selection in the document.
                    </FormDescription>
                </div>
              </div>

              <FormField
                control={form.control}
                name="referenceImage"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Reference Image (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="reference-image-input"
                        disabled={isGenerating}
                        {...fileRef}
                        onChange={(event) => {
                          handleImageChange(event);
                          fileRef.onChange(event);
                        }}
                      />
                    </FormControl>
                    <Label
                      htmlFor="reference-image-input"
                      className={cn(
                        "flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary",
                        isGenerating && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Reference preview"
                          width={128}
                          height={128}
                          className="h-32 w-32 rounded-md object-contain"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10" />
                      )}
                      <span>
                        {imagePreview
                          ? "Change reference image"
                          : "Click to upload an image"}
                      </span>
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="bg-card-foreground/5 p-6">
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Fill
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {(isGenerating || generatedImage) && (
        <Card className="w-full overflow-hidden shadow-2xl">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              The AI-generated image is placed on a new layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center bg-muted/20 p-4">
            <div className="relative aspect-video w-full max-w-2xl rounded-md border bg-card">
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm">
                  <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
                  <p className="text-lg text-primary-foreground">
                    Processing...
                  </p>
                </div>
              )}
              {generatedImage && (
                <Image
                  src={generatedImage}
                  alt="Generated content"
                  layout="fill"
                  objectFit="contain"
                  className="p-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
