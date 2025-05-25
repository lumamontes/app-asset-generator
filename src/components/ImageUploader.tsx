import { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string) => void;
  uploadedImage: string | null;
}

export default function ImageUploader({ onImageUpload, uploadedImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const processFile = (file: File) => {
    setError(null);
    
    // Validate file
    if (!file.type.match('image.*')) {
      setError('Please upload an image file (PNG, JPG, GIF, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemove = () => {
    onImageUpload('');
  };
  
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Upload an image for your app icon:</label>
      
      {uploadedImage ? (
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg border border-gray-200 overflow-hidden">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <button 
              onClick={handleButtonClick}
              className="text-gray-600 hover:text-soft-black underline mr-4"
            >
              Change
            </button>
            <button 
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            isDragging 
              ? 'border-soft-pink bg-pink-light' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-2">🖼️</div>
          <p className="mb-2 text-gray-600">
            Drag & drop an image here, or {' '}
            <button 
              onClick={handleButtonClick}
              className="text-soft-pink hover:text-pink-dark underline focus:outline-none"
              type="button"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, GIF (max 5MB)
          </p>
          {error && (
            <div className="mt-2 text-red-500 text-sm">{error}</div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}