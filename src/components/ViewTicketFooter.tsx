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
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchImageFile } from "@/query-hooks/query-hook";
import { IntlMessages } from "../../get-localization";
function ViewTicketFooter(props: PrintPDFModel) {
  const downlodFileQuery = useQuery({
    queryKey: ["download-ticket"],
    queryFn: () =>
      fetchImageFile({ type: props.type, filename: props.application_id }),
    enabled: false,
    onSuccess: (response) => {
      const href = URL.createObjectURL(response);
      // create "a" HTML element with href to file & click
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", `${props.application_id}.png`); //or any other extension
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    },
  });
  return (
    <div className="p-4 px-4 md:p-8 mb-6 flex justify-end text-white ">
      <Link href={"search-ticket"}>
        <button className="p-3 mr-3 bg-slate-500 rounded">
          {props.localizeDict["viewTicket"].searchAnother_text}
        </button>
      </Link>
      {props.type === "slot" ? (
        <button
          className="p-3 mr-3 bg-blue-500 rounded"
          onClick={() => {
            downlodFileQuery.refetch();
          }}
        >
          {props.localizeDict["viewTicket"].save_button_text}
        </button>
      ) : (
        <PDFDownloadLink
          document={
            <PDF_REPORT_Document
              records={props.records}
              application_id={props.application_id}
              type={props.type}
              localizeDict={props.localizeDict}
            />
          }
          fileName={"PDF_REPORT.pdf"}
          className="p-3 mr-3 bg-blue-500 rounded"
        >
          {({ blob, url, loading, error }) =>
            loading
              ? props.localizeDict["viewTicket"].loading_button_Text
              : props.localizeDict["viewTicket"].print_button_text
          }
        </PDFDownloadLink>
      )}
    </div>
  );
}
const PDF_REPORT_Document = (props: PrintPDFModel) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#E4E4E4",
      margin: 16,
      marginRight: 16,
      width: "90%",
    },
    table: {
      margin: 25,
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
    },
    row: {
      width: "100%",
      height: 80,
      display: "flex",
      flexDirection: "row",
      flex: 1,
    },
    pageTitle: {
      color: "red",
      fontSize: 24,
    },
    pageSubtitle: {
      fontSize: 18,
    },
    pageDesc: {
      fontSize: 16,
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
    },
    col: {
      width: "50%",
      height: 60,
      border: 1,
      borderColor: "black",
      borderStyle: "solid",
      padding: 2,
      marginHorizontal: 2,
    },
    rowText: {
      padding: 5,
    },
  });

  return (
    <Document>
      <Page size={"A4"} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>E-Conversion Tracker </Text>
          <Text style={styles.pageSubtitle}>Ticket Details</Text>
          <Text style={styles.pageDesc}>
            {" "}
            Ticket id: {props.application_id}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.rowText}>Title</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.rowText}>Description</Text>
            </View>
          </View>
          {props.records.map((item, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.rowText}>{item.title}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.rowText}>{item.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ViewTicketFooter;
export interface PrintPDFModel extends ViewTicketResp {
  application_id: string;
  type: string;
  localizeDict: IntlMessages;
}
