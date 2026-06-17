"use client";

import Link from "next/link";
import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  STUDY_STORAGE_KEY,
  dayThemes,
  getInitialStudyState,
  getLevelFromExp,
  normalizeStudyState,
} from "./lib/studyData";
import type { DayTheme, Quest, StudyState } from "./lib/studyData";

export default function Home() {
  const [studyState, setStudyState] = useState<StudyState>(
    getInitialStudyState,
  );
  const hasLoadedSavedState = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedState = window.localStorage.getItem(STUDY_STORAGE_KEY);

      if (savedState) {
        try {
          setStudyState(normalizeStudyState(JSON.parse(savedState)));
        } catch {
          window.localStorage.removeItem(STUDY_STORAGE_KEY);
        }
      }

      hasLoadedSavedState.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedState.current) {
      return;
    }

    window.localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(studyState));
  }, [studyState]);

  const totalQuests = studyState.quests.length;
  const completedQuests = useMemo(
    () => studyState.quests.filter((quest) => quest.completed).length,
    [studyState.quests],
  );
  const weeklyExp = useMemo(
    () =>
      studyState.quests.reduce(
        (total, quest) => total + (quest.completed ? quest.exp : 0),
        0,
      ),
    [studyState.quests],
  );
  const possibleWeeklyExp = useMemo(
    () => studyState.quests.reduce((total, quest) => total + quest.exp, 0),
    [studyState.quests],
  );
  const progress = totalQuests
    ? Math.round((completedQuests / totalQuests) * 100)
    : 0;
  const allComplete = totalQuests > 0 && completedQuests === totalQuests;

  function toggleQuest(questId: number) {
    setStudyState((current) => ({
      ...current,
      quests: current.quests.map((quest) =>
        quest.id === questId
          ? { ...quest, completed: !quest.completed }
          : quest,
      ),
    }));
  }

  function startNewWeek() {
    setStudyState((current) => {
      const rewardExp = current.quests.reduce(
        (total, quest) => total + quest.exp,
        0,
      );
      const totalExp = current.stats.totalExp + rewardExp;

      return {
        quests: current.quests.map((quest) => ({
          ...quest,
          completed: false,
        })),
        stats: {
          totalExp,
          level: getLevelFromExp(totalExp),
          streak: current.stats.streak + 1,
          weeksCleared: current.stats.weeksCleared + 1,
        },
      };
    });
  }

  return (
    <main className="ds-page app-page dashboard-page min-h-screen overflow-x-hidden px-2 py-3 text-[#20283a] sm:px-4">
      <div className="app-shell dashboard-shell mx-auto w-full max-w-[1180px]">
        <section className="ds-device app-device dashboard-device">
          <div className="ds-screen app-screen dashboard-screen">
            <header className="dashboard-top-panels grid gap-3 md:grid-cols-[1fr_1fr]">
              <TrainerProfileCard />
              <WeeklyProgressCard
                completedQuests={completedQuests}
                possibleWeeklyExp={possibleWeeklyExp}
                progress={progress}
                totalQuests={totalQuests}
                weeklyExp={weeklyExp}
              />
            </header>

            {allComplete ? (
              <CompletionScreen
                possibleWeeklyExp={possibleWeeklyExp}
                startNewWeek={startNewWeek}
              />
            ) : null}

            <section className="dashboard-quest-grid mt-5 grid gap-4 lg:grid-cols-3">
              {dayThemes.map((theme, index) => (
                <QuestDayCard
                  index={index}
                  key={theme.key}
                  quests={studyState.quests.filter(
                    (quest) => quest.day === theme.key,
                  )}
                  theme={theme}
                  toggleQuest={toggleQuest}
                />
              ))}
            </section>
          </div>

          <BottomNavigation active="trainer-pc" />
        </section>
      </div>
    </main>
  );
}

function TrainerProfileCard() {
  return (
    <section className="ds-panel ds-panel-red dashboard-panel dashboard-profile-panel">
      <PanelHeading title="TRAINER PROFILE" tone="red" />

      <div className="dashboard-profile-content">
        <div
          className="avatar-frame trainer-placeholder-frame"
          aria-label="Trainer image placeholder"
        >
          <span className="trainer-placeholder-grid" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="dashboard-title text-[22px] leading-relaxed text-[#c42d3d] sm:text-[34px]">
            Study Dashboard
          </h1>
          <p className="dashboard-subtitle mt-3 max-w-lg text-[11px] leading-7 text-[#2f384a] sm:text-[14px]">
            Cozy weekly quests for steady learning.
          </p>
        </div>
      </div>
    </section>
  );
}

function WeeklyProgressCard({
  completedQuests,
  possibleWeeklyExp,
  progress,
  totalQuests,
  weeklyExp,
}: {
  completedQuests: number;
  possibleWeeklyExp: number;
  progress: number;
  totalQuests: number;
  weeklyExp: number;
}) {
  return (
    <section className="ds-panel ds-panel-blue dashboard-panel dashboard-progress-panel">
      <div className="dashboard-panel-head flex items-center justify-between gap-3">
        <PanelHeading title="WEEKLY PROGRESS" tone="blue" />
        <span className="ds-badge ds-exp-badge">EXP</span>
      </div>

      <div className="dashboard-progress-track-wrap mt-5">
        <div className="progress-track">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="dashboard-progress-scale mt-2 flex justify-between text-[8px] text-[#516072]">
          <span>{weeklyExp} EXP</span>
          <span>{possibleWeeklyExp} MAX</span>
        </div>
      </div>

      <div className="dashboard-progress-stats mt-4 grid grid-cols-3 gap-3">
        <ProgressStat
          label="DONE"
          tone="gold"
          value={completedQuests}
        />
        <ProgressStat
          label="LEFT"
          tone="green"
          value={Math.max(totalQuests - completedQuests, 0)}
        />
        <ProgressStat label="SYNC" tone="blue" value={`${progress}%`} />
      </div>
    </section>
  );
}

