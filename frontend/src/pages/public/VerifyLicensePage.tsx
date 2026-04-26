import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const fetchVerification = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/v1/public/verify/${id}`);
  return res.data;
};

export function VerifyLicensePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verifyLicense', id],
    queryFn: () => fetchVerification(id!),
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-500 font-medium">Verifying License...</p>
        </div>
      </div>
    );
  }

  const isVerified = !isError && data?.success && data?.data?.status === 'APPROVED';
  const isInvalid = !isError && data?.success && data?.data?.status !== 'APPROVED';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-slate-100">
        {isVerified ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10 bg-white rounded-full" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">VALID LICENSE</h1>
            <p className="text-slate-500 mb-8">This Trade License is verified and authentic.</p>
            
            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">License ID</p>
                <p className="text-sm font-mono text-slate-700">{data.data.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">License Type</p>
                <p className="text-sm font-medium">{data.data.licenseType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Owner Initials</p>
                <p className="text-sm font-medium">{data.data.ownerInitials}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">Date of Issue</p>
                <p className="text-sm font-medium">{new Date(data.data.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </>
        ) : isInvalid ? (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">INVALID LICENSE</h1>
            <p className="text-slate-500">
              This license exists but its status is currently <span className="font-semibold">{data?.data?.status}</span>. It is not approved for use.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">LICENSE NOT FOUND</h1>
            <p className="text-slate-500">
              The requested license could not be verified in our systems. It may be fraudulent.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
