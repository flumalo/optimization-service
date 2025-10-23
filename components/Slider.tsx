import React from 'react';

interface SliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const Slider: React.FC<SliderProps> = ({ id, label, value, onChange, min, max, step, unit }) => {
  return (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {label}
            </label>
            <span className="text-sm font-mono bg-gray-700/50 text-emerald-300 rounded-md px-3 py-1 w-24 text-center">
                {value} {unit}
            </span>
        </div>
        <input
            type="range"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
        />
    </div>
  );
};

export default Slider;
