import { createLessonPlan } from "@/core/api/lesson_plans";
import { CreateLessonPlanDto, SectionInputDto } from "@/core/api/lesson_plans/dtos";
import { getAuthUserFromCookie } from "@/core/auth/authCookies";
import { useToast } from "@/core/components/base-toast/base-toast";
import { ELessonPlan } from "@/core/enums/ELessonPlan";

export const useAddEditLessonPlan = () => {
    const toast = useToast();

    const buildSection = (
        words?: any[],
        type?: string,
        gameName?: string,
    ): SectionInputDto | undefined => {
        if (!words?.length && !type) return undefined;

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
            return {
                words: words?.map((w: any) => ({
                    word: w.word,
                    audio: w.audio,
                    phonetic: w.phonetic,
                    definition: w.definition,
                })),
                taskName: "Task",
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

            warmUp: buildSection(
                (data as any).warmUp,
                (data as any).warmUpType,
                (data as any).warmUpGameName,
            ),
            vocab: buildSection(
                (data as any).vocab,
                (data as any).vocabType,
                (data as any).vocabGameName,
            ),
            grammar: buildSection(
                (data as any).grammar,
                (data as any).grammarType,
                (data as any).grammarGameName,
            ),
            listening: buildSection(
                (data as any).listening,
                (data as any).listeningType,
                (data as any).listeningGameName,
            ),
            writing: buildSection(
                (data as any).writing,
                (data as any).writingType,
                (data as any).writingGameName,
            ),
            speaking: buildSection(
                (data as any).speaking,
                (data as any).speakingType,
                (data as any).speakingGameName,
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
