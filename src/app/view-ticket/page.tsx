import ViewTicketFooter from "@/components/ViewTicketFooter";
import { getCurrencySymbol } from "@/lib/utils";
import { fetchTicketData } from "@/query-hooks/query-hook";
import { useRouter } from "next/navigation";
import React from "react";
async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = searchParams["id"] as string;
  const data = await fetchTicketData(id);
  return (
    <main className="container max-w-screen-lg mx-auto lg: ml-60">
      <div className="px-4 p-4">
        <h2 className="font-semibold text-xl text-gray-600">Ticket Summary</h2>
        <p className="text-gray-500 mb-6">View/Print ticket details</p>
      </div>
      <div
        id="contentView"
        className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6"
      >
        <div className="grid grid-cols-4">
          {data.records.map((item, index) => (
            <div key={index} className="px-2 m-3">
              <p className="text-left font-bold text-black w-full grow">
                {item.title}:
              </p>
              <p className="text-left font-normal text-gray-600">
                {item.additionalDetails != undefined &&
                item.additionalDetails["currencyId"] != undefined
                  ? getCurrencySymbol(item.additionalDetails["currencyId"]) + " " +
                    parseFloat(item.value).toLocaleString()
                  : item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <ViewTicketFooter records={data.records} application_id={id} />
    </main>
  );
}

export default Page;
