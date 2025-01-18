import React, { useState } from "react";
import axios from "axios";


const SelfEvaluationForm = () => {

  const [formData, setFormData] = useState({
    employeeName: "",
    dateOfReview: "",
    designation: "",
    department: "",
    dateOfJoining: "",
    totalTenure: "",
    previousSalary: "",
    incrementedSalary: "",
    incrementedSalaryDate: "",
    numberOfProjectsHandled: "",
    currentResponsibilities: {
      keyResponsibilities: [],
      additionalResponsibilities: [],
    },
    performanceGoals: "",
    surplusResources: "",
    additionalContributions: "",
    challenges: "",
  });

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResponsibilitiesChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentResponsibilities: {
        ...prev.currentResponsibilities,
        [field]: value.split("\n"),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No token available, please log in again.");
        return;
      }
      // console.log(JSON.stringify(formData));

      const response = await axios.post("http://localhost:5000/employee-evaluation", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        // console.log("Evaluation form successfully submitted");
        alert("Evaluation form successfully submitted");
        // navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Unauthorized: Please check your login or token.");
      } else {
        alert("Error submitting evaluation form.", error.response.data);
      }
    }
    // const values = JSON.stringify(formData);
    // console.log(values);
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="text-black grid grid-cols-4 gap-x-20 gap-y-2"
    >
      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employeeName"
        >
          Employee Name <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="dateOfReview"
        >
          Date of Review <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          name="dateOfReview"
          value={formData.dateOfReview}
          onChange={handleChanges}
          required
        />
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
          name="designation"
          value={formData.designation}
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
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="dateOfJoining"
        >
          Date of Joining <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="totalTenure"
        >
          Total Tenure <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="totalTenure"
          value={formData.totalTenure}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="previousSalary"
        >
          Previous Salary <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          name="previousSalary"
          value={formData.previousSalary}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="incrementedSalary"
        >
          Incremented Salary <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          name="incrementedSalary"
          value={formData.incrementedSalary}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="incrementedSalaryDate"
        >
          Incremented Salary Date <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          name="incrementedSalaryDate"
          value={formData.incrementedSalaryDate}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="numberOfProjectsHandled"
        >
          Number of Projects Handled <span className="text-red-600">*</span>
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          name="numberOfProjectsHandled"
          value={formData.numberOfProjectsHandled}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="keyResponsibility"
        >
          Key Responsibility <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="keyResponsibility"
          value={formData.currentResponsibilities.keyResponsibilities.join(
            "\n"
          )}
          onChange={(e) =>
            handleResponsibilitiesChange("keyResponsibilities", e.target.value)
          }
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="additionalResponsibility"
        >
          Additional Responsibilities
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="additionalResponsibility"
          value={formData.currentResponsibilities.additionalResponsibilities}
          onChange={(e) =>
            handleResponsibilitiesChange(
              "additionalResponsibilities",
              e.target.value
            )
          }
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="performanceGoals"
        >
          Performance Goals <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="performanceGoals"
          value={formData.performanceGoals}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="surplusResources"
        >
          Surplus Resources <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="surplusResources"
          value={formData.surplusResources}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="additionalContributions"
        >
          Additional Contributions <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="additionalContributions"
          value={formData.additionalContributions}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="challenges"
        >
          Challenges Faced <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="3"
          name="challenges"
          value={formData.challenges}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-3 mt-3">
        <button className="bg-blue-500" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default SelfEvaluationForm;
