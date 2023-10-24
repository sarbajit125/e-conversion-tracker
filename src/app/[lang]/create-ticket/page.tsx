import CreateTicket from "@/components/CreateTicket";
import React from "react";
import { Locale } from '../../../../i18n-config'
import { IntlMessages, getLocalization } from "../../../../get-localization";
export default async function CreateForm({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const localeDict = await getLocalization(lang) as IntlMessages
 return (
  <CreateTicket localizeDict={localeDict} />
 )
}
