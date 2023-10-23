import { RecentTransactionResp } from "@/app/api/route";
import { formatAmount, getCurrencySymbol, recentDateDisplayFormat } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";
import { Locale } from "../../i18n-config";
import { getLocalization } from "../../get-localization";

async function DashboardTransactionRow({key, data, locale}: RecentTransactionRowProps) {
  const localeDict = await getLocalization(locale)
  return (
    <tr key={key}>
      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
        {localeDict['dashboard'].paymentForm_title} <span className="font-semibold">{data.user}</span>
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
        {dayjs(data.date).format(recentDateDisplayFormat).toString()}
      </td>
      <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {formatAmount(data.amount, data.currencyCode)}
      </td>
    </tr>
  );
}

export default DashboardTransactionRow;
interface RecentTransactionRowProps {
    key: string,
    data: RecentTransactionResp,
    locale: Locale
}