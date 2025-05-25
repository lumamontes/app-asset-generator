import { useEffect, useState, useRef } from 'react';
import JSZip from 'jszip';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface DownloadSectionProps {
  emoji: string | null;
  image: string | null;
  backgroundColor: string;
  onReset: () => void;
  iconAdjustments?: {
    padding: number;
    scale: number;
  };
  splashAdjustments?: {
    padding: number;
    scale: number;
  };
}

interface AssetOptions {
  icon: boolean;
  favicon: boolean;
  adaptiveIcon: boolean;
  splashIcon: boolean;
  splash: boolean;
}

// Asset sizes required by app stores
const assetSizes = {
  appIcon: [
    { name: 'icon-1024.png', size: 1024 }, // App Store
    { name: 'icon-512.png', size: 512 },   // Play Store
    { name: 'icon-180.png', size: 180 },   // iPhone
    { name: 'icon-167.png', size: 167 },   // iPad Pro
    { name: 'icon-152.png', size: 152 },   // iPad
    { name: 'icon-120.png', size: 120 },   // iPhone
    { name: 'icon-80.png', size: 80 },     // Spotlight
    { name: 'icon-64.png', size: 64 },     // Web
    { name: 'icon-40.png', size: 40 },     // Small
  ],
  splash: [
    { name: 'splash-2436x1125.png', width: 2436, height: 1125 }, // iPhone X landscape
    { name: 'splash-1125x2436.png', width: 1125, height: 2436 }, // iPhone X portrait
    { name: 'splash-2208x1242.png', width: 2208, height: 1242 }, // iPhone 8 Plus landscape
    { name: 'splash-1242x2208.png', width: 1242, height: 2208 }, // iPhone 8 Plus portrait
    { name: 'splash-2732x2048.png', width: 2732, height: 2048 }, // 12.9" iPad Pro landscape
    { name: 'splash-2048x2732.png', width: 2048, height: 2732 }, // 12.9" iPad Pro portrait
  ],
  favicon: [
    { name: 'favicon-16.png', size: 16 },
    { name: 'favicon-32.png', size: 32 },
    { name: 'favicon-96.png', size: 96 },
  ]
};

