import { vocabApiClient } from "@/core/connectors";
import type { GenerateFlashcardDto } from "./dtos";

const ENDPOINT = "/integration/gemini/generate-flashcard";

async function generateFlashcardDefinitions(body: GenerateFlashcardDto) {
    try {
        const data = await vocabApiClient.post(ENDPOINT, body);
        return data.data;
    } catch (error) {
        throw error;
    }
}

export { generateFlashcardDefinitions };
export type { GenerateFlashcardDto };
