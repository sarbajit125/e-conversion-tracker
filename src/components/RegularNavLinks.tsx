
import Link from "next/link";

import React, { ReactNode } from "react";

function RegularNavLinks({ svg, path, id, linkName }: RegularNavLinksProps) {
  return (
    <Link href={path} id="id">
      {svg}
      <span className="ml-3">{linkName}</span>
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
