import React from "react";

interface InputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  min?: number;
  step?: number;
  description?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  unit,
  min = 0.001,
  step = 0.1,
  description,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    } else if (e.target.value === "") {
      onChange(0);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </label>
        {description && (
          <span className="text-[10px] text-gray-500 font-medium">
            {description}
          </span>
        )}
      </div>
      <div className="relative flex items-center">
        <input
          id={id}
          type="number"
          min={min}
          step={step}
          value={value === 0 ? "" : value}
          onChange={handleChange}
          className="glass-input w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500/20 pr-12"
        />
        {unit && (
          <span className="absolute right-3 text-xs font-bold text-gray-500 select-none bg-gray-800/40 px-1.5 py-0.5 rounded border border-white/5">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
