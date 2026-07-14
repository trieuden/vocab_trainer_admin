"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./game-components.module.css";

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

interface MultipleChoiceQuizProps {
  questions: QuestionDto[];
  onComplete: () => void;
}

const LABELS = ["A", "B", "C", "D"];

export function MultipleChoiceQuiz({ questions, onComplete }: MultipleChoiceQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleOptionClick = (idx: number) => {
    if (answered) return;

    setSelectedIdx(idx);
    setAnswered(true);

    const correct = currentQuestion.answers[idx]?.isRight;
    if (correct) setScore((s) => s + 1);

    timerRef.current = setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        onComplete();
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedIdx(null);
        setAnswered(false);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (currentIndex + 1 >= questions.length) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedIdx(null);
      setAnswered(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className={styles.scoreSummary}>
        <div className={styles.scoreTitle}>Hoàn thành!</div>
        <div className={styles.scoreValue}>
          {score}/{questions.length}
        </div>
        <button className={`${styles.flashcardBtn} ${styles.flashcardBtnPrimary}`} onClick={onComplete}>
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizProgress}>
        <span>{currentIndex + 1}/{questions.length}</span>
        <div className={styles.quizProgressBar}>
          <div className={styles.quizProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <span>{score} điểm</span>
      </div>

      <div className={styles.quizCard}>
        <div className={styles.quizQuestionNumber}>Câu {currentIndex + 1}</div>
        <div className={styles.quizQuestionText}>{currentQuestion.question}</div>

        <div className={styles.quizOptions}>
          {currentQuestion.answers.map((ans, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrectAnswer = ans.isRight;

            let optionClass = styles.quizOption;
            if (answered) {
              if (isCorrectAnswer) optionClass += ` ${styles.quizOptionCorrect}`;
              else if (isSelected) optionClass += ` ${styles.quizOptionWrong}`;
              else optionClass += ` ${styles.quizOptionDisabled}`;
            }

            return (
              <button
                key={ans.id ?? idx}
                className={optionClass}
                onClick={() => handleOptionClick(idx)}
                disabled={answered}
              >
                <span className={styles.quizOptionLabel}>{LABELS[idx]}</span>
                <span className={styles.quizOptionText}>{ans.answer}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`${styles.quizResult} ${
            currentQuestion.answers[selectedIdx!]?.isRight ? styles.quizResultCorrect : styles.quizResultWrong
          }`}>
            {currentQuestion.answers[selectedIdx!]?.isRight ? "✓ Chính xác!" : "✗ Sai rồi!"}
          </div>
        )}
      </div>

      {answered && (
        <div className={styles.flashcardActions}>
          <button className={`${styles.flashcardBtn} ${styles.flashcardBtnSecondary}`} onClick={handleSkip}>
            {currentIndex + 1 >= questions.length ? "Hoàn thành" : "Bỏ qua →"}
          </button>
        </div>
      )}
    </div>
  );
}
