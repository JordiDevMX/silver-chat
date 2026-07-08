import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Display name shown in the confirmation copy. */
  chatName: string;
  /** Fires when the user confirms. Parent handles the actual deletion. */
  onConfirm: () => void;
}

/**
 * Destructive confirmation dialog. Uses the dialog primitive so the
 * overlay, focus trap, and Escape-to-close all come for free. The
 * destructive button is a solid destructive variant (not the neon
 * gradient) to visually communicate the dangerous action.
 */
export function DeleteChatDialog({
  open,
  onOpenChange,
  chatName,
  onConfirm,
}: DeleteChatDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-destructive/10 border border-destructive/30 grid place-items-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <DialogTitle>{t("chat.deleteTitle")}</DialogTitle>
              <DialogDescription>
                {t("chat.deleteDesc", { name: chatName })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("chat.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t("chat.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
