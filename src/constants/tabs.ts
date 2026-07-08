import { MessageCircle, CircleDot, Users, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TabKey } from "@/types/chat";

export interface TabItem {
  key: TabKey;
  label: string;
  Icon: typeof MessageCircle;
}

// Icon + translation-key are co-located here so `MobileTabBar`,
// `DesktopNavRail`, and the legacy `Footer` share a single mental model
// for the four primary tabs. Only the `label` is localizable; the icon
// glyph is the same across locales.
const TAB_ICONS: Record<TabKey, typeof MessageCircle> = {
  chats: MessageCircle,
  updates: CircleDot,
  communities: Users,
  calls: Phone,
};

const TAB_LABEL_KEY: Record<TabKey, `nav.${TabKey}`> = {
  chats: "nav.chats",
  updates: "nav.updates",
  communities: "nav.communities",
  calls: "nav.calls",
};

/** Returns the four primary nav tabs with locale-aware labels. */
export function useTabItems(): TabItem[] {
  const { t } = useTranslation();
  return (Object.keys(TAB_ICONS) as TabKey[]).map((key) => ({
    key,
    label: t(TAB_LABEL_KEY[key]),
    Icon: TAB_ICONS[key],
  }));
}