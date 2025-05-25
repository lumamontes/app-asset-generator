import { useEffect, useRef, useState } from 'react';

interface AssetPreviewProps {
  emoji: string | null;
  image: string | null;
  backgroundColor: string;
}

interface ImageAdjustments {
  padding: number;
  scale: number;
}

export default function AssetPreview({ emoji, image, backgroundColor }: AssetPreviewProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  const [iconAdjustments, setIconAdjustments] = useState<ImageAdjustments>({ padding: 0, scale: 1 });
  const [splashAdjustments, setSplashAdjustments] = useState<ImageAdjustments>({ padding: 0, scale: 1 });
  
  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        iconRef.current?.classList.remove('animate-pulse');
      }, 500);
    }
    if (splashRef.current) {
      splashRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        splashRef.current?.classList.remove('animate-pulse');
      }, 500);
    }
  }, [emoji, image, backgroundColor]);

  const getBackgroundStyle = (bg: string) => {
    if (bg.startsWith('linear-gradient')) {
      return { backgroundImage: bg };
    }
    return { backgroundColor: bg };
  };

  const getImageStyle = (adjustments: ImageAdjustments) => {
    const { padding, scale } = adjustments;
    return {
      padding: `${padding}%`,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    };
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Preview</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm text-gray-600 mb-2">App Icon</h4>
          <div 
            ref={iconRef}
            className="w-24 h-24 rounded-xl overflow-hidden shadow-md transition-all duration-300"
            style={getBackgroundStyle(backgroundColor)}
          >
            {image ? (
              <div className="w-full h-full" style={getImageStyle(iconAdjustments)}>
                <img 
                  src={image} 
                  alt="Icon preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : emoji && (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {emoji}
              </div>
            )}
          </div>
          {image && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-xs text-gray-600">Padding</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={iconAdjustments.padding}
                  onChange={(e) => setIconAdjustments(prev => ({ ...prev, padding: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={iconAdjustments.scale}
                  onChange={(e) => setIconAdjustments(prev => ({ ...prev, scale: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm text-gray-600 mb-2">Splash Screen</h4>
          <div 
            ref={splashRef}
            className="w-full aspect-[2436/1125] rounded-xl overflow-hidden shadow-md transition-all duration-300"
            style={getBackgroundStyle(backgroundColor)}
          >
            {image ? (
              <div className="w-full h-full" style={getImageStyle(splashAdjustments)}>
                <img 
                  src={image} 
                  alt="Splash preview" 
                  className="w-full h-full object-contain"
                />
              </div>
            ) : emoji && (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {emoji}
              </div>
            )}
          </div>
          {image && (
            <div className="mt-2 space-y-2">
              <div>
                <label className="text-xs text-gray-600">Padding</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={splashAdjustments.padding}
                  onChange={(e) => setSplashAdjustments(prev => ({ ...prev, padding: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={splashAdjustments.scale}
                  onChange={(e) => setSplashAdjustments(prev => ({ ...prev, scale: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-500 italic">
        Preview of your app assets. Final assets will include all sizes required by app stores.
      </div>
    </div>
  );
}