import { vocabApiClient } from "@/core/connectors";
import type { DefineWordsDto, SuggestWordsDto } from "./dtos";

const ENDPOINTS = {
    SUGGEST_WORDS: "/integration/dictionary/suggest-words",
    DEFINE_WORDS: "/integration/dictionary/define-words",
} as const;

async function suggestWords(body: SuggestWordsDto) {
    const  data = await vocabApiClient.post(ENDPOINTS.SUGGEST_WORDS, body);
    return data;
}

async function defineWords(body: DefineWordsDto) {
    try {
        const data  = await vocabApiClient.post(ENDPOINTS.DEFINE_WORDS, body);
        return data.data;
    } catch (error) {
        throw error;
    }
}

export { suggestWords, defineWords };
