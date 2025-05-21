
import { 
  ImageIcon,
  FileText,
  LayoutGrid,
  Film,
  MessageSquareMore,
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  const features = [
    {
      title: "Video Genie",
      description: "Instantly transform a single idea into a complete, voice-backed, image-rich video, bringing your stories to life effortlessly.",
      icon: <Film className="h-8 w-8" />, // Removed text-[#4FC3F7], FeatureCard will color it using text-accent
      path: "/videos/generate",
      delay: 0.1,
      comingSoon: false,
      disabled: false
    },
    {
      title: "AI Image Creation",
      description: "Generate unique, high-quality visuals from simple text descriptions using advanced AI models. Perfect for marketing, art, and more.",
      icon: <ImageIcon className="h-8 w-8" />, // Removed text-[#4FC3F7]
      path: "/images",
      delay: 0.2
    },
    {
      title: "Smart Transcription",
      description: "Convert audio and video content into precise, readable transcripts with our AI-powered technology, saving you time and effort.",
      icon: <FileText className="h-8 w-8" />, // Removed text-[#4FC3F7]
      path: "/transcript",
      delay: 0.3
    },
    {
      title: "Media Collection",
      description: "Effortlessly organize, manage, and access all your AI-generated content within an elegant and intuitive interface.",
      icon: <LayoutGrid className="h-8 w-8" />, // Removed text-[#4FC3F7]
      path: "/gallery",
      delay: 0.4
    },
    {
      title: "Chat Genie",
      description: "Revolutionize your customer interactions with intelligent, automated WhatsApp and Instagram chat solutions.",
      icon: <MessageSquareMore className="h-8 w-8" />, // Removed text-[#4FC3F7]
      path: "/chat",
      delay: 0.5,
      comingSoon: true,
      disabled: true
    }
  ];

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeatureSection;
