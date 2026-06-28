import { AlertTriangle } from "lucide-react";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-destructive/10 border border-destructive/30 grid place-items-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="min-w-0">
              <DialogTitle>Delete chat?</DialogTitle>
              <DialogDescription>
                This will permanently delete the conversation with{" "}
                <span className="font-medium text-foreground">{chatName}</span>{" "}
                for you. The other person will still have their copy.
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
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
