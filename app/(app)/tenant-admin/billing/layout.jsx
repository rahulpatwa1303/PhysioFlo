"use client";

import { usePathname } from 'next/navigation';

const BillingLayout = ({ children }) => {
  const pathname = usePathname();
  
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
};

export default BillingLayout;
