import React from "react";
import UpwardArrowIcon from "./svgComponent/UpwardArrowIcon";
import DownwardArrowIcon from "./svgComponent/DownwardArrowIcon";

function DashboardCard({ title, desc, isPositive, value }: DashboardCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 " id={title}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
            {desc.toLocaleString()}
          </span>
          <h3 className="text-base font-normal text-gray-500">{title}</h3>
        </div>
        {isPositive ? (
          <div className="ml-5 w-0 flex items-center justify-end flex-1 text-green-500 text-base font-bold">
            {value.toLocaleString()}%
            <UpwardArrowIcon />
          </div>
        ) : (
          <div className="ml-5 w-0 flex items-center justify-end flex-1 text-red-500 text-base font-bold">
            {value.toLocaleString()}%
            <DownwardArrowIcon />
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;

export interface DashboardCardProps {
  title: string;
  desc: number;
  value: number;
  isPositive: boolean;
}
