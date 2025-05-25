import { useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';
import ImageUploader from './ImageUploader';
import ColorPicker from './ColorPicker';
import DownloadSection from './DownloadSection';
import AssetPreview from './AssetPreview';

interface ImageAdjustments {
  padding: number;
  scale: number;
}

export default function AssetGenerator() {
  const [sourceType, setSourceType] = useState<'emoji' | 'image' | null>('emoji');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>('😊');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FFD6E0');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assetsGenerated, setAssetsGenerated] = useState(false);
  const [iconAdjustments, setIconAdjustments] = useState<ImageAdjustments>({ padding: 0, scale: 1 });
  const [splashAdjustments, setSplashAdjustments] = useState<ImageAdjustments>({ padding: 0, scale: 1 });

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setSourceType('emoji');
    setUploadedImage(null);
  };

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setSourceType('image');
    setSelectedEmoji(null);
  };

  const handleSourceTypeChange = (type: 'emoji' | 'image') => {
    setSourceType(type);
    if (type === 'emoji') {
      setUploadedImage(null);
      if (!selectedEmoji) {
        setSelectedEmoji('😊');
      }
    } else {
      setSelectedEmoji(null);
    }
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleGenerateAssets = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAssetsGenerated(true);
    }, 1500);
  };

  const handleReset = () => {
    setSourceType('emoji');
    setSelectedEmoji('😊');
    setUploadedImage(null);
    setBackgroundColor('#FFD6E0');
    setAssetsGenerated(false);
    setIconAdjustments({ padding: 0, scale: 1 });
    setSplashAdjustments({ padding: 0, scale: 1 });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => handleSourceTypeChange('emoji')}
                className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                  sourceType === 'emoji' 
                    ? 'border-soft-pink bg-pink-light' 
                    : 'border-gray-200 hover:border-pink-light'
                }`}
              >
                <div className="text-2xl">😊</div>
              </button>
              
              <button 
                onClick={() => handleSourceTypeChange('image')}
                className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                  sourceType === 'image' 
                    ? 'border-soft-pink bg-pink-light' 
                    : 'border-gray-200 hover:border-pink-light'
                }`}
              >
                <div className="text-2xl">🖼️</div>
              </button>
            </div>

            {sourceType === 'emoji' && (
              <EmojiPicker onEmojiSelect={handleEmojiSelect} selectedEmoji={selectedEmoji} />
            )}
            
            {sourceType === 'image' && (
              <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
            )}

            <div className="mt-8">
              <ColorPicker 
                selectedColor={backgroundColor} 
                onColorChange={handleColorChange} 
              />
              
              <button
                onClick={handleGenerateAssets}
                disabled={isGenerating}
                className="w-full mt-8 py-3 px-6 bg-soft-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate Assets'}
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <AssetPreview 
              emoji={selectedEmoji}
              image={uploadedImage}
              backgroundColor={backgroundColor}
              onIconAdjustmentsChange={setIconAdjustments}
              onSplashAdjustmentsChange={setSplashAdjustments}
            />
            
            {assetsGenerated && (
              <DownloadSection 
                emoji={selectedEmoji}
                image={uploadedImage}
                backgroundColor={backgroundColor}
                onReset={handleReset}
                iconAdjustments={iconAdjustments}
                splashAdjustments={splashAdjustments}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}