export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "weekend";

export type Difficulty = "easy" | "medium" | "hard";

export type Quest = {
  id: number;
  title: string;
  completed: boolean;
  difficulty: Difficulty;
  exp: number;
  day: DayKey;
};

export type PlayerStats = {
  totalExp: number;
  level: number;
  streak: number;
  weeksCleared: number;
};

export type StudyState = {
  quests: Quest[];
  stats: PlayerStats;
};

export type DayTheme = {
  key: DayKey;
  label: string;
  badge: string;
  bg: string;
  border: string;
  accent: string;
  dark: string;
};

export const STUDY_STORAGE_KEY = "trainer-study-os-state-v2";

export const difficultyExp: Record<Difficulty, number> = {
  easy: 5,
  medium: 10,
  hard: 20,
};

export const dayThemes: DayTheme[] = [
  {
    key: "monday",
    label: "MONDAY",
    badge: "LV. 01",
    bg: "#FFF4CC",
    border: "#E8B84A",
    accent: "#D99A00",
    dark: "#8B6500",
  },
  {
    key: "tuesday",
    label: "TUESDAY",
    badge: "LV. 02",
    bg: "#DDEEFF",
    border: "#6FA8DC",
    accent: "#3C78D8",
    dark: "#214D86",
  },
  {
    key: "wednesday",
    label: "WEDNESDAY",
    badge: "LV. 03",
    bg: "#DDF5E3",
    border: "#72C38F",
    accent: "#3E8E5B",
    dark: "#23613B",
  },
  {
    key: "thursday",
    label: "THURSDAY",
    badge: "LV. 04",
    bg: "#FFE0EA",
    border: "#E89AB3",
    accent: "#D85C8A",
    dark: "#913654",
  },
  {
    key: "friday",
    label: "FRIDAY",
    badge: "LV. 05",
    bg: "#E5ECFF",
    border: "#7A95E8",
    accent: "#4B67C2",
    dark: "#324581",
  },
  {
    key: "weekend",
    label: "WEEKEND",
    badge: "REST",
    bg: "#EEF6E8",
    border: "#9DC183",
    accent: "#5D8A4A",
    dark: "#3C6030",
  },
];

export const defaultState: StudyState = {
  quests: [
    {
      id: 1,
      title: "Physics",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "monday",
    },
    {
      id: 2,
      title: "Coding",
      completed: false,
      difficulty: "hard",
      exp: 20,
      day: "monday",
    },
    {
      id: 3,
      title: "Math",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "monday",
    },
    {
      id: 4,
      title: "English",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "tuesday",
    },
    {
      id: 5,
      title: "Math",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "tuesday",
    },
    {
      id: 6,
      title: "Review Notes",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "tuesday",
    },
    {
      id: 7,
      title: "Chemistry",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "wednesday",
    },
    {
      id: 8,
      title: "React",
      completed: false,
      difficulty: "hard",
      exp: 20,
      day: "wednesday",
    },
    {
      id: 9,
      title: "Flashcards",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "wednesday",
    },
    {
      id: 10,
      title: "Biology",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "thursday",
    },
    {
      id: 11,
      title: "Reading",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "thursday",
    },
    {
      id: 12,
      title: "Mini Quiz",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "thursday",
    },
    {
      id: 13,
      title: "Algebra",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "friday",
    },
    {
      id: 14,
      title: "Project",
      completed: false,
      difficulty: "hard",
      exp: 20,
      day: "friday",
    },
    {
      id: 15,
      title: "Weekly Summary",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "friday",
    },
    {
      id: 16,
      title: "Recap Quest",
      completed: false,
      difficulty: "easy",
      exp: 5,
      day: "weekend",
    },
    {
      id: 17,
      title: "Plan Next Week",
      completed: false,
      difficulty: "medium",
      exp: 10,
      day: "weekend",
    },
    {
      id: 18,
      title: "Focus Session",
      completed: false,
      difficulty: "hard",
      exp: 20,
      day: "weekend",
    },
  ],
  stats: {
    totalExp: 0,
    level: 1,
    streak: 0,
    weeksCleared: 0,
  },
};

export function getInitialStudyState(): StudyState {
  return {
    quests: defaultState.quests.map((quest) => ({ ...quest })),
    stats: { ...defaultState.stats },
  };
}

export function normalizeStudyState(state: StudyState): StudyState {
  return {
    quests: state.quests.map((quest) => ({
      ...quest,
      exp: quest.exp || difficultyExp[quest.difficulty],
      completed: Boolean(quest.completed),
    })),
    stats: {
      totalExp: state.stats?.totalExp ?? 0,
      level: state.stats?.level ?? 1,
      streak: state.stats?.streak ?? 0,
      weeksCleared: state.stats?.weeksCleared ?? 0,
    },
  };
}

export function getLevelFromExp(totalExp: number) {
  return Math.max(1, Math.floor(totalExp / 100) + 1);
}
