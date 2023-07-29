import Link from "next/link";

import React, { ReactNode } from "react";

function RegularNavLinks({ svg, path, id, linkName }: RegularNavLinksProps) {
  return (
    <Link href={path} id="id">
      <div className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 group transition duration-75 flex items-center p-2">
        {svg}
        <span className="ml-3">{linkName}</span>
      </div>
    </Link>
  );
}

export default RegularNavLinks;
export interface RegularNavLinksProps {
  svg: ReactNode;
  path: string;
  id: string;
  linkName: string;
}
