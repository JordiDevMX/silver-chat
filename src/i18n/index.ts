import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { defaultNS, resources } from "@/i18n/resources";

// Initialize the shared i18next instance once at module load. Imported as a
// side-effect from `src/routes/__root.tsx` so the language detector runs
// (reading `localStorage["lng"]` and falling back to the browser language)
// before any route renders. `react-i18next` then re-renders every
// `useTranslation()` consumer on `i18n.changeLanguage()` without a provider.
if (!i18n.isInitialized) {
  void i18n.use(LanguageDetector).use(initReactI18next).init({
    resources,
    defaultNS,
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      // React already escapes interpolated values, so i18next's own
      // escaping would double-escape entities like `&amp;`.
      escapeValue: false,
    },
    detection: {
      // localStorage takes precedence so the user's explicit choice wins;
      // then the browser language; finally the <html lang> tag.
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "lng",
      // Persist the resolved language back to localStorage so the choice
      // survives reloads. `supportedLngs` already guarantees only `en`/`es`
      // are stored — anything else falls through to `fallbackLng`.
      caches: ["localStorage"],
    },
    react: {
      bindI18n: "languageChanged loaded",
      useSuspense: false,
    },
  });
}

export default i18n;