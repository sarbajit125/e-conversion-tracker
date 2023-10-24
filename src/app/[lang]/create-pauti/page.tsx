
import React from "react";
import { Locale } from '../../../../i18n-config'
import { IntlMessages, getLocalization } from "../../../../get-localization";
import CreatePauti from "@/components/CreatePauti";
async function CreateSlot({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const localeDict = await getLocalization(lang) as IntlMessages
  return (<div>
    <CreatePauti localizeDict={localeDict} />
  </div>)
}

export default CreateSlot;
