import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAuditLogs } from "@/services/auditService";

export function useAuditLogs(filters: any) {
  const listFn = useServerFn(listAuditLogs);
  return useQuery({
    queryKey: ["admin-audit-logs", filters],
    queryFn: () => listFn({ data: filters }),
  });
}
