import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Upload,
} from "antd";

function JoiningForm() {

  const navigate = useNavigate();

  const [values, setValues] = useState({
    eID: "",
    name: "",
    department: "",
    designation: "",
    DOB: "",
    gender: "",
    maritalStatus: "",
    personalContactNumber: "",
    alternateContactNumber: "",
    personalEmail: "",
    officialEmail: "",
    password: "",
    bloodGroup: "",
    employmentType: "",
    empPan: "",
    empAadhar: "",
    passportNumber: "",
    role: "",
    stat: "",
    document: "",
  });

  const [permanent, setPermanentAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [current, setCurrentAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  const [nominee, setNominee] = useState({
    name: "",
    relation: "",
    contact: "",
    aadharCard: "",
  });

  const [documents, setDocuments] = useState([]);

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);

    const updatedDocuments = files.map((file) => ({
      documentName: file.name,
      documentImage: URL.createObjectURL(file), //to generate the temporary preview URL
    }));

    setDocuments((prevDocuments) => [...prevDocuments, ...updatedDocuments]);
  };

  const handleNomineeChange = (e) => {
    setNominee({ ...nominee, [e.target.name]: e.target.value });
  };

  const handlePermanentAddressChange = (field, value) => {
    setPermanentAddress({ ...permanent, [field]: value });
    if (isSameAddress) {
      setCurrentAddress({ ...permanent, [field]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    setIsSameAddress(e.target.checked);
    if (e.target.checked) {
      setCurrentAddress(permanent);
    }
    else{
      setCurrentAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      });
    }
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // combining all the data
    const finalData = {
      ...values,
      address: {
        permanent,
        current,
      },
      nominee,
      documents: documents.map((doc) => ({
        documentName: doc.documentName,
        documentImage: doc.documentImage, // Replace this with base64 or form data upload in production
      })),
    };

    // register API call
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No token available, please log in again.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/regemp",
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("New Employee Registered");
        alert("New employee Registered");
        navigate("/dashboard");

      }
    } catch (error) {
      console.error("Error registering new employee:", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please check your login or token.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }

    // setFormSubmissionData([...formSubmissionData, values]);

    // const formData = JSON.stringify(values);  /* converting object values to JSON*/

    // console.log(formSubmissionData);

    // setValues({
    //   eID: "",
    //   name: "",
    //   DOB: "",
    //   gender: "",
    //   maritalStatus: "",
    //   personalContactNumber: "",
    //   alternateContactNumber: "",
    //   prsonalEmail: "",
    //   officialEmail: "",
    //   password: "",
    //   bloodGroup: "",
    //   employmentType: "",
    //   empAadhar: "",
    //   passportNumber: "",
    //   stat: "",
    //   document: "",
    // });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="text-black grid grid-cols-4 gap-x-20 gap-y-2"
    >
      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="eID"
        >
          Employee ID 
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          placeholder="AT-00"
          type="text"
          name="eID"
          value={values.eID}
          onChange={handleChanges}
          required
          disabled
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="name"
        >
          Employee Name <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="name"
          value={values.name}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="department"
        >
          Department <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="gender"
          value={values.department}
          onChange={handleChanges}
          
        >
          <option value="">--Select--</option>
          <option value="Design">Design</option>
          <option value="Instrumentation">Instrumentation</option>
          <option value="HR">HR</option>
          <option value="R&D">R&D</option>
          <option value="IT">IT</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="designation"
        >
          Designation <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="designation"
          value={values.designation}
          onChange={handleChanges}
          
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="DOB"
        >
          Date of Birth <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="DOB"
          value={values.DOB}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="gender"
        >
          Gender <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="gender"
          value={values.gender}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="maritalStatus"
        >
          Marital Status <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="maritalStatus"
          value={values.maritalStatus}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="personalContactNumber"
        >
          Contact Number <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Contact Number"
          name="personalContactNumber"
          maxLength={10}
          value={values.personalContactNumber}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="alternateContactNumber"
        >
          Alternate Number
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Alternate Number"
          name="alternateContactNumber"
          maxLength={10}
          value={values.alternateContactNumber}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="personalEmail"
        >
          Personal Email <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="email"
          placeholder="example@mail.com"
          name="personalEmail"
          value={values.personalEmail}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="officialEmail"
        >
          Official Email <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="email"
          placeholder="example@mail.com"
          name="officialEmail"
          value={values.officialEmail}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="password"
        >
          Create Password
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="password"
          placeholder=""
          name="password"
          value={values.password}
          onChange={handleChanges}
        />
      </div>

      <div className="bg-gray-200 mt-5 w-full p-4 rounded col-span-4 gap-x-8">
        {/* Permanent Address */}
        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="street"
          >
            Street <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="street"
            value={permanent.street}
            onChange={(e) =>
              handlePermanentAddressChange("street", e.target.value)
            }
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="city"
          >
            City <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="city"
            value={permanent.city}
            onChange={(e) =>
              handlePermanentAddressChange("city", e.target.value)
            }
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="state"
          >
            State <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="state"
            value={permanent.state}
            onChange={(e) =>
              handlePermanentAddressChange("state", e.target.value)
            }
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="postalCode"
          >
            postalCode <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="postalCode"
            maxLength={6}
            value={permanent.postalCode}
            onChange={(e) =>
              handlePermanentAddressChange("postalCode", e.target.value)
            }
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="country"
          >
            Country <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="country"
            value={permanent.country}
            onChange={(e) =>
              handlePermanentAddressChange("country", e.target.value)
            }
          />
        </div>

        {/* Checkbox for Same Address */}
        <div className="col-span-4 mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={isSameAddress}
              onChange={handleCheckboxChange}
            />
            Same as Permanent Address
          </label>
        </div>

        {/* current Address */}
        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="street"
          >
            Street <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="street"
            value={current.street}
            onChange={(e) =>
              setCurrentAddress({
                ...current,
                street: e.target.value,
              })
            }
            disabled={isSameAddress}
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="city"
          >
            City <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="city"
            value={current.city}
            onChange={(e) =>
              setCurrentAddress({
                ...current,
                city: e.target.value,
              })
            }
            disabled={isSameAddress}
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="state"
          >
            State <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="state"
            value={current.state}
            onChange={(e) =>
              setCurrentAddress({
                ...current,
                state: e.target.value,
              })
            }
            disabled={isSameAddress}
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="postalCode"
          >
            postalCode <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="postalCode"
            maxLength={6}
            value={current.postalCode}
            onChange={(e) =>
              setCurrentAddress({
                ...current,
                postalCode: e.target.value,
              })
            }
            disabled={isSameAddress}
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 mb-1 text-left "
            htmlFor="country"
          >
            Country <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            name="country"
            value={current.country}
            onChange={(e) =>
              setCurrentAddress({
                ...current,
                country: e.target.value,
              })
            }
            disabled={isSameAddress}
          />
        </div>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="bloodGroup"
        >
          Blood Group <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="bloodGroup"
          value={values.bloodGroup}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employmentType"
        >
          Employee Type <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="employmentType"
          value={values.employmentType}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Consultant">Consultant</option>
        </select>
      </div>

      {/* Nominee Details*/}
      <div className="bg-gray-200 mt-5 w-full p-4 rounded col-span-4 gap-x-8">
        <div className="col-span-2">
          <label
            className="text-base block w-full m-2 mb-1 text-left "
            htmlFor="name"
          >
            Nominee Name <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            // placeholder="Enter employee Name"
            name="name"
            value={nominee.name}
            onChange={handleNomineeChange}
            required
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full m-2 mb-1 text-left "
            htmlFor="relation"
          >
            Relation <span className="text-red-600">*</span>
          </label>
          <input
            className="w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            // placeholder="Enter employee Name"
            name="relation"
            value={nominee.relation}
            onChange={handleNomineeChange}
            required
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full m-2 mb-1 text-left "
            htmlFor="contact"
          >
            Contact Number <span className="text-red-600">*</span>
          </label>
          <input
            className=" w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            // placeholder="Contact Number"
            name="contact"
            maxLength={10}
            value={nominee.contact}
            onChange={handleNomineeChange}
            required
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full m-2 mb-1 text-left "
            htmlFor="aadharCard"
          >
            Aadhar Card Number <span className="text-red-600">*</span>
          </label>
          <input
            className=" w-full bg-white block p-2 text-sm rounded-md border"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            name="aadharCard"
            minLength={12}
            maxLength={12}
            value={nominee.aadharCard}
            onChange={handleNomineeChange}
          />
        </div>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="empPan"
        >
          PAN Card Number <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="empPan"
          minLength={10}
          maxLength={10}
          value={values.empPan}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="empAadhar"
        >
          Aadhar Card Number <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          placeholder="XXXX-XXXX-XXXX"
          name="empAadhar"
          minLength={12}
          maxLength={12}
          value={values.empAadhar}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="passportNumber"
        >
          Passport Number (if Any)
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="XXXX-XXXX-XXXX"
          name="passportNumber"
          value={values.passportNumber}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="role"
        >
          Role <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="role"
          value={values.role}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="Employee">Employee</option>
          <option value="admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="stat"
        >
          Employee Status <span className="text-red-600">*</span>
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="stat"
          value={values.stat}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="regular">Regular</option>
          <option value="releived">Releived</option>
          <option value="resigned">Resigned</option>
        </select>
      </div>

      {/* <div className="col-span-2">
        <label
          className="text-base block w-full mt-2  text-left "
          htmlFor="document"
        >
          Document
        </label>
        <input
          type="file"
          name="document"
          value={values.document}
          onChange={handleChanges}
          required
          multiple
        />
      </div> */}

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 text-left"
          htmlFor="document"
        >
          Upload Documents <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          name="document"
          onChange={handleDocumentChange}
          multiple
          className="w-full p-2 border bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      {/* Display uploaded documents */}
      <div className="mt-4 col-span-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center space-x-4 mb-2">
            <span className="font-medium">{doc.documentName}</span>
            <img
              src={doc.documentImage}
              alt="Preview"
              className="w-16 h-16 object-cover border"
            />
          </div>
        ))}
      </div>

      <div className="col-span-3 mt-3">
        <button className="bg-blue-500" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default JoiningForm;
