
import React from "react";
import FeedbackInput from "@/components/FeedbackInput";
import PodcastPreview from "@/components/PodcastPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Feedback = () => {
  const [audioUrl, setAudioUrl] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { toast } = useToast();

  const handleFeedbackSubmit = async (feedback: string) => {
    setIsProcessing(true);
    try {
      // First, generate the podcast script
      console.log("Generating podcast script...");
      const { data: scriptData, error: scriptError } =
        await supabase.functions.invoke("generate-podcast-script", {
          body: { feedback },
        });

      console.log("script data: ", scriptData);

      if (scriptError) {
        console.error("Script generation error:", scriptError);
        throw scriptError;
      }

      console.log("Script generated:", scriptData);

      // Then, convert the script to speech
      console.log("Converting to speech...");
      const { data: audioData, error: audioError } =
        await supabase.functions.invoke("text-to-speech", {
          body: { 
            text: scriptData.script,
            structuredScript: scriptData.structuredScript 
          },
        });

      if (audioError) {
        console.error("Audio generation error:", audioError);
        throw audioError;
      }

      setAudioUrl(audioData.audioUrl);
      toast({
        title: "Success!",
        description: "Your podcast has been generated successfully.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate podcast",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Connections
          </Button>
        </Link>

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Create Your Podcast
          </h1>
          <p className="text-gray-600">
            Transform your meeting feedback into an AI-powered podcast
          </p>
        </div>

        <div className="space-y-16">
          <FeedbackInput onSubmit={handleFeedbackSubmit} />

          {isProcessing && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Creating your podcast...</p>
            </div>
          )}

          {audioUrl && !isProcessing && <PodcastPreview audioUrl={audioUrl} />}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
