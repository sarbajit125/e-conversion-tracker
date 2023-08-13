import { formatAmount, getServiceName, getUserInitials } from "@/lib/utils";
import React from "react";

function DashboardUserRow({
  fullname,
  recentTransaction,
  currencyCode,
  key,
  serviceType
}: DashboardUserRowProps) {
  return (
    <div className="flex items-center space-x-4" key={key}>
      <div className="flex-shrink-0">
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {getUserInitials(fullname)}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fullname}</p>
        <p className="text-sm text-gray-500 truncate">{getServiceName(serviceType)}</p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900">
        {formatAmount(recentTransaction, currencyCode)}
      </div>
    </div>
  );
}

export default DashboardUserRow;

export interface DashboardUserRowProps {
  fullname: string;
  recentTransaction: number;
  currencyCode: string;
  key: string;
  serviceType: string;
}
