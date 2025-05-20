
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const faqData = [
  {
    question: "What is OptiScan AI?",
    answer:
      "OptiScan AI is a powerful tool that allows you to upload images, automatically extract text from them using Optical Character Recognition (OCR), and then refine that text using advanced AI for improved accuracy and readability.",
  },
  {
    question: "What types of images can I upload?",
    answer:
      "Currently, OptiScan AI supports JPEG and PNG image formats. We are working to expand support for more formats in the future.",
  },
  {
    question: "How does the AI text refinement work?",
    answer:
      "Once text is extracted from your image, our AI (powered by Genkit) analyzes the text to correct common OCR errors, improve sentence structure, and enhance overall clarity. It's like having an expert editor review your scanned documents.",
  },
  {
    question: "Can I edit the text after AI refinement?",
    answer:
      "Yes! The AI-refined text is displayed in an editable textarea. You can make any further adjustments or corrections you need before downloading.",
  },
  {
    question: "What download formats are supported for the refined text?",
    answer:
      "You can download your refined text as a plain text (.txt) file or as a code-styled HTML (.html) file, which is great for preserving formatting when sharing or archiving.",
  },
  {
    question: "Is OptiScan AI free to use?",
    answer:
      "OptiScan AI offers a basic free tier for occasional use. For more advanced features, higher usage limits, or commercial applications, please check our upcoming pricing plans (details coming soon!).",
  },
  {
    question: "How accurate is the OCR and AI refinement?",
    answer:
      "Our OCR technology is highly accurate for clear images. The AI refinement significantly improves upon the raw OCR output, correcting errors and enhancing readability. However, for very low-quality images or highly complex layouts, some manual review may still be beneficial.",
  },
];

export function FaqSection() {
  return (
    <Card className="shadow-lg mx-4 sm:mx-0">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left hover:no-underline text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
