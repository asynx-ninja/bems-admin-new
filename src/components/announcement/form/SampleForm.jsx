import React from "react";
import {
  usePDF,
  BlobProvider,
  PDFDownloadLink,
  pdf,
} from "@react-pdf/renderer";
import SampleDocument from "./SampleDocument";
import { useEffect, useState } from "react";
import saveAs from "file-saver";
import axios from "axios";
import API_LINK from "../../../config/API";

const SampleForm = ({
  brgy = "BALITE",
  service_id = "BRGY-BALITE-S-ADMINISTRATIVE-20231119113007",
}) => {
  const [document, setDocument] = useState(null);
  const [NewPDF, setNewPDF] = useState(null);

  const styles = {
    container: {
      width: "220px",
      borderRadius: "5px",
      padding: "15px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
    },
    flex: { width: "100%", display: "flex", gap: "5px", alignItems: "center" },
    bold: { fontSize: "13px", fontWeight: 600 },
    thin: { fontSize: "11px", color: "#6f6f6f", fontWeight: 500 },
    btn: {
      borderRadius: "3px",
      border: "1px solid gray",
      display: "flex",
      alignItems: "center",
      gap: "2px",
      padding: "3px",
      fontSize: "11px",
      color: "#4f4f4f",
      fontWeight: 600,
      cursor: "pointer",
      userSelect: "none",
    },
  };

  // useEffect(() => {
  //   const generatePDF = async () => {
  //     try {
  //       setDocument(await pdf(<SampleDocument />).toBlob());
  //       setNewPDF(new File([document], "filename"));
  //       // saveAs(document, 'NewFile.pdf');
  //     } catch (error) {
  //       console.error(error.message);
  //       alert("Error generating PDF");
  //     }
  //   };

  //   generatePDF();
  // }, []);

  const [detail, setDetail] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/forms/?brgy=${brgy}&service_id=${service_id}`
        );
        setDetail(response.data[0]);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetch();
  }, [brgy, service_id]);

  console.log(detail)

  return (
    <>
      <a download={NewPDF} target="_blank">
        download
      </a>

      <PDFDownloadLink
        document={<SampleDocument detail={detail} />}
        fileName="invoice.pdf"
      >
        <div style={styles.btn}>
          <span>Download</span>
        </div>
      </PDFDownloadLink>

      <BlobProvider document={<SampleDocument detail={detail} />}>
        {({ url, blob }) => (
          <a href={url} target="_blank" style={styles.btn}>
            <span>Print</span>
          </a>
        )}
      </BlobProvider>
    </>
  );
};

export default SampleForm;
