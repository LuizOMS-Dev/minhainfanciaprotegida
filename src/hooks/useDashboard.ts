import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminOverview, getRecentActivity } from "@/services/dashboardService";

export function useDashboardOverview() {
  const overviewFn = useServerFn(getAdminOverview);
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => overviewFn(),
    refetchInterval: 60_000,
  });
}

export function useDashboardActivity(limit: number = 15) {
  const activityFn = useServerFn(getRecentActivity);
  return useQuery({
    queryKey: ["admin-recent-activity", limit],
    queryFn: () => activityFn({ data: { limit } }),
    refetchInterval: 60_000,
  });
}
