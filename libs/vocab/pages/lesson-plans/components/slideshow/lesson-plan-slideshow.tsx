"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlashcardGame } from "@/vocab/components/core/flashcard-game";
import { MultipleChoiceQuiz } from "@/vocab/components/core/multiple-choice-quiz";
import styles from "./slideshow.module.css";

interface WordDto {
  id?: string;
  words: string;
  phoneticText?: string;
  definition?: string;
  audio?: string;
}

interface AnswerDto {
  id?: string;
  answer: string;
  isRight: boolean;
}

interface QuestionDto {
  id?: string;
  question: string;
  answers: AnswerDto[];
}

interface SectionBlock {
  id?: string;
  name?: string;
  type?: string;
  words?: WordDto[];
  questions?: QuestionDto[];
}

interface LessonPlanSlideshowProps {
  data: any;
  onClose: () => void;
}

interface SlideSection {
  key: string;
  label: string;
  type: "flashcard" | "quiz" | "skip";
  data: SectionBlock;
}

const SECTION_KEYS = ["warmUp", "vocab", "grammar", "listening", "writing", "speaking"] as const;
const SECTION_LABELS: Record<string, string> = {
  warmUp: "Mở đầu",
  vocab: "Từ vựng",
  grammar: "Ngữ pháp",
  listening: "Nghe",
  writing: "Viết",
  speaking: "Nói",
};

export function LessonPlanSlideshow({ data, onClose }: LessonPlanSlideshowProps) {
  const { t: tl } = useTranslation("lesson_plans");
  const [currentIndex, setCurrentIndex] = useState(0);

  const sections = useMemo<SlideSection[]>(() => {
    const result: SlideSection[] = [];

    for (const key of SECTION_KEYS) {
      const block = data?.[key];
      const type = data?.[`${key}Type`];

      if (!block) continue;

      if (type === "GAME" && block.type === "FLASHCARD" && block.words?.length) {
        result.push({
          key,
          label: SECTION_LABELS[key] || key,
          type: "flashcard",
          data: block,
        });
      } else if (type === "TASK" && block.questions?.length) {
        result.push({
          key,
          label: SECTION_LABELS[key] || key,
          type: "quiz",
          data: block,
        });
      }
    }

    return result;
  }, [data]);

  const currentSection = sections[currentIndex];

  const handleSectionComplete = () => {
    if (currentIndex + 1 >= sections.length) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < sections.length) setCurrentIndex((i) => i + 1);
  };

  if (!sections.length) {
    return (
      <div className={styles.slideshowOverlay}>
        <div className={styles.slideshowHeader}>
          <span className={styles.slideshowTitle}>{tl("slideshow.title")}</span>
          <button className={styles.slideshowCloseBtn} onClick={onClose}>✕</button>
        </div>
        <div className={styles.slideshowBody}>
          <div className={styles.slideshowEmpty}>
            <div className={styles.slideshowEmptyIcon}>📭</div>
            <div>{tl("slideshow.no_content")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.slideshowOverlay}>
      <div className={styles.slideshowHeader}>
        <span className={styles.slideshowTitle}>{tl("slideshow.title")}</span>
        <div className={styles.slideshowSectionInfo}>
          <span className={styles.slideshowSectionLabel}>
            Mục {currentIndex + 1}/{sections.length}
          </span>
          <span className={styles.slideshowSectionName}>{currentSection.label}</span>
          <span className={styles.slideshowSectionType}>
            {currentSection.type === "flashcard" ? "Flashcard" : "Trắc nghiệm"}
          </span>
        </div>
        <button className={styles.slideshowCloseBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.slideshowBody}>
        {currentSection.type === "flashcard" && (
          <FlashcardGame
            words={currentSection.data.words || []}
            onComplete={handleSectionComplete}
          />
        )}
        {currentSection.type === "quiz" && (
          <MultipleChoiceQuiz
            questions={currentSection.data.questions || []}
            onComplete={handleSectionComplete}
          />
        )}
      </div>

      <div className={styles.slideshowNav}>
        <button
          className={styles.slideshowNavBtn}
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Trước
        </button>

        <div className={styles.slideshowDots}>
          {sections.map((s, idx) => (
            <button
              key={s.key}
              className={`${styles.slideshowDot} ${
                idx === currentIndex ? styles.slideshowDotActive : ""
              } ${idx < currentIndex ? styles.slideshowDotCompleted : ""}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        <button
          className={styles.slideshowNavBtn}
          onClick={handleNext}
          disabled={currentIndex + 1 >= sections.length}
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
