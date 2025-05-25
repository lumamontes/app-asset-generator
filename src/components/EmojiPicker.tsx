import { useState, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji: string | null;
}

export default function EmojiPicker({ onEmojiSelect, selectedEmoji }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  
  useEffect(() => {
    // Load recent emojis from localStorage if available
    try {
      const stored = localStorage.getItem('recentEmojis');
      if (stored) {
        setRecentEmojis(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent emojis:', error);
    }
  }, []);
  
  const handleEmojiSelect = (emoji: { native: string }) => {
    onEmojiSelect(emoji.native);
    setShowPicker(false);
    
    // Save to recent emojis
    try {
      const updated = [emoji.native, ...recentEmojis.filter(e => e !== emoji.native)].slice(0, 10);
      setRecentEmojis(updated);
      localStorage.setItem('recentEmojis', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save recent emojis:', error);
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Select an emoji for your app icon:</label>
        
        {selectedEmoji ? (
          <div className="flex items-center gap-2">
            <div 
              className="text-6xl p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-soft-pink transition-colors"
              onClick={() => setShowPicker(true)}
            >
              {selectedEmoji}
            </div>
            <button 
              onClick={() => setShowPicker(true)}
              className="text-gray-600 hover:text-soft-black underline ml-2"
            >
              Change
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowPicker(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-soft-pink transition-colors"
          >
            Open Emoji Picker
          </button>
        )}
      </div>
      
      {showPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-auto">
            <div className="p-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Choose an Emoji</h3>
              <button 
                onClick={() => setShowPicker(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {recentEmojis.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm text-gray-500 mb-2">Recent</h4>
                <div className="flex flex-wrap gap-2">
                  {recentEmojis.map((emoji, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleEmojiSelect({ native: emoji })}
                      className="text-2xl p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              set="native"
              previewPosition="none"
            />
          </div>
        </div>
      )}
    </div>
  );
}