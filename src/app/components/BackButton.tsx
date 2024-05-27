'use client'
import { useRouter } from "next/navigation";
import React from "react";
import { ChevronLeft } from "lucide-react";

function BackButton() {
  const route = useRouter();
  return (
    <button onClick={() => route.back()}>
      <ChevronLeft />
    </button>
  );
}

export default BackButton;
