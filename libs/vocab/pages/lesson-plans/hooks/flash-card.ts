import { useEffect, useState } from 'react';
import { defineWords, suggestWords } from '@/core/api/dictionary';
import { generateFlashcardDefinitions } from '@/core/api/gemini';
import { enumData } from '@/core/enums/enumData';



export const useSuggestWords = (keyword: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const text = keyword.trim();
    if (!text) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await suggestWords({
          word: text,
          max: enumData.PageRequest.PAGE_SIZE,
        });
        const rawItems = response?.data?.data || response?.data || response || [];
        const items = Array.isArray(rawItems) ? rawItems : [];
        setSuggestions(
          items
            .map((item) => item?.word || item?.name || item)
            .filter((w) => typeof w === 'string' && w.trim())
        );
      } catch (e) {
        setSuggestions([]);
        setError(e instanceof Error ? e.message : 'Suggest words failed');
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  return { suggestions, loading, error };
};

export const useFlashcardWordManager = () => {
  const [words, setWords] = useState<any[]>([]);
  const [inputWord, setInputWord] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [isAddingWord, setIsAddingWord] = useState(false);
  const { suggestions, loading } = useSuggestWords(inputWord);
  const [generateLoading, setGenerateLoading] = useState(false);

  const handleAddWord = async (text: string) => {
    setIsAddingWord(true);

    const data = await defineWords({ word: text });
    const word = {
      word: data.word,
      audio: data.phonetics?.[0]?.audio ?? '',
      phoneticText: data.phonetic,
      definition: data.definition,
    };
    if (!word) return;
    setWords((prev) => [...prev, word]);
    setInputWord('');
    setShowSuggest(false);
  };

  const removeWord = (word: string) => {
    if (!word) return;
    setWords((prev) => {
      return prev.filter((w: any) => w.word !== word);
    });
  };

  const generateDefinitions = async (words: string[]) => {
    setGenerateLoading(true);
    const data = await generateFlashcardDefinitions({ words });

    setWords((prev) =>
      prev.map((w) => {
        const index = words.indexOf(w.word);
        if (index !== -1) {
          return { ...w, definition: data[index].definition };
        }
        return w;
      }),
    );

    setGenerateLoading(false);
    return data;
  };

  const generateAllDefinitions = async () => {
    setGenerateLoading(true);
    const data = await generateFlashcardDefinitions({ words: words.map((w) => w.word) });

    setWords((prev) =>
      prev.map((w) => {
        const updated = data.find((item: any) => item.word === w.word);
        return updated ? { ...w, definition: updated.definition } : w;
      }),
    );

    setGenerateLoading(false);
    return data;
  };

  const clear = () => {
    setWords([]);
    setInputWord('');
    setShowSuggest(false);
    setLoadingMap({});
    setIsAddingWord(false);
    setGenerateLoading(false);
  };

  return {
    inputWord,
    setInputWord,
    showSuggest,
    setShowSuggest,
    suggestions,
    loading,
    words,
    loadingMap,
    handleAddWord,
    isAddingWord,
    removeWord,
    generateLoading,
    generateDefinitions,
    generateAllDefinitions,
    clear,
  };
};

export type LessonPlanFlashcardApi = ReturnType<typeof useFlashcardWordManager>;
