
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from '@/components/shared/SelectBox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VOICE_OPTIONS } from '@/lib/video/constants/audio';
import { VoiceItem } from './VoiceItem';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';

const AudioSection = () => {
  const { form, isGenerating } = useVideoGenerationForm();
  
  const audioLanguage = form.watch('audio_language');
  const selectedVoice = form.watch('voice');
  
  // Filter voices by selected language
  const filteredVoices = Object.entries(VOICE_OPTIONS).filter(
    ([_, voice]) => voice.language === audioLanguage
  );
  
  // Group voices by ID prefix
  const googleVoices = filteredVoices.filter(([voiceId]) => voiceId.startsWith('google_'));
  const elevenLabsVoices = filteredVoices.filter(([voiceId]) => !voiceId.startsWith('google_') && !voiceId.startsWith('amazon_'));
  const amazonVoices = filteredVoices.filter(([voiceId]) => voiceId.startsWith('amazon_'));
  
  // Determine active tab based on selected voice
  const getActiveTab = () => {
    if (selectedVoice?.startsWith('google_')) return 'google';
    if (selectedVoice?.startsWith('eleven_')) return 'elevenlabs';
    if (selectedVoice?.startsWith('amazon_')) return 'amazon';
    return 'elevenlabs'; // Default to ElevenLabs
  };

  // Handle tab change to select first voice from the group
  const handleTabChange = (value: string) => {
    let voices;
    switch (value) {
      case 'google':
        voices = googleVoices;
        break;
      case 'elevenlabs':
        voices = elevenLabsVoices;
        break;
      case 'amazon':
        voices = amazonVoices;
        break;
      default:
        voices = elevenLabsVoices;
    }
    
    // Select first voice from the group if any exist
    if (voices.length > 0) {
      form.setValue('voice', voices[0][0]);
    }
  };
  
  // Determine if the selected voice is a Google voice
  const isGoogleVoice = selectedVoice?.startsWith('google_');
  
  return (
    <div className="space-y-6">
      {/* Language selection */}
      <FormField
        control={form.control}
        name="audio_language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Audio Language</FormLabel>
            <FormControl>
              <LanguageSelector 
                value={field.value} 
                onChange={field.onChange}
                disabled={isGenerating}
              />
            </FormControl>
            <FormDescription>
              Select the language for your video's audio
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Voice selection */}
      <FormField
        control={form.control}
        name="voice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice</FormLabel>
            <FormControl>
              <Tabs 
                defaultValue={getActiveTab()} 
                onValueChange={handleTabChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="elevenlabs" disabled={isGenerating} className="py-2">
                    ElevenLabs 
                    {!isGoogleVoice && <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Premium</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="google" disabled={isGenerating} className="py-2">
                    Google
                    {isGoogleVoice && <Badge variant="outline" className="ml-2 bg-emerald-100 text-emerald-800 border-emerald-200">Budget</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="amazon" disabled={isGenerating} className="py-2">
                    Amazon
                  </TabsTrigger>
                </TabsList>
                
                {/* ElevenLabs voices */}
                <TabsContent value="elevenlabs">
                  <Card>
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                        {elevenLabsVoices.map(([voiceId, voice]) => (
                          <VoiceItem 
                            key={voiceId} 
                            selected={field.value === voiceId} 
                            onClick={() => field.onChange(voiceId)}
                            voice={voice}
                            voiceId={voiceId}
                            disabled={isGenerating}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="text-center p-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-b-md">
                      Premium voices cost 11 credits per second of video
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Google voices */}
                <TabsContent value="google">
                  <Card>
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                        {googleVoices.map(([voiceId, voice]) => (
                          <VoiceItem 
                            key={voiceId} 
                            selected={field.value === voiceId} 
                            onClick={() => field.onChange(voiceId)}
                            voice={voice}
                            voiceId={voiceId}
                            disabled={isGenerating}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="text-center p-2 text-sm text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-b-md">
                      Budget-friendly option - only 3 credits per second of video
                    </div>
                  </Card>
                </TabsContent>
                
                {/* Amazon voices */}
                <TabsContent value="amazon">
                  <Card>
                    <ScrollArea className="h-[240px] pr-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                        {amazonVoices.map(([voiceId, voice]) => (
                          <VoiceItem 
                            key={voiceId} 
                            selected={field.value === voiceId} 
                            onClick={() => field.onChange(voiceId)}
                            voice={voice}
                            voiceId={voiceId}
                            disabled={isGenerating}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="text-center p-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-b-md">
                      Premium voices cost 11 credits per second of video
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AudioSection;
