import { useEffect, useState } from 'react';
import { suggestWords } from '@/core/api/dictionary';
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

  const handleAddWord = (text: string) => {
    const trimmed = text?.trim();
    if (!trimmed) return;

    // Tránh thêm từ trùng lặp
    const exists = words.some((w) => w.word?.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setInputWord('');
      setShowSuggest(false);
      return;
    }

    const newWord = {
      word: trimmed,
      audio: '',
      phoneticText: '',
      definition: '',
    };

    setWords((prev) => [...prev, newWord]);
    setInputWord('');
    setShowSuggest(false);
  };

  const removeWord = (word: string) => {
    if (!word) return;
    setWords((prev) => {
      return prev.filter((w: any) => w.word !== word);
    });
  };

  const generateDefinitions = async (wordsToGen: string[]) => {
    if (!wordsToGen || wordsToGen.length === 0) return;

    setGenerateLoading(true);
    setLoadingMap((prev) => {
      const next = { ...prev };
      wordsToGen.forEach((w) => {
        next[w] = true;
      });
      return next;
    });

    try {
      const data = await generateFlashcardDefinitions({ words: wordsToGen });

      setWords((prev) =>
        prev.map((w) => {
          const item = Array.isArray(data)
            ? data.find((d: any) => d.word?.toLowerCase() === w.word?.toLowerCase())
            : null;

          if (item) {
            return {
              ...w,
              definition: item.definition ?? w.definition,
              phoneticText: item.phonetic ?? item.phoneticText ?? w.phoneticText,
              audio: item.audio ?? w.audio,
            };
          }

          const index = wordsToGen.indexOf(w.word);
          if (index !== -1 && data?.[index]) {
            return {
              ...w,
              definition: data[index].definition ?? w.definition,
              phoneticText: data[index].phonetic ?? data[index].phoneticText ?? w.phoneticText,
              audio: data[index].audio ?? w.audio,
            };
          }
          return w;
        }),
      );

      return data;
    } catch (err) {
      console.error('Failed to generate definitions', err);
    } finally {
      setGenerateLoading(false);
      setLoadingMap((prev) => {
        const next = { ...prev };
        wordsToGen.forEach((w) => {
          delete next[w];
        });
        return next;
      });
    }
  };

  const generateAllDefinitions = async () => {
    if (words.length === 0) return;
    const allWords = words.map((w) => w.word);
    return generateDefinitions(allWords);
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
