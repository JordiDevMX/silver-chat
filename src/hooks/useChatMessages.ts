import { useOptimistic, useTransition } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMessages } from "@/data/mockMessages";
import { formatMessageTime } from "@/lib/format";
import type { Msg } from "@/types/chat";

export const messagesQueryKey = (chatId: string) => ["messages", chatId] as const;

const SIMULATED_LATENCY_MS = 450;

function makeTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface SendMessageInput {
  text: string;
  previousId: string;
}

async function sendMessageFn(input: SendMessageInput): Promise<Msg> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  return {
    id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: input.text,
    time: formatMessageTime(new Date()),
    date: new Date(),
    fromSelf: true,
    status: "sent",
  };
}

export interface UseChatMessagesResult {
  messages: Msg[];
  isLoading: boolean;
  isSending: boolean;
  error: Error | null;
  send: (text: string) => void;
}

export function useChatMessages(chatId: string): UseChatMessagesResult {
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const query = useQuery<Msg[]>({
    queryKey: messagesQueryKey(chatId),
    queryFn: () => getMessages(chatId),
    staleTime: 30_000,
  });

  const mutation = useMutation({
    mutationFn: sendMessageFn,
    onSuccess: (saved) => {
      queryClient.setQueryData<Msg[]>(messagesQueryKey(chatId), (old) => [...(old ?? []), saved]);
    },
    onError: () => {
      toast.error("Failed to send", {
        description: "Your message wasn't delivered. Check your internet connection & try again.",
      });
    },
  });

  const [optimisticMessages, addOptimistic] = useOptimistic<Msg[], Msg>(
    query.data ?? [],
    (current, optimistic) => [...current, optimistic],
  );

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tempId = makeTempId();
    const optimistic: Msg = {
      id: tempId,
      text: trimmed,
      time: formatMessageTime(new Date()),
      date: new Date(),
      fromSelf: true,
      status: "pending",
    };

    startTransition(async () => {
      addOptimistic(optimistic);
      try {
        await mutation.mutateAsync({
          text: trimmed,
          previousId: tempId,
        });
      } catch {
        // Optimistic entry will be discarded automatically when the
        // transition ends without a corresponding cache update.
      }
    });
  }

  return {
    messages: optimisticMessages,
    isLoading: query.isLoading,
    isSending: mutation.isPending,
    error: query.error ?? mutation.error,
    send,
  };
}