function QuestDayCard({
  index,
  quests,
  theme,
  toggleQuest,
}: {
  index: number;
  quests: Quest[];
  theme: DayTheme;
  toggleQuest: (questId: number) => void;
}) {
  const completed = quests.filter((quest) => quest.completed).length;
  const clear = quests.length > 0 && completed === quests.length;

  return (
    <article
      className={`quest-card quest-card-${theme.key}`}
      style={
        {
          "--day-bg": theme.bg,
          "--day-border": theme.border,
          "--day-accent": theme.accent,
          "--day-dark": theme.dark,
          animationDelay: `${index * 55}ms`,
        } as CSSProperties
      }
    >
      <div className="quest-card-header">
        <div className="flex items-center gap-3">
          <PokeOrb tone={theme.accent} />
          <h2>{theme.label}</h2>
        </div>
        <span className="level-badge">{theme.badge}</span>
      </div>

      <div className="quest-list">
        {quests.map((quest) => (
          <QuestItem key={quest.id} quest={quest} toggleQuest={toggleQuest} />
        ))}

        {quests.length === 0 ? (
          <div className="empty-quest">NO QUESTS SET</div>
        ) : null}
      </div>

      <div className="quest-card-footer">
        <span>
          {completed}/{quests.length} QUESTS
        </span>
        <span>{clear ? "CLEAR!" : "READY"}</span>
      </div>
    </article>
  );
}

function QuestItem({
  quest,
  toggleQuest,
}: {
  quest: Quest;
  toggleQuest: (questId: number) => void;
}) {
  return (
    <label className={`quest-item ${quest.completed ? "is-complete" : ""}`}>
      <input
        checked={quest.completed}
        className="sr-only"
        onChange={() => toggleQuest(quest.id)}
        type="checkbox"
      />
      <span className="quest-checkbox" aria-hidden="true">
        {quest.completed ? "" : ""}
      </span>
      <span className="quest-title">{quest.title}</span>
    </label>
  );
}

function BottomNavigation({ active }: { active: string }) {
  const items = [
    {
      id: "trainer-pc",
      label: "TRAINER PC",
      href: "/",
      enabled: true,
      icon: "/ui/bar-trainer-pc.png",
    },
    { id: "bag", label: "BAG", enabled: false, icon: "/ui/bar-bag.png" },
    {
      id: "quest-log",
      label: "QUEST LOG",
      href: "/quests",
      enabled: true,
      icon: "/ui/bar-quest-log.png",
    },
    { id: "pokedex", label: "POKEDEX", enabled: false, icon: "/ui/bar-pokedex.png" },
    { id: "options", label: "OPTIONS", enabled: false, icon: "/ui/bar-options.png" },
  ];

  return (
    <nav className="ds-bottom-nav app-bottom-nav dashboard-bottom-nav" aria-label="Main menu">
      <div className="nav-buttons">
        {items.map((item) => {
          const isActive = active === item.id;
          const buttonClass = `nav-button ${
            isActive ? `is-active is-${item.id}-active` : ""
          } ${item.enabled ? "" : "is-disabled"}`;

          if (!item.enabled || !item.href) {
            return (
              <button
                aria-disabled="true"
                className={buttonClass}
                disabled
                key={item.id}
                type="button"
              >
                <Image
                  alt=""
                  className="nav-icon-image"
                  height={56}
                  src={item.icon}
                  width={56}
                />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link className={buttonClass} href={item.href} key={item.id}>
              <Image
                alt=""
                className="nav-icon-image"
                height={56}
                src={item.icon}
                width={56}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Link className="menu-orb-button" href="/quests" aria-label="Open quest setup">
        <Image
          alt=""
          className="menu-orb-image"
          height={130}
          src="/ui/menu-orb.png"
          width={130}
        />
      </Link>
    </nav>
  );
}

function CompletionScreen({
  possibleWeeklyExp,
  startNewWeek,
}: {
  possibleWeeklyExp: number;
  startNewWeek: () => void;
}) {
  return (
    <section className="completion-panel">
      <div>
        <p className="text-[10px] text-[#3E8E5B]">WEEK CLEAR</p>
        <h2 className="mt-2 text-[20px] leading-relaxed text-[#c42d3d]">
          All quests completed!
        </h2>
        <p className="mt-2 text-[10px] leading-6 text-[#344055]">
          Claim {possibleWeeklyExp} EXP and start a fresh study week.
        </p>
      </div>
      <button className="primary-ds-button" onClick={startNewWeek} type="button">
        START NEW WEEK
      </button>
    </section>
  );
}

function PanelHeading({ title, tone }: { title: string; tone: "red" | "blue" }) {
  return (
    <div className="panel-heading">
      <PokeOrb tone={tone === "red" ? "#c42d3d" : "#3C78D8"} />
      <p>{title}</p>
    </div>
  );
}

function ProgressStat({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "gold" | "green" | "blue";
  value: number | string;
}) {
  return (
    <div className={`progress-stat progress-stat-${tone}`}>
      <PokeOrb tone={tone === "gold" ? "#D99A00" : tone === "green" ? "#3E8E5B" : "#3C78D8"} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function PokeOrb({ tone }: { tone: string }) {
  return (
    <span
      className="poke-orb"
      style={{ "--orb-tone": tone } as CSSProperties}
      aria-hidden="true"
    />
  );
}
