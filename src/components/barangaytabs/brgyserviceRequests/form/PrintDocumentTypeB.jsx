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
import BAGONG_PILIPINAS from "../../../../assets/image/bagong-pilipinas-logo.jpg";

const PrintDocumentTypeB = ({ detail, officials = { officials }, brgy }) => {
  const [date, setDate] = useState(new Date());

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
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 35,
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
        fontSize: 12,
      },
      municipality: {
        fontFamily: "Times-Roman",
        fontSize: 12,
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
    backgroundImage: {
      position: "absolute",
      height: "410px",
      width: "100%",
      top: 50,
      left: 10,
      right: 0,
      bottom: 0,
      opacity: 0.1, // Set the opacity of the background image
    },
  });

  const Divider = () => (
    <View
      style={{
        borderBottomWidth: 2,
        borderBottomColor: "#000000",
        marginTop: 10,
        marginBottom: 10,
      }}
    />
  );

  const TwoColumns = ({ children }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {children}
    </View>
  );

  const LetterHead = () => (
    <View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          src={BAGONG_PILIPINAS}
          alt=""
          srcset=""
          style={styles.letterHead.image}
        />
      </View>
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
            Barangay Hall, Dike Street, Rodriguez, Rizal
          </Text>
          <Text style={styles.letterHead.address}>
            E-mail Address: montalbanpublicinformation@gmail.com
          </Text>
          <Text style={styles.letterHead.address}>
            Telephone: 0967-291-5669
          </Text>
        </View>
        <Image
          src={returnLogo()}
          alt=""
          srcset=""
          style={styles.letterHead.image}
        />
      </View>
    </View>
  );

  const Body = () => (
    <View>
      <TwoColumns>
        <View style={{ width: "26%", borderRightWidth: 2, borderRightColor: "#000000" }}>
          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 12,
              marginTop: 30,
            }}
          >
            BARANGAY {detail.brgy.toUpperCase()}
          </Text>

          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 10,
              marginTop: 30,
            }}
          >
            BARANGAY CHAIRMAN
          </Text>

          {officials
            .filter((official) => official.position === "Barangay Chairman")
            .map((official) => (
              <Text
                key={official.user_id}
                style={{
                  ...styles.terms.bold,
                  textAlign: "center",
                  marginTop: 5,
                  marginLeft: 12,
                  marginRight: 12,
                  fontSize: 8,
                }}
              >
                {official.lastName}, {official.firstName} {official.middleName}
              </Text>
            ))}

          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 10,
              marginTop: 30,
            }}
          >
            BARANGAY KAGAWAD
          </Text>

          {officials
            .filter((official) => official.position === "Barangay Kagawad")
            .map((official) => (
              <Text
                key={official.user_id}
                style={{
                  ...styles.terms.bold,
                  textAlign: "center",
                  marginTop: 5,
                  marginLeft: 12,
                  marginRight: 12,
                  fontSize: 8,
                }}
              >
                {official.lastName}, {official.firstName} {official.middleName}
              </Text>
            ))}

          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 10,
              marginTop: 30,
            }}
          >
            SK CHAIRMAN
          </Text>

          {officials
            .filter((official) => official.position === "SK Chairman")
            .map((official) => (
              <Text
                key={official.user_id}
                style={{
                  ...styles.terms.bold,
                  textAlign: "center",
                  marginTop: 10,
                  marginLeft: 12,
                  marginRight: 12,
                  fontSize: 8,
                }}
              >
                {official.lastName}, {official.firstName} {official.middleName}
              </Text>
            ))}

          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 10,
              marginTop: 30,
            }}
          >
            SECRETARY
          </Text>

          {officials
            .filter((official) => official.position === "Secretary")
            .map((official) => (
              <Text
                key={official.user_id}
                style={{
                  ...styles.terms.bold,
                  textAlign: "center",
                  marginTop: 10,
                  marginLeft: 12,
                  marginRight: 12,
                  fontSize: 8,
                }}
              >
                {official.lastName}, {official.firstName} {official.middleName}
              </Text>
            ))}

          <Text
            style={{
              ...styles.terms.bold,
              textAlign: "center",
              fontSize: 10,
              marginTop: 30,
            }}
          >
            TREASURER
          </Text>

          {officials
            .filter((official) => official.position === "Treasurer")
            .map((official) => (
              <Text
                key={official.user_id}
                style={{
                  ...styles.terms.bold,
                  textAlign: "center",
                  marginTop: 10,
                  marginLeft: 12,
                  marginRight: 12,
                  fontSize: 8,
                }}
              >
                {official.lastName}, {official.firstName} {official.middleName}
              </Text>
            ))}
        </View>

        <View style={{ ...styles.bodyHead.column, width: "74%" }}>
        <Image src={returnLogo()} style={styles.backgroundImage} />
      {/* BODY HEAD */}
      <View style={styles.bodyHead.column}>
        <Text style={{ ...styles.bodyHead.text, marginTop: 10 }}>
          Control Number: {detail.req_id}
        </Text>
      </View>
      {/* END OF BODY HEAD */}

      {/* TERMS */}
      <View style={{ marginLeft: 10, marginRight: 10 }}>
        <Text
          style={{
            ...styles.terms.bold,
            textAlign: "center",
            fontSize: 16,
            marginTop: 30,
          }}
        >
          BARANGAY CLEARANCE
        </Text>
        <Text style={{ fontSize: 12, marginTop: 10 }}>
          To Whom It May Concern:
        </Text>
        <Text
          style={{
            marginTop: 20,
            textAlign: "justify",
            fontSize: 12,
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          This is to certify that the person whose name and right thumb mark
          appear hereon has requested a RECORD CLEARANCE from this office and
          the result(s) is/are listed below:
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 25,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          NAME : {detail.form && detail.form[0].firstName.value}{" "}
          {detail.form && detail.form[0].middleName.value}{" "}
          {detail.form && detail.form[0].lastName.value}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 15,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          AGE :{" "}
          {detail.form && detail.form[0].age && detail.form[0].age.value
            ? detail.form[0].age.value
            : ""}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 15,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          SEX/CIVIL STATUS :{" "}
          {detail.form && detail.form[0].sex && detail.form[0].sex.value
            ? detail.form[0].sex.value
            : ""}{" "}
          /{" "}
          {detail.form &&
          detail.form[0].age &&
          detail.form[0].civil_status.value
            ? detail.form[0].civil_status.value
            : ""}
        </Text>
        <Text
          style={{
            fontSize: 12,
            marginTop: 15,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          BIRTH DATE:{" "}
          {detail.form && detail.form[0].birthday && detail.form[0].birthday.value
            ? detail.form[0].birthday.value
            : ""}{" "}
          / {detail.form && detail.form[0].address && detail.form[0].address.value
            ? detail.form[0].address.value
            : ""}{" "}
        </Text>

        <Text
          style={{
            fontSize: 12,
            marginTop: 15,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          ADDRESS:{" "}
          {detail.form && detail.form[0].address && detail.form[0].address.value
            ? detail.form[0].address.value
            : ""}{" "}
        </Text>

        <Text
          style={{
            fontSize: 12,
            marginTop: 15,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          REMARKS:  {detail.form && detail.form[1].remarks && detail.form[1].remarks.value
            ? detail.form[1].remarks.value
            : ""}{" "}
        </Text>

        <Text
          style={{
            fontSize: 12,
            marginTop: 15,

            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          PURPOSE:  {detail.form && detail.form[1].purpose && detail.form[1].purpose.value
            ? detail.form[1].purpose.value
            : ""}{" "}
        </Text>

        <View
          style={{ ...styles.terms.parentSign, justifyContent: "flex-end" }}
        >
          <View style={styles.terms.half}>
            {officials
              .filter((official) => official.position === "Barangay Chairman")
              .map((official) => (
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: "center",
                    lineHeight: 2, // Adjust the lineHeight as needed
                  }}
                >
                  {official.lastName}, {official.firstName}{" "}
                  {official.middleName}
                </Text>
              ))}
            <View style={styles.terms.signText}>
              <Text style={styles.terms.center}>Punong Barangay</Text>
            </View>
          </View>
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: 10,
            marginTop: 30,
            marginBottom: 5,
            textAlign: "justify",
            lineHeight: 2, // Adjust the lineHeight as needed
          }}
        >
          Note: Not valid without Official Barangay dry seal
        </Text>
      </View>
      {/* END OF TERMS */}
        </View>
      </TwoColumns>
      {/* END OF TERMS */}
    </View>
  );

  const Footer = () => (
    <View style={{ ...styles.footer.view, marginTop: 30 }}>
      <Text style={styles.footer.text}>THIS FORM IS NOT FOR SALE</Text>
      <Text style={styles.footer.text}>{detail.version}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <LetterHead />
        <Divider />
        <Body />
        <Footer />
      </Page>
    </Document>
  );
};

export default PrintDocumentTypeB;
