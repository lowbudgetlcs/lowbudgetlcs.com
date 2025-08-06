export const DamageCheckbox = ({
  label,
  checked,
  onChange,
  team,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  team: string;
}) => {
  const formattedId = `${team}-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center gap-2 pl-4">
      <input type="checkbox" checked={checked} onChange={onChange} id={formattedId} />
      <label htmlFor={formattedId} className="text-white/80 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};

export const MasterDamageCheckbox = ({
  label,
  checked,
  onChange,
  team,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  team: string;
}) => {
  const formattedId = `${team}-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} id={formattedId} />
      <label htmlFor={formattedId} className="text-white/80 cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
};