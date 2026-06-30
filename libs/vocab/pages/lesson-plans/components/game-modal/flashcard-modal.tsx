"use client";

import React, { useMemo } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { BaseButton, BaseTable, type BaseTableColumn } from "@/core/components";
import type { LessonPlanFlashcardApi } from "../../hooks/flash-card";
import styles from "./flashcard-modal.module.css";
import { useTranslation } from "react-i18next";

interface FlashcardModalProps {
    flashcard: LessonPlanFlashcardApi;
    onRemoveWord?: (word: string) => void;
}

export function FlashcardModal({ flashcard, onRemoveWord }: FlashcardModalProps) {
    const {
        inputWord,
        setInputWord,
        showSuggest,
        setShowSuggest,
        suggestions,
        loading,
        words,
        loadingMap,
        handleAddWord,
        removeWord,
        generateLoading,
        generateDefinitions,
        generateAllDefinitions,
    } = flashcard;

    const { t } = useTranslation("common");
    const { t: tl } = useTranslation("lesson_plans");

    const columns = useMemo<BaseTableColumn<any>[]>(
        () => [
            {
                key: "stt",
                title: tl("flashcard.col_stt"),
                width: 56,
                minWidth: 48,
                hideable: false,
                align: "center",
                render: (_row, rowIndex) => rowIndex + 1,
            },
            {
                key: "word",
                title: tl("flashcard.col_word"),
                width: 140,
                minWidth: 80,
                hideable: false,
                render: (row) => row?.word ?? t("dash"),
            },
            {
                key: "audio",
                title: tl("flashcard.col_audio"),
                width: 200,
                minWidth: 100,
                render: (row) => row?.audio ?? "—",
            },
            {
                key: "phonetic",
                title: tl("flashcard.col_phonetic"),
                width: 140,
                minWidth: 80,
                render: (row) => row?.phoneticText ?? t("dash"),
            },
            {
                key: "definition",
                title: tl("flashcard.col_definition"),
                width: 280,
                minWidth: 120,
                render: (row) => row?.definition ?? t("dash"),
            },
            {
                key: "actions",
                title: "Tác vụ",
                width: 108,
                minWidth: 100,
                hideable: false,
                align: "center",
                pinned: "right",
                render: (row) => {
                    const rowBusy = !!loadingMap?.[row.word];
                    return (
                        <div className={styles.actionCellRow}>
                            <button
                                type="button"
                                className={styles.fetchDefBtn}
                                title={tl("flashcard.fetch_definition_title")}
                                aria-label={tl("flashcard.fetch_definition_aria", { word: row.word })}
                                disabled={rowBusy}
                                onClick={() => void generateDefinitions([row.word])}
                            >
                                {rowBusy ? <span className={styles.inlineSpinner} aria-hidden="true" /> : <Sparkles size={16} strokeWidth={2} />}
                            </button>
                            <button
                                type="button"
                                className={styles.removeBtn}
                                title={tl("flashcard.remove_word_title")}
                                aria-label={tl("flashcard.remove_word_aria", { word: row.word })}
                                onClick={() => {
                                    removeWord(row.word);
                                    onRemoveWord?.(row.word);
                                }}
                            >
                                <Trash2 size={16} strokeWidth={2} />
                            </button>
                        </div>
                    );
                },
            },
        ],
        [t, tl, words, loadingMap, generateLoading, generateDefinitions, removeWord, onRemoveWord],
    );

    return (
        <div className={styles.wrapper}>
            <div className={styles.suggestContainer}>
                <div className={styles.inputRow}>
                    <input
                        className={styles.wordSelect}
                        type="text"
                        value={inputWord}
                        placeholder={tl("flashcard.search_placeholder")}
                        onFocus={() => setShowSuggest(true)}
                        onChange={(event) => {
                            setInputWord(event.target.value);
                            setShowSuggest(true);
                        }}
                        onKeyDown={(event) => {
                            if (event.key !== "Enter") return;
                            if (event.nativeEvent.isComposing) return;
                            if (!event.ctrlKey && !event.metaKey) return;
                            event.preventDefault();
                            void handleAddWord(inputWord);
                        }}
                    />
                </div>
                {showSuggest && suggestions.length > 0 ? (
                    <div className={styles.suggestBox}>
                        {suggestions.map((word, index) => (
                            <button
                                key={`${word}-${index}`}
                                type="button"
                                className={styles.suggestItem}
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => {
                                    setInputWord(word);
                                    setShowSuggest(false);
                                    void handleAddWord(word);
                                }}
                            >
                                {word}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
            {loading ? <div className={styles.hintText}>{tl("flashcard.suggest_loading")}</div> : null}

            <div className={styles.baseTableHost}>
                <BaseTable<any> className={styles.baseTableEmbed} columns={columns} data={words} rowKey={(r) => r.word} emptyText={t("no_data")} loading={loading} />
            </div>

            <div className={styles.belowTable}>
                <BaseButton
                    variant="primary"
                    disabled={words.length === 0 || generateLoading}
                    onClick={() => void generateAllDefinitions()}
                    startIcon={generateLoading ? <span className={styles.inlineSpinner} aria-hidden="true" /> : <Sparkles size={16} strokeWidth={2} />}
                >
                    {tl("flashcard.fetch_definitions")}
                </BaseButton>
            </div>
        </div>
    );
}
