import React from "react";
import montalban_logo from "../../../assets/header/montalban-logo.png";
import API_LINK from "../../../config/API";
import { useEffect, useState } from "react";
import axios from "axios";

const PrintForm = ({ pdfRef }) => {
  const [request, setRequest] = useState({});
  const [date, setDate] = useState(new Date());
  const terms = [
    "I am an existing resident applying for this request form of this barangay.",
    "I understand the procedures, terms, and conditions as displayed before I fill-out this service request form.",
    "All information provided are true and complete to the best of my knowledge.",
    "I will immediately inform my barangay of any updates/changes from the information/documents submitted.",
    "All documents submitted are original/authenticated copies, and information stated therein are true and correct.",
    "In compliance with the Data Privacy Act of 2012, I give consent to my barangay to collect, process, and evaluate information needed for this service application form.",
  ];

  const formatBday = (bday) => {
    const formattedBirthday = bday.toLocaleDateString("en-PH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedBirthday;
  };

  const formattedDate = date.toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  const formattedTime = date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/requests/?brgy=BALITE&archived=false&id=6562217e8335cdfe15804488`
        );

        setRequest(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, []);

  const filterPersonalInformation = (form) => {
    const filtered = Object.keys(form)
      .filter((key) => !["user_id", "id_pic"].includes(key))
      .reduce((obj, key) => {
        obj[key] = form[key];
        return obj;
      }, {});

    return filtered;
  };

  const romanize = (num) => {
    var lookup = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      },
      roman = "",
      i;
    for (i in lookup) {
      while (num >= lookup[i]) {
        roman += i;
        num -= lookup[i];
      }
    }

    return roman;
  };

  return (
    <div id="divToPrint" className="max-w-3xl mx-auto">
      <div
        // className="flex justify-between items-center"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img
          src={montalban_logo}
          alt=""
          //   className="h-[100px]"
          style={{ height: "100px" }}
        />
        <div
          //   className="text-[14px]  text-center"
          style={{ textAlign: "center", fontSize: "14px" }}
        >
          <h1
            // className="leading-none font-serif"
            style={{ fontFamily: "serif", lineHeight: 1 }}
          >
            Republic of the Philippines
          </h1>
          <h1
            //   className="font-serif"
            style={{ lineHeight: 1 }}
          >
            Municipality of Rodriguez, Rizal
          </h1>
          <h1
            // className="text-[25px] leading-[1.8rem] font-bold"
            style={{
              fontSize: "25px",
              lineHeight: "1.8rem",
              fontWeight: "bold",
            }}
          >
            BARANGAY BALITE
          </h1>
          <h1
            //   className="font-serif"
            style={{ fontFamily: "serif" }}
          >
            Barangay Hall, Dike Street, Rodriguez, Rizal
          </h1>
        </div>
        <img
          src={montalban_logo}
          alt=""
          //   className="h-[100px]"
          style={{ height: "100px" }}
        />
      </div>
      <div className="mt-1 mb-5  flex flex-col items-center justify-center">
        <h1 className="underline font-bold text-xl underline-offset-[5px]">
          SCHOLARSHIP REQUEST FORM
        </h1>
        <p className="text-[13px]">{request.service_id}</p>
      </div>
      <div className="outline flex flex-col p-3">
        {/* DETAILS */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="text-[15px]">
              <label className="font-[600]">REQUEST ID: </label>
              <span className="font-[700] underline underline-offset-4">
                {request.req_id}
              </span>
            </div>
            <div className="text-[15px]">
              <label className="font-[600]">USER ID: </label>
              <span className="font-[700] underline underline-offset-4">
                {request.form && request.form[0].user_id.value}
              </span>
            </div>
            <div className="text-[15px]">
              <label className="font-[600]">
                DATE AND TIME OF ACCOMPLISHED FORM:{" "}
              </label>
              <span className="font-[700] underline underline-offset-4">
                {formattedDate} {formattedTime}
              </span>
            </div>
          </div>
          {Object.hasOwn(request, "file")
            ? request.file.map((item) => {
                if (
                  item.name.includes(`${request.form[0].lastName.value} - ID`)
                )
                  return (
                    <img
                      src={item.link}
                      alt=""
                      className="w-[100px] h-[100px] object-cover"
                    />
                  );
              })
            : null}
        </div>

        {/* PERSONAL INFORMATION */}
        <div>
          <h1 className="text-[18px] font-bold  border-0 border-b-2 border-black">
            I. PERSONAL INFORMATION
          </h1>
          <div className="grid grid-cols-4 grid-flow-row my-3">
            {request.form &&
              Object.entries(filterPersonalInformation(request.form[0])).map(
                ([key, value], idx) => (
                  <div
                    className={`flex flex-col outline outline-1 border border-1 ${
                      key === "address" ? "col-span-3" : null
                    } ${key === "email" ? "col-span-3" : null} ${
                      key === "birthday" ? "col-span-2" : null
                    } px-3 py-1`}
                  >
                    <label className="font-bold text-[14px]">
                      {value.display.toUpperCase()} :
                    </label>
                    <span className="font-[600] text-[16px] ">
                      {key === "birthday"
                        ? formatBday(new Date(value.value))
                        : value.value === ""
                        ? "N/A"
                        : value.value}{" "}
                    </span>
                  </div>
                )
              )}
          </div>
        </div>

        {/* OTHER PERSONAL INFORMATION */}
        <div className="">
          {request.form &&
            request.form[1].map((item, idx) => (
              <div className="mb-3">
                <h1 className="text-[18px] font-bold  border-0 border-b-2 border-black">
                  {`${romanize(idx + 2)}. ${item.section_title}`}
                </h1>
                <div className="grid grid-cols-2 pt-3">
                  {item.form.map((form, idx) => {
                    return form.type === "file" ? null : (
                      <div className="flex flex-col" idx={idx}>
                        <label className="font-bold text-[14px]">
                          {form.display.toUpperCase()} :
                        </label>
                        <span className="font-[600] text-[16px] ">
                          {form.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* TERMS */}
        <div className="border border-1 border-black p-3">
          <h1 className="font-[600] text-[15px] text-justify">
            I,{" "}
            <span className="underline underline-offset-4 font-bold">{`${
              request.form && request.form[0].lastName.value
            }, ${request.form && request.form[0].firstName.value} ${
              request.form && request.form[0].middleName.value
            }`}</span>{" "}
            , a resident of{" "}
            <span className="underline underline-offset-4 font-bold">
              {request.form && request.form[0].address.value}
            </span>{" "}
            attest that
          </h1>
          <div className="pl-4 mt-3">
            <ul className="list-disc grid grid-rows-3 grid-flow-col gap-x-10">
              {terms.map((term, idx) => (
                <li
                  key={idx}
                  className="font-[500] text-justify text-[14px] italic"
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SIGNATORIES */}
        <div className="flex w-full mt-3 space-x-5">
          <div className="w-6/12">
            <h1 className="text-[14px] font-bold">AFFIANT</h1>
            <div className="h-24 border-0 border-b-2 border-black">
              {Object.hasOwn(request, "file")
                ? request.file.map((item) => {
                    if (
                      item.name.includes(
                        `${request.form[0].lastName.value} - SIGNATURE`
                      )
                    )
                      return (
                        <img
                          src={item.link}
                          alt=""
                          className="h-24 w-full pb-1 object-contain"
                        />
                      );
                  })
                : null}
            </div>
            <p className="text-center text-[14px] font-[600]">
              Resident's Signature over Printed Name
            </p>
          </div>
          <div className="w-6/12">
            <h1 className="text-[14px] font-bold">
              ASSISTED BY: (For Residents below 18 years old)
            </h1>
            <div className="h-24 border-0 border-b-2 border-black">
              {Object.hasOwn(request, "file")
                ? request.file.map((item) => {
                    if (
                      item.name.includes(
                        `${request.form[0].lastName.value} - SIGNATURE GUARDIAN`
                      )
                    )
                      return (
                        <img
                          src={item.link}
                          alt=""
                          className="h-24 w-full pb-1 object-contain"
                        />
                      );
                  })
                : null}
            </div>
            <p className="text-center text-[14px] font-[600]">
              Parent/Guardian's Signature over Printed Name
            </p>
          </div>
        </div>
      </div>
      {/* FORM NOT SALE */}
      <div className="flex justify-between items-center font-bold text-sm mt-1">
        <h1>THIS FORM IS NOT FOR SALE</h1>
        <h1>{request.version}</h1>
      </div>
    </div>
  );
};

export default PrintForm;
