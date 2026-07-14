"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseCollapsibleSection, BasePopup, useToast } from "@/core/components";
import { FlashcardModal } from "../game-modal/flashcard-modal";
import styles from "./add-lesson-plan-popup.module.css";
import { useAddEditLessonPlan } from "../../hooks/add-edit-lesson-plan";
import { useFlashcardWordManager } from "../../hooks/flash-card";
import { ELessonPlan, EGame } from "@/core/enums";
import { CreateLessonPlanDto } from "@/core/api/lesson_plans/dtos";
import { GameType, LessonPlanType } from "@/core/api/lesson_plans/types";
import { TaskContent } from "./task-content";
import { MultipleChoiceQuestionDto } from "@/core/api/lesson_plans/dtos";

function initialSegmentState() {
    return {
        expanded: true,
        tab: ELessonPlan.LessonPlanType.TASK.code,
        gameType: EGame.GameType.FLASHCARD.code,
        gameVisited: false,
        taskType: "ESSAY",
        questions: [] as MultipleChoiceQuestionDto[],
    };
}

interface SegmentState {
    expanded: boolean;
    tab: string;
    gameType: string;
    gameVisited: boolean;
    taskType: string;
    questions: MultipleChoiceQuestionDto[];
}

interface AddLessonPlanPopupProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export function AddLessonPlanPopup({ open, onClose, onCreated }: AddLessonPlanPopupProps) {
    const { t: tl } = useTranslation("lesson_plans");
    const { t: tc } = useTranslation("common");
    const toast = useToast();
    const { handleSaveLessonPlan } = useAddEditLessonPlan();

    const warmUpFlash = useFlashcardWordManager();
    const vocabFlash = useFlashcardWordManager();
    const grammarFlash = useFlashcardWordManager();
    const listeningFlash = useFlashcardWordManager();
    const writingFlash = useFlashcardWordManager();
    const speakingFlash = useFlashcardWordManager();

    const [warmUp, setWarmUp] = useState<SegmentState>(initialSegmentState);
    const [vocab, setVocab] = useState<SegmentState>(initialSegmentState);
    const [grammar, setGrammar] = useState<SegmentState>(initialSegmentState);
    const [listening, setListening] = useState<SegmentState>(initialSegmentState);
    const [writing, setWriting] = useState<SegmentState>(initialSegmentState);
    const [speaking, setSpeaking] = useState<SegmentState>(initialSegmentState);
    const [isSaving, setIsSaving] = useState(false);

    const [infoExpanded, setInfoExpanded] = useState(true);

    const [lessonPlan, setLessonPlan] = useState<Partial<CreateLessonPlanDto>>({
        name: '',
        level: ELessonPlan.LessonLevel.A1,
    });

    const resetAll = () => {
        setLessonPlan({ name: '', level: ELessonPlan.LessonLevel.A1 });
        setWarmUp(initialSegmentState());
        setVocab(initialSegmentState());
        setGrammar(initialSegmentState());
        setListening(initialSegmentState());
        setWriting(initialSegmentState());
        setSpeaking(initialSegmentState());
        warmUpFlash.clear();
        vocabFlash.clear();
        grammarFlash.clear();
        listeningFlash.clear();
        writingFlash.clear();
        speakingFlash.clear();
    };

    const handleCreateLessonPlan = async () => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            const response = await handleSaveLessonPlan(lessonPlan as CreateLessonPlanDto);

