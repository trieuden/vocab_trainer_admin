"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { generateWrongAnswers } from "@/core/api/lesson_plans";
import { MultipleChoiceQuestionDto } from "@/core/api/lesson_plans/dtos";
import { useToast } from "@/core/components";
import styles from "./add-lesson-plan-popup.module.css";

interface QuestionState extends MultipleChoiceQuestionDto {
  generating?: boolean;
}

interface TaskContentProps {
  section: string;
  taskType: string;
  onTaskTypeChange: (type: string) => void;
  questions: QuestionState[];
  onQuestionsChange: (questions: QuestionState[]) => void;
}

export function TaskContent({ section, taskType, onTaskTypeChange, questions, onQuestionsChange }: TaskContentProps) {
  const { t: tl } = useTranslation("lesson_plans");
  const toast = useToast();

  const handleGenerateWrongAnswers = async (index: number) => {
    const q = questions[index];
    if (!q.question || !q.correctAnswer) {
      toast.error("Vui lòng nhập câu hỏi và đáp án đúng");
      return;
    }

    const updated = [...questions];
    updated[index] = { ...updated[index], generating: true };
    onQuestionsChange(updated);

    try {
      const result = await generateWrongAnswers(q.question, q.correctAnswer);
      const updated2 = [...questions];
      updated2[index] = {
        ...updated2[index],
        wrongAnswers: result.wrongAnswers || [],
        generating: false,
      };
      onQuestionsChange(updated2);
    } catch {
      toast.error("Không thể tạo đáp án sai");
      const updated3 = [...questions];
      updated3[index] = { ...updated3[index], generating: false };
      onQuestionsChange(updated3);
    }
  };

  const handleAddQuestion = () => {
    onQuestionsChange([...questions, { question: "", correctAnswer: "", wrongAnswers: [] }]);
  };

  const handleRemoveQuestion = (index: number) => {
    onQuestionsChange(questions.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: keyof QuestionState, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onQuestionsChange(updated);
  };

  return (
    <div>
      <div className={styles.taskTypeGroup}>
        <button
          type="button"
          className={`${styles.taskTypeBtn} ${taskType === "ESSAY" ? styles.taskTypeBtnActive : ""}`}
          onClick={() => onTaskTypeChange("ESSAY")}
        >
          {tl("add_popup.task_type_essay")}
        </button>
        <button
          type="button"
          className={`${styles.taskTypeBtn} ${taskType === "MULTIPLE_CHOICE" ? styles.taskTypeBtnActive : ""}`}
          onClick={() => onTaskTypeChange("MULTIPLE_CHOICE")}
        >
          {tl("add_popup.task_type_multiple_choice")}
        </button>
      </div>

      {taskType === "ESSAY" && (
        <div className={styles.contentText}>{tl("add_popup.task_line", { section })}</div>
      )}

      {taskType === "MULTIPLE_CHOICE" && (
        <div className={styles.questionList}>
          {questions.map((q, idx) => (
            <div key={idx} className={styles.questionItem}>
              <div className={styles.questionRow}>
                <span className={styles.questionLabel}>Câu {idx + 1}</span>
                <input
                  type="text"
                  className={styles.questionInput}
                  placeholder={tl("add_popup.question_placeholder")}
                  value={q.question}
                  onChange={(e) => handleUpdateQuestion(idx, "question", e.target.value)}
                />
                <input
                  type="text"
                  className={styles.questionInput}
                  placeholder={tl("add_popup.correct_answer_placeholder")}
                  value={q.correctAnswer}
                  onChange={(e) => handleUpdateQuestion(idx, "correctAnswer", e.target.value)}
                />
                <button type="button" className={styles.addQuestionBtn} onClick={() => handleRemoveQuestion(idx)}>
                  ✕
                </button>
              </div>
              <div className={styles.wrongAnswerList}>
                {(q.wrongAnswers || []).map((wa, wIdx) => (
                  <div key={wIdx} className={styles.wrongAnswerRow}>
                    <span>{String.fromCharCode(65 + wIdx + 1)}</span>
                    <input
                      type="text"
                      className={styles.questionInput}
                      value={wa}
                      onChange={(e) => {
                        const updated = [...(q.wrongAnswers || [])];
                        updated[wIdx] = e.target.value;
                        handleUpdateQuestion(idx, "wrongAnswers", updated);
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={styles.generateBtn}
                onClick={() => handleGenerateWrongAnswers(idx)}
                disabled={q.generating}
              >
                {q.generating ? "Đang tạo..." : tl("add_popup.generate_wrong_answers")}
              </button>
            </div>
          ))}
          <button type="button" className={styles.addQuestionBtn} onClick={handleAddQuestion}>
            + {tl("add_popup.add_question")}
          </button>
        </div>
      )}
    </div>
  );
}
