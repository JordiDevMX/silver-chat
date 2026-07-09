import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useTabItems } from "@/constants/tabs";
import { useNavBadges } from "@/hooks/useNotifications";
import type { TabKey } from "@/types/chat";

interface FooterProps {
  active: TabKey;
}

export function Footer({ active }: FooterProps) {
  const { t } = useTranslation();
  const tabs = useTabItems();
  const badges = useNavBadges();
  return (
    <nav className="sticky bottom-0 z-30 bg-gradient-silver border-t border-border/60 backdrop-blur-xl">
      <ul className="grid grid-cols-4 px-2 pt-1.5 pb-2">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          const badge = badges[key];
          return (
            <li key={key}>
              <Link
                to="/"
                search={{ tab: key }}
                aria-current={isActive ? "page" : undefined}
                className="group w-full flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors"
              >
                <span
                  className={[
                    "relative grid place-items-center h-9 w-16 rounded-full transition-all",
                    isActive
                      ? "bg-gradient-neon text-primary-foreground shadow-glow"
                      : "text-muted-foreground group-hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none grid place-items-center ring-2 ring-background">
                      {badge > 99 ? t("nav.badgeOverflow") : badge}
                    </span>
                  )}
                </span>
                <span
                  className={[
                    "text-[11px] font-medium tracking-tight transition-colors",
                    isActive ? "text-neon" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}