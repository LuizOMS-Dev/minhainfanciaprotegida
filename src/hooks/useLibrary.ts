import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAdminLibraryItems, deleteAdminLibraryItem } from "@/services/libraryService";

export function useListAdminLibrary(search?: string, tags?: string) {
  const listFn = useServerFn(listAdminLibraryItems);
  return useQuery({
    queryKey: ["admin-library", search, tags],
    queryFn: () => listFn({ data: { search, tags } }),
  });
}

export function useDeleteAdminLibraryItem() {
  const deleteFn = useServerFn(deleteAdminLibraryItem);
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-library"] });
    },
  });
}
