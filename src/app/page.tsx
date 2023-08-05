import DashboardCard from "@/components/DashboardCard";
import DashboardTransactionRow from "@/components/DashboardTransactionRow";
import DashboardUserRow from "@/components/DashboardUserRow";
import UpwardArrowIcon from "@/components/svgComponent/UpwardArrowIcon";
import {
  axiosDashboardData,
  fetchDashboardData,
} from "@/query-hooks/query-hook";
import Link from "next/link";
export default async function Home() {
  const responseData = await fetchDashboardData();
  return (
    <div
      id="main-content"
      className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-60"
    >
      <main>
        <div className="pt-6 px-4">
          <div className="w-full grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8  ">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                    $45,385
                  </span>
                  <h3 className="text-base font-normal text-gray-500">
                    Sales this week
                  </h3>
                </div>
                <div className="flex items-center justify-end flex-1 text-green-500 text-base font-bold">
                  12.5%
                  <UpwardArrowIcon />
                </div>
              </div>
              <div id="main-chart" style={{width: '518'}}></div>
            </div>
            <div>
              <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Latest Transactions
                    </h3>
                    <span className="text-base font-normal text-gray-500">
                      This is a list of latest transactions
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href="#"
                      className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
                    >
                      View all
                    </Link>
                  </div>
                </div>
                <div className="flex mt-8">
                  <div className="overflow-x-auto rounded-lg">
                    <div className="align-middle inline-block min-w-full">
                      <div className="shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Transaction
                              </th>
                              <th
                                scope="col"
                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Date & Time
                              </th>
                              <th
                                scope="col"
                                className="p-4 text-left text-xs font-medium text-gray-500 uppercase "
                              >
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {responseData.recentTransaction.map(
                              (item, index) => (
                                <DashboardTransactionRow
                                  key={index.toString()}
                                  data={item}
                                />
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DashboardCard
              title={"New products this week"}
              desc={"2,340"}
              value={"14.6%"}
              isPositive={true}
            />
            <DashboardCard
              title={"Visitors this week"}
              desc={"5,355"}
              value={"32.9%"}
              isPositive={true}
            />
            <DashboardCard
              title={"User signups this week"}
              desc={"5,355"}
              value={"-2.7%"}
              isPositive={false}
            />
          </div>
          <div className="grid grid-cols-1 2xl:grid-cols-1 xl:gap-4 my-4">
            <div className="bg-white shadow rounded-lg mb-4 p-4 sm:p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold leading-none text-gray-900">
                  Latest Customers
                </h3>
                <Link
                  href="#"
                  className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg inline-flex items-center p-2"
                >
                  View all
                </Link>
              </div>
              <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200">
                  {responseData.recentCustomer.map((item, index) => (
                    <DashboardUserRow
                      key={index.toString()}
                      fullname={item.user}
                      recentTransaction={item.amount}
                      currencyCode={item.currencyCode}
                      serviceType={item.serviceType}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
