import React from 'react';
import useTestStore from '../store/testStore';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
];

const LanguageSelector: React.FC = () => {
  const setSelectedLanguage = useTestStore((state) => state.setSelectedLanguage);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Select Explanation Language</h2>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className="w-full p-3 text-left hover:bg-gray-100 rounded-md transition-colors"
          >
            <span className="font-medium">{lang.name}</span>
            <span className="ml-2 text-gray-600">({lang.native})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;