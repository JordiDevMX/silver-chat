import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users } from "lucide-react";
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

const newCommunitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Community name must be at least 2 characters")
    .max(50, "Community name must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional()
    .or(z.literal("")),
});

export type NewCommunityFormValues = z.infer<typeof newCommunitySchema>;

interface NewCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with validated values when the form is submitted. */
  onCreate?: (values: NewCommunityFormValues) => void;
}

export function NewCommunityDialog({ open, onOpenChange, onCreate }: NewCommunityDialogProps) {
  const form = useForm<NewCommunityFormValues>({
    resolver: zodResolver(newCommunitySchema),
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
              <DialogTitle>New community</DialogTitle>
              <DialogDescription>
                Build a space for your team, class, or group.
              </DialogDescription>
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Neon Architects"
                      autoComplete="off"
                      maxLength={50}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Visible to everyone in the community.
                  </FormDescription>
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
                    Description{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What's this community about?"
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-gradient-neon text-primary-foreground shadow-glow hover:brightness-110"
              >
                Create community
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
