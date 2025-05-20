
import ImageModelField from '../ImageModelField';
import PixelSelection from '@/components/shared/PixelSelection';
import RatioAndTransitionFields from '../RatioAndTransitionFields';

const AdvancedVisualsSettingsFields = () => {
  return (
    <div className="space-y-6">
      <ImageModelField />
      <PixelSelection />
      <RatioAndTransitionFields />
    </div>
  );
};

export default AdvancedVisualsSettingsFields;
