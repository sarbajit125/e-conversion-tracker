"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { i18n } from "../../i18n-config";
import { Menu, Button, Text, rem } from "@mantine/core";
function LangSwitch() {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <button className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3">Toggle Language</button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Available language</Menu.Label>
          {i18n.locales.map((locale) => {
            return (
              <Link href={redirectedPathName(locale)} key={locale}>
                <Menu.Item>{locale}</Menu.Item>
              </Link>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default LangSwitch;
