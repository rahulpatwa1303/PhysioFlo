
import { LoaderCircle } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="animate-spin">
      <LoaderCircle />
    </div>
  );
}

export default loading;
