
import React from 'react';
import FeedbackInput from '@/components/FeedbackInput';
import PodcastPreview from '@/components/PodcastPreview';

const Index = () => {
  const [audioUrl, setAudioUrl] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFeedbackSubmit = async (feedback: string) => {
    setIsProcessing(true);
    try {
      // Audio is handled directly in the FeedbackInput component
      setAudioUrl('generated');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container max-w-4xl py-12 px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Meeting Assistant</h1>
          <p className="text-gray-600">Join your online meetings and transform your feedback into voice content</p>
        </div>
        
        <div className="space-y-8">
          <FeedbackInput onSubmit={handleFeedbackSubmit} />
          
          {isProcessing && (
            <div className="text-center py-8 animate-fadeIn">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Processing your feedback...</p>
            </div>
          )}
          
          {audioUrl && !isProcessing && (
            <PodcastPreview audioUrl={audioUrl} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
