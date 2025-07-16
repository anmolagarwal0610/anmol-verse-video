
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranscriptGenerator } from '@/hooks/use-transcript-generator';
import { FormInput } from '@/components/transcript/FormInput';
import { LoadingIndicator } from '@/components/transcript/LoadingIndicator';
import { ErrorDisplay } from '@/components/transcript/ErrorDisplay';
import { TranscriptDisplay } from '@/components/transcript/TranscriptDisplay';
import { GuideDisplay } from '@/components/transcript/GuideDisplay';
import { AuthDialog } from '@/components/transcript/AuthDialog';

interface TranscriptFormProps {
  onTranscriptGenerated?: (transcript: string) => void;
}

const TranscriptForm = ({ onTranscriptGenerated }: TranscriptFormProps) => {
  const navigate = useNavigate();
  const {
    prompt,
    setPrompt,
    language,
    setLanguage,
    transcript,
    guide,
    isGenerating,
    error,
    debugInfo,
    generationProgress,
    showAuthDialog,
    setShowAuthDialog,
    handleGenerate,
    handleRetry,
    calculateCreditCost
  } = useTranscriptGenerator(onTranscriptGenerated);

  const redirectToAuth = () => {
    navigate('/auth');
    setShowAuthDialog(false);
  };

  // Calculate credit cost
  const creditCost = calculateCreditCost();

  return (
    <>
      <motion.div
        className="w-full max-w-3xl glass-panel rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <FormInput 
          prompt={prompt}
          language={language}
          onPromptChange={setPrompt}
          onLanguageChange={setLanguage}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
          creditCost={creditCost}
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
        
        {guide && !error && (
          <GuideDisplay guide={guide} />
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

export default TranscriptForm;
