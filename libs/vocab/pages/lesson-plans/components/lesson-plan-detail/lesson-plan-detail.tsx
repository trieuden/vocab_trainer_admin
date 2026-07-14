'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCollapsibleSection, BaseLoading, BasePopup } from '@/core/components';
import { EGame, ELessonPlan } from '@/core/enums';
import { useLessonPlanDetail } from '../../hooks/lesson-plan-detail';
import { LessonPlanSlideshow } from '../slideshow/lesson-plan-slideshow';
import styles from './lesson-plan-detail.module.css';

interface LessonPlanDetailProps {
  open: boolean;
  id: string | null;
  onClose: () => void;
}

interface SegmentSectionProps {
  title: string;
  headerClassName: string;
  sectionType: string | null;
  block: any;
  expanded: boolean;
  onToggle: () => void;
  toggleAriaLabel: string;
}

const gameTypeMap = {
  [EGame.GameType.CROSSWORD.code]: EGame.GameType.CROSSWORD.name,
  [EGame.GameType.FLASHCARD.code]: EGame.GameType.FLASHCARD.name,
};

function WordsTable({ block }: { block: any }) {
  const { t: tl } = useTranslation('lesson_plans');

  const words: any[] = block?.words ?? [];
  if (!words.length) {
    return <div className={styles.emptyWords}>{tl('detail.no_words')}</div>;
  }

  return (
    <table className={styles.wordsTable}>
      <thead>
        <tr>
          <th style={{ width: 44 }}>#</th>
          <th>{tl('flashcard.col_word')}</th>
          <th>{tl('flashcard.col_phonetic')}</th>
          <th>{tl('flashcard.col_definition')}</th>
          <th>{tl('flashcard.col_audio')}</th>
        </tr>
      </thead>
      <tbody>
        {words.map((w: any, i: number) => (
          <tr key={w.id ?? i}>
            <td style={{ color: '#94a3b8', textAlign: 'center' }}>{i + 1}</td>
            <td style={{ fontWeight: 600 }}>{w.words ?? '—'}</td>
            <td>{w.phoneticText ?? '—'}</td>
            <td>{w.definition ?? '—'}</td>
            <td>
              {w.audio ? (
                <a href={w.audio} target="_blank" rel="noopener noreferrer" className={styles.audioLink}>
                  {tl('detail.open_audio')}
                </a>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function QuestionsTable({ block }: { block: any }) {
  const { t: tl } = useTranslation('lesson_plans');

  const questions: any[] = block?.questions ?? [];
  if (!questions.length) {
    return <div className={styles.emptyWords}>{tl('detail.no_questions')}</div>;
  }

  return (
    <div className={styles.questionList}>
      {questions.map((q: any, i: number) => (
        <div key={q.id ?? i} className={styles.questionItem}>
          <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>{i + 1}.</span>
            <span className={styles.questionText}>{q.question}</span>
          </div>
          <div className={styles.answerList}>
            {(q.answers ?? []).map((a: any, aIdx: number) => (
              <div
                key={a.id ?? aIdx}
                className={`${styles.answerItem} ${a.isRight ? styles.answerCorrect : ''}`}
              >
                <span className={styles.answerLabel}>{String.fromCharCode(65 + aIdx)}</span>
                <span className={styles.answerText}>{a.answer}</span>
                {a.isRight && <span className={styles.correctBadge}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SegmentSection({ title, headerClassName, sectionType, block, expanded, onToggle, toggleAriaLabel }: SegmentSectionProps) {
  const { t: tl } = useTranslation('lesson_plans');

  const isTask = sectionType === ELessonPlan.LessonPlanType.TASK.code;
  const isGame = sectionType === ELessonPlan.LessonPlanType.GAME.code;
  const hasQuestions = block?.questions?.length > 0;

  return (
    <BaseCollapsibleSection title={title} expanded={expanded} onToggle={onToggle} headerClassName={headerClassName} toggleAriaLabel={toggleAriaLabel}>
      {/* Nội dung TASK */}
      <div className={`${styles.contentPanel} ${styles.contentPanelTask}`} hidden={!isTask}>
        <div className={styles.contentLabel}>{tl('detail.task')}</div>
        {hasQuestions ? (
          <QuestionsTable block={block} />
        ) : (
          <div className={styles.contentText}>{block?.name ?? tl('add_popup.task_line', { section: title })}</div>
        )}
      </div>

      {/* Nội dung GAME */}
      <div className={`${styles.contentPanel} ${styles.contentPanelGame}`} hidden={!isGame}>
        <div className={styles.contentLabel}>{tl('detail.game')}</div>

        <div className={styles.gameInfoText}>
          <span className={styles.gameName}>{gameTypeMap[block?.type ?? '']}</span>
        </div>

        <WordsTable block={block} />
      </div>
    </BaseCollapsibleSection>
  );
}

export function LessonPlanDetail({ open, id, onClose }: LessonPlanDetailProps) {
  const { t: tl } = useTranslation('lesson_plans');
  const { t: tc } = useTranslation('common');
  const { data, loading, error } = useLessonPlanDetail(open ? id : null);

  const [expanded, setExpanded] = useState({
    warmUp: true,
    vocab: true,
    grammar: true,
    listening: true,
    writing: true,
    speaking: true,
  });
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const toggle = (key: keyof typeof expanded) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const SECTIONS = [
    { key: 'warmUp' as const, labelKey: 'col_warm_up', headerCls: styles.sectionHeaderWarmUp },
    { key: 'vocab' as const, labelKey: 'col_vocab', headerCls: styles.sectionHeaderVocab },
    { key: 'grammar' as const, labelKey: 'col_grammar', headerCls: styles.sectionHeaderGrammar },
    { key: 'listening' as const, labelKey: 'col_listening', headerCls: styles.sectionHeaderListening },
    { key: 'writing' as const, labelKey: 'col_writing', headerCls: styles.sectionHeaderWriting },
    { key: 'speaking' as const, labelKey: 'col_speaking', headerCls: styles.sectionHeaderSpeaking },
  ];

  return (
    <BasePopup open={open} onClose={onClose} title={tl('detail.title')}>
      {loading && (
        <div className={styles.centerMsg}>
          <BaseLoading label={tc('loading')} />
        </div>
      )}

      {error && !loading && <div className={`${styles.centerMsg} ${styles.errorMsg}`}>{error}</div>}

      {data && !loading && (
        <div className={styles.sectionList}>
          {SECTIONS.map(({ key, labelKey, headerCls }) => (
            <SegmentSection
              key={key}
              title={tl(labelKey)}
              headerClassName={headerCls}
              sectionType={data[`${key}Type`] ?? null}
              block={data[key] ?? null}
              expanded={expanded[key]}
              onToggle={() => toggle(key)}
              toggleAriaLabel={tl(labelKey)}
            />
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setSlideshowOpen(true)}>
          {tl('detail.slideshow')}
        </button>
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
          {tc('cancel')}
        </button>
      </div>

      {slideshowOpen && data && (
        <LessonPlanSlideshow data={data} onClose={() => setSlideshowOpen(false)} />
      )}
    </BasePopup>
  );
}
