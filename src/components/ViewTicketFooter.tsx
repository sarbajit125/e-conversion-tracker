"use client";
import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { ViewTicketResp } from "@/app/api/view-ticket/route";
function ViewTicketFooter(props: ViewTicketResp) {
  const [isSave, setSave] = useState<boolean>(false);
  return (
    <div className="p-4 px-4 md:p-8 mb-6 flex justify-end text-white ">
      <button className="p-3 mr-3 bg-slate-500 rounded">Search another</button>
      <button
        className="p-3 mr-3 bg-blue-500 rounded"
        onClick={(e) => setSave(true)}
      >
        Print
      </button>
      {isSave ? (
        <PDFDownloadLink
          document={<PDF_REPORT_Document records={props.records} />}
          fileName={"PDF_REPORT.pdf"}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Report loading..." : "Report ready to download"
          }
        </PDFDownloadLink>
      ) : null}
    </div>
  );
}
const PDF_REPORT_Document = (props: ViewTicketResp) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#E4E4E4",
      margin: 16,
      padding: 5,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {},
    pageTitle:{
      color: 'red',
      fontSize: 24,
    },
    pageSubtitle:{
      fontSize: 18
    },
    pageDesc:{
      fontSize: 16
    },
    header:{
      flex:1,
      flexGrow:1,
      justifyContent: 'center',
      alignContent:'center',
    },
  });

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>E-Conversion Tracker </Text>
          <Text style={styles.pageSubtitle}>Ticket Details</Text>
          <Text style={styles.pageDesc}> Ticket id: 123456789</Text>
        </View>
        <View style={styles.table}>
          <table>
            <thead>
              <th>
                <Text>Title</Text>
              </th>
              <th>
                <Text>Description</Text>
              </th>
            </thead>
            <tbody>
              {props.records.map((item, index) => (
                <tr key={item.id}>
                  <th>
                    <Text> {item.title}</Text>
                  </th>
                  <th>
                    <Text> {item.value}</Text>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </View>
      </Page>
    </Document>
  );
};

export default ViewTicketFooter;
