import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Step3PaymentSchema, type Step3FormValues } from "../../schemas";
import { useSettlePayment, useSubmitApplication } from "../../api";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Step3Payment({ applicationId, onSuccess }: { applicationId: string; onSuccess: () => void }) {
  const { toast } = useToast();
  const settlePayment = useSettlePayment(applicationId);
  const submitApplication = useSubmitApplication(applicationId);

  const form = useForm<Step3FormValues>({
    resolver: zodResolver(Step3PaymentSchema),
    defaultValues: { amount: 100, currency: "USD", transactionId: `TXN-${Date.now()}` }
  });

  const onSubmit = async (data: Step3FormValues) => {
    try {
      // 1. Settle Payment
      await settlePayment.mutateAsync(data);
      toast({ title: "Payment Successful", description: "Your payment was processed." });

      // 2. Auto-Submit to transition to PENDING
      await submitApplication.mutateAsync();
      toast({ title: "Application Submitted", description: "Your application is now pending review." });
      
      onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to process payment and submit", variant: "destructive" });
    }
  };

  const isPending = settlePayment.isPending || submitApplication.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Pay</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID (Simulation)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Processing..." : "Pay & Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
