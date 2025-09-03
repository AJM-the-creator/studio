import { PhotoshopAiAssistant } from "@/components/photoshop-ai-assistant";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full font-body">
      <main className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <PhotoshopAiAssistant />
      </main>
      <Toaster />
    </div>
  );
}
