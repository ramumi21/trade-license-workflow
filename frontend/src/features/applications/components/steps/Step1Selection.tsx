import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Step1FormValues, Step1SelectionSchema } from "../../schemas";
import { useCreateApplication } from "../../api";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Step1Selection({ onSuccess }: { onSuccess: (id: string) => void }) {
  const { toast } = useToast();
  const createApplication = useCreateApplication();
  
  const form = useForm<Step1FormValues>({
    resolver: zodResolver(Step1SelectionSchema),
    defaultValues: { licenseType: "" }
  });

  const onSubmit = async (data: Step1FormValues) => {
    try {
      const app = await createApplication.mutateAsync(data);
      toast({ title: "Success", description: "Application created! Please proceed to attachments." });
      onSuccess(app.id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create application", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="licenseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a license type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TRADE_LICENSE">Standard Trade License</SelectItem>
                  <SelectItem value="COMMERCIAL_LICENSE">Commercial License</SelectItem>
                  <SelectItem value="PROFESSIONAL_LICENSE">Professional License</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={createApplication.isPending}>
            {createApplication.isPending ? "Creating..." : "Next: Attachments"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
