"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  Announcement,
  Assignment,
  Attempt,
  Course,
  DemoState,
  Grade,
  Group,
  L,
  Lesson,
  Module,
  Notice,
  Submission,
  User,
} from "./types";
import { createSeed, STORAGE_KEY } from "./seed";
import { uid } from "./format";

type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "login"; userId: string }
  | { type: "logout" }
  | { type: "submit"; assignmentId: string; studentId: string; text: string; fileName?: string }
  | {
      type: "mark";
      submissionId: string;
      status: "accepted" | "returned";
      grade?: number;
      comment: L;
    }
  | { type: "attempt"; testId: string; studentId: string; answers: number[] }
  | { type: "classMark"; studentId: string; courseId: string; title: L; value: number }
  | { type: "profile"; userId: string; phone: string }
  | { type: "password"; userId: string; current: string; next: string }
  | { type: "createUser"; user: Omit<User, "id" | "blocked" | "avatar"> & { avatar?: string } }
  | { type: "toggleBlock"; userId: string }
  | { type: "createGroup"; name: L }
  | { type: "enroll"; groupId: string; studentId: string }
  | { type: "unenroll"; groupId: string; studentId: string }
  | { type: "createCourse"; name: L; teacherId: string; groupIds: string[]; room: L }
  | { type: "patchCourse"; courseId: string; teacherId: string; groupIds: string[] }
  | { type: "term"; termLabel: L; termStart: string; termEnd: string }
  | { type: "announce"; title: L; body: L; audience: string; authorId: string }
  | { type: "settings"; name: L; supportEmail: string }
  | { type: "addModule"; courseId: string; title: L }
  | { type: "addLesson"; moduleId: string; title: L; body: L }
  | { type: "addAssignment"; courseId: string; title: L; brief: L; deadline: string }
  | { type: "addTest"; courseId: string; title: L; prompt: L; options: L[]; correctIndex: number }
  | { type: "readNotice"; noticeId: string }
  | { type: "reset" };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "login":
      return { ...state, sessionUserId: action.userId };
    case "logout":
      return { ...state, sessionUserId: null };
    case "reset":
      return { ...createSeed(), sessionUserId: state.sessionUserId };
    case "submit": {
      const assignment = state.assignments.find((a) => a.id === action.assignmentId);
      if (!assignment) return state;
      const late = Date.now() > new Date(assignment.deadline).getTime();
      const existing = state.submissions.find(
        (s) => s.assignmentId === action.assignmentId && s.studentId === action.studentId
      );
      const nextSub: Submission = {
        id: existing?.id ?? uid("s"),
        assignmentId: action.assignmentId,
        studentId: action.studentId,
        text: action.text,
        fileName: action.fileName,
        submittedAt: new Date().toISOString(),
        late,
        status: "in_review",
      };
      const submissions = existing
        ? state.submissions.map((s) => (s.id === existing.id ? nextSub : s))
        : [nextSub, ...state.submissions];
      const course = state.courses.find((c) => c.id === assignment.courseId);
      const teacherId = course?.teacherId;
      let notices = state.notices;
      if (teacherId) {
        notices = [
          {
            id: uid("n"),
            userId: teacherId,
            kind: "comment",
            title: assignment.title,
            body: { ru: "Новая сдача на проверке.", en: "New work waiting to be marked." },
            href: `/app/teaching/assignments/${assignment.id}`,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...notices,
        ];
      }
      return { ...state, submissions, notices };
    }
    case "mark": {
      const sub = state.submissions.find((s) => s.id === action.submissionId);
      if (!sub) return state;
      const assignment = state.assignments.find((a) => a.id === sub.assignmentId);
      const submissions = state.submissions.map((s) =>
        s.id === action.submissionId
          ? { ...s, status: action.status, grade: action.grade, comment: action.comment }
          : s
      );
      let grades = state.grades;
      if (action.status === "accepted" && action.grade && assignment) {
        const existing = grades.find((g) => g.sourceId === assignment.id && g.studentId === sub.studentId);
        const g: Grade = {
          id: existing?.id ?? uid("gr"),
          studentId: sub.studentId,
          courseId: assignment.courseId,
          source: "assignment",
          sourceId: assignment.id,
          title: assignment.title,
          value: action.grade,
          date: new Date().toISOString(),
        };
        grades = existing ? grades.map((x) => (x.id === existing.id ? g : x)) : [g, ...grades];
      }
      const notice: Notice = {
        id: uid("n"),
        userId: sub.studentId,
        kind: action.status === "accepted" ? "grade" : "comment",
        title: assignment?.title ?? { ru: "Работа", en: "Work" },
        body:
          action.status === "accepted"
            ? { ru: `Оценка ${action.grade}`, en: `Mark ${action.grade}` }
            : action.comment,
        href: `/app/assignments/${sub.assignmentId}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      return { ...state, submissions, grades, notices: [notice, ...state.notices] };
    }
    case "attempt": {
      const test = state.tests.find((t) => t.id === action.testId);
      if (!test) return state;
      if (state.attempts.some((a) => a.testId === action.testId && a.studentId === action.studentId)) {
        return state;
      }
      let correct = 0;
      test.questions.forEach((q, i) => {
        if (action.answers[i] === q.correctIndex) correct += 1;
      });
      const score = Math.round((correct / test.questions.length) * 5);
      const value = Math.max(2, score);
      const attempt: Attempt = {
        id: uid("at"),
        testId: action.testId,
        studentId: action.studentId,
        answers: action.answers,
        score: value,
        submittedAt: new Date().toISOString(),
      };
      const grade: Grade = {
        id: uid("gr"),
        studentId: action.studentId,
        courseId: test.courseId,
        source: "test",
        sourceId: test.id,
        title: test.title,
        value,
        date: attempt.submittedAt,
      };
      const notice: Notice = {
        id: uid("n"),
        userId: action.studentId,
        kind: "grade",
        title: test.title,
        body: { ru: `Оценка ${value}`, en: `Mark ${value}` },
        href: `/app/tests/${test.id}`,
        read: false,
        createdAt: attempt.submittedAt,
      };
      return {
        ...state,
        attempts: [attempt, ...state.attempts],
        grades: [grade, ...state.grades],
        notices: [notice, ...state.notices],
      };
    }
    case "classMark": {
      const grade: Grade = {
        id: uid("gr"),
        studentId: action.studentId,
        courseId: action.courseId,
        source: "lesson",
        sourceId: uid("cw"),
        title: action.title,
        value: action.value,
        date: new Date().toISOString(),
      };
      const notice: Notice = {
        id: uid("n"),
        userId: action.studentId,
        kind: "grade",
        title: action.title,
        body: { ru: `Оценка ${action.value}`, en: `Mark ${action.value}` },
        href: "/app/grades",
        read: false,
        createdAt: grade.date,
      };
      return { ...state, grades: [grade, ...state.grades], notices: [notice, ...state.notices] };
    }
    case "profile":
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, phone: action.phone } : u)),
      };
    case "password": {
      const user = state.users.find((u) => u.id === action.userId);
      if (!user || user.password !== action.current) return state;
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, password: action.next } : u)),
      };
    }
    case "createUser": {
      const user: User = {
        id: uid("u"),
        blocked: false,
        avatar: action.user.avatar ?? "/images/avatars/avatar-mira.png",
        ...action.user,
      };
      return { ...state, users: [...state.users, user] };
    }
    case "toggleBlock":
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, blocked: !u.blocked } : u)),
      };
    case "createGroup": {
      const group: Group = { id: uid("g"), name: action.name, studentIds: [] };
      return { ...state, groups: [...state.groups, group] };
    }
    case "enroll":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.groupId && !g.studentIds.includes(action.studentId)
            ? { ...g, studentIds: [...g.studentIds, action.studentId] }
            : g
        ),
        users: state.users.map((u) =>
          u.id === action.studentId ? { ...u, groupId: action.groupId } : u
        ),
      };
    case "unenroll":
      return {
        ...state,
        groups: state.groups.map((g) =>
          g.id === action.groupId
            ? { ...g, studentIds: g.studentIds.filter((id) => id !== action.studentId) }
            : g
        ),
        users: state.users.map((u) =>
          u.id === action.studentId && u.groupId === action.groupId ? { ...u, groupId: undefined } : u
        ),
      };
    case "createCourse": {
      const course: Course = {
        id: uid("c"),
        name: action.name,
        teacherId: action.teacherId,
        groupIds: action.groupIds,
        image: "/images/courses/course-history.png",
        room: action.room,
      };
      return { ...state, courses: [...state.courses, course] };
    }
    case "patchCourse":
      return {
        ...state,
        courses: state.courses.map((c) =>
          c.id === action.courseId
            ? { ...c, teacherId: action.teacherId, groupIds: action.groupIds }
            : c
        ),
      };
    case "term":
      return {
        ...state,
        institution: {
          ...state.institution,
          termLabel: action.termLabel,
          termStart: action.termStart,
          termEnd: action.termEnd,
        },
      };
    case "announce": {
      const announcement: Announcement = {
        id: uid("an"),
        authorId: action.authorId,
        title: action.title,
        body: action.body,
        audience: action.audience,
        createdAt: new Date().toISOString(),
      };
      const targets =
        action.audience === "all"
          ? state.users.filter((u) => u.role === "student" || u.role === "teacher")
          : state.users.filter((u) => u.groupId === action.audience);
      const notices: Notice[] = targets.map((u) => ({
        id: uid("n"),
        userId: u.id,
        kind: "announcement",
        title: action.title,
        body: action.body,
        href: u.role === "student" ? "/app/today" : "/app/teaching",
        read: false,
        createdAt: announcement.createdAt,
      }));
      return {
        ...state,
        announcements: [announcement, ...state.announcements],
        notices: [...notices, ...state.notices],
      };
    }
    case "settings":
      return {
        ...state,
        institution: {
          ...state.institution,
          name: action.name,
          supportEmail: action.supportEmail,
        },
      };
    case "addModule": {
      const mod: Module = {
        id: uid("m"),
        courseId: action.courseId,
        title: action.title,
        order: state.modules.filter((m) => m.courseId === action.courseId).length + 1,
      };
      return { ...state, modules: [...state.modules, mod] };
    }
    case "addLesson": {
      const lesson: Lesson = {
        id: uid("l"),
        moduleId: action.moduleId,
        title: action.title,
        body: action.body,
      };
      return { ...state, lessons: [...state.lessons, lesson] };
    }
    case "addAssignment": {
      const assignment: Assignment = {
        id: uid("a"),
        courseId: action.courseId,
        title: action.title,
        brief: action.brief,
        deadline: action.deadline,
      };
      return { ...state, assignments: [...state.assignments, assignment] };
    }
    case "addTest": {
      return {
        ...state,
        tests: [
          ...state.tests,
          {
            id: uid("t"),
            courseId: action.courseId,
            title: action.title,
            questions: [
              {
                id: uid("q"),
                prompt: action.prompt,
                options: action.options,
                correctIndex: action.correctIndex,
              },
            ],
          },
        ],
      };
    }
    case "readNotice":
      return {
        ...state,
        notices: state.notices.map((n) => (n.id === action.noticeId ? { ...n, read: true } : n)),
      };
    default:
      return state;
  }
}

type DemoContextValue = {
  state: DemoState;
  dispatch: (action: Action) => void;
  login: (email: string, password: string) => User | null;
  ready: boolean;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null as unknown as DemoState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "hydrate", state: raw ? (JSON.parse(raw) as DemoState) : createSeed() });
    } catch {
      dispatch({ type: "hydrate", state: createSeed() });
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
  }, [state, ready]);

  const login = useCallback(
    (email: string, password: string) => {
      if (!state) return null;
      const user = state.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && !u.blocked
      );
      if (!user) return null;
      dispatch({ type: "login", userId: user.id });
      return user;
    },
    [state]
  );

  const value = useMemo(
    () => ({ state, dispatch, login, ready }),
    [state, login, ready]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("DemoProvider missing");
  return ctx;
}

export function useSession(): User | null {
  const { state, ready } = useDemo();
  if (!ready || !state) return null;
  return state.users.find((u) => u.id === state.sessionUserId) ?? null;
}

export function passwordOk(state: DemoState, userId: string, current: string, next: string): boolean {
  const user = state.users.find((u) => u.id === userId);
  return Boolean(user && user.password === current && next.length >= 4);
}
