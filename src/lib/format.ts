import i18n from "@/i18n";

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Resolves the active locale for `toLocaleDateString`. Reads the live i18next
 * instance so date separators re-render in the user's language without each
 * call site threading a locale through props. Falls back to the browser
 * default if i18next hasn't initialized yet (e.g. during prerender).
 */
function activeLocale(): string | undefined {
  return i18n.isInitialized ? i18n.language : undefined;
}

export function formatMessageDate(date: Date, now: Date = new Date()): string {
  const target = startOfDay(date);
  const today = startOfDay(now);
  const diffDays = Math.round((today.getTime() - target.getTime()) / MS_PER_DAY);

  if (diffDays === 0) return i18n.t("dates.today");
  if (diffDays === 1) return i18n.t("dates.yesterday");

  const locale = activeLocale();

  if (diffDays > 1 && diffDays < 7) {
    return date.toLocaleDateString(locale, { weekday: "long" });
  }

  if (target.getFullYear() === today.getFullYear()) {
    return date.toLocaleDateString(locale, { month: "long", day: "numeric" });
  }

  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString(activeLocale(), {
    hour: "2-digit",
    minute: "2-digit",
  });
}