            if (response?.message) {
                toast.success(`✅ ${response.message}`, 5500);
                resetAll();
                onCreated?.();
                onClose();
            }
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        setLessonPlan((prev) => ({
            ...prev,
            warmUp: warmUpFlash.words,
            warmUpType: warmUp.tab as LessonPlanType,
            warmUpGameName: warmUp.gameType as GameType,
            warmUpTaskType: warmUp.taskType,
            warmUpQuestions: warmUp.questions,

            vocab: vocabFlash.words,
            vocabType: vocab.tab as LessonPlanType,
            vocabGameName: vocab.gameType as GameType,
            vocabTaskType: vocab.taskType,
            vocabQuestions: vocab.questions,

            grammar: grammarFlash.words,
            grammarType: grammar.tab as LessonPlanType,
            grammarGameName: grammar.gameType as GameType,
            grammarTaskType: grammar.taskType,
            grammarQuestions: grammar.questions,

            listening: listeningFlash.words,
            listeningType: listening.tab as LessonPlanType,
            listeningGameName: listening.gameType as GameType,
            listeningTaskType: listening.taskType,
            listeningQuestions: listening.questions,

            writing: writingFlash.words,
            writingType: writing.tab as LessonPlanType,
            writingGameName: writing.gameType as GameType,
            writingTaskType: writing.taskType,
            writingQuestions: writing.questions,

            speaking: speakingFlash.words,
            speakingType: speaking.tab as LessonPlanType,
            speakingGameName: speaking.gameType as GameType,
            speakingTaskType: speaking.taskType,
            speakingQuestions: speaking.questions,
        }));
    }, [
        warmUpFlash.words, vocabFlash.words, grammarFlash.words,
        listeningFlash.words, writingFlash.words, speakingFlash.words,
        warmUp.tab, warmUp.gameType, warmUp.taskType, warmUp.questions,
        vocab.tab, vocab.gameType, vocab.taskType, vocab.questions,
        grammar.tab, grammar.gameType, grammar.taskType, grammar.questions,
        listening.tab, listening.gameType, listening.taskType, listening.questions,
        writing.tab, writing.gameType, writing.taskType, writing.questions,
        speaking.tab, speaking.gameType, speaking.taskType, speaking.questions,
    ]);

    const renderSection = (
        label: string,
        state: SegmentState,
        setState: React.Dispatch<React.SetStateAction<SegmentState>>,
        flashcard: ReturnType<typeof useFlashcardWordManager>,
        headerClass: string,
    ) => (
        <BaseCollapsibleSection
            title={label}
            expanded={state.expanded}
            onToggle={() => setState((s) => ({ ...s, expanded: !s.expanded }))}
            headerClassName={headerClass}
            toggleAriaLabel={label}
        >
            <div className={styles.tabGroup} role="tablist" aria-label={label}>
                <button
                    type="button"
                    role="tab"
                    aria-selected={state.tab === ELessonPlan.LessonPlanType.TASK.code}
                    className={`${styles.tabBtn} ${state.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                    onClick={() => setState((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                >
                    {tl("add_popup.tab_task")}
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={state.tab === "GAME"}
                    className={`${styles.tabBtn} ${state.tab === "GAME" ? styles.tabActive : ""}`}
                    onClick={() => setState((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                >
                    {tl("add_popup.tab_game")}
                </button>
            </div>

            <div className={state.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                <div hidden={state.tab !== "TASK"}>
                    <TaskContent
                        section={label}
                        taskType={state.taskType}
                        onTaskTypeChange={(type) => setState((s) => ({ ...s, taskType: type }))}
                        questions={state.questions}
                        onQuestionsChange={(questions) => setState((s) => ({ ...s, questions }))}
                    />
                </div>

                {state.gameVisited ? (
                    <div hidden={state.tab !== "GAME"}>
                        <div className={styles.gameTypeGroup}>
                            <button
                                type="button"
                                className={`${styles.gameTypeBtn} ${state.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                onClick={() => setState((s) => ({ ...s, gameType: EGame.GameType.FLASHCARD.code }))}
                            >
                                {EGame.GameType.FLASHCARD.name}
                            </button>
                            <button
                                type="button"
                                className={`${styles.gameTypeBtn} ${state.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                onClick={() => setState((s) => ({ ...s, gameType: EGame.GameType.CROSSWORD.code }))}
                            >
                                {EGame.GameType.CROSSWORD.name}
                            </button>
                        </div>
                        <div hidden={state.gameType !== EGame.GameType.FLASHCARD.code}>
                            <FlashcardModal flashcard={flashcard} />
                        </div>
                        <div hidden={state.gameType !== EGame.GameType.CROSSWORD.code}>
                            <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                        </div>
                    </div>
                ) : null}
            </div>
        </BaseCollapsibleSection>
    );

    return (
        <BasePopup open={open} onClose={onClose} title={tl("add_popup.title")}>
            <div className={styles.sectionList}>
                <BaseCollapsibleSection
                    title={tl("add_popup.info")}
                    expanded={infoExpanded}
                    onToggle={() => setInfoExpanded((s) => !s)}
                    headerClassName={styles.sectionHeaderInfo}
                    toggleAriaLabel={tl("add_popup.info")}
                >
                    <div className={styles.infoFields}>
                        <div className={styles.fieldRow}>
                            <label>{tl("add_popup.name")}</label>
                            <input
                                type="text"
                                value={lessonPlan.name || ''}
                                onChange={(e) => setLessonPlan((s) => ({ ...s, name: e.target.value }))}
                                placeholder={tl("add_popup.name_placeholder")}
                                className={styles.textInput}
                            />
                        </div>
                        <div className={styles.fieldRow}>
                            <label>{tl("add_popup.level")}</label>
                            <select
                                value={lessonPlan.level || ELessonPlan.LessonLevel.A1}
                                onChange={(e) => setLessonPlan((s) => ({ ...s, level: e.target.value }))}
                                className={styles.selectInput}
                            >
                                {Object.values(ELessonPlan.LessonLevel).map((lv) => (
                                    <option key={lv} value={lv}>{lv}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </BaseCollapsibleSection>

                {renderSection(tl("col_warm_up"), warmUp, setWarmUp, warmUpFlash, styles.sectionHeaderWarmUp)}
                {renderSection(tl("col_vocab"), vocab, setVocab, vocabFlash, styles.sectionHeaderVocab)}
                {renderSection(tl("col_grammar"), grammar, setGrammar, grammarFlash, styles.sectionHeaderGrammar)}
                {renderSection(tl("col_listening"), listening, setListening, listeningFlash, styles.sectionHeaderListening)}
                {renderSection(tl("col_writing"), writing, setWriting, writingFlash, styles.sectionHeaderWriting)}
                {renderSection(tl("col_speaking"), speaking, setSpeaking, speakingFlash, styles.sectionHeaderSpeaking)}
            </div>

            <div className={styles.actions}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
                    {tc("cancel")}
                </button>
                <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCreateLessonPlan} disabled={isSaving}>
                    {isSaving ? "Đang tạo..." : tl("add_popup.save")}
                </button>
            </div>
        </BasePopup>
    );
}
