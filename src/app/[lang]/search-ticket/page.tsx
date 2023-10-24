import SearchTicket from "@/components/SearchTicket";
import { getLocalization, IntlMessages } from "../../../../get-localization";

import { Locale } from "../../../../i18n-config";
export default async function SearchTicker({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const localeDict = (await getLocalization(lang)) as IntlMessages;
  return <SearchTicket localizeDict={localeDict} />;
}
