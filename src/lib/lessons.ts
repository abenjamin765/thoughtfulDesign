import { getCollection } from 'astro:content';

export type LessonEntry = Awaited<ReturnType<typeof getPublishedLessons>>[number];

export async function getPublishedLessons() {
  const lessons = await getCollection('lessons');
  return lessons
    .filter((lesson) => lesson.data.published)
    .sort((a, b) => {
      if (a.data.module !== b.data.module) {
        return a.data.module.localeCompare(b.data.module);
      }
      return a.data.order - b.data.order;
    });
}

export function groupLessonsByModule(lessons: LessonEntry[]) {
  const modules = new Map<string, LessonEntry[]>();

  for (const lesson of lessons) {
    const existing = modules.get(lesson.data.module) ?? [];
    existing.push(lesson);
    modules.set(lesson.data.module, existing);
  }

  return [...modules.entries()].map(([name, moduleLessons]) => ({
    name,
    lessons: moduleLessons,
  }));
}

export function getLessonSlug(lesson: LessonEntry) {
  const filename = lesson.id.split('/').pop() ?? lesson.id;
  return filename.replace(/\.mdx?$/, '');
}
