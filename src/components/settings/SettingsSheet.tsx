import { useState } from "react";
import {
  Bell,
  Database,
  Smartphone,
  Globe,
  Info,
  UserPlus,
  Mail,
  ShieldCheck,
  LogOut,
  Trash2,
  UserX,
  Image as ImageIcon,
  CircleDot,
  Eye,
  CheckCheck,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { cn } from "@/lib/utils";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileVisibility = "Everyone" | "My contacts" | "Nobody";
type StatusPrivacy = "Everyone" | "My contacts" | "Selected contacts" | "Nobody";
type Language = "English" | "Español" | "Français" | "Deutsch" | "日本語";

const LANGUAGES: Language[] = ["English", "Español"];

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="px-1 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

function CardSurface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card/60 border border-white/10 backdrop-blur-xl shadow-silver overflow-hidden divide-y divide-white/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function UserCard() {
  return (
    <div className="rounded-2xl bg-gradient-silver border border-white/10 backdrop-blur-xl shadow-silver p-4 flex items-center gap-3">
      <div className="relative shrink-0">
        <div
          className="h-12 w-12 rounded-full grid place-items-center text-sm font-semibold text-primary-foreground ring-1 ring-inset ring-white/30 shadow-silver"
          style={{
            backgroundImage: "linear-gradient(135deg, oklch(0.7 0.24 300), oklch(0.78 0.2 330))",
          }}
        >
          JO
        </div>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon ring-2 ring-card shadow-glow" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">Jordi</p>
        <p className="text-xs text-muted-foreground truncate">jordidev@proton.me</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

function StorageIndicator({ usedGb, totalGb }: { usedGb: number; totalGb: number }) {
  const pct = Math.min(100, Math.round((usedGb / totalGb) * 100));
  return (
    <span className="flex flex-col items-end gap-1 min-w-[88px]">
      <span className="text-xs font-medium text-muted-foreground tabular-nums">
        {usedGb.toFixed(1)} / {totalGb} GB
      </span>
      <span aria-hidden="true" className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
        <span
          className="block h-full rounded-full bg-gradient-neon shadow-glow"
          style={{ width: `${pct}%` }}
        />
      </span>
    </span>
  );
}

interface SimpleSelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
  Icon: LucideIcon;
  danger?: boolean;
}

function SimpleSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  Icon,
  danger = false,
}: SimpleSelectProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <SettingsRow
        Icon={Icon}
        label={label}
        right={
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn(danger ? "text-red-300" : "text-neon")}>{value}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                open && "rotate-90",
              )}
            />
          </span>
        }
        onClick={() => setOpen((v) => !v)}
        danger={danger}
      />
      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="mx-3.5 mb-2 rounded-xl border border-white/10 bg-card/95 backdrop-blur-2xl shadow-silver overflow-hidden"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-3.5 py-2 text-sm transition-colors hover:bg-accent/60 cursor-pointer",
                  selected ? "text-neon" : "text-foreground",
                )}
              >
                <span>{option}</span>
                {selected ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ToggleRow({
  Icon,
  label,
  subtitle,
  checked,
  onChange,
  danger = false,
}: {
  Icon: LucideIcon;
  label: string;
  subtitle?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  danger?: boolean;
}) {
  return (
    <SettingsRow
      as="label"
      Icon={Icon}
      label={label}
      subtitle={subtitle}
      danger={danger}
      right={
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          aria-label={`Toggle ${label}`}
        />
      }
    />
  );
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifSounds, setNotifSounds] = useState(true);
  const [notifPreviews, setNotifPreviews] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>("Everyone");
  const [statusPrivacy, setStatusPrivacy] = useState<StatusPrivacy>("My contacts");
  const [language, setLanguage] = useState<Language>("English");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(24rem,calc(100vw-2rem))] sm:max-w-none gap-0 border-l border-white/10 bg-card/80 backdrop-blur-2xl p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-white/5">
          <SheetTitle className="text-lg">Settings</SheetTitle>
          <SheetDescription>Manage your account, privacy and devices.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          <UserCard />

          <div>
            <SectionHeading>Quick settings</SectionHeading>
            <CardSurface>
              <SettingsRow
                Icon={Bell}
                label="Notifications"
                subtitle="Messages, calls & status"
                onClick={() => onOpenChange(false)}
                right={
                  <span className="flex items-center gap-1.5 text-xs text-neon">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-glow" />
                    On
                  </span>
                }
              />
              <div className="px-3.5 pb-3 pt-1 space-y-2 bg-black/5">
                <label className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Messages</span>
                  <Switch
                    checked={notifMessages}
                    onCheckedChange={setNotifMessages}
                    aria-label="Toggle message notifications"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sounds</span>
                  <Switch
                    checked={notifSounds}
                    onCheckedChange={setNotifSounds}
                    aria-label="Toggle sound notifications"
                  />
                </label>
                <label className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Previews</span>
                  <Switch
                    checked={notifPreviews}
                    onCheckedChange={setNotifPreviews}
                    aria-label="Toggle notification previews"
                  />
                </label>
              </div>
              <SettingsRow
                Icon={Database}
                label="Storage"
                subtitle="Cache, media & downloads"
                right={<StorageIndicator usedGb={2.4} totalGb={15} />}
              />
              <SettingsRow
                Icon={Smartphone}
                label="Linked devices"
                subtitle="3 active sessions"
                onClick={() => onOpenChange(false)}
              />
              <SimpleSelect
                Icon={Globe}
                label="Language"
                value={language}
                options={LANGUAGES}
                onChange={setLanguage}
              />
              <SettingsRow
                Icon={Info}
                label="About"
                subtitle="SilverChat v1.0.0 · build 2026.06.25"
                onClick={() => onOpenChange(false)}
              />
            </CardSurface>
          </div>

          <div>
            <SectionHeading>Advanced</SectionHeading>
            <Accordion type="multiple" className="space-y-2">
              <AccordionItem
                value="account"
                className="rounded-2xl bg-card/60 border border-white/10 backdrop-blur-xl shadow-silver overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="h-7 w-7 grid place-items-center rounded-md bg-gradient-silver border border-white/10 text-neon">
                      <UserPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>
                    Account settings
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    <SettingsRow
                      Icon={UserPlus}
                      label="Add another account"
                      subtitle="Personal, work or shared"
                    />
                    <SettingsRow Icon={Mail} label="Change email" subtitle="jordi@example.com" />
                    <SettingsRow
                      Icon={ShieldCheck}
                      label="Two-factor authentication"
                      badge="Recommended"
                    />
                    <div className="my-1 border-t border-white/5" />
                    <SettingsRow
                      Icon={LogOut}
                      label="Log out"
                      onClick={() => onOpenChange(false)}
                      danger
                    />
                    <SettingsRow
                      Icon={Trash2}
                      label="Delete account"
                      subtitle="Permanent · 30-day recovery"
                      onClick={() => onOpenChange(false)}
                      danger
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="privacy"
                className="rounded-2xl bg-card/60 border border-white/10 backdrop-blur-xl shadow-silver overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="h-7 w-7 grid place-items-center rounded-md bg-gradient-silver border border-white/10 text-neon">
                      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
                    </span>
                    Privacy &amp; security
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    <SettingsRow
                      Icon={UserX}
                      label="Blocked contacts"
                      badge="3"
                      onClick={() => onOpenChange(false)}
                    />
                    <SimpleSelect
                      Icon={ImageIcon}
                      label="Profile photo"
                      value={profileVisibility}
                      options={["Everyone", "My contacts", "Nobody"] as const}
                      onChange={setProfileVisibility}
                    />
                    <ToggleRow
                      Icon={CircleDot}
                      label="Online status"
                      subtitle="Last seen is shown when on"
                      checked={showOnline}
                      onChange={setShowOnline}
                    />
                    <SimpleSelect
                      Icon={Eye}
                      label="Status / stories"
                      value={statusPrivacy}
                      options={["Everyone", "My contacts", "Selected contacts", "Nobody"] as const}
                      onChange={setStatusPrivacy}
                    />
                    <ToggleRow
                      Icon={CheckCheck}
                      label="Read receipts"
                      subtitle="Let others know when you’ve read their messages"
                      checked={readReceipts}
                      onChange={setReadReceipts}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="border-t border-white/5 px-5 py-3 text-[11px] text-muted-foreground text-center">
          End-to-end encrypted · SilverChat
        </div>
      </SheetContent>
    </Sheet>
  );
}
