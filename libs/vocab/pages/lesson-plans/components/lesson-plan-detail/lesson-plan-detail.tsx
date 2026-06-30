'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseCollapsibleSection, BaseLoading, BasePopup } from '@/core/components';
import { EGame, ELessonPlan } from '@/core/enums';
import { useLessonPlanDetail } from '../../hooks/lesson-plan-detail';
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

function SegmentSection({ title, headerClassName, sectionType, block, expanded, onToggle, toggleAriaLabel }: SegmentSectionProps) {
  const { t: tl } = useTranslation('lesson_plans');

  return (
    <BaseCollapsibleSection title={title} expanded={expanded} onToggle={onToggle} headerClassName={headerClassName} toggleAriaLabel={toggleAriaLabel}>
      {/* Nội dung TASK */}
      <div className={`${styles.contentPanel} ${styles.contentPanelTask}`} hidden={sectionType !== ELessonPlan.LessonPlanType.TASK.code}>
        <div className={styles.contentLabel}>{tl('detail.task')}</div>
        <div className={styles.contentText}>{tl('add_popup.task_line', { section: title })}</div>
      </div>

      {/* Nội dung GAME */}
      <div className={`${styles.contentPanel} ${styles.contentPanelGame}`} hidden={sectionType !== ELessonPlan.LessonPlanType.GAME.code}>
        <div className={styles.contentLabel}>{tl('detail.game')}</div>

        <div className={styles.gameInfoText}>
          {/* <span className={styles.gamePrefix}>{tl('detail.game_prefix')}</span> */}
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
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose}>
          {tc('cancel')}
        </button>
      </div>
    </BasePopup>
  );
}
