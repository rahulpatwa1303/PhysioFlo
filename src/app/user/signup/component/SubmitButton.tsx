"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

export const SubmitButton = ({ disabled }: { disabled: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <button
      className="bg-teal-600 w-full py-2 px-8 rounded-xl shadow-md !text-white disabled:cursor-not-allowed disabled:bg-teal-600/40 transition flex justify-center gap-4"
      disabled={pending || !disabled}
    >
      Submit {pending && <LoaderCircle className="animate-spin " />}
    </button>
  );
};
