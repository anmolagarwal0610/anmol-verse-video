
import ImageModelField from '../ImageModelField';
import PixelSelection from '@/components/shared/PixelSelection';
import RatioAndTransitionFields from '../RatioAndTransitionFields';
import { useVideoGenerationForm } from '../../VideoGenerationFormContext';

const AdvancedVisualsSettingsFields = () => {
  const { form } = useVideoGenerationForm();

  return (
    <div className="space-y-6">
      <ImageModelField />
      <PixelSelection form={form} name="pixelOption" />
      <RatioAndTransitionFields />
    </div>
  );
};

export default AdvancedVisualsSettingsFields;
