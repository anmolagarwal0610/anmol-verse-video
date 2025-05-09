
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
      description: "Turn a single idea into a complete, voice-backed, image-rich video instantly and effortlessly.",
      icon: <Film className="h-8 w-8 text-blue-500" />,
      path: "/videos/generate",
      color: "from-blue-500 to-blue-600",
      delay: 0.1,
      comingSoon: false,
      disabled: false
    },
    {
      title: "Chat Genie",
      description: "Enchant your messaging experience with intelligent WhatsApp and Instagram chat automation.",
      icon: <MessageSquareMore className="h-8 w-8 text-teal-500" />,
      path: "/chat",
      color: "from-teal-500 to-teal-600",
      delay: 0.2,
      comingSoon: true,
      disabled: true
    },
    {
      title: "AI Image Creation",
      description: "Generate elegant visuals from text descriptions with advanced AI models.",
      icon: <ImageIcon className="h-8 w-8 text-indigo-500" />,
      path: "/images",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.3
    },
    {
      title: "Smart Transcription",
      description: "Create precise transcripts from audio and video content with AI technology.",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      path: "/transcript",
      color: "from-green-500 to-green-600",
      delay: 0.4
    },
    {
      title: "Media Collection",
      description: "Organize and manage your generated content in an elegant interface.",
      icon: <LayoutGrid className="h-8 w-8 text-purple-500" />,
      path: "/gallery",
      color: "from-purple-500 to-purple-600",
      delay: 0.5
    }
  ];

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeatureSection;
