import React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import API_LINK from "../../config/API";
import Chart from "react-apexcharts";

const TRB = () => {
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({
      chart: { type: 'bar' },
      xaxis: { categories: [] },
      yaxis: {  title: {
        text: "Total Revenue",
      },}
    });
  
    useEffect(() => {
      const fetchFeeSummary = async () => {
        try {
          const response = await axios.get(`${API_LINK}/requests/get_revenue`);
          const data = response.data;
          console.log(data);
          const barangays = [
            'Balite',
            'Burgos',
            'Geronimo',
            'Macabud',
            'Manggahan',
            'Mascap',
            'Puray',
            'Rosario',
            'San Isidro',
            'San Jose',
            'San Rafael',
          ];
  
          const mappedData = barangays.map((brgy) => {
            const found = data.find((item) => item._id.toUpperCase() === brgy.toUpperCase());
            return found ? found.totalFee : 0;
          });
  
          setSeries([{ name: 'Total Fee', data: mappedData }]);
          setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: { categories: barangays,  title: {
                text: "Barangays",
              }, },
          }));
        } catch (error) {
          console.error('Error fetching fee summary:', error);
        }
      };
  
      fetchFeeSummary();
    }, []);

    
    return (
      <>
        <div className="bg-[#e9e9e9] w-full lg:w-1/2 rounded-xl mt-5 justify-center items-center">
          <h1 className="mt-5 ml-5 font-medium text-black">
           Total Service Revenue per Barangay
          </h1>
          <div className="flex rounded-xl">
            {series.length > 0 && (
              <Chart
                options={options}
                series={series}
                type="bar"
                className="flex w-11/12 rounded-xl"
              />
            )}
          </div>
        </div>
      </>
  );
};

export default TRB;