export default function DownloadSection({ 
  emoji, 
  image, 
  backgroundColor, 
  onReset,
  iconAdjustments = { padding: 0, scale: 1 },
  splashAdjustments = { padding: 0, scale: 1 }
}: DownloadSectionProps) {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [assetOptions, setAssetOptions] = useState<AssetOptions>({
    icon: true,
    favicon: true,
    adaptiveIcon: true,
    splashIcon: true,
    splash: true
  });
  
  const iconRef = useRef<HTMLDivElement>(null);
  const splashRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    generateAssets();
    
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, []);
  
  const generateAssets = async () => {
    if (!iconRef.current || !splashRef.current) return;
    
    setGenerating(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();
      
      const appIconFolder = zip.folder('app-icons');
      const splashFolder = zip.folder('splash-screens');
      const faviconFolder = zip.folder('favicons');
      
      if (!appIconFolder || !splashFolder || !faviconFolder) {
        throw new Error('Failed to create folders in zip');
      }
      
      let totalAssets = 0;
      if (assetOptions.icon) totalAssets += assetSizes.appIcon.length;
      if (assetOptions.splash) totalAssets += assetSizes.splash.length;
      if (assetOptions.favicon) totalAssets += assetSizes.favicon.length;
      
      let completed = 0;
      
      // Generate app icons
      if (assetOptions.icon) {
        for (const size of assetSizes.appIcon) {
          const dataUrl = await generateIcon(size.size);
          appIconFolder.file(size.name, dataUrl.split(',')[1], { base64: true });
          completed++;
          setProgress(Math.round((completed / totalAssets) * 100));
        }
      }
      
      // Generate splash screens
      if (assetOptions.splash) {
        for (const size of assetSizes.splash) {
          const dataUrl = await generateSplash(size.width, size.height);
          splashFolder.file(size.name, dataUrl.split(',')[1], { base64: true });
          completed++;
          setProgress(Math.round((completed / totalAssets) * 100));
        }
      }
      
      // Generate favicons
      if (assetOptions.favicon) {
        for (const size of assetSizes.favicon) {
          const dataUrl = await generateIcon(size.size);
          faviconFolder.file(size.name, dataUrl.split(',')[1], { base64: true });
          completed++;
          setProgress(Math.round((completed / totalAssets) * 100));
        }
      }
      
      zip.file('README.txt', createReadmeContent());
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      
      setDownloadUrl(url);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating assets:', error);
      setGenerating(false);
    }
  };
  
  const generateIcon = async (size: number): Promise<string> => {
    const element = iconRef.current?.cloneNode(true) as HTMLElement;
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    
    // Adjust emoji size based on icon size
    if (emoji && !image) {
      const emojiElement = element.querySelector('div');
      if (emojiElement) {
        // Scale emoji size relative to icon size
        const fontSize = Math.max(size * 0.6, 40); // Minimum size of 40px
        emojiElement.style.fontSize = `${fontSize}px`;
      }
    }
    
    document.body.appendChild(element);
    
    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      return dataUrl;
    } finally {
      document.body.removeChild(element);
    }
  };

  const generateSplash = async (width: number, height: number): Promise<string> => {
    const element = splashRef.current?.cloneNode(true) as HTMLElement;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    
    // Adjust emoji size based on splash screen size
    if (emoji && !image) {
      const emojiElement = element.querySelector('div');
      if (emojiElement) {
        // Scale emoji size relative to splash screen size
        const fontSize = Math.max(Math.min(width, height) * 0.3, 200); // Minimum size of 200px
        emojiElement.style.fontSize = `${fontSize}px`;
      }
    }
    
    document.body.appendChild(element);
    
    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      return dataUrl;
    } finally {
      document.body.removeChild(element);
    }
  };
  
  const createReadmeContent = () => {
    return `
APP ASSETS GENERATOR
===================

Generated on: ${new Date().toLocaleString()}

CONTENTS:
---------
1. app-icons/ - App icons in various sizes for iOS and Android
2. splash-screens/ - Splash screens in various sizes
3. favicons/ - Favicons for web use

For more information about app icons and splash screens, visit:
https://developer.apple.com/design/human-interface-guidelines/app-icons
https://developer.android.com/guide/practices/ui_guidelines/icon_design
    `;
  };
  
  const getBackgroundStyle = (bg: string) => {
    if (bg.startsWith('linear-gradient')) {
      return { backgroundImage: bg };
    }
    return { backgroundColor: bg };
  };

  const getImageStyle = (adjustments: { padding: number; scale: number }) => {
    const { padding, scale } = adjustments;
    return {
      padding: `${padding}%`,
      transform: `scale(${scale})`,
      transformOrigin: 'center',
    };
  };
  
  return (
    <div>
      <div 
        className="hidden" 
        style={{ 
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          visibility: 'hidden',
          width: 0,
          height: 0,
          overflow: 'hidden',
          display: 'none'
        }}
      >
        <div 
          ref={iconRef}
          style={{ 
            ...getBackgroundStyle(backgroundColor),
            width: '1024px', 
            height: '1024px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {image ? (
            <div style={getImageStyle(iconAdjustments)}>
              <img 
                src={image} 
                alt="App Icon"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }}
              />
            </div>
          ) : emoji && (
            <div style={{ 
              fontSize: '750px', 
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center' 
            }}>
              {emoji}
            </div>
          )}
        </div>

        <div 
          ref={splashRef}
          style={{ 
            ...getBackgroundStyle(backgroundColor),
            width: '2436px', 
            height: '1125px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {image ? (
            <div style={getImageStyle(splashAdjustments)}>
              <img 
                src={image} 
                alt="Splash Image"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ) : emoji && (
            <div style={{ 
              fontSize: '400px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {emoji}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
        <div className="mb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            Advanced Options
          </button>
          
          {showAdvanced && (
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assetOptions.icon}
                  onChange={(e) => setAssetOptions(prev => ({ ...prev, icon: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">App Icon (icon.png)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assetOptions.favicon}
                  onChange={(e) => setAssetOptions(prev => ({ ...prev, favicon: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Favicon (favicon.png)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assetOptions.adaptiveIcon}
                  onChange={(e) => setAssetOptions(prev => ({ ...prev, adaptiveIcon: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Adaptive Icon (adaptive-icon.png)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assetOptions.splashIcon}
                  onChange={(e) => setAssetOptions(prev => ({ ...prev, splashIcon: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Splash Icon (splash-icon.png)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={assetOptions.splash}
                  onChange={(e) => setAssetOptions(prev => ({ ...prev, splash: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Splash Screen (splash.png)</span>
              </label>
            </div>
          )}
        </div>

        {generating ? (
          <div className="text-center py-4">
            <div className="mb-4">Generating assets...</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-soft-pink h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : downloadUrl ? (
          <div className="text-center">
            <div className="flex gap-4 justify-center">
              <a 
                href={downloadUrl} 
                download="app-assets.zip"
                className="py-2 px-4 bg-soft-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                Download
              </a>
              
              <button
                onClick={onReset}
                className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Over
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={generateAssets}
              className="py-2 px-4 bg-soft-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}