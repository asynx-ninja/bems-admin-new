import { React } from "react";
// FORM INPUTS
import OccupationList from "./data/OccupationList";
import Religion from "./data/Religion";
import CivilStatus from "./data/CivilStatus";
import Sex from "./data/Sex";

const PersonalDetails = ({ detail }) => {
  return (
    <fieldset className="flex-col border-[1px] border-black rounded-md">
      <legend className="ml-2 px-2 text-sm font-medium">
        Personal Details
      </legend>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center items-start gap-3 p-6">
        {detail.form &&
          Object.entries(detail.form[0]).map(([key, item], idx) => {
            return (
              <div
                key={idx}
                className={
                  item.display === "address"
                    ? "sm:col-span-1 md:col-span-2 lg:col-span-3"
                    : "col-span-1"
                }
              >
                {item.display === "user id" && null}
                {item.display === "occupation" ? (
                  <OccupationList variable={key} item={item} />
                ) : null}
                {item.display === "civil status" ? (
                  <CivilStatus variable={key} item={item} />
                ) : null}
                {item.display === "religion" ? (
                  <Religion variable={key} item={item} />
                ) : null}
                {item.display === "sex" ? (
                  <Sex variable={key} item={item} />
                ) : null}
                {item.type === "file" ? (
                  <input
                    type={item.type}
                    name={key}
                    id={item.display}
                    accept="image/*"
                    className="hidden"
                  />
                ) : null}
                {item.type === "date" ||
                item.type === "email" ||
                item.type === "number" ||
                item.type === "text" ? (
                  <div>
                    <label
                      htmlFor={item.display}
                      className="block sm:text-xs lg:text-sm font-medium mb-2"
                    >
                      {item.display.toUpperCase()}
                    </label>
                    <input
                      name={key}
                      type={item.type}
                      id={item.display}
                      value={item.value}
                      readOnly
                      className={`border-gray-400 border py-3 px-4 block w-full  text-black rounded-md text-sm focus:border-green-500 focus:ring-green-500 bg-white`}
                      aria-describedby="hs-input-helper-text"
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </fieldset>
  );
};

export default PersonalDetails;
