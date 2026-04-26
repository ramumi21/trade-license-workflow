import { SignUp } from "@clerk/clerk-react";
import { ShieldCheck } from "lucide-react";

export function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4">
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <div className="flex items-center space-x-2 text-primary">
          <ShieldCheck className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight text-slate-900">TradeLink Ethiopia</span>
        </div>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </div>
    </div>
  );
}
