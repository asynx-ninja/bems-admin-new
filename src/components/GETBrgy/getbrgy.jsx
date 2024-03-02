import { useEffect, useState } from "react";
import axios from "axios";
import API_LINK from "../../config/API";

const getBrgy = (brgy) => {
  const [information, setInformation] = useState({});

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const response = await axios.get(
          `${API_LINK}/brgyinfo/?brgy=${brgy}&archived=true`
        );
        console.log("hays", response);
        if (response.status === 200) {
          setInformation(response.data[0]);
        } else {
          setInformation({});
        }
      } catch (error) {
        console.error("Error fetching information:", error);
        setInformation({});
      }
    };

    fetchInformation();
  }, [brgy]);
  
  

  return information;
};

export default getBrgy;
