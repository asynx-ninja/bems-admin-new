import React, { useState, useEffect } from "react";
import {
  Font,
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../../assets/header/montalban-logo.png";
import id_picture from "../../../../assets/sample/official.jpg";
import BALITE from "../../../../assets/logo/BALITE.png";
import BURGOS from "../../../../assets/logo/BURGOS.png";
import GERONIMO from "../../../../assets/logo/GERONIMO.png";
import MACABUD from "../../../../assets/logo/MACABUD.png";
import MANGGAHAN from "../../../../assets/logo/MANGGAHAN.png";
import MASCAP from "../../../../assets/logo/MASCAP.png";
import PURAY from "../../../../assets/logo/PURAY.png";
import ROSARIO from "../../../../assets/logo/ROSARIO.png";
import SAN_ISIDRO from "../../../../assets/logo/SAN_ISIDRO.png";
import SAN_JOSE from "../../../../assets/logo/SAN_JOSE.png";
import SAN_RAFAEL from "../../../../assets/logo/SAN_RAFAEL.png";
import OETMT from "../../../../assets/fonts/Old-English-Text-MT.otf";
import ESITC from "../../../../assets/fonts/Edwardian-Script-ITC.otf";


Font.register({
  family: "Old-English-Text-MT",
  src: OETMT,
});

Font.register({
  family: "Edwardian-Script-ITC",
  src: ESITC,
});

const PrintDocumentTypeC = ({
  detail,
  officials = { officials },
  docDetails,
  brgy,
}) => {
  const [date, setDate] = useState(new Date());
  console.log("docDetails sa pdf: ", docDetails);

  const returnLogo = () => {
    switch (detail.brgy) {
      case "BALITE":
        return BALITE;

      case "BURGOS":
        return BURGOS;

      case "GERONIMO":
        return GERONIMO;

      case "MACABUD":
        return MACABUD;

      case "MANGGAHAN":
        return MANGGAHAN;

      case "MASCAP":
        return MASCAP;

      case "PURAY":
        return PURAY;

      case "ROSARIO":
        return ROSARIO;

      case "SAN ISIDRO":
        return SAN_ISIDRO;

      case "SAN JOSE":
        return SAN_JOSE;

      case "SAN RAFAEL":
        return SAN_RAFAEL;
    }
  };

  const formatBday = (bday) => {
    const formattedBirthday = bday.toLocaleDateString("en-PH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedBirthday;
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);

  const formattedDate = `${date.toLocaleDateString("en-PH", {
    year: "numeric",
  })}`;

  const dateIssued = `${date.toLocaleDateString("en-PH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;

  const createdAtFormatted = new Date(detail.createdAt).toLocaleDateString(
    "en-PH",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

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

  const terms = [
    "I am an existing resident applying for this request form of this barangay.",
    "I understand the procedures, terms, and conditions as displayed before I fill-out this service request form.",
    "All information provided are true and complete to the best of my knowledge.",
    "I will immediately inform my barangay of any updates/changes from the information/documents submitted.",
    "All documents submitted are original/authenticated copies, and information stated therein are true and correct.",
    "In compliance with the Data Privacy Act of 2012, I give consent to my barangay to collect, process, and evaluate information needed for this service application form.",
  ];

  const TwoColumns = ({ children }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {children}
    </View>
  );

  const Title = () => (
    <View>
      <Text
        style={{
          marginTop: 5,
          fontSize: 6,
          lineHeight: 1.5,
        }}
      >
        BIR FORM 0016 (DECEMBER, 2014)
      </Text>
    </View>
  );

  const FirstSegment = () => (
    <View>
      <TwoColumns>
        <View
          style={{
            width: "60%",
          }}
        >
          {/* TOP HEADER */}
          <TwoColumns>
            <View
              style={{
                width: "70%",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              >
                COMMUNITY TAX CERTIFICATE
              </Text>
            </View>

            <View
              style={{
                width: "30%",
                backgroundColor: "black", // Set black background color
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textAlign: "center",
                  color: "white",
                  paddingVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              >
                INDIVIDUAL
              </Text>
            </View>
          </TwoColumns>

          {/* DATE AND PLACE ISSUED */}
          <TwoColumns>
            <View
              style={{
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 5,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                YEAR
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {formattedDate}
              </Text>
            </View>

            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 5,
                  marginLeft: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                PLACE OF ISSUE (City / Mun. / Prov.)
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {detail.brgy}, RODRIGUEZ, RIZAL
              </Text>
            </View>

            <View
              style={{
                width: "30%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  marginLeft: 10,
                  paddingTop: 5,
                  lineHeight: 1.3,
                }}
              >
                DATE ISSUED
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {dateIssued}
              </Text>
            </View>
          </TwoColumns>

          {/* NAMES */}
          <TwoColumns>
            <View
              style={{
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 5,
                  lineHeight: 1.3,
                }}
              >
                NAME (SURNAME)
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {detail.form && detail.form[0]?.lastName?.value}
              </Text>
            </View>

            <View
              style={{
                width: "50%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 5,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                (FIRST)
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {detail.form && detail.form[0]?.firstName?.value}
              </Text>
            </View>

            <View
              style={{
                width: "30%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 5,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                (MIDDLE)
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {detail.form && detail.form[0]?.middleName?.value}
              </Text>
            </View>
          </TwoColumns>

          {/* NAMES */}
          <TwoColumns>
            <View
              style={{
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingTop: 5,
                  lineHeight: 1.3,
                }}
              >
                ADDRESS
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                {detail.form && detail.form[0]?.address?.value}
              </Text>
            </View>
          </TwoColumns>
        </View>

        <View
          style={{
            width: "40%",
            borderBottomWidth: 1,
            borderBottomColor: "#000000",
            borderLeftWidth: 1,
            borderLeftColor: "#000000",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 700,
                paddingVertical: 5,
                paddingHorizontal: 5,
                fontFamily: "Times-Bold",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              CCI2022
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 8,
                textAlign: "center",
                paddingVertical: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
                fontFamily: "Helvetica-Bold",
              }}
            >
              TAXPAYER'S COPY
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 6,
                textAlign: "center",
                paddingTop: 3,
                paddingBottom: 2,
              }}
            >
              TIN (If Any):
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                paddingTop: 2,
                paddingBottom: 4,
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
                paddingLeft: 7,
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />

              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                  marginLeft: 5,
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />

              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                  marginLeft: 5,
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />

              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                  marginLeft: 5,
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
            </View>
          </View>

          {/* Gender */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              paddingTop: 2,
              paddingBottom: 4,
              borderBottomWidth: 1,
              borderBottomColor: "#000000",
              paddingLeft: 7,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: 700,
                paddingVertical: 3,
                paddingHorizontal: 5,
              }}
            >
              SEX:
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 35,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              >
                <Text
                  style={{
                    fontSize: 7,
                    textAlign: "center",
                  }}
                >
                  1
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 7,
                  textAlign: "center",
                  paddingHorizontal: 3,
                }}
              >
                MALE
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: 7,
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              />
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderWidth: 1,
                  borderColor: "black", // Set the color of the border
                }}
              >
                <Text
                  style={{
                    fontSize: 7,
                    textAlign: "center",
                  }}
                >
                  2
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 7,
                  textAlign: "center",
                  paddingHorizontal: 3,
                }}
              >
                FEMALE
              </Text>
            </View>
          </View>
        </View>
      </TwoColumns>
    </View>
  );

  const SecondSegment = () => (
    <View>
      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingTop: 5,
                  paddingBottom: 5,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                CITIZENSHIP
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              />
            </View>

            <View
              style={{
                width: "25%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 5,
                  paddingBottom: 5,
                  marginLeft: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                ICR NO. (If an Alien)
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "30%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 5,
                  paddingBottom: 5,
                  marginLeft: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1.3,
                }}
              >
                PLACE OF BIRTH
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingTop: 2,
                  paddingBottom: 3,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  marginLeft: 10,
                  paddingTop: 5,
                  paddingBottom: 3,
                  lineHeight: 1,
                }}
              >
                HEIGHT
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingBottom: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1,
                }}
              >
                {detail.form && detail.form[0]?.height?.value}
              </Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingTop: 5,
                  paddingBottom: 5,
                  lineHeight: 1.3,
                }}
              >
                CIVIL STATUS
              </Text>

              {/* STATUSES */}
              <View
                style={{
                  flexDirection: "column",
                  paddingLeft: 25,
                  paddingVertical: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        textAlign: "center",
                      }}
                    >
                      1
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 7,
                      textAlign: "center",
                      paddingHorizontal: 1,
                    }}
                  >
                    Single
                  </Text>

                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginLeft: 15,
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        textAlign: "center",
                      }}
                    >
                      3
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 7,
                      textAlign: "center",
                      paddingHorizontal: 1,
                    }}
                  >
                    Widow / Widower / Legally Separated
                  </Text>
                </View>

                {/* LOWER */}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 1, // Adjust the margin as needed
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        textAlign: "center",
                      }}
                    >
                      2
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 7,
                      textAlign: "center",
                      paddingHorizontal: 1,
                    }}
                  >
                    Married
                  </Text>

                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginLeft: 11,
                    }}
                  />
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderWidth: 1,
                      borderColor: "black",
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        textAlign: "center",
                      }}
                    >
                      4
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 7,
                      textAlign: "center",
                      paddingHorizontal: 1,
                    }}
                  >
                    Divorced
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  marginLeft: 10,
                  paddingTop: 5,
                  paddingBottom: 3,
                  lineHeight: 1,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                }}
              >
                DATE OF BIRTH
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  lineHeight: 1,
                }}
              >
                {detail.form && detail.form[0]?.birthday?.value}
              </Text>
            </View>

            <View
              style={{
                width: "25%",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  marginLeft: 10,
                  paddingTop: 5,
                  paddingBottom: 3,
                  lineHeight: 1,
                }}
              >
                WEIGHT
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  textAlign: "center",
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                  lineHeight: 1,
                }}
              >
                {detail.form && detail.form[0]?.weight?.value} KG
              </Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>
    </View>
  );

  const ThirdSegment = () => (
    <View>
      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                PROFESSION / OCCUPATION / BUSINESS
              </Text>
            </View>

            <View
              style={{
                width: "20%",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                  textAlign: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              >
                TAXABLE AMOUNT
              </Text>
            </View>

            <View
              style={{
                width: "25%",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                  textAlign: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              >
                COMMUNITY TAX DUE
              </Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                A. BASIC COMMUNITY TAX (₱5.00) Voluntary or Exempted (₱1.00)
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                backgroundColor: "gray",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  paddingLeft: 7,
                  lineHeight: 1.3,
                }}
              >
                ₱
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                B. ADDITIONAL COMMUNITY TAX (tax not to exceed ₱5,000.00)
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                backgroundColor: "gray",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
                backgroundColor: "gray",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 10,
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000000",
                }}
              ></Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                1.
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  paddingRight: 30,
                }}
              >
                GROSS RECIEPTS OR EARNINGS DERIVED FROM BUSINESS DURING THE
                PRECEDING YEAR (₱1.00 for every ₱1,000)
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  paddingLeft: 7,
                  lineHeight: 1.3,
                }}
              >
                ₱
              </Text>
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                2.
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  paddingRight: 30,
                }}
              >
                SALARIES OR GROSS RECIEPT OR EARNINGS DERIVED FROM EXERCISE OF
                PROFESSION OR PURSUIT OF ANY OCCUPATION (₱1.00 of every ₱1,000)
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>

      <TwoColumns>
        <View
          style={{
            width: "100%",
          }}
        >
          {/* OTHER INFO 1 */}
          <TwoColumns>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "55%",
                borderRightWidth: 1,
                borderRightColor: "#000000",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                3.
              </Text>
              <Text
                style={{
                  fontSize: 6,
                  fontWeight: 700,
                  paddingLeft: 7,
                  paddingVertical: 3,
                  lineHeight: 1.3,
                  paddingRight: 30,
                }}
              >
                INCOME FROM REAL PROPERTY (₱1.00 of every ₱1,000)
              </Text>
            </View>

            <View
              style={{
                width: "20%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>

            <View
              style={{
                width: "25%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  lineHeight: 1.3,
                }}
              ></Text>
            </View>
          </TwoColumns>
        </View>
      </TwoColumns>
    </View>
  );

  const LastSegment = () => {
    return (
      <View>
        <TwoColumns>
          <View
            style={{
              width: "20%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center", // Center the content horizontally
                alignItems: "center", // Center the content vertically
                borderRightWidth: 1,
                borderRightColor: "#000000",
              }}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  paddingVertical: 5,
                  paddingBottom: 75,
                  lineHeight: 1.3,
                  textAlign: "center",
                }}
              >
                Right Thumb Print
              </Text>
            </View>
          </View>

          <View
            style={{
              width: "80%",
            }}
          >
            <TwoColumns>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  width: "46.5%",
                  borderRightWidth: 1,
                  borderRightColor: "#000000",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    // alignItems: "center",
                    width: "100%",
                    paddingTop: 4,
                    paddingBottom: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: "#000000",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 6,
                      fontWeight: 700,
                      paddingLeft: 7,
                      paddingBottom: 11,
                      lineHeight: 1.3,
                    }}
                  >
                    TAXPAYER'S SIGNATURE
                  </Text>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    paddingTop: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 8,
                      textAlign: "center",
                      lineHeight: 1,
                    }}
                  >
                    {officials
                      .filter((official) => official.position === "Treasurer")
                      .map((official) => (
                        <Text
                          style={{
                            fontSize: 10,
                            textAlign: "center",
                            lineHeight: 1.3, // Adjust the lineHeight as needed
                          }}
                        >
                          {official.lastName}, {official.firstName}{" "}
                          {official.middleName}
                        </Text>
                      ))}
                  </Text>
                  <View
                    style={{
                      borderWidth: 0,
                      borderTopWidth: 1,
                      borderColor: "#000000",
                      fontSize: 8,
                      paddingHorizontal: 15,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        paddingTop: 2,
                        paddingBottom: 5,
                      }}
                    >
                      MUNICIPAL / CITY TREASURER
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: "59.5%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center", // Center the content horizontally
                    alignItems: "center", // Center the content vertically
                    borderBottomWidth: 1,
                    borderBottomColor: "#000000",
                  }}
                >
                  <Text
                    style={{
                      width: "44%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      lineHeight: 1.3,
                      textAlign: "center",
                      borderRightWidth: 1,
                      borderRightColor: "#000000",
                    }}
                  >
                    TOTAL
                  </Text>

                  <Text
                    style={{
                      width: "56%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      paddingLeft: 7,
                      lineHeight: 1.3,
                    }}
                  >
                    ₱
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center", // Center the content horizontally
                    alignItems: "center", // Center the content vertically
                    borderBottomWidth: 1,
                    borderBottomColor: "#000000",
                  }}
                >
                  <Text
                    style={{
                      width: "44%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      lineHeight: 1.3,
                      textAlign: "center",
                      borderRightWidth: 1,
                      borderRightColor: "#000000",
                    }}
                  >
                    INTEREST
                  </Text>

                  <Text
                    style={{
                      width: "56%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      paddingLeft: 7,
                      lineHeight: 1.3,
                    }}
                  >
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center", // Center the content horizontally
                    alignItems: "center", // Center the content vertically
                    borderBottomWidth: 1,
                    borderBottomColor: "#000000",
                  }}
                >
                  <Text
                    style={{
                      width: "44%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      lineHeight: 1.3,
                      textAlign: "center",
                      borderRightWidth: 1,
                      borderRightColor: "#000000",
                    }}
                  >
                    TOTAL AMOUNT PAID
                  </Text>

                  <Text
                    style={{
                      width: "56%",
                      fontSize: 8,
                      fontWeight: 700,
                      paddingVertical: 5,
                      paddingLeft: 7,
                      lineHeight: 1.3,
                    }}
                  >
                    ₱
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center", // Center the content horizontally
                    alignItems: "center", // Center the content vertically
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 6,
                      fontWeight: 700,
                      paddingTop: 3,
                      paddingBottom: 15,
                      paddingLeft: 5,
                      lineHeight: 1.3,
                    }}
                  >
                    (In words):
                  </Text>
                </View>
              </View>
            </TwoColumns>
          </View>
        </TwoColumns>

      </View>
    );
  };

  const Body = () => (
    <View
      style={{
        border: 1,
        borderColor: "black",
      }}
    >
      <FirstSegment />
      <SecondSegment />
      <ThirdSegment />
      <LastSegment />
    </View>
  );

  const Footer = () => (
    <View>
      <Text
        style={{
          marginTop: 5,
          fontSize: 6,
          lineHeight: 1.5,
        }}
      >
        DOP: 04.28.2022
      </Text>
    </View>
  );

  return (
    <Document>
      <Page
        size="A4"
        style={{
          paddingTop: 5,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 5,
        }}
      >
        <Title />
        <Body />
        <Footer />
      </Page>
    </Document>
  );
};

export default PrintDocumentTypeC;
