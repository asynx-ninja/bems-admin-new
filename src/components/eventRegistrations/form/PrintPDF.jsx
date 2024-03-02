import { useState, useEffect } from "react";
import {
  Font,
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "../../../assets/header/montalban-logo.png";
import OETMT from "../../../assets/fonts/Old-English-Text-MT.otf";
import ESITC from "../../../assets/fonts/Edwardian-Script-ITC.otf";
import axios from "axios";
import API_LINK from "../../../config/API";
import BagongPh from "../../../assets/image/bagong-pilipinas-logo.jpg"
Font.register({
  family: "Old-English-Text-MT",
  src: OETMT,
});

Font.register({
  family: "Edwardian-Script-ITC",
  src: ESITC,
});

const PrintPDF = ({ detail, officials }) => {
  const [date, setDate] = useState(new Date());
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const announcementsResponse = await axios.get(
          `${API_LINK}/announcement/specific/?brgy=${detail.brgy}&archived=false&event_id=${detail.event_id}`
        );

        setAnnouncements(announcementsResponse.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);

        console.error("Error response data:", error.response?.data);
        console.error("Error response status:", error.response?.status);
      }
    };

    fetchData();
  }, [detail.brgy]);

  console.log("announcements: ", announcements);
  console.log("event_id: ", detail.event_id);

 

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

  const formattedDate = `${day}${ordinalSuffix} day of ${date.toLocaleDateString(
    "en-PH",
    {
      month: "long",
      year: "numeric",
    }
  )}`;

  const formattedDate1 = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  };

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
        fontFamily: "Old-English-Text-MT",
        fontSize: 11,
      },
      municipality: {
        fontFamily: "Old-English-Text-MT",
        fontSize: 11,
        lineHeight: 1,
        marginTop: 3,
      },
      municipality1: {
        fontFamily: "Times-Bold",
        fontSize: 11,
        fontWeight: 700,
        marginTop: 3,
      },
      brgy: {
        fontFamily: "Times-Bold",
        fontSize: 14,
        fontWeight: 700,
        marginTop: 3,
      },
      office: {
        fontFamily: "Edwardian-Script-ITC",
        fontSize: 26,
      },
    },
    title: {
      view1: {
        paddingTop: 5,
        paddingBottom: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
      },
      req: {
        fontSize: 20,
        fontFamily: "Times-Bold",
        fontWeight: 700,
        textAlign: "center"
        // textDecoration: "underline",
      },
      id: {
        paddingTop: 3,
        fontSize: 11,
        fontFamily: "Times-Bold",
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
        width: "100%",
        gap: 10,
        marginTop: 45,
        marginBottom: 35,
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

  console.log("detail: ", detail);

  const LetterHead = () => (
    <View style={styles.letterHead.view1}>
      <Image
        src={BagongPh}
        alt=""
        srcset=""
        style={styles.letterHead.image}
      />

      <View style={styles.letterHead.view2}>
        <Text style={styles.letterHead.republic}>
          Republic of the Philippines
        </Text>
        <Text style={styles.letterHead.municipality}>Province of Rizal</Text>
        <Text style={styles.letterHead.municipality1}>
          Municipality of Rodriguez
        </Text>
        <Text style={styles.letterHead.brgy}>BARANGAY {detail.brgy}</Text>
        <Text style={styles.letterHead.office}>
          Office of the Barangay Chairman
        </Text>
      </View>

      <Image src={logo} alt="" srcset="" style={styles.letterHead.image} />
    </View>
  );

  const Title = () => (
    <View style={styles.title.view1}>
      <Text style={styles.title.req}>
        {detail.event_name.toUpperCase()}
      </Text>
      <Text style={styles.title.req}>
       EVENT CERTIFICATION
      </Text>
      <Text style={styles.title.id}>
        Event Certification for Event Registration
      </Text>
    </View>
  );

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

  const Body = () => (
    <View style={{ marginHorizontal: 15 }}>
      <Text style={{ fontSize: 12, marginTop: 20, fontFamily: "Times-Roman" }}>
        TO WHOM IT MAY CONCERN:
      </Text>

      <Text
        style={{
          marginTop: 20,
          textAlign: "justify",
          fontSize: 12,
          lineHeight: 2, // Adjust the lineHeight as needed
          textIndent: 30,
          fontFamily: "Times-Roman",
        }}
      >
        This is to certify that{" "}
        <Text style={{ fontSize: 12, fontFamily: "Times-Bold" }}>
          {detail.form && detail.form[0].firstName.value}{" "}
          {detail.form && detail.form[0].middleName.value}{" "}
          {detail.form && detail.form[0].lastName.value}
        </Text>
        , a registered resident of Barangay {detail.brgy}, Municipality of
        Rodriguez, Rizal, has successfully registered and will actively
        participate in the event titled {detail.event_name} held on{" "}
        {formattedDate1(announcements.date)}.
      </Text>

      <Text
        style={{
          marginTop: 20,
          textAlign: "justify",
          fontSize: 12,
          lineHeight: 2, // Adjust the lineHeight as needed
          textIndent: 30,
          fontFamily: "Times-Roman",
        }}
      >
        This certification is issued upon the request of{" "}
        <Text style={{ fontFamily: "Times-Bold", fontSize: 12 }}>
          {detail.form && detail.form[0].firstName.value}{" "}
          {detail.form && detail.form[0].middleName.value}{" "}
          {detail.form && detail.form[0].lastName.value}
        </Text>{" "}
        in connection with his/her Event Registration. Given this{" "}
        {formattedDate}, from the Office of the Punong Barangay, Barangay{" "}
        {detail.brgy}, Rodriguez Rizal.
      </Text>

      <View style={{ ...styles.terms.parentSign, justifyContent: "flex-end" }}>
        <View style={styles.terms.half}>
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              lineHeight: 1.3, // Adjust the lineHeight as needed
              fontFamily: "Times-Bold",
            }}
          >
            {detail.form && detail.form[0].firstName.value}{" "}
            {detail.form && detail.form[0].middleName.value}{" "}
            {detail.form && detail.form[0].lastName.value}
          </Text>
          <View style={styles.terms.signText}>
            <Text style={{ ...styles.terms.center, fontFamily: "Times-Bold" }}>
              Applicant's Signature
            </Text>
          </View>
        </View>
        <View style={styles.terms.half}>
          {officials
            .filter((official) => official.position === "City Mayor")
            .map((official) => (
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  lineHeight: 1.3, // Adjust the lineHeight as needed
                  fontFamily: "Times-Bold",
                }}
              >
                {official.lastName.toUpperCase()},{" "}
                {official.firstName.toUpperCase()}{" "}
                {official.middleName.toUpperCase()}
              </Text>
            ))}
          <View style={styles.terms.signText}>
            <Text style={{ ...styles.terms.center, fontFamily: "Times-Bold" }}>
              City Mayor
            </Text>
          </View>
        </View>
      </View>
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
      <Page size="A4" style={styles.body}>
        <LetterHead />
        <Divider />
        <Title />
        <Body />
      </Page>
    </Document>
  );
};

export default PrintPDF;
