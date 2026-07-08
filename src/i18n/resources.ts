import en from "@/locales/en/translation.json";
import es from "@/locales/es/translation.json";

export const appLocales = ["en", "es"] as const;
export type AppLocale = (typeof appLocales)[number];

export const defaultNS = "translation" as const;

export const resources = {
  en: { [defaultNS]: en },
  es: { [defaultNS]: es },
} as const;

// Type-safe `t()` keys auto-derived from the English dictionary shape.
// See https://react.i18next.com/typescript — augmenting only
// `i18next.CustomTypeOptions` is the canonical pattern; `react-i18next`
// reads `resources`/`defaultNS`/`returnNull` from this declaration.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    returnNull: false;
  }
}