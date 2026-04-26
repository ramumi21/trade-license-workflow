import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step2AttachmentsSchema, type Step2FormValues } from "../../schemas";
import { useUploadAttachment } from "../../api";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Step2Attachments({ applicationId, onSuccess }: { applicationId: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const uploadAttachment = useUploadAttachment(applicationId);

  const form = useForm<Step2FormValues>({
    resolver: zodResolver(Step2AttachmentsSchema),
    defaultValues: { documentType: "PASSPORT" }
  });

  const onSubmit = async (data: Step2FormValues) => {
    try {
      if (!data.file || data.file.length === 0) throw new Error("File is required");
      const file = data.file[0];
      await uploadAttachment.mutateAsync({ file, documentType: data.documentType });
      toast({ title: "Success", description: "Attachment uploaded! Please proceed to payment." });
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to upload attachment", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PASSPORT">Passport</SelectItem>
                  <SelectItem value="TRADE_LICENSE">Existing License</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Document File</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*,.pdf" 
                  onChange={(e) => onChange(e.target.files)} 
                  {...fieldProps} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={uploadAttachment.isPending}>
            {uploadAttachment.isPending ? "Uploading..." : "Next: Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
