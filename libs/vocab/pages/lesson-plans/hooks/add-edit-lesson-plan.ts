import { createLessonPlan } from "@/core/api/lesson_plans";
import { CreateLessonPlanDto, SectionInputDto, MultipleChoiceQuestionDto, WordDto } from "@/core/api/lesson_plans/dtos";
import { getAuthUserFromCookie } from "@/core/auth/authCookies";
import { useToast } from "@/core/components/base-toast/base-toast";
import { ELessonPlan } from "@/core/enums/ELessonPlan";

export const useAddEditLessonPlan = () => {
    const toast = useToast();

    const buildSection = (
        sectionOrWords?: SectionInputDto | WordDto[],
        type?: string,
        gameName?: string,
        taskType?: string,
        questions?: MultipleChoiceQuestionDto[],
        defaultTaskName: string = "Task",
    ): SectionInputDto | undefined => {
        const isObject = sectionOrWords && typeof sectionOrWords === "object" && !Array.isArray(sectionOrWords);
        const sectionObj = isObject ? (sectionOrWords as SectionInputDto & { tab?: string; gameName?: string }) : undefined;

        const rawWords = isObject ? sectionObj?.words : (Array.isArray(sectionOrWords) ? sectionOrWords : undefined);
        const sectionType = isObject ? (sectionObj?.refType || sectionObj?.tab) : type;
        const gameType = isObject ? (sectionObj?.gameType || sectionObj?.gameName) : gameName;
        const finalTaskType = isObject ? sectionObj?.taskType : taskType;
        const rawQuestions = isObject ? sectionObj?.questions : questions;
        const isTouched = isObject ? !!sectionObj?.isTouched : false;
        const taskName = (isObject ? sectionObj?.taskName : undefined) || defaultTaskName;

        const mappedWords: WordDto[] = (rawWords || [])
            .filter((w): w is WordDto => !!w && typeof w.word === "string" && w.word.trim().length > 0)
            .map((w) => ({
                word: w.word.trim(),
                audio: w.audio || "",
                phonetic: w.phoneticText || w.phonetic || "",
                definition: w.definition || "",
            }));

        const validQuestions: MultipleChoiceQuestionDto[] = (rawQuestions || [])
            .filter((q): q is MultipleChoiceQuestionDto => !!q && typeof q.question === "string" && q.question.trim().length > 0 && typeof q.correctAnswer === "string" && q.correctAnswer.trim().length > 0)
            .map((q) => ({
                question: q.question.trim(),
                correctAnswer: q.correctAnswer.trim(),
                wrongAnswers: Array.isArray(q.wrongAnswers)
                    ? q.wrongAnswers.filter((wa): wa is string => typeof wa === "string" && wa.trim().length > 0).map((wa) => wa.trim())
                    : [],
            }));

        const hasWords = mappedWords.length > 0;
        const hasQuestions = validQuestions.length > 0;

        if (sectionType === ELessonPlan.LessonPlanType.GAME.code || sectionType === "GAME") {
            if (!hasWords) return undefined;
            return {
                words: mappedWords,
                gameType: (gameType || "FLASHCARD") as SectionInputDto["gameType"],
                refType: ELessonPlan.LessonPlanType.GAME.code as SectionInputDto["refType"],
            };
        }

        if (sectionType === ELessonPlan.LessonPlanType.TASK.code || sectionType === "TASK") {
            if (finalTaskType === "MULTIPLE_CHOICE") {
                if (!hasQuestions && !hasWords) return undefined;
                const section: SectionInputDto = {
                    taskName,
                    taskType: "MULTIPLE_CHOICE",
                    refType: ELessonPlan.LessonPlanType.TASK.code as SectionInputDto["refType"],
                };
                if (hasQuestions) section.questions = validQuestions;
                if (hasWords) section.words = mappedWords;
                return section;
            }

            if (finalTaskType === "ESSAY") {
                if (!hasWords && !isTouched) return undefined;
                const section: SectionInputDto = {
                    taskName,
                    taskType: "ESSAY",
                    refType: ELessonPlan.LessonPlanType.TASK.code as SectionInputDto["refType"],
                };
                if (hasWords) section.words = mappedWords;
                return section;
            }
        }

        // Fallback: If sectionType was not set but words or questions exist
        if (hasWords) {
            return {
                words: mappedWords,
                gameType: (gameType || "FLASHCARD") as SectionInputDto["gameType"],
                refType: ELessonPlan.LessonPlanType.GAME.code as SectionInputDto["refType"],
            };
        }

        if (hasQuestions) {
            return {
                taskName,
                taskType: "MULTIPLE_CHOICE",
                questions: validQuestions,
                refType: ELessonPlan.LessonPlanType.TASK.code as SectionInputDto["refType"],
            };
        }

        return undefined;
    };

    const handleSaveLessonPlan = async (data: CreateLessonPlanDto) => {
        const authUser = getAuthUserFromCookie();

        if (!authUser?.id) {
            toast.error("Không tìm thấy thông tin người dùng đăng nhập");
            return;
        }

        const body: CreateLessonPlanDto = {
            name: data.name,
            level: data.level || ELessonPlan.LessonLevel.A1,
            description: data.description,
            userId: authUser.id,

            warmUp: buildSection(data.warmUp, undefined, undefined, undefined, undefined, "Warm-up"),
            vocab: buildSection(data.vocab, undefined, undefined, undefined, undefined, "Vocabulary"),
            grammar: buildSection(data.grammar, undefined, undefined, undefined, undefined, "Grammar"),
            listening: buildSection(data.listening, undefined, undefined, undefined, undefined, "Listening"),
            writing: buildSection(data.writing, undefined, undefined, undefined, undefined, "Writing"),
            speaking: buildSection(data.speaking, undefined, undefined, undefined, undefined, "Speaking"),
        };

        try {
            const response = await createLessonPlan(body);
            return response;
        } catch (error) {
            toast.error("Create lesson plan failed");
        }
    };
    return { handleSaveLessonPlan, buildSection };
};
