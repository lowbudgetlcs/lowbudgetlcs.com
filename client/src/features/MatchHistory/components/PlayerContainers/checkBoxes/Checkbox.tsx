import { useId } from "react";

export const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => {
  const uniqueId = useId();
  return (
    <div className="flex items-center gap-2 pl-4">
      <input type="checkbox" checked={checked} onChange={onChange} id={uniqueId} />
      <label htmlFor={uniqueId} className="text-white/80 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};

export const MasterCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => {
  const uniqueId = useId();
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} id={uniqueId} />
      <label htmlFor={uniqueId} className="text-white/80 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};
