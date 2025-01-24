import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eID: "",
    name: "",
    department: "",
    designation: "",
    personalEmail: "",
    typeOfLeave: "",
    specifyIfOthers: "",
    startDate: "",
    endDate: "",
    numberOfDays: 0,
    reasonForLeave: "",
    emergencyContact: "",
    addressDuringLeave: "",
    supervisor: {
      name: "",
      officialEmail: "",
    },
    additionalNotes: "",
    declaration: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch initial data from localStorage
    const empData = JSON.parse(localStorage.getItem("empData") || "{}");
    setFormData((prevData) => ({
      ...prevData,
      eID: empData.eID || "",
      name: empData.name || "",
      department: empData.department || "",
      designation: empData.designation || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("supervisor.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        supervisor: {
          ...formData.supervisor,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (
      startDate.toString() === "Invalid Date" ||
      endDate.toString() === "Invalid Date"
    ) {
      alert("Please enter valid date");
      return 0;
    }

    if (endDate >= startDate) {
      const diffTime = Math.abs(endDate - startDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    updatedData.numberOfDays = calculateDays(
      updatedData.startDate,
      updatedData.endDate
    );
    setFormData(updatedData);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.declaration) {
      alert("Please acknowledge the declaration before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        // "http://localhost:3000/api/apply-leave",
        "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/apply-leave",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(formData);

      if (response.status === 201) {
        setFormData({
          eID: "",
          name: "",
          department: "",
          designation: "",
          personalEmail: "",
          typeOfLeave: "",
          specifyIfOthers: "",
          startDate: "",
          endDate: "",
          numberOfDays: 0,
          reasonForLeave: "",
          emergencyContact: "",
          addressDuringLeave: "",
          supervisor: {
            name: "",
            officialEmail: "",
          },
          additionalNotes: "",
          declaration: false,
        });
        navigate("/dashboard");
        alert("Form submitted successfully!");
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.status === 500) {
        alert("Internal Server Error: Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Leave Application Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Details */}
        {[
          { label: "Employee ID", name: "eID", readOnly: true },
          { label: "Name", name: "name", readOnly: true },
          { label: "Department", name: "department", readOnly: true },
          { label: "Designation", name: "designation", readOnly: true },
          { label: "Personal Email", name: "personalEmail" },
          { label: "Reason for Leave", name: "reasonForLeave" },
        ].map(({ label, name, readOnly }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-700 font-medium">
              {label}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              readOnly={readOnly}
              className={`mt-1 p-2 border bg-white ${readOnly ? "bg-gray-100" : ""} rounded-md`}
              required={!readOnly}
            />
          </div>
        ))}

        {/* Type of Leave */}
        <div className="flex flex-col">
          <label htmlFor="typeOfLeave" className="text-gray-700 font-medium">
            Type of Leave<span className="text-red-600">*</span>
          </label>
          <select
            id="typeOfLeave"
            name="typeOfLeave"
            value={formData.typeOfLeave}
            onChange={handleChange}
            className="mt-1 p-2 border bg-white border-gray-300 rounded-md"
            required
          >
            <option value="">Select Type of Leave</option>
            {[
              "Sick Leave",
              "Casual Leave",
              "Earned Leave",
              "Half Day Leave",
              "Short Leave",
              "Others",
            ].map((leaveType) => (
              <option key={leaveType} value={leaveType}>
                {leaveType}
              </option>
            ))}
          </select>
        </div>

        {/* Specify If Others */}
        {formData.typeOfLeave === "Others" && (
          <div className="flex flex-col">
            <label
              htmlFor="specifyIfOthers"
              className="text-gray-700 font-medium"
            >
              Specify If Others
            </label>
            <input
              type="text"
              id="specifyIfOthers"
              name="specifyIfOthers"
              value={formData.specifyIfOthers}
              onChange={handleChange}
              className="mt-1 p-2 border bg-white border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Start and End Date */}
        {[
          { label: "Start Date", name: "startDate" },
          { label: "End Date", name: "endDate" },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-700 font-medium">
              {label}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id={name}
              name={name}
              value={formData[name]} // Convert stored DD-MM-YYYY format back to YYYY-MM-DD for the input
              onChange={handleDateChange}
              className="mt-1 p-2 border bg-gray-200 border-gray-300 rounded-md"
              required
              min={today} // Restrict past dates
            />
          </div>
        ))}

        {/* Number of Days */}
        <div className="flex flex-col">
          <label htmlFor="numberOfDays" className="text-gray-700 font-medium">
            Number of Days<span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            id="numberOfDays"
            name="numberOfDays"
            value={formData.numberOfDays}
            readOnly
            className="mt-1 p-2 border border-gray-300 bg-white rounded-md"
          />
        </div>

        <div className="flex flex-col">
        <label htmlFor="emergencyContact" className="text-gray-700 font-medium">
            Emergency Contact
          </label>
          <input
            type="text"
            id="emergencyContact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            maxLength={10}
            pattern="[0-9]{10}"
            className="mt-1 p-2 border border-gray-300 bg-white rounded-md"
          />
        </div>

        {/* Emergency Contact, Address During Leave, Additional Notes */}
        {[
          { label: "Address During Leave", name: "addressDuringLeave" },
          { label: "Additional Notes", name: "additionalNotes" },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-700 font-medium">
              {label}
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="mt-1 p-2 border bg-white border-gray-300 rounded-md"
            />
          </div>
        ))}

        {/* Supervisor Details */}
        {[
          { label: "Supervisor Name", name: "supervisor.name" },
          {
            label: "Supervisor Official Email",
            name: "supervisor.officialEmail",
          },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-gray-700 font-medium">
              {label}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={
                name.startsWith("supervisor.")
                  ? formData.supervisor[name.split(".")[1]] || ""
                  : formData[name] || ""
              }
              onChange={handleChange}
              className="mt-1 p-2 border bg-white border-gray-300 rounded-md"
              required
            />
          </div>
        ))}

        {/* Declaration */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="declaration"
            name="declaration"
            checked={formData.declaration}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="declaration" className="ml-2 text-gray-700">
            I acknowledge that the above information is true and correct.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.declaration || isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            formData.declaration
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;
