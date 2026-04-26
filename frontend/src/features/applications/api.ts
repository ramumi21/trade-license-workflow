import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/useApi";

import type { Step1FormValues, Step3FormValues, Application } from "./schemas";



export const useCreateApplication = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async (data: Step1FormValues) => {
      const response = await api.post("/applications", data);
      return response.data?.data || response.data;
    },
  });
};

import { useQuery } from "@tanstack/react-query";

export const useCustomerApplications = () => {
  const api = useApi();
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await api.get("/applications");
      return (response.data?.data || response.data || []) as Application[];
    },
  });
};



export const useUploadAttachment = (applicationId: string | null) => {

  const api = useApi();

  return useMutation({

    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {

      if (!applicationId) throw new Error("Application ID missing");

      const formData = new FormData();

      formData.append("file", file);

      formData.append("documentType", documentType);



      const response = await api.post(`/applications/${applicationId}/attachments`, formData, {

        headers: {

          "Content-Type": "multipart/form-data",

        },

      });

      return response.data;

    },

  });

};



export const useSettlePayment = (applicationId: string | null) => {

  const api = useApi();

  return useMutation({

    mutationFn: async (data: Step3FormValues) => {

      if (!applicationId) throw new Error("Application ID missing");

      const response = await api.post(`/applications/${applicationId}/payment`, data);

      return response.data;

    },

  });

};



export const useSubmitApplication = (applicationId: string | null) => {

  const api = useApi();

  const queryClient = useQueryClient();



  return useMutation({

    mutationFn: async () => {

      if (!applicationId) throw new Error("Application ID missing");

      const response = await api.post(`/applications/${applicationId}/submit`);

      return response.data;

    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["pendingReviews"] });
    }

  });

};