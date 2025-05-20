
"use client";

import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { improveOcrQuality, type ImproveOcrQualityInput } from "@/ai/flows/improve-ocr-quality";
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { UploadCloud, FileText, Wand2, Download, FileImage, Info } from 'lucide-react';
import { ImageSlideshow } from '@/components/ImageSlideshow';

const MOCK_OCR_TEXT_PRESET = "Th1s is a s4mple text with s0me OCR err0rs. OptiScan AI can h3lp fix this! The qu1ck br0wn f0x jump3d 0ver the l4zy d0g. We h0pe y0u enj0y using this t00l.";

const slideshowImagesData = [
  { src: 'https://placehold.co/320x224.png', alt: 'Abstract tech background', hint: 'abstract technology' },
  { src: 'https://placehold.co/320x224.png', alt: 'Serene nature landscape', hint: 'nature landscape' },
  { src: 'https://placehold.co/320x224.png', alt: 'Modern city architecture', hint: 'city architecture' },
  { src: 'https://placehold.co/320x224.png', alt: 'Delicious gourmet food', hint: 'food delicious' },
  { src: 'https://placehold.co/320x224.png', alt: 'Dynamic sports action shot', hint: 'sports action' },
  { src: 'https://placehold.co/320x224.png', alt: 'Professional business meeting', hint: 'business meeting' },
  { src: 'https://placehold.co/320x224.png', alt: 'Vintage travel poster', hint: 'vintage travel' },
  { src: 'https://placehold.co/320x224.png', alt: 'Cute animal illustration', hint: 'cute animal' },
];


export default function OptiScanPage() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>("");
  const [refinedText, setRefinedText] = useState<string>("");
  const [isOcrLoading, setIsOcrLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup object URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setRawOcrText(""); // Reset previous OCR text
      setRefinedText(""); // Reset previous refined text
      
      // Simulate OCR
      setIsOcrLoading(true);
      setTimeout(() => {
        setRawOcrText(MOCK_OCR_TEXT_PRESET);
        setIsOcrLoading(false);
        toast({
          title: "Image Processed",
          description: "Text has been extracted from the image.",
        });
      }, 1500); // Simulate network delay
    }
  };

  const handleRefineText = async () => {
    if (!rawOcrText) {
      toast({
        title: "Error",
        description: "No text to refine. Please upload an image first.",
        variant: "destructive",
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const input: ImproveOcrQualityInput = { ocrText: rawOcrText };
      const result = await improveOcrQuality(input);
      setRefinedText(result.refinedText);
      toast({
        title: "Text Refined",
        description: "AI has enhanced the extracted text.",
      });
    } catch (error) {
      console.error("AI Refinement Error:", error);
      toast({
        title: "AI Error",
        description: "Could not refine text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTxt = () => {
    downloadFile("refined_text.txt", refinedText, "text/plain;charset=utf-8");
  };

  const handleDownloadCodeStyledHtml = () => {
    const styledContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formatted Text - OptiScan AI</title>
  <style>
    body { 
      background-color: #282c34; /* Dark background */
      color: #abb2bf; /* Light text */
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      padding: 20px; 
      font-size: 14px; 
      line-height: 1.6; 
      margin: 0;
    }
    pre { 
      white-space: pre-wrap; 
      word-wrap: break-word; 
      background-color: #21252b; /* Slightly lighter dark for pre block */
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #333842;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <pre>${refinedText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;
    downloadFile("code_styled_text.html", styledContent, "text/html;charset=utf-8");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <AppHeader />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-8 space-y-8">
        
        <Card className="shadow-lg mx-4 sm:mx-0">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UploadCloud className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">1. Upload Your Image</CardTitle>
            </div>
            <CardDescription>Select an image file (JPEG, PNG) to extract text from it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image-upload" className="sr-only">Upload Image</Label>
              <Input 
                id="image-upload" 
                type="file" 
                accept="image/jpeg, image/png" 
                onChange={handleImageUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>
            {imagePreview && (
              <div className="mt-4 p-2 border border-dashed border-border rounded-md bg-muted/50 flex justify-center items-center max-h-96 overflow-hidden">
                <Image 
                  src={imagePreview} 
                  alt="Uploaded preview" 
                  width={400} 
                  height={300} 
                  className="rounded-md object-contain max-h-80 w-auto"
                  data-ai-hint="uploaded image"
                />
              </div>
            )}
            {!imagePreview && !isOcrLoading && (
              <div className="mt-4 p-8 border border-dashed border-border rounded-md bg-muted/50 flex flex-col justify-center items-center text-center min-h-[200px]">
                <FileImage className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your image preview will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {isOcrLoading && (
          <Card className="shadow-lg mx-4 sm:mx-0">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px]">
              <LoadingSpinner className="h-12 w-12 text-primary mb-4" />
              <p className="text-muted-foreground">Extracting text, please wait...</p>
            </CardContent>
          </Card>
        )}

        {rawOcrText && !isOcrLoading && (
          <Card className="shadow-lg mx-4 sm:mx-0">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">2. Original Extracted Text</CardTitle>
              </div>
              <CardDescription>This is the raw text extracted from your image. You can refine it using AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={rawOcrText} 
                readOnly 
                rows={8}
                className="bg-muted/50 focus:ring-0 focus:border-input"
                aria-label="Original extracted text"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleRefineText} disabled={isAiLoading || !rawOcrText} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isAiLoading ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Refine with AI
              </Button>
            </CardFooter>
          </Card>
        )}

        {isAiLoading && !refinedText && (
           <Card className="shadow-lg mx-4 sm:mx-0">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px]">
              <LoadingSpinner className="h-12 w-12 text-accent mb-4" />
              <p className="text-muted-foreground">AI is refining your text...</p>
            </CardContent>
          </Card>
        )}
        
        <ImageSlideshow images={slideshowImagesData} title="Featured Inspirations" />

        {refinedText && (
          <Card className="shadow-lg mx-4 sm:mx-0">
            <CardHeader>
              <div className="flex items-center space-x-2">
                 <Wand2 className="h-6 w-6 text-accent" />
                <CardTitle className="text-2xl">3. AI-Refined Text & Editor</CardTitle>
              </div>
              <CardDescription>Edit the AI-enhanced text below. Then, download it in your preferred format.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={refinedText} 
                onChange={(e) => setRefinedText(e.target.value)}
                rows={10}
                className="focus:ring-accent focus:border-accent"
                aria-label="AI-refined text editor"
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={handleDownloadTxt} variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                <Download className="mr-2 h-4 w-4" />
                Download .txt
              </Button>
              <Button onClick={handleDownloadCodeStyledHtml} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download Code-Styled .html
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card className="shadow-lg bg-card mx-4 sm:mx-0">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Info className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Effortless Text Extraction & Refinement</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-card-foreground/90">
            <p>
              Just a couple of clicks and a few seconds are all you need to extract and refine text from your images. 
              Your text will be ready in no time, saving you hours of effort.
            </p>
            <p>
              OptiScan AI works seamlessly on any device with a modern browser - no setup required. 
              Convert images (JPEG, PNG, etc.) to clear, editable text anytime, anywhere.
            </p>
          </CardContent>
        </Card>

      </main>
      <AppFooter />
    </div>
  );
}
