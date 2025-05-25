import { useState, useEffect } from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  const colorOptions = [
    { name: 'Soft Pink', value: '#FFD6E0' },
    { name: 'Light Blue', value: '#BFDBFE' },
    { name: 'Mint', value: '#A7F3D0' },
    { name: 'Lavender', value: '#DDD6FE' },
    { name: 'Peach', value: '#FED7AA' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#121212' }
  ];

  const gradientOptions = [
    { name: 'Sunset', value: 'linear-gradient(to right, #FF512F, #DD2476)' },
    { name: 'Ocean', value: 'linear-gradient(to right, #2193b0, #6dd5ed)' },
    { name: 'Purple Love', value: 'linear-gradient(to right, #cc2b5e, #753a88)' },
    { name: 'Fresh Mint', value: 'linear-gradient(to right, #00b09b, #96c93d)' },
    { name: 'Cherry', value: 'linear-gradient(to right, #EB3349, #F45C43)' },
    { name: 'Deep Space', value: 'linear-gradient(to right, #000000, #434343)' },
    { name: 'Cosmic', value: 'linear-gradient(to right, #ff00cc, #333399)' },
    { name: 'Northern Lights', value: 'linear-gradient(to right, #5f2c82, #49a09d)' },
    { name: 'Sunny Morning', value: 'linear-gradient(to right, #f6d365, #fda085)' },
    { name: 'Rainbow', value: 'linear-gradient(to right, #ff9a9e, #fad0c4, #fad0c4)' },
    { name: 'Plum Plate', value: 'linear-gradient(to right, #667eea, #764ba2)' },
    { name: 'Everlasting Sky', value: 'linear-gradient(to right, #fdfcfb, #e2d1c3)' }
  ];
  
  const handleColorOptionClick = (color: string) => {
    onColorChange(color);
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };
  
  return (
    <div>
      <h4 className="text-sm text-gray-600 mb-2">Solid Colors</h4>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
        {colorOptions.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => handleColorOptionClick(color.value)}
            className={`
              w-12 h-12 rounded-lg transition-all duration-200 relative
              ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-500' : 'hover:scale-110'}
            `}
            style={{ backgroundColor: color.value }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
        
        <button
          type="button"
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          className={`
            w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 via-green-400 to-blue-400
            hover:scale-110 transition-all duration-200
            ${showCustomPicker ? 'ring-2 ring-offset-2 ring-gray-500' : ''}
          `}
          title="Custom Color"
          aria-label="Select custom color"
        />
      </div>

      <h4 className="text-sm text-gray-600 mb-2">Gradients</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
        {gradientOptions.map((gradient) => (
          <button
            key={gradient.name}
            type="button"
            onClick={() => handleColorOptionClick(gradient.value)}
            className={`
              h-12 rounded-lg transition-all duration-200 relative
              ${selectedColor === gradient.value ? 'ring-2 ring-offset-2 ring-gray-500' : 'hover:scale-110'}
            `}
            style={{ background: gradient.value }}
            title={gradient.name}
            aria-label={`Select ${gradient.name} gradient`}
          />
        ))}
      </div>
      
      {showCustomPicker && (
        <div className="animate-fadeIn mb-6">
          <h4 className="text-sm text-gray-600 mb-2">Custom Color</h4>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={selectedColor}
              onChange={handleCustomColorChange}
              className="w-12 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedColor}
              onChange={handleCustomColorChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
      )}
    </div>
  );
}