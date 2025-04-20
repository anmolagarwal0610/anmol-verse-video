
import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranscriptGenerator } from '@/hooks/use-transcript-generator';
import { FormInput } from '@/components/transcript/FormInput';
import { LoadingIndicator } from '@/components/transcript/LoadingIndicator';
import { ErrorDisplay } from '@/components/transcript/ErrorDisplay';
import { TranscriptDisplay } from '@/components/transcript/TranscriptDisplay';
import { AuthDialog } from '@/components/transcript/AuthDialog';

interface TranscriptFormProps {
  onTranscriptGenerated?: (transcript: string) => void;
}

const TranscriptForm = ({ onTranscriptGenerated }: TranscriptFormProps) => {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    scriptModel,
    setScriptModel,
    transcript,
    isGenerating,
    error,
    debugInfo,
    generationProgress,
    showAuthDialog,
    setShowAuthDialog,
    handleGenerate,
    handleRetry
  } = useTranscriptGenerator(onTranscriptGenerated);

  const redirectToAuth = useCallback(() => {
    navigate('/auth');
    setShowAuthDialog(false);
  }, [navigate, setShowAuthDialog]);

  return (
    <>
      <motion.div
        className="w-full max-w-3xl glass-panel rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <FormInput 
          prompt={prompt}
          scriptModel={scriptModel}
          onPromptChange={setPrompt}
          onScriptModelChange={setScriptModel}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
        />

        {isGenerating && (
          <LoadingIndicator progress={generationProgress} />
        )}

        {error && (
          <ErrorDisplay 
            error={error}
            debugInfo={debugInfo}
            onRetry={handleRetry}
            isGenerating={isGenerating}
            prompt={prompt}
          />
        )}

        {transcript && !error && (
          <TranscriptDisplay transcript={transcript} />
        )}
      </motion.div>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSignIn={redirectToAuth}
      />
    </>
  );
};

export default memo(TranscriptForm);
