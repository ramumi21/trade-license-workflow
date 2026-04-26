import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

export const useDashboardAnalytics = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: async () => {
      const response = await api.get("/analytics/dashboard");
      return response.data?.data || response.data;
    },
  });
};
