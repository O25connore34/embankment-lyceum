export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];

export type L = { ru: string; en: string };

export type Role = "student" | "teacher" | "admin";

export type User = {
  id: string;
  email: string;
  password: string;
  role: Role;
  firstName: L;
  lastName: L;
  patronymic?: L;
  avatar: string;
  groupId?: string;
  phone: string;
  blocked: boolean;
};

export type Group = {
  id: string;
  name: L;
  studentIds: string[];
};

export type Course = {
  id: string;
  name: L;
  teacherId: string;
  groupIds: string[];
  image: string;
  room: L;
};

export type Module = {
  id: string;
  courseId: string;
  title: L;
  order: number;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: L;
  body: L;
  file?: { name: L; href: string };
  video?: { label: L; href: string };
};

export type Assignment = {
  id: string;
  courseId: string;
  title: L;
  brief: L;
  deadline: string;
};

export type SubmissionStatus = "submitted" | "in_review" | "accepted" | "returned";

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  text: string;
  fileName?: string;
  submittedAt: string;
  late: boolean;
  status: SubmissionStatus;
  grade?: number;
  comment?: L;
};

export type TestQuestion = {
  id: string;
  prompt: L;
  options: L[];
  correctIndex: number;
};

export type CourseTest = {
  id: string;
  courseId: string;
  title: L;
  questions: TestQuestion[];
};

export type Attempt = {
  id: string;
  testId: string;
  studentId: string;
  answers: number[];
  score: number;
  submittedAt: string;
};

export type GradeSource = "assignment" | "test" | "lesson";

export type Grade = {
  id: string;
  studentId: string;
  courseId: string;
  source: GradeSource;
  sourceId: string;
  title: L;
  value: number;
  date: string;
};

export type Slot = {
  id: string;
  courseId: string;
  groupId: string;
  weekday: number;
  start: string;
  end: string;
  room: L;
  meetingUrl?: string;
};

export type Announcement = {
  id: string;
  authorId: string;
  title: L;
  body: L;
  audience: "all" | string;
  createdAt: string;
};

export type NoticeKind = "deadline" | "grade" | "comment" | "announcement";

export type Notice = {
  id: string;
  userId: string;
  kind: NoticeKind;
  title: L;
  body: L;
  href: string;
  read: boolean;
  createdAt: string;
};

export type Institution = {
  name: L;
  supportEmail: string;
  termLabel: L;
  termStart: string;
  termEnd: string;
};

export type DemoState = {
  institution: Institution;
  users: User[];
  groups: Group[];
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  assignments: Assignment[];
  submissions: Submission[];
  tests: CourseTest[];
  attempts: Attempt[];
  grades: Grade[];
  slots: Slot[];
  announcements: Announcement[];
  notices: Notice[];
  sessionUserId: string | null;
};
