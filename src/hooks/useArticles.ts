import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAdminArticles, deleteAdminArticle } from "@/services/articleService";

export function useListAdminArticles(filters: any) {
  const listFn = useServerFn(listAdminArticles);
  return useQuery({
    queryKey: ["admin-articles", filters],
    queryFn: () => listFn({ data: filters }),
  });
}

export function useDeleteAdminArticle() {
  const deleteFn = useServerFn(deleteAdminArticle);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
}
