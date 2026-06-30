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


function initialSegmentState() {
    return {
        expanded: true,
        tab: ELessonPlan.LessonPlanType.TASK.code,
        gameType: EGame.GameType.FLASHCARD.code,
        gameVisited: false,
    };
}

interface SegmentState {
    expanded: boolean;
    tab: string;
    gameType: string;
    gameVisited: boolean;
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

    const handleCreateLessonPlan = async () => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            const response = await handleSaveLessonPlan(lessonPlan as CreateLessonPlanDto);

            if (response?.message) {
                toast.success(`✅ ${response.message}`, 5500);
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
            
            vocab: vocabFlash.words,
            vocabType: vocab.tab as LessonPlanType,
            vocabGameName: vocab.gameType as GameType,
            
            grammar: grammarFlash.words,
            grammarType: grammar.tab as LessonPlanType,
            grammarGameName: grammar.gameType as GameType,

            listening: listeningFlash.words,
            listeningType: listening.tab as LessonPlanType,
            listeningGameName: listening.gameType as GameType,

            writing: writingFlash.words,
            writingType: writing.tab as LessonPlanType,
            writingGameName: writing.gameType as GameType,

            speaking: speakingFlash.words,
            speakingType: speaking.tab as LessonPlanType,
            speakingGameName: speaking.gameType as GameType,
        }));
    }, [warmUpFlash.words, vocabFlash.words, grammarFlash.words, listeningFlash.words, writingFlash.words, speakingFlash.words, warmUp.tab, warmUp.gameType, vocab.tab, vocab.gameType, grammar.tab, grammar.gameType, listening.tab, listening.gameType, writing.tab, writing.gameType, speaking.tab, speaking.gameType]);

    return (
        <BasePopup open={open} onClose={onClose} title={tl("add_popup.title")}>
            <div className={styles.sectionList}>
                {/* Thông tin */}
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

                {/* Warm-up */}
                <BaseCollapsibleSection
                    title={tl("col_warm_up")}
                    expanded={warmUp.expanded}
                    onToggle={() => setWarmUp((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderWarmUp}
                    toggleAriaLabel={tl("col_warm_up")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_warm_up")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={warmUp.tab === ELessonPlan.LessonPlanType.TASK.code}
                            className={`${styles.tabBtn} ${warmUp.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setWarmUp((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={warmUp.tab === "GAME"}
                            className={`${styles.tabBtn} ${warmUp.tab === "GAME" ? styles.tabActive : ""}`}
                            onClick={() => setWarmUp((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={warmUp.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={warmUp.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_warm_up") })}</div>
                        </div>

                        {warmUp.gameVisited ? (
                            <div hidden={warmUp.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${warmUp.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setWarmUp((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${warmUp.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setWarmUp((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={warmUp.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={warmUpFlash} />
                                </div>
                                <div hidden={warmUp.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>

                {/* Vocabulary */}
                <BaseCollapsibleSection
                    title={tl("col_vocab")}
                    expanded={vocab.expanded}
                    onToggle={() => setVocab((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderVocab}
                    toggleAriaLabel={tl("col_vocab")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_vocab")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={vocab.tab === "TASK"}
                            className={`${styles.tabBtn} ${vocab.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setVocab((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={vocab.tab === "GAME"}
                            className={`${styles.tabBtn} ${vocab.tab === "GAME" ? styles.tabActive : ""}`}
                            onClick={() => setVocab((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={vocab.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={vocab.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_vocab") })}</div>
                        </div>

                        {vocab.gameVisited ? (
                            <div hidden={vocab.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${vocab.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setVocab((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${vocab.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setVocab((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={vocab.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={vocabFlash} />
                                </div>
                                <div hidden={vocab.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>

                {/* Grammar */}
                <BaseCollapsibleSection
                    title={tl("col_grammar")}
                    expanded={grammar.expanded}
                    onToggle={() => setGrammar((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderGrammar}
                    toggleAriaLabel={tl("col_grammar")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_grammar")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={grammar.tab === ELessonPlan.LessonPlanType.TASK.code}
                            className={`${styles.tabBtn} ${grammar.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setGrammar((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={grammar.tab === ELessonPlan.LessonPlanType.GAME.code}
                            className={`${styles.tabBtn} ${grammar.tab === ELessonPlan.LessonPlanType.GAME.code ? styles.tabActive : ""}`}
                            onClick={() => setGrammar((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={grammar.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={grammar.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_grammar") })}</div>
                        </div>

                        {grammar.gameVisited ? (
                            <div hidden={grammar.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${grammar.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setGrammar((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${grammar.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setGrammar((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={grammar.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={grammarFlash} />
                                </div>
                                <div hidden={grammar.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>

                {/* Listening */}
                <BaseCollapsibleSection
                    title={tl("col_listening")}
                    expanded={listening.expanded}
                    onToggle={() => setListening((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderListening}
                    toggleAriaLabel={tl("col_listening")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_listening")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={listening.tab === ELessonPlan.LessonPlanType.TASK.code}
                            className={`${styles.tabBtn} ${listening.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setListening((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={listening.tab === ELessonPlan.LessonPlanType.GAME.code}
                            className={`${styles.tabBtn} ${listening.tab === ELessonPlan.LessonPlanType.GAME.code ? styles.tabActive : ""}`}
                            onClick={() => setListening((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={listening.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={listening.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_listening") })}</div>
                        </div>

                        {listening.gameVisited ? (
                            <div hidden={listening.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${listening.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setListening((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${listening.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setListening((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={listening.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={listeningFlash} />
                                </div>
                                <div hidden={listening.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>

                {/* Writing */}
                <BaseCollapsibleSection
                    title={tl("col_writing")}
                    expanded={writing.expanded}
                    onToggle={() => setWriting((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderWriting}
                    toggleAriaLabel={tl("col_writing")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_writing")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={writing.tab === ELessonPlan.LessonPlanType.TASK.code}
                            className={`${styles.tabBtn} ${writing.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setWriting((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={writing.tab === ELessonPlan.LessonPlanType.GAME.code}
                            className={`${styles.tabBtn} ${writing.tab === ELessonPlan.LessonPlanType.GAME.code ? styles.tabActive : ""}`}
                            onClick={() => setWriting((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={writing.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={writing.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_writing") })}</div>
                        </div>

                        {writing.gameVisited ? (
                            <div hidden={writing.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${writing.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setWriting((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${writing.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setWriting((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={writing.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={writingFlash} />
                                </div>
                                <div hidden={writing.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>

                {/* Speaking */}
                <BaseCollapsibleSection
                    title={tl("col_speaking")}
                    expanded={speaking.expanded}
                    onToggle={() => setSpeaking((s) => ({ ...s, expanded: !s.expanded }))}
                    headerClassName={styles.sectionHeaderSpeaking}
                    toggleAriaLabel={tl("col_speaking")}
                >
                    <div className={styles.tabGroup} role="tablist" aria-label={tl("col_speaking")}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={speaking.tab === ELessonPlan.LessonPlanType.TASK.code}
                            className={`${styles.tabBtn} ${speaking.tab === ELessonPlan.LessonPlanType.TASK.code ? styles.tabActive : ""}`}
                            onClick={() => setSpeaking((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code }))}
                        >
                            {tl("add_popup.tab_task")}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={speaking.tab === ELessonPlan.LessonPlanType.GAME.code}
                            className={`${styles.tabBtn} ${speaking.tab === ELessonPlan.LessonPlanType.GAME.code ? styles.tabActive : ""}`}
                            onClick={() => setSpeaking((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code }))}
                        >
                            {tl("add_popup.tab_game")}
                        </button>
                    </div>

                    <div className={speaking.tab === "TASK" ? `${styles.contentPanel} ${styles.contentPanelTask}` : `${styles.contentPanel} ${styles.contentPanelGame}`}>
                        <div className={styles.contentLabel}>{tl("add_popup.content_label")}</div>

                        <div hidden={speaking.tab !== "TASK"}>
                            <div className={styles.contentText}>{tl("add_popup.task_line", { section: tl("col_speaking") })}</div>
                        </div>

                        {speaking.gameVisited ? (
                            <div hidden={speaking.tab !== "GAME"}>
                                <div className={styles.gameTypeGroup}>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${speaking.gameType === EGame.GameType.FLASHCARD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setSpeaking((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.FLASHCARD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.FLASHCARD.name}
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.gameTypeBtn} ${speaking.gameType === EGame.GameType.CROSSWORD.code ? styles.gameTypeBtnActive : ""}`}
                                        onClick={() =>
                                            setSpeaking((s) => ({
                                                ...s,
                                                gameType: EGame.GameType.CROSSWORD.code,
                                            }))
                                        }
                                    >
                                        {EGame.GameType.CROSSWORD.name}
                                    </button>
                                </div>
                                <div hidden={speaking.gameType !== EGame.GameType.FLASHCARD.code}>
                                    <FlashcardModal flashcard={speakingFlash} />
                                </div>
                                <div hidden={speaking.gameType !== EGame.GameType.CROSSWORD.code}>
                                    <div className={styles.contentText}>{tl("add_popup.crossword_placeholder")}</div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </BaseCollapsibleSection>
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
