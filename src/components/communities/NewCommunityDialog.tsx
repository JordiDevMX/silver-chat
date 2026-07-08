import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export type NewCommunityFormValues = {
  name: string;
  description?: string;
};

interface NewCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with validated values when the form is submitted. */
  onCreate?: (values: NewCommunityFormValues) => void;
}

export function NewCommunityDialog({ open, onOpenChange, onCreate }: NewCommunityDialogProps) {
  const { t } = useTranslation();

  // The schema's validation messages are translated, so the resolver must be
  // rebuilt when the active language changes. `useMemo` keyed on `t` keeps
  // the resolver in sync while preserving referential stability across
  // renders within the same locale.
  const resolver = useMemo(() => {
    const schema = z.object({
      name: z
        .string()
        .trim()
        .min(2, t("communities.validation.nameMin"))
        .max(50, t("communities.validation.nameMax")),
      description: z
        .string()
        .trim()
        .max(200, t("communities.validation.descMax"))
        .optional()
        .or(z.literal("")),
    });
    return zodResolver(schema);
  }, [t]);

  const form = useForm<NewCommunityFormValues>({
    resolver,
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onTouched",
  });

  // Reset the form whenever the dialog re-opens so a previous draft
  // doesn't leak into a fresh session.
  useEffect(() => {
    if (open) form.reset({ name: "", description: "" });
  }, [open, form]);

  function onSubmit(values: NewCommunityFormValues) {
    onCreate?.(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-gradient-silver border border-border grid place-items-center shadow-silver shrink-0">
              <Users className="h-5 w-5 text-foreground/80" />
            </div>
            <div className="min-w-0">
              <DialogTitle>{t("communities.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("communities.dialogDesc")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("communities.name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("communities.namePlaceholder")}
                      autoComplete="off"
                      maxLength={50}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("communities.nameDesc")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("communities.description")}{" "}
                    <span className="text-muted-foreground font-normal">
                      {t("communities.optional")}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("communities.descriptionPlaceholder")}
                      className="resize-none min-h-[80px]"
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("communities.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-gradient-neon text-primary-foreground shadow-glow hover:brightness-110"
              >
                {t("communities.createCommunity")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}