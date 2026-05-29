"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StudyTask = {
  id: string;
  title: string;
};

type StudyDay = {
  day: string;
  badge: string;
  border: string;
  text: string;
  bg: string;
  tasks: StudyTask[];
};

const weeklyPlan: StudyDay[] = [
  {
    day: "MONDAY",
    badge: "LV. 01",
    border: "border-[#ffd166]",
    text: "text-[#ff5c8a]",
    bg: "bg-[#fff9d7]",
    tasks: [
      { id: "monday-physics", title: "Physics" },
      { id: "monday-coding", title: "Coding" },
      { id: "monday-math", title: "Math" },
    ],
  },
  {
    day: "TUESDAY",
    badge: "LV. 02",
    border: "border-[#7bdff2]",
    text: "text-[#4ea8de]",
    bg: "bg-[#effaff]",
    tasks: [
      { id: "tuesday-english", title: "English" },
      { id: "tuesday-math", title: "Math" },
      { id: "tuesday-notes", title: "Review Notes" },
    ],
  },
  {
    day: "WEDNESDAY",
    badge: "LV. 03",
    border: "border-[#95d5b2]",
    text: "text-[#2d6a4f]",
    bg: "bg-[#f0fff6]",
    tasks: [
      { id: "wednesday-chemistry", title: "Chemistry" },
      { id: "wednesday-react", title: "React" },
      { id: "wednesday-flashcards", title: "Flashcards" },
    ],
  },
  {
    day: "THURSDAY",
    badge: "LV. 04",
    border: "border-[#f7a8b8]",
    text: "text-[#c94f7c]",
    bg: "bg-[#fff1f6]",
    tasks: [
      { id: "thursday-biology", title: "Biology" },
      { id: "thursday-reading", title: "Reading" },
      { id: "thursday-quiz", title: "Mini Quiz" },
    ],
  },
  {
    day: "FRIDAY",
    badge: "LV. 05",
    border: "border-[#9ad0ec]",
    text: "text-[#317ba8]",
    bg: "bg-[#eef8ff]",
    tasks: [
      { id: "friday-algebra", title: "Algebra" },
      { id: "friday-project", title: "Project" },
      { id: "friday-summary", title: "Weekly Summary" },
    ],
  },
  {
    day: "WEEKEND",
    badge: "REST",
    border: "border-[#b8e1a8]",
    text: "text-[#548c3f]",
    bg: "bg-[#f6ffee]",
    tasks: [
      { id: "weekend-recap", title: "Recap Quest" },
      { id: "weekend-plan", title: "Plan Next Week" },
      { id: "weekend-focus", title: "Focus Session" },
    ],
  },
];

const allTaskIds = weeklyPlan.flatMap((day) => day.tasks.map((task) => task.id));
const STORAGE_KEY = "trainer-study-dashboard-progress";

export default function Home() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    {},
  );
  const hasLoadedSavedState = useRef(false);

  useEffect(() => {
    queueMicrotask(() => {
      const savedTasks = window.localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        try {
          setCompletedTasks(JSON.parse(savedTasks));
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      hasLoadedSavedState.current = true;
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedState.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  const completedCount = useMemo(
    () => allTaskIds.filter((id) => completedTasks[id]).length,
    [completedTasks],
  );

  const totalTasks = allTaskIds.length;
  const progress = Math.round((completedCount / totalTasks) * 100);
  const exp = completedCount * 25;

  function toggleTask(taskId: string) {
    setCompletedTasks((current) => ({
      ...current,
      [taskId]: !current[taskId],
    }));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#ffd6e7] px-4 py-6 text-[#324052] sm:px-8">
      <div className="pixel-particles" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="pixel-shell border-4 border-[#ff8fb1] bg-[#fff4b8] p-4 shadow-2xl sm:p-6">
          <header className="mb-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="pixel-panel border-4 border-[#f7a8b8] bg-[#fffaf0] p-5">
              <p className="mb-3 text-[9px] text-[#4ea8de]">TRAINER PROFILE</p>
              <div className="flex items-center gap-4">
                <div className="trainer-sprite grid h-20 w-20 place-items-center border-4 border-[#6c7a89] bg-[#dff7ff] text-3xl">
                  *
                </div>
                <div>
                  <h1 className="text-lg leading-relaxed text-[#ff5c8a] sm:text-2xl">
                    Study Dashboard
                  </h1>
                  <p className="mt-2 text-[9px] leading-5 text-[#64748b]">
                    Cozy weekly quests for steady learning.
                  </p>
                </div>
              </div>
            </div>

            <div className="pixel-panel border-4 border-[#7bdff2] bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[9px] text-[#4ea8de]">WEEKLY PROGRESS</p>
                <span className="rounded-none border-2 border-[#6c7a89] bg-[#fff4b8] px-2 py-1 text-[8px] text-[#ff5c8a]">
                  {exp} EXP
                </span>
              </div>

              <div className="h-5 border-4 border-[#6c7a89] bg-[#e9edf2] p-1">
                <div
                  className="progress-fill h-full bg-[#71d99e] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[8px]">
                <div className="border-2 border-[#ffd166] bg-[#fff9d7] p-2">
                  <p className="text-[#ff5c8a]">{completedCount}</p>
                  <p className="mt-1 text-[#64748b]">DONE</p>
                </div>
                <div className="border-2 border-[#95d5b2] bg-[#f0fff6] p-2">
                  <p className="text-[#2d6a4f]">{totalTasks - completedCount}</p>
                  <p className="mt-1 text-[#64748b]">LEFT</p>
                </div>
                <div className="border-2 border-[#7bdff2] bg-[#effaff] p-2">
                  <p className="text-[#4ea8de]">{progress}%</p>
                  <p className="mt-1 text-[#64748b]">SYNC</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {weeklyPlan.map((studyDay, index) => {
              const doneForDay = studyDay.tasks.filter(
                (task) => completedTasks[task.id],
              ).length;

              return (
                <article
                  className={`day-card ${studyDay.bg} ${studyDay.border} border-4 p-4`}
                  key={studyDay.day}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className={`text-sm ${studyDay.text}`}>{studyDay.day}</h2>
                    <span className="border-2 border-[#6c7a89] bg-white px-2 py-1 text-[8px] text-[#64748b]">
                      {studyDay.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {studyDay.tasks.map((task) => {
                      const isDone = completedTasks[task.id];

                      return (
                        <label
                          className={`task-row flex cursor-pointer items-center gap-3 border-2 border-[#d6dbe3] bg-white p-3 text-[10px] transition duration-200 hover:-translate-y-0.5 hover:border-[#ff8fb1] ${
                            isDone ? "task-row-complete" : ""
                          }`}
                          key={task.id}
                        >
                          <input
                            checked={Boolean(isDone)}
                            className="peer sr-only"
                            onChange={() => toggleTask(task.id)}
                            type="checkbox"
                          />
                          <span
                            aria-hidden="true"
                            className="pixel-checkbox grid h-5 w-5 shrink-0 place-items-center border-2 border-[#6c7a89] bg-[#fff4b8] text-[9px] text-[#2d6a4f]"
                          >
                            {isDone ? "OK" : ""}
                          </span>
                          <span className="task-title leading-5">{task.title}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[8px] text-[#64748b]">
                    <span>
                      {doneForDay}/{studyDay.tasks.length} QUESTS
                    </span>
                    <span>{doneForDay === studyDay.tasks.length ? "CLEAR!" : "READY"}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
