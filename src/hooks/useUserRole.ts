import { useQuery } from "@tanstack/react-query";
import { getMyRoles } from "@/lib/admin.functions";

export function useUserRole() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => getMyRoles(),
    staleTime: 60_000,
  });

  const roles = data?.roles ?? [];
  const isAdmin = roles.includes("admin");
  const isEditor = roles.includes("editor");
  const isReviewer = roles.includes("reviewer");
  const isViewer = roles.includes("viewer");

  return {
    roles,
    isAdmin,
    isEditor,
    isReviewer,
    isViewer,
    isLoading,
    error,
  };
}
