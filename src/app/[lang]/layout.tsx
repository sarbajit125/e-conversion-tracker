import RegularNavLinks from "@/components/RegularNavLinks";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import DashboardLogo from "@/components/svgComponent/DashboardLogo";
import CreateTicketLogo from "@/components/svgComponent/CreateTicketLogo";
import Image from "next/image";
import SidebarMobileHamburger from "@/components/svgComponent/SidebarMobileHamburger";
import SideBarMobileClose from "@/components/svgComponent/SideBarMobileClose";
import QueryProvider from "@/query-hooks/queryProvider";
import ToastProvider from "@/query-hooks/toastProvider";
import { Toaster } from "@/components/ui/toaster";
import SearchIcon from "@/components/svgComponent/SearchIcon";
import RootStyleRegistry from "@/query-hooks/emotion";
import { IoTicketOutline } from "react-icons/io5";
import { getLocalization } from "../../../get-localization";
import LangSwitch from "@/components/LangSwitch";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Bhulekh Conversion Tracker",
  description: "Track Land records conversion with ease",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string }
}) {
  const localeDict = await getLocalization(params.lang);
  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider>
            <RootStyleRegistry>
              <div>
                <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
                  <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-start">
                        <button
                          id="toggleSidebarMobile"
                          aria-expanded="true"
                          aria-controls="sidebar"
                          className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                        >
                          <SidebarMobileHamburger />
                          <SideBarMobileClose />
                        </button>
                        <a
                          href="#"
                          className="text-xl font-bold flex items-center lg:ml-2.5"
                        >
                          <Image
                            src={
                              "https://demo.themesberg.com/windster/images/logo.svg"
                            }
                            width={25}
                            height={30}
                            className="h-6 mr-2"
                            alt="Windster Logo"
                          />
                          <span className="self-center whitespace-nowrap">
                            Bhulekh
                          </span>
                        </a>
                        <form
                          action="#"
                          method="GET"
                          className="hidden lg:block lg:pl-32"
                        >
                          <label htmlFor="topbar-search" className="sr-only">
                            Search
                          </label>
                          <div className="mt-1 relative lg:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="email"
                              id="topbar-search"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5"
                              placeholder="Search"
                            />
                          </div>
                        </form>
                      </div>
                      <div className="flex items-center">
                        <button
                          id="toggleSidebarMobileSearch"
                          type="button"
                          className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
                        >
                          <span className="sr-only">Search</span>
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                        <div className="hidden lg:flex items-center">
                          <span className="text-base font-normal text-gray-500 mr-5">
                            Open source ❤️
                          </span>
                          <div className="-mb-1">
                            <a
                              className="github-button"
                              href="#"
                              data-color-scheme="no-preference: dark; light: light; dark: light;"
                              data-icon="octicon-star"
                              data-size="large"
                              data-show-count="true"
                              aria-label="Star themesberg/windster-tailwind-css-dashboard on GitHub"
                            >
                              Star
                            </a>
                          </div>
                        </div>
                        <LangSwitch />
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="flex overflow-hidden bg-white pt-16">
                <aside
                  id="sidebar"
                  className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-60  transition-width duration-75"
                  aria-label="Sidebar"
                >
                  <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                      <div className="flex-1 px-3 bg-white divide-y space-y-1">
                        <ul className="space-y-2 pb-2">
                          <li>
                            <RegularNavLinks
                              svg={<DashboardLogo />}
                              path={`/${params.lang}`}
                              id={"dashboard"}
                              linkName={localeDict['navigation'].dashboard_nav_text}
                            />
                          </li>
                          <li>
                            <RegularNavLinks
                              svg={<CreateTicketLogo />}
                              path={`/${params.lang}/create-ticket`}
                              id={"createTicket"}
                              linkName={localeDict['navigation'].createTicket_nav_text}
                            />
                          </li>
                          <li>
                            <RegularNavLinks
                              svg={<SearchIcon />}
                              path={`/${params.lang}/search-ticket`}
                              id={"searchTicket"}
                              linkName={localeDict['navigation'].searchTicket_nav_text}
                            />
                          </li>
                          <li>
                            <RegularNavLinks
                              path={`/${params.lang}/create-pauti`}
                              linkName={localeDict['navigation'].pauti_nav_text}
                              id="addSlot"
                              svg={<IoTicketOutline />}
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </aside>
                <div
                  className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
                  id="sidebarBackdrop"
                ></div>
                {children}
                <Toaster />
              </div>
            </RootStyleRegistry>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
