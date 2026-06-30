import { useEffect, useState } from "react";
import { defineWords, suggestWords } from "@/core/api/dictionary";
import { generateFlashcardDefinitions } from "@/core/api/gemini";
import { enumData } from "@/core/enums/enumData";

function normalizeWords(raw: unknown): string[] {
    if (!raw) return [];

    const source = Array.isArray(raw) ? raw : Array.isArray((raw as any)?.data) ? (raw as any).data : Array.isArray((raw as any)?.items) ? (raw as any).items : [];

    return source
        .map((item: any) => {
            if (typeof item === "string") return item;
            if (typeof item?.word === "string") return item.word;
            if (typeof item?.name === "string") return item.name;
            return "";
        })
        .filter(Boolean);
}

export function useSuggestWords(keyword: string) {
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
                const data = await suggestWords({
                    word: text,
                    max: enumData.PageRequest.PAGE_SIZE,
                });
                setSuggestions(normalizeWords(data));
            } catch (e) {
                setSuggestions([]);
                setError(e instanceof Error ? e.message : "Suggest words failed");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [keyword]);

    return { suggestions, loading, error };
}


export function useFlashcardWordManager() {
    const [words, setWords] = useState<any[]>([]);
    const [inputWord, setInputWord] = useState("");
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
            audio: data.phonetics?.[0]?.audio ?? "",
            phoneticText: data.phonetic,
            definition: data.definition,
        };
        if (!word) return;
        setWords((prev) => [...prev, word]);
        setInputWord("");
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
    };
}

export type LessonPlanFlashcardApi = ReturnType<typeof useFlashcardWordManager>;