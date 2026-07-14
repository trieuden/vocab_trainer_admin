import { createLessonPlan } from "@/core/api/lesson_plans";
import { CreateLessonPlanDto, SectionInputDto, MultipleChoiceQuestionDto } from "@/core/api/lesson_plans/dtos";
import { getAuthUserFromCookie } from "@/core/auth/authCookies";
import { useToast } from "@/core/components/base-toast/base-toast";
import { ELessonPlan } from "@/core/enums/ELessonPlan";

export const useAddEditLessonPlan = () => {
    const toast = useToast();

    const buildSection = (
        words?: any[],
        type?: string,
        gameName?: string,
        taskType?: string,
        questions?: MultipleChoiceQuestionDto[],
    ): SectionInputDto | undefined => {
        if (!words?.length && !type && !taskType) return undefined;

        if (type === "GAME") {
            return {
                words: words?.map((w: any) => ({
                    word: w.word,
                    audio: w.audio,
                    phonetic: w.phonetic,
                    definition: w.definition,
                })),
                gameType: gameName as any,
            };
        }

        if (type === "TASK") {
            const section: SectionInputDto = {
                words: words?.map((w: any) => ({
                    word: w.word,
                    audio: w.audio,
                    phonetic: w.phonetic,
                    definition: w.definition,
                })),
                taskName: "Task",
                taskType: taskType as any,
            };
            if (taskType === "MULTIPLE_CHOICE" && questions?.length) {
                section.questions = questions.map(({ question, correctAnswer, wrongAnswers }) => ({
                    question, correctAnswer, wrongAnswers,
                }));
            }
            return section;
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

            warmUp: buildSection(
                (data as any).warmUp,
                (data as any).warmUpType,
                (data as any).warmUpGameName,
                (data as any).warmUpTaskType,
                (data as any).warmUpQuestions,
            ),
            vocab: buildSection(
                (data as any).vocab,
                (data as any).vocabType,
                (data as any).vocabGameName,
                (data as any).vocabTaskType,
                (data as any).vocabQuestions,
            ),
            grammar: buildSection(
                (data as any).grammar,
                (data as any).grammarType,
                (data as any).grammarGameName,
                (data as any).grammarTaskType,
                (data as any).grammarQuestions,
            ),
            listening: buildSection(
                (data as any).listening,
                (data as any).listeningType,
                (data as any).listeningGameName,
                (data as any).listeningTaskType,
                (data as any).listeningQuestions,
            ),
            writing: buildSection(
                (data as any).writing,
                (data as any).writingType,
                (data as any).writingGameName,
                (data as any).writingTaskType,
                (data as any).writingQuestions,
            ),
            speaking: buildSection(
                (data as any).speaking,
                (data as any).speakingType,
                (data as any).speakingGameName,
                (data as any).speakingTaskType,
                (data as any).speakingQuestions,
            ),
        };

        try {
            const response = await createLessonPlan(body);
            return response;
        } catch (error) {
            toast.error("Create lesson plan failed");
        }
    };
    return { handleSaveLessonPlan };
};
