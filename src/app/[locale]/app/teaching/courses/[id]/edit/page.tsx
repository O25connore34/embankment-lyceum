"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RoleGate } from "@/components/app-shell";
import { ln } from "@/lib/format";
import { useI18n } from "@/lib/locale";
import { useDemo, useSession } from "@/lib/store";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { locale, dict, href } = useI18n();
  const { state, ready, dispatch } = useDemo();
  const user = useSession();
  const [modTitle, setModTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonBody, setLessonBody] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [asTitle, setAsTitle] = useState("");
  const [asBrief, setAsBrief] = useState("");
  const [deadline, setDeadline] = useState("2026-08-30T18:00");
  const [testTitle, setTestTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [flash, setFlash] = useState("");
  if (!ready || !state || !user) return null;
  const course = state.courses.find((c) => c.id === id && c.teacherId === user.id);
  if (!course) {
    return (
      <RoleGate allow="teacher">
        <div className="page">
          <h1>{dict.common.forbiddenTitle}</h1>
          <Link className="btn" href={href("/app/teaching")}>
            {dict.nav.teaching}
          </Link>
        </div>
      </RoleGate>
    );
  }
  const modules = state.modules.filter((m) => m.courseId === course.id);

  return (
    <RoleGate allow="teacher">
      <div className="page">
        {flash ? <div className="ok">{flash}</div> : null}
        <p className="kicker">
          <Link href={href(`/app/teaching/courses/${course.id}`)}>{ln(course.name, locale)}</Link>
        </p>
        <h1>{dict.teacher.editProgramme}</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "addModule",
              courseId: course.id,
              title: { ru: modTitle, en: modTitle },
            });
            setModTitle("");
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.teacher.moduleTitle}</span>
            <input value={modTitle} onChange={(e) => setModTitle(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.teacher.addModule}
          </button>
        </form>
        <form
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "addLesson",
              moduleId,
              title: { ru: lessonTitle, en: lessonTitle },
              body: { ru: lessonBody, en: lessonBody },
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.teacher.addLesson}</span>
            <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} required>
              <option value="">{dict.common.none}</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {ln(m.title, locale)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{dict.teacher.lessonTitle}</span>
            <input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.lessonBody}</span>
            <textarea value={lessonBody} onChange={(e) => setLessonBody(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.teacher.addLesson}
          </button>
        </form>
        <form
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "addAssignment",
              courseId: course.id,
              title: { ru: asTitle, en: asTitle },
              brief: { ru: asBrief, en: asBrief },
              deadline: new Date(deadline).toISOString(),
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.teacher.assignmentTitle}</span>
            <input value={asTitle} onChange={(e) => setAsTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.assignmentBrief}</span>
            <textarea value={asBrief} onChange={(e) => setAsBrief(e.target.value)} required />
          </label>
          <label className="field">
            <span>{dict.teacher.deadline}</span>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.teacher.addAssignment}
          </button>
        </form>
        <form
          style={{ marginTop: 24 }}
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "addTest",
              courseId: course.id,
              title: { ru: testTitle, en: testTitle },
              prompt: { ru: prompt, en: prompt },
              options: [
                { ru: optA, en: optA },
                { ru: optB, en: optB },
              ],
              correctIndex: 0,
            });
            setFlash(dict.student.saved);
          }}
        >
          <label className="field">
            <span>{dict.teacher.addTest}</span>
            <input value={testTitle} onChange={(e) => setTestTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span>{ln({ ru: "Вопрос", en: "Question" }, locale)}</span>
            <input value={prompt} onChange={(e) => setPrompt(e.target.value)} required />
          </label>
          <label className="field">
            <span>{ln({ ru: "Верный ответ", en: "Correct option" }, locale)}</span>
            <input value={optA} onChange={(e) => setOptA(e.target.value)} required />
          </label>
          <label className="field">
            <span>{ln({ ru: "Второй вариант", en: "Second option" }, locale)}</span>
            <input value={optB} onChange={(e) => setOptB(e.target.value)} required />
          </label>
          <button className="btn" type="submit">
            {dict.teacher.addTest}
          </button>
        </form>
      </div>
    </RoleGate>
  );
}
