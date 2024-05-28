
import { LoaderCircle } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex justify-center items-center h-[100dvh]">
      <LoaderCircle className="animate-spin"/>
    </div>
  );
}

export default loading;
