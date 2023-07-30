import React from "react";

function DashboardUserRow({fullname, recentTransaction}:DashboardUserRowProps ) {

    const getUserInitials = (fullname: string): string => {
        let initials = ""
        const nameArr: string[] = fullname.split(" ")
        const firstNameFirst= nameArr[0].charAt(0).toUpperCase()
        initials = firstNameFirst
        if (nameArr.length > 0) {
            const lastNameFirst = nameArr[1].charAt(0).toUpperCase()
            initials += lastNameFirst
        }
        return initials

    }
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
      <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
    <span className="font-medium text-gray-600 dark:text-gray-300">{getUserInitials(fullname)}</span>
</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{fullname}</p>
      </div>
      <div className="inline-flex items-center text-base font-semibold text-gray-900">
        ${recentTransaction}
      </div>
    </div>
  );
}

export default DashboardUserRow;

export interface DashboardUserRowProps {
    fullname: string
    recentTransaction: string
}
