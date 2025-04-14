
import { 
  ImageIcon,
  FileText,
  LayoutGrid,
  Film,
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeatureSection = () => {
  const features = [
    {
      title: "Video Generation",
      description: "Transform your ideas into high-quality, engaging short videos.",
      icon: <Film className="h-8 w-8 text-blue-500" />,
      path: "/videos/generate",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1,
      comingSoon: false,
      disabled: false
    },
    {
      title: "AI Image Generation",
      description: "Create stunning visuals from text descriptions with advanced AI models.",
      icon: <ImageIcon className="h-8 w-8 text-indigo-500" />,
      path: "/images",
      color: "from-indigo-500 to-purple-500",
      delay: 0.2
    },
    {
      title: "Auto Transcript",
      description: "Generate accurate transcripts from audio and video content.",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      path: "/transcript",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      title: "Media Gallery",
      description: "Browse and manage all your generated content in one place.",
      icon: <LayoutGrid className="h-8 w-8 text-orange-500" />,
      path: "/gallery",
      color: "from-orange-500 to-amber-500",
      delay: 0.4
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
