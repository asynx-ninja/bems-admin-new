import { useState, useEffect, React, useRef } from "react";
// FORM DETAILS
import PersonalDetails from "./PersonalDetails";
import OtherDetails from "./OtherDetails";
import PrintForm from "./form/PrintForm";
import PrintPDF from "./form/PrintPDF";
import PrintDocumentTypeA from "./form/PrintDocumentTypeA";
import PrintDocumentTypeB from "./form/PrintDocumentTypeB";
import PrintDocumentTypeC from "./form/PrintDocumentTypeC";
import PrintDocumentTypeD from "./form/PrintDocumentTypeD";
import PrintDocumentTypeE from "./form/PrintDocumentTypeE";
import PrintDocumentTypeF from "./form/PrintDocumentTypeF";
import PrintDocumentTypeG from "./form/PrintDocumentTypeG";
import PrintDocumentTypeH from "./form/PrintDocumentTypeH";
import PrintDocumentTypeI from "./form/PrintDocumentTypeI";
import PrintDocumentTypeJ from "./form/PrintDocumentTypeJ";
import PrintDocumentTypeK from "./form/PrintDocumentTypeK";
import axios from "axios";
import API_LINK from "../../../config/API";

import { PDFDownloadLink } from "@react-pdf/renderer";
import GetBrgy from "../../GETBrgy/getbrgy";

function ViewRequestModal({ request, brgy, officials }) {
  const information = GetBrgy(brgy);
  const [detail, setDetail] = useState(request);
  const [empty] = useState(false);
  const [docDetails, setDocDetails] = useState([]);
  const [service_id, setServiceId] = useState(request.service_id);

  useEffect(() => {
    // function to filter
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/document/?brgy=${brgy}&service_id=${service_id}`
        );

        // filter
        setDocDetails(response.data);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetch();
  }, [brgy, service_id, request]); // Add 'request' as a dependency

  useEffect(() => {
    // Update 'service_id' and 'detail' whenever 'request' changes
    setServiceId(request.service_id);
    setDetail(request);
  }, [request]);

  console.log("service_id: ", service_id);
  // console.log("docDetails: ", docDetails);

  const fileName =
    detail.form[0] && detail.form[0].lastName
      ? `${detail.form[0].lastName.value.toUpperCase()}, ${detail.form[0].firstName.value.toUpperCase()} ${detail.form[0].middleName.value.toUpperCase()}-${detail.type.toUpperCase()}-${
          detail.req_id
        }.pdf`
      : "SAMPLE.pdf";

  // console.log("detail", detail);

  const returnFile = (string) => {
    for (const item of detail.file) {
      if (item.name.includes(string)) {
        return (
          <div className="block p-1 w-full h-24">
            <article
              tabIndex={0}
              className="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm"
            >
              <img
                alt="upload preview"
                className="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"
              />
              <section className="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                <a
                  href={item.link}
                  target="_blank"
                  className="flex-1 group-hover:text-blue-800 line-clamp-1"
                >
                  {item.name}
                </a>
                <div className="flex">
                  <span className="p-1 text-blue-800">
                    <i>
                      <svg
                        className="fill-current w-4 h-4 ml-auto pt-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                      >
                        <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                      </svg>
                    </i>
                  </span>
                </div>
              </section>
            </article>
          </div>
        );
      }
    }

    return null;
  };

  const DocumentTypeComponent =
    docDetails.length > 0 && getDocumentTypeComponent(docDetails[0].type);

  function getDocumentTypeComponent(type) {
    switch (type) {
      case "Type A":
        return PrintDocumentTypeA;
      case "Type B":
        return PrintDocumentTypeB;
      case "Type C":
        return PrintDocumentTypeC;
      case "Type D":
        return PrintDocumentTypeD;
      case "Type E":
        return PrintDocumentTypeE;
      case "Type F":
        return PrintDocumentTypeF;
      case "Type G":
        return PrintDocumentTypeG;
      case "Type H":
        return PrintDocumentTypeH;
      case "Type I":
        return PrintDocumentTypeI;
      case "Type J":
        return PrintDocumentTypeJ;
      case "Type K":
        return PrintDocumentTypeK;
      // Add cases for other types if needed
      default:
        return null;
    }
  }

  console.log("request sa modal: ", request);

  return (
    <div>
      <div
        id="hs-view-request-modal"
        className="hs-overlay hidden fixed top-0 left-0 z-[80] w-full h-full overflow-x-hidden overflow-y-auto flex items-center justify-center "
      >
        {/* Modal */}
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 px-3 py-5 md:px-5 opacity-0 transition-all w-full h-auto">
          <div className="flex flex-col bg-white shadow-sm rounded-t-3xl rounded-b-3xl w-full h-full md:max-w-xl lg:max-w-2xl xxl:max-w-3xl mx-auto max-h-screen">
            {/* Header */}
            <div
              className="py-5 px-3 flex justify-between items-center overflow-hidden rounded-t-2xl bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#408D51] to-[#295141]"
              style={{
                background: `radial-gradient(ellipse at bottom, ${information?.theme?.gradient?.start}, ${information?.theme?.gradient?.end})`,
              }}
            >
              <h3
                className="font-bold text-white mx-auto md:text-xl text-center"
                style={{ letterSpacing: "0.3em" }}
              >
                REQUEST SERVICE
              </h3>
            </div>

            {/* BODY */}
            <div className="scrollbarWidth scrollbarTrack scrollbarHover p-4 scrollbarThumb flex flex-col mx-auto w-full overflow-y-auto relative h-[470px]">
              <form className="space-y-4">
                {empty && (
                  <div
                    className="bg-red-50 border text-center border-red-200 text-sm text-red-600 rounded-md py-4 mt-2 mb-4"
                    role="alert"
                  >
                    Please fill out the required information!
                  </div>
                )}
                <PersonalDetails detail={detail} />
                <OtherDetails detail={detail} returnFile={returnFile} />
              </form>
            </div>
            {/* END OF BODY */}
            {/* BUTTON BELOW */}
            <div className="flex justify-center items-center gap-x-2 py-3 px-6 dark:border-gray-700">
              <div className="sm:space-x-0 lg:space-x-2 sm:space-y-2 lg:space-y-0 w-full flex sm:flex-col lg:flex-row">
                {DocumentTypeComponent &&
                  request.status === "Transaction Completed" && (
                    <PDFDownloadLink
                      document={
                        <DocumentTypeComponent
                          detail={detail}
                          officials={officials}
                          docDetails={docDetails}
                          brgy={brgy}
                        />
                      }
                      fileName={fileName}
                      className="h-[2.5rem] flex text-center justify-center items-center w-full py-1 px-6 gap-2 rounded-md border text-[9px] xxl:text-xs font-base bg-[#22687a] text-white shadow-sm"
                    >
                      GENERATE DOCUMENT REQUEST ({docDetails[0].type})
                    </PDFDownloadLink>
                  )}

                <PDFDownloadLink
                  document={<PrintPDF detail={detail} brgy={brgy} />}
                  fileName={fileName}
                  className="h-[2.5rem] flex text-center justify-center items-center w-full py-1 px-6 gap-2 rounded-md border text-[9px] xxl:text-xs font-base bg-teal-900 text-white shadow-sm"
                >
                  GENERATE REQUEST FORM
                </PDFDownloadLink>
                <button
                  type="button"
                  className="h-[2.5rem] w-full py-1 px-6  gap-2 rounded-md borde text-sm font-base bg-pink-800 text-white shadow-sm"
                  data-hs-overlay="#hs-view-request-modal"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRequestModal;
