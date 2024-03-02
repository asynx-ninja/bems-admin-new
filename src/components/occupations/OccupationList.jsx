import React from 'react'
import { useLocation } from 'react-router-dom'

const OccupationList = ({ handleChange, handleUserDataChange, occupation, editButton }) => {
  const location = useLocation()
  const page = location.pathname.split("/")[1]
console.log("luh",occupation)
  return (
    <select
      className="form-control dropdown py-3 px-4 border block w-full text-black border-gray-200 rounded-md text-sm focus:border-green-500 focus:ring-green-500 "
      value={page === "settings" ? occupation : ""}
      disabled={page === "settings" ? editButton : false}
      id="occupation" name="occupation"
      onChange={page === "settings" ? (e) => handleUserDataChange('occupation', e.target.value) : handleChange}>
      <option value="" disabled="disabled">
        -- select occupation --
      </option>
      <optgroup label="Healthcare Practitioners and Technical Occupations:">
        <option value="Chiropractor">Chiropractor</option>
        <option value="Dentist">Dentist</option>
        <option value="Dietitian or Nutritionist">Dietitian or Nutritionist</option>
        <option value="Optometrist">Optometrist</option>
        <option value="Pharmacist">Pharmacist</option>
        <option value="Physician">Physician</option>
        <option value="Physician Assistant">Physician Assistant</option>
        <option value="Podiatrist">Podiatrist</option>
        <option value="Registered Nurse">Registered Nurse</option>
        <option value="Therapist">Therapist</option>
        <option value="Veterinarian">Veterinarian</option>
        <option value="Health Technologist or Technician">
          Health Technologist or Technician
        </option>
        <option value="Other Healthcare Practitioners and Technical Occupation">
          Other Healthcare Practitioners and Technical Occupation
        </option>
      </optgroup>
      <optgroup label="Healthcare Support Occupations:">
        <option value="Nursing, Psychiatric, or Home Health Aide">
          Nursing, Psychiatric, or Home Health Aide
        </option>
        <option value="Occupational and Physical Therapist Assistant or Aide">
          Occupational and Physical Therapist Assistant or Aide
        </option>
        <option value="Other Healthcare Support Occupation">
          Other Healthcare Support Occupation
        </option>
      </optgroup>
      <optgroup label="Business, Executive, Management, and Financial Occupations:">
        <option value="Chief Executive">Chief Executive</option>
        <option value="General and Operations Manager">
          General and Operations Manager
        </option>
        <option
          value="Advertising, Marketing, Promotions, Public Relations, and Sales
      Manager"
        >
          Advertising, Marketing, Promotions, Public Relations, and Sales Manager
        </option>
        <option value="Operations Specialties Manager (e.g., IT or HR Manager)">
          Operations Specialties Manager (e.g., IT or HR Manager)
        </option>
        <option value="Construction Manager">Construction Manager</option>
        <option value="Engineering Manager">Engineering Manager</option>
        <option value="Accountant, Auditor">Accountant, Auditor</option>
        <option value="Business Operations or Financial Specialist">
          Business Operations or Financial Specialist
        </option>
        <option value="Business Owner">Business Owner</option>
        <option value="Other Business, Executive, Management, Financial Occupation">
          Other Business, Executive, Management, Financial Occupation
        </option>
      </optgroup>
      <optgroup label="Architecture and Engineering Occupations:">
        <option value="Architect, Surveyor, or Cartographer">
          Architect, Surveyor, or Cartographer
        </option>
        <option value="Engineer">Engineer</option>
        <option value="Other Architecture and Engineering Occupation">
          Other Architecture and Engineering Occupation
        </option>
      </optgroup>
      <optgroup label="Education, Training, and Library Occupations:">
        <option value="Postsecondary Teacher (e.g., College Professor)">
          Postsecondary Teacher (e.g., College Professor)
        </option>
        <option value="Primary, Secondary, or Special Education School Teacher">
          Primary, Secondary, or Special Education School Teacher
        </option>
        <option value="Other Teacher or Instructor">
          Other Teacher or Instructor
        </option>
        <option value="Other Education, Training, and Library Occupation">
          Other Education, Training, and Library Occupation
        </option>
      </optgroup>
      <optgroup label="Other Professional Occupations:">
        <option value="Arts, Design, Entertainment, Sports, and Media Occupations">
          Arts, Design, Entertainment, Sports, and Media Occupations
        </option>
        <option value="Computer Specialist, Mathematical Science">
          Computer Specialist, Mathematical Science
        </option>
        <option
          value="Counselor, Social Worker, or Other Community and Social Service
      Specialist"
        >
          Counselor, Social Worker, or Other Community and Social Service Specialist
        </option>
        <option value="Lawyer, Judge">Lawyer, Judge</option>
        <option
          value="Life Scientist (e.g., Animal, Food, Soil, or Biological Scientist,
      Zoologist)"
        >
          Life Scientist (e.g., Animal, Food, Soil, or Biological Scientist,
          Zoologist)
        </option>
        <option value="Physical Scientist (e.g., Astronomer, Physicist, Chemist, Hydrologist)">
          Physical Scientist (e.g., Astronomer, Physicist, Chemist, Hydrologist)
        </option>
        <option
          value="Religious Worker (e.g., Clergy, Director of Religious Activities or
      Education)"
        >
          Religious Worker (e.g., Clergy, Director of Religious Activities or
          Education)
        </option>
        <option value="Social Scientist and Related Worker">
          Social Scientist and Related Worker
        </option>
        <option value="Other Professional Occupation">
          Other Professional Occupation
        </option>
      </optgroup>
      <optgroup label="Office and Administrative Support Occupations:">
        <option value="Supervisor of Administrative Support Workers">
          Supervisor of Administrative Support Workers
        </option>
        <option value="Financial Clerk">Financial Clerk</option>
        <option value="Secretary or Administrative Assistant">
          Secretary or Administrative Assistant
        </option>
        <option value="Material Recording, Scheduling, and Dispatching Worker">
          Material Recording, Scheduling, and Dispatching Worker
        </option>
        <option value="Other Office and Administrative Support Occupation">
          Other Office and Administrative Support Occupation
        </option>
      </optgroup>
      <optgroup label="Services Occupations:">
        <option
          value="Protective Service (e.g., Fire Fighting, Police Officer, Correctional
      Officer)"
        >
          Protective Service (e.g., Fire Fighting, Police Officer, Correctional
          Officer)
        </option>
        <option value="Chef or Head Cook">Chef or Head Cook</option>
        <option value="Cook or Food Preparation Worker">
          Cook or Food Preparation Worker
        </option>
        <option value="Food and Beverage Serving Worker (e.g., Bartender, Waiter, Waitress)">
          Food and Beverage Serving Worker (e.g., Bartender, Waiter, Waitress)
        </option>
        <option value="Building and Grounds Cleaning and Maintenance">
          Building and Grounds Cleaning and Maintenance
        </option>
        <option
          value="Personal Care and Service (e.g., Hairdresser, Flight Attendant,
      Concierge)"
        >
          Personal Care and Service (e.g., Hairdresser, Flight Attendant, Concierge)
        </option>
        <option value="Sales Supervisor, Retail Sales">
          Sales Supervisor, Retail Sales
        </option>
        <option value="Retail Sales Worker">Retail Sales Worker</option>
        <option value="Insurance Sales Agent">Insurance Sales Agent</option>
        <option value="Sales Representative">Sales Representative</option>
        <option value="Real Estate Sales Agent">Real Estate Sales Agent</option>
        <option value="Other Services Occupation">Other Services Occupation</option>
      </optgroup>
      <optgroup label="Agriculture, Maintenance, Repair, and Skilled Crafts Occupations:">
        <option value="Construction and Extraction (e.g., Construction Laborer, Electrician)">
          Construction and Extraction (e.g., Construction Laborer, Electrician)
        </option>
        <option value="Farming, Fishing, and Forestry">
          Farming, Fishing, and Forestry
        </option>
        <option value="Installation, Maintenance, and Repair">
          Installation, Maintenance, and Repair
        </option>
        <option value="Production Occupations">Production Occupations</option>
        <option value="Other Agriculture, Maintenance, Repair, and Skilled Crafts Occupation">
          Other Agriculture, Maintenance, Repair, and Skilled Crafts Occupation
        </option>
      </optgroup>
      <optgroup label="Transportation Occupations:">
        <option value="Aircraft Pilot or Flight Engineer">
          Aircraft Pilot or Flight Engineer
        </option>
        <option value="Motor Vehicle Operator (e.g., Ambulance, Bus, Taxi, or Truck Driver)">
          Motor Vehicle Operator (e.g., Ambulance, Bus, Taxi, or Truck Driver)
        </option>
        <option value="Other Transportation Occupation">
          Other Transportation Occupation
        </option>
      </optgroup>
      <optgroup label="Other Occupations:">
        <option value="Student">Student</option>
        <option value="Military">Military</option>
        <option value="Homemaker">Homemaker</option>
        <option value="Other Occupation">Other Occupation</option>
        <option value="Don't Know">Don't Know</option>
        <option value="Not Applicable">Not Applicable</option>
      </optgroup>
    </select>

  )
}

export default OccupationList