import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Mail,
  UserPlus,
  ShieldCheck,
  LogOut,
  Trash2,
  Eye,
  Camera,
  Globe,
  AtSign,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SectionHeading, CardSurface } from "@/components/settings/SettingsSheet";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ProfileDetailsProps {
  /** Called when any destructive / log-out action is triggered — the
   *  parent Sheet closes so the user lands back on the main view. */
  onAction?: () => void;
}

/**
 * Dedicated "Profile Details" sub-view rendered inside the Settings Sheet
 * (in-place view swap — see `SettingsSheet`'s `view` state).
 *
 * Consolidates identity, contact, social links, and account/security
 * management into one cohesive surface. The account operations previously
 * lived inside the "Account settings" accordion in the main settings view;
 * they are migrated here unchanged (same icons, copy, color tokens).
 */
export function ProfileDetails({ onAction }: ProfileDetailsProps) {
  const { t } = useTranslation();

  // Inline editable fields — local mock state (no backend persistence).
  const [displayName, setDisplayName] = useState("Jordi");
  const [username, setUsername] = useState("jordidev");

  // Avatar action sheet — bottom sheet triggered by tapping the avatar.
  const [photoSheetOpen, setPhotoSheetOpen] = useState(false);

  return (
    <div className="px-3 py-4 space-y-5">
      {/* ── Visual identity ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 pb-2">
        <button
          type="button"
          onClick={() => setPhotoSheetOpen(true)}
          aria-label={t("settings.photoActionsTitle")}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        >
          <div className="relative">
            <div
              className="h-20 w-20 rounded-full grid place-items-center text-xl font-semibold text-primary-foreground ring-1 ring-inset ring-white/30 shadow-silver"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.7 0.24 300), oklch(0.78 0.2 330))",
              }}
            >
              JO
            </div>
            <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-neon ring-2 ring-card shadow-glow grid place-items-center">
              <Camera className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={2.5} />
            </span>
          </div>
        </button>

        <InlineInput
          label={t("settings.displayName")}
          placeholder={t("settings.displayNamePlaceholder")}
          value={displayName}
          onChange={setDisplayName}
        />
        <InlineInput
          label={t("settings.username")}
          placeholder={t("settings.usernamePlaceholder")}
          value={username}
          onChange={setUsername}
          prefix="@"
        />
      </div>

      {/* ── Contact ────────────────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("settings.contact")}</SectionHeading>
        <CardSurface>
          <SettingsRow
            Icon={Mail}
            label={t("settings.changeEmail")}
            subtitle="jordidev@proton.me"
            onClick={onAction}
          />
        </CardSurface>
      </div>

      {/* ── Social & web links ─────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("settings.socialLinks")}</SectionHeading>
        <CardSurface>
          <SettingsRow
            Icon={AtSign}
            label={t("settings.twitterHandle")}
            subtitle="@jordi"
            onClick={onAction}
          />
          <SettingsRow
            Icon={Globe}
            label={t("settings.websiteLabel")}
            subtitle="jordi.dev"
            onClick={onAction}
          />
          <SettingsRow
            Icon={Plus}
            label={t("settings.addLink")}
            subtitle={t("settings.addLinkSub")}
            onClick={onAction}
          />
        </CardSurface>
      </div>

      {/* ── Security & account ─────────────────────────────────────── */}
      <div>
        <SectionHeading>{t("settings.securityAccount")}</SectionHeading>
        <CardSurface>
          <SettingsRow
            Icon={UserPlus}
            label={t("settings.addAnotherAccount")}
            subtitle={t("settings.addAnotherAccountSub")}
            onClick={onAction}
          />
          <SettingsRow
            Icon={ShieldCheck}
            label={t("settings.twoFactor")}
            badge={t("settings.twoFactorBadge")}
            onClick={onAction}
          />
        </CardSurface>
      </div>

      {/* Destructive actions aligned at the very bottom. Same red color
          tokens as the old accordion — `danger` prop on SettingsRow
          applies `text-red-400` + red icon tile. */}
      <CardSurface>
        <SettingsRow
          Icon={LogOut}
          label={t("settings.logOut")}
          onClick={onAction}
          danger
        />
        <SettingsRow
          Icon={Trash2}
          label={t("settings.deleteAccount")}
          subtitle={t("settings.deleteAccountSub")}
          onClick={onAction}
          danger
        />
      </CardSurface>

      {/* ── Avatar action sheet (bottom sheet) ──────────────────────── */}
      <Sheet open={photoSheetOpen} onOpenChange={setPhotoSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t border-white/10 bg-card/80 backdrop-blur-2xl p-0 flex flex-col gap-0"
        >
          <SheetHeader className="px-5 pt-4 pb-2 border-b border-white/5">
            <SheetTitle className="text-sm">{t("settings.photoActionsTitle")}</SheetTitle>
            <SheetDescription className="text-xs">
              {t("settings.photoActionsDesc")}
            </SheetDescription>
          </SheetHeader>
          <div className="py-1 divide-y divide-white/5">
            <PhotoActionRow Icon={Eye} label={t("settings.viewPhoto")} onClick={() => setPhotoSheetOpen(false)} />
            <PhotoActionRow
              Icon={Camera}
              label={t("settings.takePhoto")}
              subtitle={t("settings.takePhotoSub")}
              onClick={() => setPhotoSheetOpen(false)}
            />
            <PhotoActionRow Icon={ImageIcon} label={t("settings.uploadFromGallery")} onClick={() => setPhotoSheetOpen(false)} />
            <PhotoActionRow Icon={Trash2} label={t("settings.removePhoto")} danger onClick={() => setPhotoSheetOpen(false)} />
          </div>
          <div className="border-t border-white/5">
            <PhotoActionRow
              label={t("settings.cancelAction")}
              onClick={() => setPhotoSheetOpen(false)}
              centered
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ── Internal sub-components ────────────────────────────────────────────

/** Inline editable text field — transparent input with a tiny label.
 *  The whole stack is the interactive element (no floating edit button). */
function InlineInput({
  label,
  placeholder,
  value,
  onChange,
  prefix,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (next: string) => void;
  prefix?: string;
}) {
  return (
    <div className="w-full">
      <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <label
        className={cn(
          "flex items-center w-full rounded-xl bg-card/60 border border-white/10 backdrop-blur-xl",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 transition",
        )}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground select-none">{prefix}</span>
        ) : null}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-2.5"
        />
      </label>
    </div>
  );
}

/** Compact row inside the bottom avatar action sheet. Mirrors the
 *  SettingsRow visual language (icon tile + bold label + optional
 *  subtitle) but tuned for a vertical action list. */
function PhotoActionRow({
  Icon,
  label,
  subtitle,
  onClick,
  danger = false,
  centered = false,
}: {
  Icon?: LucideIcon;
  label: string;
  subtitle?: string;
  onClick: () => void;
  danger?: boolean;
  centered?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
        "hover:bg-accent/60 active:bg-accent cursor-pointer",
        danger ? "text-red-400" : "text-foreground",
        centered && "justify-center",
      )}
    >
      {Icon ? (
        <span
          className={cn(
            "h-8 w-8 grid place-items-center rounded-lg shrink-0 border",
            danger
              ? "bg-red-500/10 border-red-500/25 text-red-400"
              : "bg-gradient-silver border-white/10 text-neon",
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
      ) : null}
      <span className="flex-1 min-w-0">
        <span className={cn("block text-sm font-medium", centered && "text-center")}>
          {label}
        </span>
        {subtitle ? (
          <span className="block text-xs text-muted-foreground truncate">{subtitle}</span>
        ) : null}
      </span>
    </button>
  );
}

