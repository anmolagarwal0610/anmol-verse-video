
import ModelSelectionFields from './basic/ModelSelectionFields';
import TopicField from './basic/TopicField';
import TimingFields from './basic/TimingFields';

const BasicFormFields = () => {
  return (
    <div className="space-y-6">
      <ModelSelectionFields />
      <TopicField />
      <TimingFields />
    </div>
  );
};

export default BasicFormFields;
