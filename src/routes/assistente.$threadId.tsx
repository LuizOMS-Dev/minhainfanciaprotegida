import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import { AssistantChat } from "@/components/site/AssistantChat";
import { useChatThreads } from "@/hooks/use-chat-threads";

export const Route = createFileRoute("/assistente/$threadId")({
  component: AssistantThreadPage,
});

function AssistantThreadPage() {
  const { threadId } = Route.useParams();
  const { getThread, updateMessages } = useChatThreads();
  const thread = getThread(threadId);

  const handleChange = useCallback(
    (messages: Parameters<typeof updateMessages>[1]) => {
      updateMessages(threadId, messages);
    },
    [threadId, updateMessages],
  );

  return (
    <AssistantChat
      key={threadId}
      threadId={threadId}
      initialMessages={thread?.messages ?? []}
      onMessagesChange={handleChange}
    />
  );
}
