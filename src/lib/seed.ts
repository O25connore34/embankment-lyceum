import type { DemoState, L, User } from "./types";

const t = (ru: string, en: string): L => ({ ru, en });

function student(
  id: string,
  email: string,
  first: L,
  last: L,
  avatar: string
): User {
  return {
    id,
    email,
    password: "demo",
    role: "student",
    firstName: first,
    lastName: last,
    avatar,
    groupId: "g-11b",
    phone: "",
    blocked: false,
  };
}

export const STORAGE_KEY = "embankment-lyceum-v1";

export function createSeed(): DemoState {
  const students: User[] = [
    student("u-mira", "student@embankment.local", t("Мира", "Mira"), t("Соловьёва", "Solovyova"), "/images/avatars/avatar-mira.png"),
    student("u-ilya", "ilya.kim@embankment.local", t("Илья", "Ilya"), t("Ким", "Kim"), "/images/avatars/avatar-ilya.png"),
    student("u-anna", "anna.berg@embankment.local", t("Анна", "Anna"), t("Берг", "Berg"), "/images/avatars/avatar-anna.png"),
    student("u-petr", "petr.orlov@embankment.local", t("Пётр", "Petr"), t("Орлов", "Orlov"), "/images/avatars/avatar-petr.png"),
    student("u-sofia", "sofia.levi@embankment.local", t("Софья", "Sofia"), t("Леви", "Levi"), "/images/avatars/avatar-sofia.png"),
    student("u-daniil", "daniil.shakh@embankment.local", t("Даниил", "Daniil"), t("Шах", "Shakh"), "/images/avatars/avatar-daniil.png"),
    student("u-elena", "elena.morozova@embankment.local", t("Елена", "Elena"), t("Морозова", "Morozova"), "/images/avatars/avatar-elena.png"),
    student("u-timur", "timur.nazarov@embankment.local", t("Тимур", "Timur"), t("Назаров", "Nazarov"), "/images/avatars/avatar-timur.png"),
    student("u-vera", "vera.pak@embankment.local", t("Вера", "Vera"), t("Пак", "Pak"), "/images/avatars/avatar-vera.png"),
    student("u-nikita", "nikita.belov@embankment.local", t("Никита", "Nikita"), t("Белов", "Belov"), "/images/avatars/avatar-nikita.png"),
    student("u-yulia", "yulia.savelyeva@embankment.local", t("Юлия", "Yulia"), t("Савельева", "Savelyeva"), "/images/avatars/avatar-yulia.png"),
    student("u-artem", "artem.grigoryan@embankment.local", t("Артём", "Artem"), t("Григорян", "Grigoryan"), "/images/avatars/avatar-artem.png"),
  ];

  return {
    institution: {
      name: t("Лицей «Набережная»", "Embankment Lyceum"),
      supportEmail: "office@embankment.local",
      termLabel: t("2026/27, первое полугодие", "2026/27, first half"),
      termStart: "2026-09-01",
      termEnd: "2026-12-25",
    },
    sessionUserId: null,
    users: [
      ...students,
      {
        id: "u-sokolova",
        email: "teacher@embankment.local",
        password: "demo",
        role: "teacher",
        firstName: t("Нина", "Nina"),
        lastName: t("Соколова", "Sokolova"),
        patronymic: t("Валерьевна", "Valeryevna"),
        avatar: "/images/avatars/avatar-sokolova.png",
        phone: "+7 921 410 22 11",
        blocked: false,
      },
      {
        id: "u-lebedev",
        email: "lebedev@embankment.local",
        password: "demo",
        role: "teacher",
        firstName: t("Игорь", "Igor"),
        lastName: t("Лебедев", "Lebedev"),
        patronymic: t("Петрович", "Petrovich"),
        avatar: "/images/avatars/avatar-lebedev.png",
        phone: "",
        blocked: false,
      },
      {
        id: "u-orshina",
        email: "orshina@embankment.local",
        password: "demo",
        role: "teacher",
        firstName: t("Мария", "Maria"),
        lastName: t("Оршина", "Orshina"),
        patronymic: t("Львовна", "Lvovna"),
        avatar: "/images/avatars/avatar-orshina.png",
        phone: "",
        blocked: false,
      },
      {
        id: "u-krum",
        email: "krum@embankment.local",
        password: "demo",
        role: "teacher",
        firstName: t("Павел", "Pavel"),
        lastName: t("Крум", "Krum"),
        patronymic: t("Янович", "Yanovich"),
        avatar: "/images/avatars/avatar-krum.png",
        phone: "",
        blocked: false,
      },
      {
        id: "u-gromova",
        email: "gromova@embankment.local",
        password: "demo",
        role: "teacher",
        firstName: t("Татьяна", "Tatiana"),
        lastName: t("Громова", "Gromova"),
        patronymic: t("Сергеевна", "Sergeyevna"),
        avatar: "/images/avatars/avatar-gromova.png",
        phone: "",
        blocked: false,
      },
      {
        id: "u-volkov",
        email: "admin@embankment.local",
        password: "demo",
        role: "admin",
        firstName: t("Андрей", "Andrei"),
        lastName: t("Волков", "Volkov"),
        patronymic: t("Сергеевич", "Sergeyevich"),
        avatar: "/images/avatars/avatar-volkov.png",
        phone: "+7 921 410 00 01",
        blocked: false,
      },
    ],
    groups: [
      {
        id: "g-11b",
        name: t("11-Б", "11-B"),
        studentIds: students.map((s) => s.id),
      },
    ],
    courses: [
      {
        id: "c-inf",
        name: t("Информатика", "Informatics"),
        teacherId: "u-sokolova",
        groupIds: ["g-11b"],
        image: "/images/courses/course-informatics.png",
        room: t("каб. 12, компьютерный", "Room 12, computer lab"),
      },
      {
        id: "c-alg",
        name: t("Алгебра", "Algebra"),
        teacherId: "u-lebedev",
        groupIds: ["g-11b"],
        image: "/images/courses/course-algebra.png",
        room: t("каб. 204", "Room 204"),
      },
      {
        id: "c-rus",
        name: t("Русский язык", "Russian"),
        teacherId: "u-orshina",
        groupIds: ["g-11b"],
        image: "/images/courses/course-russian.png",
        room: t("каб. 214", "Room 214"),
      },
      {
        id: "c-phy",
        name: t("Физика", "Physics"),
        teacherId: "u-krum",
        groupIds: ["g-11b"],
        image: "/images/courses/course-physics.png",
        room: t("каб. 301", "Room 301"),
      },
      {
        id: "c-his",
        name: t("История", "History"),
        teacherId: "u-gromova",
        groupIds: ["g-11b"],
        image: "/images/courses/course-history.png",
        room: t("каб. 118", "Room 118"),
      },
    ],
    modules: [
      { id: "m-inf-1", courseId: "c-inf", title: t("Последовательности в Python", "Sequences in Python"), order: 1 },
      { id: "m-inf-2", courseId: "c-inf", title: t("Файлы", "Files"), order: 2 },
      { id: "m-alg-1", courseId: "c-alg", title: t("Квадратные уравнения", "Quadratic equations"), order: 1 },
      { id: "m-rus-1", courseId: "c-rus", title: t("Причастие и деепричастие", "Participles"), order: 1 },
      { id: "m-phy-1", courseId: "c-phy", title: t("Колебания", "Oscillations"), order: 1 },
      { id: "m-his-1", courseId: "c-his", title: t("Европа 1848–1871", "Europe 1848–1871"), order: 1 },
    ],
    lessons: [
      {
        id: "l-inf-lists",
        moduleId: "m-inf-1",
        title: t("Списки: обход и накопление", "Lists: walking and accumulating"),
        body: t(
          "Список в Python хранит элементы по порядку. Обход `for x in xs` не требует индекса, если индекс сам по себе не нужен. Накопление — отдельный список или число, которое вы обновляете внутри цикла. Ошибка новичка: изменять список, по которому идёт тот же цикл. Для сегодняшней лабораторной: напишите функцию, которая из списка чисел оставляет только чётные и возвращает их сумму.\n\nПример в тетради:\n\n```\ndef even_sum(xs):\n    total = 0\n    for x in xs:\n        if x % 2 == 0:\n            total += x\n    return total\n```",
          "A Python list keeps items in order. `for x in xs` needs no index unless you truly want the position. Accumulation is a second list, or a number you update inside the loop. A common fault is mutating the list you are walking. For today’s lab: write a function that keeps only the even numbers from a list and returns their sum.\n\nFrom the board:\n\n```\ndef even_sum(xs):\n    total = 0\n    for x in xs:\n        if x % 2 == 0:\n            total += x\n    return total\n```"
        ),
        file: {
          name: t("Лабораторная: списки.txt", "Lab: lists.txt"),
          href: "/files/lab-lists.txt",
        },
        video: {
          label: t("Краткая запись: цикл for (Python, англ.)", "Short recording: the for-loop (Python)"),
          href: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        },
      },
      {
        id: "l-inf-files",
        moduleId: "m-inf-2",
        title: t("Чтение текстового файла", "Reading a text file"),
        body: t(
          "Файл открывают через `with open(path, encoding='utf-8') as f`. Метод `readlines()` даёт список строк с символом перевода строки — его обычно снимают `.strip()`. В лицее пути пишем относительно папки задания, не от диска C:.",
          "Open a file with `with open(path, encoding='utf-8') as f`. `readlines()` keeps the newline; strip it. In this lyceum we write paths relative to the assignment folder, never from C:."
        ),
        file: {
          name: t("Заготовка файла.txt", "Starter file.txt"),
          href: "/files/lab-files.txt",
        },
      },
      {
        id: "l-alg-disc",
        moduleId: "m-alg-1",
        title: t("Дискриминант и число корней", "The discriminant and how many roots"),
        body: t(
          "Для уравнения ax² + bx + c = 0 считают D = b² − 4ac. Если D > 0, два различных корня; D = 0 — один (кратности два); D < 0 — в действительных числах корней нет. На доске разобрали 2x² − 3x − 2 = 0: D = 25, корни 2 и −1/2.",
          "For ax² + bx + c = 0, D = b² − 4ac. D > 0: two distinct real roots; D = 0: one root (multiplicity two); D < 0: no real roots. On the board: 2x² − 3x − 2 = 0, D = 25, roots 2 and −1/2."
        ),
        file: {
          name: t("Лист с уравнениями.txt", "Equation sheet.txt"),
          href: "/files/algebra-sheet.txt",
        },
      },
      {
        id: "l-rus-part",
        moduleId: "m-rus-1",
        title: t("Обособление причастного оборота", "Setting off the participial phrase"),
        body: t(
          "Причастный оборот обособляется, если стоит после определяемого слова: «Лицей, построенный у воды, держит расписание в бумажном журнале». Перед определяемым словом оборот обычно не обособляют, если нет дополнительных условий. Не путать с деепричастным оборотом: он относится к глаголу и всегда обособляется.",
          "A participial phrase is set off when it follows the noun it modifies: “The lyceum, built by the water, still keeps a paper register.” Before the noun it is usually not set off, unless other conditions apply. Do not confuse it with the adverbial participle, which attaches to the verb and is always set off."
        ),
        file: {
          name: t("Упражнение на обособление.txt", "Set-off exercise.txt"),
          href: "/files/russian-participles.txt",
        },
      },
      {
        id: "l-phy-harm",
        moduleId: "m-phy-1",
        title: t("Гармонические колебания", "Simple harmonic motion"),
        body: t(
          "Смещение x = A cos(ωt + φ). Период пружинного маятника T = 2π√(m/k). На лабораторной измеряете 10 полных колебаний, делите время на 10 — так меньше ошибка секундомера. Амплитуду берём по линейке от положения равновесия.",
          "Displacement x = A cos(ωt + φ). Period of a mass on a spring T = 2π√(m/k). In the lab you time 10 full swings and divide by 10, which cuts stopwatch error. Amplitude is read from equilibrium with a ruler."
        ),
        file: {
          name: t("Протокол лабораторной.txt", "Lab protocol.txt"),
          href: "/files/physics-lab.txt",
        },
        video: {
          label: t("Колебания груза на пружине (англ.)", "Mass on a spring (English)"),
          href: "https://www.youtube.com/watch?v=p_di4Zn4wz4",
        },
      },
      {
        id: "l-his-48",
        moduleId: "m-his-1",
        title: t("1848: что требовали и что получили", "1848: what was asked for, what arrived"),
        body: t(
          "Весна народов — не одна революция, а пачка городских восстаний с разными списками требований. В Париже — республика и национальные мастерские; в Вене и Берлине — конституция и отмена цензуры; в Милане и Венеции — австрийцы. К осени 1849 консервативный порядок в основном вернулся, но конституционный язык уже нельзя было убрать из политики.",
          "The Springtime of Nations was not one revolution but a bundle of city risings with different lists. Paris: a republic and national workshops; Vienna and Berlin: a constitution and an end to censorship; Milan and Venice: the Austrians. By autumn 1849 the conservative order had mostly returned, but constitutional language could not be taken back out of politics."
        ),
        file: {
          name: t("Хронология 1848–1849.txt", "Timeline 1848–1849.txt"),
          href: "/files/history-1848.txt",
        },
      },
    ],
    assignments: [
      {
        id: "a-inf-even",
        courseId: "c-inf",
        title: t("Функция even_sum", "The even_sum function"),
        brief: t(
          "Сдайте текст функции even_sum(xs) и два своих примера вызова. Файл — по желанию. Срок: 27 августа, 18:00.",
          "Turn in the text of even_sum(xs) and two example calls of your own. A file is optional. Due 27 August, 18:00."
        ),
        deadline: "2026-08-27T18:00:00",
      },
      {
        id: "a-alg-quad",
        courseId: "c-alg",
        title: t("Три уравнения на дискриминант", "Three equations, discriminant"),
        brief: t(
          "Решите  x² − 5x + 6 = 0,  x² + 4x + 5 = 0,  2x² − 4x + 2 = 0. Для каждого напишите D и число действительных корней.",
          "Solve x² − 5x + 6 = 0, x² + 4x + 5 = 0, 2x² − 4x + 2 = 0. For each, write D and how many real roots."
        ),
        deadline: "2026-08-20T18:00:00",
      },
      {
        id: "a-rus-sent",
        courseId: "c-rus",
        title: t("Четыре предложения с оборотом", "Four sentences with a phrase"),
        brief: t(
          "Составьте четыре предложения: два с обособленным причастным оборотом после существительного, два — с деепричастным. Подчеркните оборот.",
          "Write four sentences: two with a participial phrase set off after the noun, two with an adverbial participle. Mark the phrase."
        ),
        deadline: "2026-08-22T18:00:00",
      },
      {
        id: "a-phy-period",
        courseId: "c-phy",
        title: t("Расчёт периода", "Period calculation"),
        brief: t(
          "Груз 0,2 кг на пружине k = 50 Н/м. Найдите T. Запишите формулу и численный ответ с двумя знаками.",
          "A 0.2 kg mass on a spring k = 50 N/m. Find T. Write the formula and a numerical answer to two decimal places."
        ),
        deadline: "2026-08-28T18:00:00",
      },
    ],
    submissions: [
      {
        id: "s-mira-rus",
        assignmentId: "a-rus-sent",
        studentId: "u-mira",
        text: "1. Лицей, построенный у воды, держит пары по звонку.\n2. Тетрадь, исписанная карандашом, лежала на подоконнике.\n3. Сверив расписание, Мира вошла в 214-й.\n4. Закрыв журнал, Оршина вышла к доске.",
        submittedAt: "2026-08-21T16:40:00",
        late: false,
        status: "accepted",
        grade: 5,
        comment: t(
          "Обороты на месте, знаки верные. Во втором предложении можно было поставить запятую иначе — не ошибка.",
          "The phrases sit where they should, punctuation is sound. The second sentence could take a different comma — not a fault."
        ),
      },
      {
        id: "s-mira-alg",
        assignmentId: "a-alg-quad",
        studentId: "u-mira",
        text: "1) D=1, два корня (2 и 3). 2) D=−4, действительных корней нет. 3) D=0, один корень x=1.",
        submittedAt: "2026-08-21T21:10:00",
        late: true,
        status: "in_review",
      },
      {
        id: "s-ilya-rus",
        assignmentId: "a-rus-sent",
        studentId: "u-ilya",
        text: "1. Книга лежащая на столе пыльная. 2. Выйдя в коридор я вспомнил кабинет.",
        submittedAt: "2026-08-22T19:02:00",
        late: true,
        status: "returned",
        comment: t(
          "Не хватает запятых и двух предложений. Верните с полным комплектом.",
          "Commas are missing, and two sentences are missing. Send back a full set."
        ),
      },
      {
        id: "s-anna-inf",
        assignmentId: "a-inf-even",
        studentId: "u-anna",
        text: "def even_sum(xs):\n    return sum(x for x in xs if x % 2 == 0)\n\neven_sum([1,2,3,4])  # 6\neven_sum([])  # 0",
        submittedAt: "2026-08-25T12:15:00",
        late: false,
        status: "in_review",
      },
    ],
    tests: [
      {
        id: "t-inf-lists",
        courseId: "c-inf",
        title: t("Мини-зачёт: списки", "Short quiz: lists"),
        questions: [
          {
            id: "q1",
            prompt: t("Что вернёт len([3, 1, 3])?", "What does len([3, 1, 3]) return?"),
            options: [t("2", "2"), t("3", "3"), t("7", "7"), t("ошибка", "an error")],
            correctIndex: 1,
          },
          {
            id: "q2",
            prompt: t("Какой способ безопаснее для обхода списка, если индекс не нужен?", "Which walk is safer when you do not need the index?"),
            options: [
              t("for i in range(len(xs)): xs[i]", "for i in range(len(xs)): xs[i]"),
              t("for x in xs", "for x in xs"),
              t("while True", "while True"),
              t("xs.foreach", "xs.foreach"),
            ],
            correctIndex: 1,
          },
          {
            id: "q3",
            prompt: t("Что делает xs.append(4) с списком xs = [1, 2]?", "What does xs.append(4) do to xs = [1, 2]?"),
            options: [
              t("возвращает [1, 2, 4]", "returns [1, 2, 4]"),
              t("меняет xs на месте, результат — None", "mutates xs in place; the result is None"),
              t("ошибка типа", "a type error"),
              t("создаёт кортеж", "builds a tuple"),
            ],
            correctIndex: 1,
          },
          {
            id: "q4",
            prompt: t("Чётные из [1, 2, 3, 4] — это", "The even numbers in [1, 2, 3, 4] are"),
            options: [t("[1, 3]", "[1, 3]"), t("[2, 4]", "[2, 4]"), t("[1, 2, 3, 4]", "[1, 2, 3, 4]"), t("[]", "[]")],
            correctIndex: 1,
          },
        ],
      },
    ],
    attempts: [],
    grades: [
      {
        id: "gr-mira-rus",
        studentId: "u-mira",
        courseId: "c-rus",
        source: "assignment",
        sourceId: "a-rus-sent",
        title: t("Четыре предложения с оборотом", "Four sentences with a phrase"),
        value: 5,
        date: "2026-08-23T09:10:00",
      },
      {
        id: "gr-mira-inf-cw",
        studentId: "u-mira",
        courseId: "c-inf",
        source: "lesson",
        sourceId: "l-inf-lists",
        title: t("Работа на занятии, 20 августа", "Work in the room, 20 August"),
        value: 4,
        date: "2026-08-20T11:40:00",
      },
      {
        id: "gr-mira-his",
        studentId: "u-mira",
        courseId: "c-his",
        source: "lesson",
        sourceId: "l-his-48",
        title: t("Устный ответ, 1848", "Spoken answer, 1848"),
        value: 5,
        date: "2026-08-24T10:05:00",
      },
    ],
    slots: [
      { id: "sl-1", courseId: "c-alg", groupId: "g-11b", weekday: 1, start: "09:00", end: "09:45", room: t("каб. 204", "Room 204") },
      { id: "sl-2", courseId: "c-rus", groupId: "g-11b", weekday: 1, start: "10:00", end: "10:45", room: t("каб. 214", "Room 214") },
      { id: "sl-3", courseId: "c-his", groupId: "g-11b", weekday: 1, start: "11:50", end: "12:35", room: t("каб. 118", "Room 118") },
      { id: "sl-4", courseId: "c-inf", groupId: "g-11b", weekday: 2, start: "09:00", end: "09:45", room: t("каб. 12", "Room 12") },
      { id: "sl-5", courseId: "c-phy", groupId: "g-11b", weekday: 2, start: "10:50", end: "11:35", room: t("каб. 301", "Room 301") },
      { id: "sl-6", courseId: "c-alg", groupId: "g-11b", weekday: 2, start: "12:40", end: "13:25", room: t("каб. 204", "Room 204") },
      { id: "sl-7", courseId: "c-rus", groupId: "g-11b", weekday: 3, start: "09:00", end: "09:45", room: t("каб. 214", "Room 214") },
      { id: "sl-8", courseId: "c-inf", groupId: "g-11b", weekday: 3, start: "10:50", end: "11:35", room: t("каб. 12", "Room 12"), meetingUrl: "https://meet.jit.si/embankment-informatics-11b" },
      { id: "sl-9", courseId: "c-phy", groupId: "g-11b", weekday: 3, start: "12:40", end: "13:25", room: t("каб. 301", "Room 301") },
      { id: "sl-10", courseId: "c-his", groupId: "g-11b", weekday: 4, start: "09:00", end: "09:45", room: t("каб. 118", "Room 118") },
      { id: "sl-11", courseId: "c-alg", groupId: "g-11b", weekday: 4, start: "10:50", end: "11:35", room: t("каб. 204", "Room 204") },
      { id: "sl-12", courseId: "c-inf", groupId: "g-11b", weekday: 4, start: "12:40", end: "13:25", room: t("каб. 12", "Room 12") },
      { id: "sl-13", courseId: "c-phy", groupId: "g-11b", weekday: 5, start: "09:00", end: "09:45", room: t("каб. 301", "Room 301") },
      { id: "sl-14", courseId: "c-rus", groupId: "g-11b", weekday: 5, start: "10:50", end: "11:35", room: t("каб. 214", "Room 214") },
      { id: "sl-15", courseId: "c-alg", groupId: "g-11b", weekday: 5, start: "12:40", end: "13:25", room: t("каб. 204", "Room 204") },
    ],
    announcements: [
      {
        id: "an-1",
        authorId: "u-volkov",
        title: t("Сверка журналов до 29 августа", "Gradebooks to be checked by 29 August"),
        body: t(
          "Преподаватели закрывают текущие отметки до пятницы. Ученики 11-Б: проверьте, что сдача по алгебре ушла, даже если срок вышел.",
          "Teachers close current marks by Friday. Form 11-B: make sure the algebra work has gone in, even if the deadline has passed."
        ),
        audience: "all",
        createdAt: "2026-08-25T08:30:00",
      },
      {
        id: "an-2",
        authorId: "u-sokolova",
        title: t("Лабораторная в 12-м кабинете", "Lab in room 12"),
        body: t(
          "В среду информатика — в компьютерном. Флешки с домашними файлами можно не нести: сдача через портал.",
          "Wednesday informatics is in the computer lab. You do not need a stick for homework files: turn them in through the portal."
        ),
        audience: "g-11b",
        createdAt: "2026-08-25T16:00:00",
      },
    ],
    notices: [
      {
        id: "n-1",
        userId: "u-mira",
        kind: "announcement",
        title: t("Сверка журналов до 29 августа", "Gradebooks to be checked by 29 August"),
        body: t("Объявление учебной части.", "From the office."),
        href: "/app/today",
        read: false,
        createdAt: "2026-08-25T08:30:00",
      },
      {
        id: "n-2",
        userId: "u-mira",
        kind: "grade",
        title: t("Русский язык: оценка 5", "Russian: mark 5"),
        body: t("Четыре предложения с оборотом приняты.", "Four sentences with a phrase accepted."),
        href: "/app/grades",
        read: false,
        createdAt: "2026-08-23T09:10:00",
      },
      {
        id: "n-3",
        userId: "u-mira",
        kind: "deadline",
        title: t("Информатика: срок завтра, 18:00", "Informatics: due tomorrow, 18:00"),
        body: t("Функция even_sum.", "The even_sum function."),
        href: "/app/assignments/a-inf-even",
        read: false,
        createdAt: "2026-08-26T07:00:00",
      },
      {
        id: "n-4",
        userId: "u-sokolova",
        kind: "comment",
        title: t("Сдача Берг, even_sum", "Berg’s even_sum submission"),
        body: t("Новая работа на проверке.", "New work waiting to be marked."),
        href: "/app/teaching/assignments/a-inf-even",
        read: false,
        createdAt: "2026-08-25T12:16:00",
      },
    ],
  };
}
