
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AUDIO_LANGUAGES } from "@/lib/video/constants/audio";

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: Record<string, string>;
  placeholder?: string;
}

export const SelectBox = ({
  value,
  onChange,
  disabled = false,
  options,
  placeholder = "Select an option"
}: SelectBoxProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" className="w-full z-50 bg-background border shadow-lg">
        {Object.entries(options).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const LanguageSelector = ({ 
  value, 
  onChange, 
  disabled = false 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  disabled?: boolean 
}) => {
  return (
    <SelectBox
      value={value}
      onChange={onChange}
      disabled={disabled}
      options={AUDIO_LANGUAGES}
      placeholder="Select language"
    />
  );
};
