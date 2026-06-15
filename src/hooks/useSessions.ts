import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listActiveSessions, revokeSession } from "@/services/sessionService";

export function useActiveSessions() {
  const listFn = useServerFn(listActiveSessions);
  return useQuery({
    queryKey: ["admin-sessions"],
    queryFn: () => listFn(),
  });
}

export function useRevokeSession() {
  const revokeFn = useServerFn(revokeSession);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sessionId: string) => revokeFn({ data: { sessionId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
    },
  });
}
