"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import styles from "./game-components.module.css";

interface WordDto {
  word?: string;
  words?: string;
  audio?: string;
  phoneticText?: string;
  definition?: string;
}

interface FlashcardGameProps {
  words: WordDto[];
  onComplete: () => void;
}

type GameMode = "type_word" | "choose_definition";

interface OptionItem {
  text: string;
  isCorrect: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWordText(w: WordDto): string {
  return w.word || w.words || "";
}

export function FlashcardGame({ words, onComplete }: FlashcardGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<GameMode>(() =>
    Math.random() < 0.5 ? "type_word" : "choose_definition"
  );
  const [inputValue, setInputValue] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex) / words.length) * 100;

  const generateOptions = useCallback(() => {
    if (!currentWord) return;
    const correctAnswer = currentWord.definition || "";
    const otherWords = words.filter((w) => getWordText(w) !== getWordText(currentWord));
    const wrongAnswers = shuffleArray(otherWords)
      .slice(0, 3)
      .map((w) => w.definition || "")
      .filter((d) => d && d !== correctAnswer);

    while (wrongAnswers.length < 3) {
      wrongAnswers.push("(no definition)");
    }

    const allOptions = shuffleArray([
      { text: correctAnswer, isCorrect: true },
      ...wrongAnswers.slice(0, 3).map((d) => ({ text: d, isCorrect: false })),
    ]);

    setOptions(allOptions);
  }, [currentWord, words]);

  useEffect(() => {
    setMode(Math.random() < 0.5 ? "type_word" : "choose_definition");
    setInputValue("");
    setAnswered(false);
    setIsCorrect(false);
    setOptions([]);
  }, [currentIndex]);

  useEffect(() => {
    if (mode === "choose_definition" && currentWord) {
      generateOptions();
    }
  }, [mode, currentWord, generateOptions]);

  useEffect(() => {
    if (mode === "type_word" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode, currentIndex]);

  const handleTypeSubmit = () => {
    if (answered) return;
    const correct = inputValue.trim().toLowerCase() === getWordText(currentWord).toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleOptionClick = (option: OptionItem) => {
    if (answered) return;
    setIsCorrect(option.isCorrect);
    setAnswered(true);
    if (option.isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= words.length) {
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const playAudio = () => {
    if (currentWord?.audio) {
      const audio = new Audio(currentWord.audio);
      audio.play();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!answered) {
        handleTypeSubmit();
      } else {
        handleNext();
      }
    }
  };

  if (!currentWord) {
    return (
      <div className={styles.scoreSummary}>
        <div className={styles.scoreTitle}>Hoàn thành!</div>
        <div className={styles.scoreValue}>
          {score}/{words.length}
        </div>
        <button className={`${styles.flashcardBtn} ${styles.flashcardBtnPrimary}`} onClick={onComplete}>
          Đóng
        </button>
      </div>
    );
  }

  return (
    <div className={styles.flashcardContainer} onKeyDown={handleKeyDown}>
      <div className={styles.flashcardProgress}>
        <span>{currentIndex + 1}/{words.length}</span>
        <div className={styles.flashcardProgressBar}>
          <div className={styles.flashcardProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <span>{score} điểm</span>
      </div>

      <div className={styles.flashcardCard}>
        <div className={styles.flashcardModeLabel}>
          {mode === "type_word" ? "Nhập từ" : "Chọn định nghĩa"}
        </div>

        {mode === "type_word" ? (
          <>
            <div className={styles.flashcardDefinition}>{currentWord.definition}</div>
            {currentWord.audio && (
              <button className={styles.flashcardAudioBtn} onClick={playAudio}>
                🔊 Nghe audio
              </button>
            )}
            <input
              ref={inputRef}
              type="text"
              className={`${styles.flashcardInput} ${
                answered ? (isCorrect ? styles.flashcardInputCorrect : styles.flashcardInputWrong) : ""
              }`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={answered}
              placeholder="Nhập từ..."
            />
            {answered && (
              <div className={`${styles.flashcardInputResult} ${isCorrect ? styles.flashcardCorrect : styles.flashcardWrong}`}>
                {isCorrect ? "✓ Chính xác!" : `✗ Đáp án: ${getWordText(currentWord)}`}
              </div>
            )}
          </>
        ) : (
          <>
            <div className={styles.flashcardWord}>{getWordText(currentWord)}</div>
            <div className={styles.flashcardOptions}>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`${styles.flashcardOption} ${
                    answered
                      ? opt.isCorrect
                        ? styles.flashcardOptionCorrect
                        : ""
                      : ""
                  }`}
                  onClick={() => handleOptionClick(opt)}
                  disabled={answered}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {answered && (
              <div className={`${styles.flashcardInputResult} ${isCorrect ? styles.flashcardCorrect : styles.flashcardWrong}`}>
                {isCorrect ? "✓ Chính xác!" : "✗ Sai rồi!"}
              </div>
            )}
          </>
        )}
      </div>

      {answered && (
        <div className={styles.flashcardActions}>
          <button className={`${styles.flashcardBtn} ${styles.flashcardBtnPrimary}`} onClick={handleNext}>
            {currentIndex + 1 >= words.length ? "Hoàn thành" : "Tiếp theo →"}
          </button>
        </div>
      )}
    </div>
  );
}
