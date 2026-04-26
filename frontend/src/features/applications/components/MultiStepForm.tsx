import { useState } from "react";
import { Step1Selection } from "./steps/Step1Selection";
import { Step2Attachments } from "./steps/Step2Attachments";
import { Step3Payment } from "./steps/Step3Payment";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFinish = () => {
    navigate("/"); // Or to a success page
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Trade License Application</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Step 1: Select License Type"}
            {currentStep === 2 && "Step 2: Upload Attachments"}
            {currentStep === 3 && "Step 3: Settle Payment"}
            {currentStep === 4 && "Application Complete"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Step1Selection 
              onSuccess={(id) => {
                setApplicationId(id);
                setCurrentStep(2);
              }} 
            />
          )}
          {currentStep === 2 && applicationId && (
            <Step2Attachments 
              applicationId={applicationId} 
              onSuccess={() => setCurrentStep(3)} 
            />
          )}
          {currentStep === 3 && applicationId && (
            <Step3Payment 
              applicationId={applicationId} 
              onSuccess={() => setCurrentStep(4)} 
            />
          )}
          {currentStep === 4 && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Application Successfully Submitted!</h2>
              <p className="text-muted-foreground mb-8">Your application is now pending review. You can track its status in your dashboard.</p>
              <Button onClick={handleFinish}>Return to Dashboard</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
