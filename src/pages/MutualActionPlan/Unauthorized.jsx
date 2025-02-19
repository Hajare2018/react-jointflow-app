import { useMutation } from '@tanstack/react-query';
import { Button } from '../../component-lib/catalyst/button';
import { useUserContext } from '../../context/UserContext';
import HttpClient from '../../Api/HttpClient';
import { useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Unauthorized() {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { accessToken } = useUserContext();
  const mutation = useMutation({
    mutationFn: async () => {
      return HttpClient.postReactivationMail({
        token: {
          jwt_token: accessToken,
        },
      });
    },
    onSuccess: () => {
      setShowSnackbar(true);
    },
  });

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="relative">
        <div className="text-center shadow-sm border rounded p-6 bg-slate-50">
          <h1 className="text-lg text-slate-900 mb-4">Session expired!</h1>
          <p className="mb-4">Your access has expired, click to receive a new access link.</p>
          <Button
            color="rose"
            onClick={() => {
              mutation.mutate();
            }}
          >
            Get access email
          </Button>
        </div>
        {showSnackbar && (
          <div className="absolute top-44 left-0 right-0 flex justify-center">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <CheckCircleIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-green-400"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Email sent if exists</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                      onClick={() => setShowSnackbar(false)}
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
