"use client";

import Link from "next/link";
import Image from "next/image";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  STUDY_STORAGE_KEY,
  dayThemes,
  difficultyExp,
  getInitialStudyState,
  normalizeStudyState,
} from "../lib/studyData";
import type { DayKey, Difficulty, Quest, StudyState } from "../lib/studyData";

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];

export default function WeeklyQuestPage() {
  const [studyState, setStudyState] = useState<StudyState>(
    getInitialStudyState,
  );
  const [title, setTitle] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayKey>("monday");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const selectedTheme = dayThemes.find((day) => day.key === selectedDay);
  const totalQuestExp = useMemo(
    () => studyState.quests.reduce((total, quest) => total + quest.exp, 0),
    [studyState.quests],
  );

  function resetForm() {
    setTitle("");
    setSelectedDay("monday");
    setDifficulty("medium");
    setEditingId(null);
  }

  function submitQuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setStudyState((current) => {
      const exp = difficultyExp[difficulty];

      if (editingId) {
        return {
          ...current,
          quests: current.quests.map((quest) =>
            quest.id === editingId
              ? {
                  ...quest,
                  title: trimmedTitle,
                  day: selectedDay,
                  difficulty,
                  exp,
                }
              : quest,
          ),
        };
      }

      return {
        ...current,
        quests: [
          ...current.quests,
          {
            id: Date.now(),
            title: trimmedTitle,
            completed: false,
            difficulty,
            exp,
            day: selectedDay,
          },
        ],
      };
    });

    resetForm();
  }

  function editQuest(quest: Quest) {
    setTitle(quest.title);
    setSelectedDay(quest.day);
    setDifficulty(quest.difficulty);
    setEditingId(quest.id);
  }

  function deleteQuest(questId: number) {
    setStudyState((current) => ({
      ...current,
      quests: current.quests.filter((quest) => quest.id !== questId),
    }));

    if (editingId === questId) {
      resetForm();
    }
  }

  return (
    <main className="ds-page app-page quest-page min-h-screen overflow-x-hidden px-2 py-3 text-[#20283a] sm:px-4">
      <div className="app-shell mx-auto w-full max-w-[1180px]">
        <section className="ds-device app-device">
          <div className="ds-screen app-screen quest-screen">
            <header className="quest-setup-header">
              <div>
                <div className="panel-heading">
                  <PokeOrb tone="#c42d3d" />
                  <p>QUEST SETUP MENU</p>
                </div>
                <h1 className="mt-4 text-[24px] leading-relaxed text-[#c42d3d] sm:text-[36px]">
                  Weekly Quest Builder
                </h1>
                <p className="mt-2 max-w-2xl text-[10px] leading-6 text-[#344055] sm:text-[12px]">
                  Add study quests, assign days, and tune EXP before the week starts.
                </p>
              </div>

              <div className="setup-summary">
                <span>{studyState.quests.length} QUESTS</span>
                <span>{totalQuestExp} EXP</span>
                <span>LV. {studyState.stats.level}</span>
              </div>
            </header>

            <section className="quest-builder-grid mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <form className="setup-form ds-panel ds-panel-red p-4 sm:p-5" onSubmit={submitQuest}>
                <label className="setup-label" htmlFor="quest-title">
                  QUEST NAME
                </label>
                <input
                  className="ds-input"
                  id="quest-title"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Learn Linked List"
                  value={title}
                />

                <fieldset className="mt-5">
                  <legend className="setup-label">ASSIGN DAY</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {dayThemes.map((day) => (
                      <button
                        className={`choice-button ${
                          selectedDay === day.key ? "is-selected" : ""
                        }`}
                        key={day.key}
                        onClick={() => setSelectedDay(day.key)}
                        style={
                          {
                            "--choice-accent": day.accent,
                            "--choice-bg": day.bg,
                            "--choice-border": day.border,
                          } as CSSProperties
                        }
                        type="button"
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-5">
                  <legend className="setup-label">DIFFICULTY</legend>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {difficultyOptions.map((option) => (
                      <button
                        className={`difficulty-button ${
                          difficulty === option ? "is-selected" : ""
                        }`}
                        key={option}
                        onClick={() => setDifficulty(option)}
                        type="button"
                      >
                        <span>{option.toUpperCase()}</span>
                        <small>{difficultyExp[option]} EXP</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div
                  className="selected-day-preview"
                  style={
                    {
                      "--day-bg": selectedTheme?.bg,
                      "--day-border": selectedTheme?.border,
                      "--day-accent": selectedTheme?.accent,
                    } as CSSProperties
                  }
                >
                  <span>SET TO</span>
                  <strong>{selectedTheme?.label}</strong>
                  <em>+{difficultyExp[difficulty]} EXP</em>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button className="primary-ds-button flex-1" type="submit">
                    {editingId ? "SAVE QUEST" : "ADD QUEST"}
                  </button>
                  {editingId ? (
                    <button className="secondary-ds-button" onClick={resetForm} type="button">
                      CANCEL
                    </button>
                  ) : null}
                </div>
              </form>

              <section className="quest-manager ds-panel ds-panel-blue p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="panel-heading">
                    <PokeOrb tone="#3C78D8" />
                    <p>CURRENT QUEST LIST</p>
                  </div>
                  <Link className="mini-ds-link" href="/">
                    DASHBOARD
                  </Link>
                </div>

                <div className="mt-4 space-y-3">
                  {studyState.quests.map((quest) => {
                    const day = dayThemes.find((theme) => theme.key === quest.day);

                    return (
                      <div
                        className="managed-quest"
                        key={quest.id}
                        style={
                          {
                            "--day-bg": day?.bg,
                            "--day-border": day?.border,
                            "--day-accent": day?.accent,
                          } as CSSProperties
                        }
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[11px] text-[#20283a]">
                            {quest.title}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2 text-[8px] text-[#596575]">
                            <span>{day?.label}</span>
                            <span>{quest.difficulty.toUpperCase()}</span>
                            <span>{quest.exp} EXP</span>
                          </div>
                        </div>

                        <div className="managed-actions">
                          <button onClick={() => editQuest(quest)} type="button">
                            EDIT
                          </button>
                          <button onClick={() => deleteQuest(quest.id)} type="button">
                            DEL
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {studyState.quests.length === 0 ? (
                    <div className="empty-manager">NO WEEKLY QUESTS YET</div>
                  ) : null}
                </div>
              </section>
            </section>
          </div>

          <BottomNavigation active="quest-log" />
        </section>
      </div>
    </main>
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

function PokeOrb({ tone }: { tone: string }) {
  return (
    <span
      className="poke-orb"
      style={{ "--orb-tone": tone } as CSSProperties}
      aria-hidden="true"
    />
  );
}
