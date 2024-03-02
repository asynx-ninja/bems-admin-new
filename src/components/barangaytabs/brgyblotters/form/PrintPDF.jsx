import { useState, useEffect } from "react";
import {
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


const PrintPDF = ({ detail }) => {
  const [date, setDate] = useState(new Date());
  
  const returnLogo = () => {
    switch (detail.brgy) {
      case "BALITE": 
      return BALITE

      case "BURGOS": 
      return BURGOS

      case "GERONIMO": 
      return GERONIMO

      case "MACABUD": 
      return MACABUD

      case "MANGGAHAN": 
      return MANGGAHAN

      case "MASCAP": 
      return MASCAP

      case "PURAY": 
      return PURAY

      case "ROSARIO": 
      return ROSARIO

      case "SAN ISIDRO": 
      return SAN_ISIDRO

      case "SAN JOSE": 
      return SAN_JOSE

      case "SAN RAFAEL": 
      return SAN_RAFAEL
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

  const styles = StyleSheet.create({
    body: {
      padding: 35,
    },
    letterHead: {
      view1: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      },
      image: {
        width: 70,
      },
      view2: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      republic: {
        fontFamily: "Times-Roman",
        fontSize: 14,
      },
      municipality: {
        fontFamily: "Times-Roman",
        fontSize: 14,
        lineHeight: 1,
      },
      brgy: {
        fontFamily: "Helvetica-Bold",
        fontSize: 20,
        fontWeight: 700,
      },
      address: {
        fontFamily: "Times-Roman",
        fontSize: 12,
      },
    },
    title: {
      view1: {
        paddingTop: 12,
        paddingBottom: 12,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
      req: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        fontWeight: 700,
        textDecoration: "underline",
      },
      id: {
        paddingTop: 3,
        fontSize: 8,
      },
    },
    bodyHead: {
      bodyParent: {
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: "#000000",
      },
      view1: {
        paddingBottom: 8,
        paddingHorizontal: 12,
        fontSize: 11,
      },
      parent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontSize: 12,
      },
      bodyTitles: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingHorizontal: 12,
      },
      text: {
        fontFamily: "Helvetica-Bold",
        fontWeight: 700,
        fontSize: 12,
      },
      image: {
        objectFit: "cover",
        outlineWidth: 2,
        backgroundColor: "#ffffff",
        height: 100,
        width: 100,
      },
      column: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 2,
        paddingHorizontal: 12,
      },
    },
    info: {
      parent: {
        paddingHorizontal: 12,
      },
      header: {
        fontFamily: "Helvetica-Bold",
        fontWeight: 700,
        fontSize: 16,
        borderBottomWidth: 2,
        borderColor: "#000000",
        marginTop: 10,
      },
      table: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        flexWrap: "wrap",
        marginTop: 10,
        border: 2,
        borderColor: "#000000",
      },
      tableCell: {
        flex: "1 0 21%",
        padding: 8,
        borderTop: 1,
        borderColor: "#000000",
        outlineWidth: 1,
      },
      label: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        fontWeight: 700,
      },
      value: {
        fontSize: 12,
      },
    },
    terms: {
      parent: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 12,
        borderWidth: 2,
        borderColor: "#000000",
      },
      bold: {
        fontFamily: "Helvetica-Bold",
        fontWeight: 700,
        fontSize: 10,
      },
      underline: {
        textDecoration: "underline",
      },
      listParent: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginVertical: 10,
      },
      listChild: {
        fontSize: 10,
        fontStyle: "italic",
        display: "flex",
        flexDirection: "row",
      },
      text: {
        fontFamily: "Helvetica-Oblique",
        textAlign: "justify",
        marginLeft: 5,
        fontStyle: "italic",
      },
      parentSign: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 4,
        width: "100%",
        gap: 10,
      },
      half: {
        width: "50%",
      },
      imageStyle: {
        height: 50,
        marginLeft: "auto",
        marginRight: "auto",
      },
      signText: {
        borderWidth: 0,
        borderTopWidth: 2,
        borderColor: "#000000",
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        fontWeight: 700,
      },
      center: {
        textAlign: "center",
      },
    },
    footer: {
      view: {
        display: "flex",
        flexDirection: "row",
        paddingHorizontal: 8,
        justifyContent: "space-between",
      },
      text: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        fontWeight: 700,
      },
    },
  });

  console.log("detail: ", detail)

  const LetterHead = () => (
    <View style={styles.letterHead.view1}>
      <Image src={logo} alt="" srcset="" style={styles.letterHead.image} />
      <View style={styles.letterHead.view2}>
        <Text style={styles.letterHead.republic}>
          Republic of the Philippines
        </Text>
        <Text style={styles.letterHead.municipality}>
          Municipality of Rodriguez, Rizal
        </Text>
        <Text style={styles.letterHead.brgy}>BARANGAY {detail.brgy}</Text>
        <Text style={styles.letterHead.address}>
          Barangay Hall, Dike Street, Rodriguez, Rizal | +63 (2) 8 948 0157
        </Text>
      </View>
      <Image src={returnLogo()} alt="" srcset="" style={styles.letterHead.image} />
    </View>
  );

  const Title = () => (
    <View style={styles.title.view1}>
      <Text style={styles.title.req}>{detail.service_name.toUpperCase()} REQUEST FORM</Text>
      <Text style={styles.title.id}>{detail.service_id}</Text>
    </View>
  );

  const Body = () => (
    <View style={styles.bodyHead.bodyParent}>
      {/* BODY HEAD */}
      <View style={styles.bodyHead.column}>
        <Text style={styles.bodyHead.text}>REQUEST ID: {detail.req_id}</Text>
        <Text style={styles.bodyHead.text}>
          USER ID: {detail.form && detail.form[0].user_id.value}
        </Text>
        <Text style={styles.bodyHead.text}>
          DATE AND TIME OF ACCOMPLISHED FORM: {formattedDate} {formattedTime}
        </Text>
      </View>
      {/* END OF BODY HEAD */}

      {/* PERSONAL INFORMATION */}
      <View style={styles.info.parent}>
        <Text style={styles.info.header}>I. PERSONAL INFORMATION</Text>

        <View style={styles.info.table}>
          {detail.form &&
            Object.entries(filterPersonalInformation(detail.form[0])).map(
              ([key, value], idx) => {
                return value.display !== "address" ? (
                  <View key={idx} style={styles.info.tableCell}>
                    <Text style={styles.info.label}>
                      {value.display.toUpperCase() + ":"}
                    </Text>
                    <Text style={styles.info.value}>{value.value}</Text>
                  </View>
                ) : (
                  <View
                    key={idx}
                    style={{
                      flex: "1 0 100%",
                      padding: 8,
                      borderTop: 1,
                      borderColor: "#000000",
                      outlineWidth: 1,
                    }}
                  >
                    <Text style={styles.info.label}>
                      {value.display.toUpperCase() + ":"}
                    </Text>
                    <Text style={styles.info.value}>{value.value}</Text>
                  </View>
                );
              }
            )}
        </View>
      </View>
      {/* END OF PERSONAL INFORMATION */}

      {/* CUSTOMIZED INFORMATION */}
      {detail.form &&
        detail.form[1].map((item, idx) => (
          <View key={idx} style={styles.info.parent}>
            <Text style={styles.info.header}>
              {`${romanize(idx + 2)}. ${item.section_title}`}
            </Text>
            <View style={styles.info.table}>
              {item.form.map((form, idx) => {
                return form.type !== "file" ? (
                  <View
                    key={idx}
                    style={{
                      flex: "1 0 50%",
                      padding: 8,
                      borderTop: 1,
                      borderColor: "#000000",
                      outlineWidth: 1,
                    }}
                  >
                    <Text style={styles.info.label}>
                      {form.display.toUpperCase() + ":"}
                    </Text>
                    <Text style={styles.info.value}>{form.value}</Text>
                  </View>
                ) : null;
              })}
            </View>
          </View>
        ))}
      {/* END OF CUSTOMIZED INFORMATION */}

      {/* TERMS */}
      <View style={styles.terms.parent}>
        <Text style={styles.terms.bold}>
          I,{" "}
          <Text style={styles.terms.underline}>
          {detail.form && detail.form[0].lastName.value}, {detail.form && detail.form[0].firstName.value} {detail.form && detail.form[0].middleName.value}
          </Text>
          , a resident of{" "}
          <Text style={styles.terms.underline}>Barangay {detail.brgy} of Rodriguez, Rizal</Text>
          {" "}attest that
        </Text>
        <View style={styles.terms.listParent}>
          {terms.map((term, idx) => (
            <View key={idx} style={styles.terms.listChild}>
              <Text>•</Text>
              <Text style={styles.terms.text}>{term}</Text>
            </View>
          ))}
        </View>
        <View style={styles.terms.parentSign}>
          <View style={styles.terms.half}>
            <Text style={styles.terms.bold}>AFFIANT</Text>
            <View alt="" style={styles.terms.imageStyle}></View>
            <View style={styles.terms.signText}>
              <Text style={styles.terms.center}>
                Resident's Signature over Printed Name
              </Text>
            </View>
          </View>
          <View style={styles.terms.half}>
            <Text
              style={styles.terms.bold}
            >{`ASSISTED BY: (For Residents below 18 years old)`}</Text>
            <View alt="" style={styles.terms.imageStyle}></View>
            <View style={styles.terms.signText}>
              <Text style={styles.terms.center}>
                Parent/Guardian's Signature over Printed Name
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* END OF TERMS */}
    </View>
  );

  const Footer = () => (
    <View style={styles.footer.view}>
      <Text style={styles.footer.text}>THIS FORM IS NOT FOR SALE</Text>
      <Text style={styles.footer.text}>{detail.version}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="LEGAL" style={styles.body}>
        <LetterHead />
        <Title />
        <Body />
        <Footer />
      </Page>
    </Document>
  );
};

export default PrintPDF;
