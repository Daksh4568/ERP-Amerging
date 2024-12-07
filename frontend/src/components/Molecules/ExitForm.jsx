import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
// import {
//   Form,
//   Input,
//   Button,
//   Select,
//   DatePicker,
//   Typography,
//   Checkbox,
//   Table,
//   InputNumber,
//   List,
//   Row,
//   Col,
//   Rate,
// } from "antd";

// const { Title } = Typography;
// const { TextArea } = Input;

function ExitForm() {
  // const rateManagerQuestions = [
  //     "Follow policies & procedures",
  //     "Treats employees in a fair and equal way",
  //     "Provides recognition for a job well done",
  //     "Resolves complaints and problems",
  //     "Gives needed information",
  //     "Keeps employees busy",
  //     "Knows his/her job well",
  //     "Welcomes suggestions",
  //     "Maintains discipline",
  // ]
  // const managerRatingOptions = ["Never", "Sometimes", "Usually", "Always"];

  // const [form] = Form.useForm();

  // const rateDepartmentQuestions = [
  //     "Cooperation/teamwork in the department",
  //     "Cooperation with other departments",
  //     "Department training and OTJ training",
  //     "Communications",
  //     "Working Conditions",
  //     "Work Schedule",
  // ]
  // const departmentRatingOptions = ["Excellent", "Good", "Fair", "Poor"]

  const [formData, setFormData] = useState({
    employeeName: "",
    department: "",
    designation: "",
    lastWorkingDay: "",
    exitFeedback: {
      reasonForLeaving: "",
      experience: "",
      skillUtilization: "",
      trainingSupport: "",
      ideasValued: "",
      improvementSuggestions: "",
      finalComments: "",
    },
    managerRating: {
      followPolicies: "",
      fairTreatment: "",
      recognitionForJob: "",
      resolvesComplaints: "",
      givesInformation: "",
      keepsBusy: "",
      knowsJobWell: "",
      welcomesSuggestions: "",
      maintainsDiscipline: "",
    },
    departmentFeedback: {
      teamwork: "",
      interDepartmentCooperation: "",
      training: "",
      communication: "",
      workingConditions: "",
      workSchedule: "",
    },
    corporateComplianceAcknowledgement: {
      hasViolations: false,
      acknowledgementDate: "",
    },
    noDues: {
      accounts: { cleared: false, remarks: "" },
      stores: { cleared: false, remarks: "" },
      admin: { cleared: false, remarks: "" },
      it: { cleared: false, remarks: "" },
      hr: { cleared: false, remarks: "" },
      departmentHead: { cleared: false, remarks: "" },
    },
  });

  const handleComplianceChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      corporateComplianceAcknowledgement: {
        ...prev.corporateComplianceAcknowledgement,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("empData"));

        const fetchedData = {
          employeeId: storedData.eID,
          employeeName: storedData.name,
          department: "Embedded",
          designation: "SDE",
        };

        // Merging fetched data with formData
        setFormData((prevData) => ({
          ...prevData,
          ...fetchedData,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExitFeedbackChange = (field, message) => {
    setFormData((prevData) => ({
      ...prevData,
      exitFeedback: {
        ...prevData.exitFeedback,
        [field]: message,
      },
    }));
  };

  const handleManagerRatingChange = (field, newRating) => {
    setFormData((prevData) => ({
      ...prevData,
      managerRating: {
        ...prevData.managerRating,
        [field]: newRating,
      },
    }));
  };

  const handleDepartmentRatingChange = (field, newRating) => {
    setFormData((prevData) => ({
      ...prevData,
      departmentFeedback: {
        ...prevData.departmentFeedback,
        [field]: newRating,
      },
    }));
  };

  const handleNoDuesChange = (dept) => {
    setFormData({
      ...formData,
      noDues: {
        ...formData.noDues,
        [dept]: {
          ...formData.noDues[dept],
          cleared: !formData.noDues[dept].cleared,
        },
      },
    });
  };

  const handleRemarksChange = (dept, remarks) => {
    setFormData({
      ...formData,
      noDues: {
        ...formData.noDues,
        [dept]: { ...formData.noDues[dept], remarks },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // exit-form apit
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        alert("No token available, please log in again.");
        return;
      }
      console.log(JSON.stringify(formData));

      const response = await axios.post(
        "http://localhost:5000/exit-form",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Exit form successfully submitted");
        alert("Exit form successfully submitted");
        // navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Unauthorized: Please check your login or token.");
      } else {
        alert("Error submitting Exit form.", error.response.data);
      }
    }

    const values = JSON.stringify(formData, null, 2);
    console.log(values);
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
          Employee Name
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
          htmlFor="employeeId"
        >
          Employee ID
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          placeholder="AT-47"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChanges}
          required
          disabled
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="department"
        >
          Department
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="department"
          value={formData.department}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="designation"
        >
          Designation
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="designation"
          value={formData.designation}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="lastWorkingDay"
        >
          Last Working Day <span className="text-red-600">*</span>
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="lastWorkingDay"
          value={formData.lastWorkingDay}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-4 mt-4">
        <h3 className="text-lg font-bold mb-4 underline">
          No Dues Clearance <span className="text-red-600">*</span>
        </h3>

        <div className="grid grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg">
          <div className="font-semibold col-span-1">Department</div>
          <div className="font-semibold col-span-1 text-center">Cleared</div>
          <div className="font-semibold col-span-2 text-left">Remarks</div>

          {Object.keys(formData.noDues).map((dept) => (
            <React.Fragment key={dept}>
              <div className="capitalize col-span-1 flex items-center">
                {dept}
              </div>

              <div className="col-span-1 flex justify-center items-center">
                <input
                  type="checkbox"
                  checked={formData.noDues[dept].cleared}
                  onChange={() => handleNoDuesChange(dept)}
                  className="w-5 h-5"
                />
              </div>

              <div className="col-span-2">
                <textarea
                  className="w-full p-2 text-sm border rounded-md bg-white"
                  placeholder={`Remarks for ${dept} (if any)`}
                  value={formData.noDues[dept].remarks}
                  onChange={(e) => handleRemarksChange(dept, e.target.value)}
                  rows="2"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="col-span-4">
        <title className="text-base block w-full mt-2 mb-1 text-left ">
          I kindly request that you take a few moments to provide your input by
          responding to the questions below. Please rest assured that all your
          responses will be treated with the utmost confidentiality. Your
          cooperation is greatly appreciated. Thank you.
        </title>
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="reasonForLeaving"
        >
          Reason for leaving the company?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="reasonForLeaving"
          value={formData.reasonForLeaving}
          onChange={(e) =>
            handleExitFeedbackChange("reasonForLeaving", e.target.value)
          }
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="experience"
        >
          How was your experience working at the company?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="experience"
          value={formData.experience}
          onChange={(e) =>
            handleExitFeedbackChange("experience", e.target.value)
          }
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="skillUtilization"
        >
          Did you feel that your skills and talents were effectively utilized in
          your role? <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="skillUtilization"
          value={formData.skillUtilization}
          onChange={(e) =>
            handleExitFeedbackChange("skillUtilization", e.target.value)
          }
        />
      </div>
      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="trainingSupport"
        >
          Did you receive the necessary training and support to perform your job
          effectively? <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="trainingSupport"
          value={formData.trainingSupport}
          onChange={(e) =>
            handleExitFeedbackChange("trainingSupport", e.target.value)
          }
        />
      </div>
      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="ideasValued"
        >
          Did you feel that your ideas and opinions were valued and heard within
          the company? <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="ideasValued"
          value={formData.ideasValued}
          onChange={(e) =>
            handleExitFeedbackChange("ideasValued", e.target.value)
          }
        />
      </div>
      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="improvementSuggestions"
        >
          What areas do you think the company could improve upon?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="improvementSuggestions"
          value={formData.improvementSuggestions}
          onChange={(e) =>
            handleExitFeedbackChange("improvementSuggestions", e.target.value)
          }
        />
      </div>
      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="finalComments"
        >
          Do you have any final comments or suggestions for the company?{" "}
          <span className="text-red-600">*</span>
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows="2"
          name="finalComments"
          value={formData.finalComments}
          onChange={(e) =>
            handleExitFeedbackChange("finalComments", e.target.value)
          }
        />
      </div>

      <div className="col-span-4">
        <title className="text-base block w-full mt-2 mb-1 text-left underline">
          Rate your Manager on the following:{" "}
          <span className="text-red-600">*</span>
        </title>
      </div>

      <div className="col-span-4 border p-3 bg-gray-200">
        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="followPolicies"
          >
            Follow policies & procedures
          </label>
          <ReactStars
            count={5}
            name="followPolicies"
            value={formData.followPolicies}
            onChange={(rating) =>
              handleManagerRatingChange("followPolicies", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-2">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="fairTreatment"
          >
            Treats employees in a fair and equal way
          </label>
          <ReactStars
            count={5}
            name="fairTreatment"
            value={formData.fairTreatment}
            onChange={(rating) =>
              handleManagerRatingChange("fairTreatment", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="recognitionForJob"
          >
            Provides recognition for a job well done
          </label>
          <ReactStars
            count={5}
            name="recognitionForJob"
            value={formData.recognitionForJob}
            onChange={(rating) =>
              handleManagerRatingChange("recognitionForJob", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="resolvesComplaints"
          >
            Resolves complaints and problems
          </label>
          <ReactStars
            count={5}
            name="resolvesComplaints"
            value={formData.resolvesComplaints}
            onChange={(rating) =>
              handleManagerRatingChange("resolvesComplaints", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="givesInformation"
          >
            Gives needed informations
          </label>
          <ReactStars
            count={5}
            name="givesInformation"
            value={formData.givesInformation}
            onChange={(rating) =>
              handleManagerRatingChange("givesInformation", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="keepsBusy"
          >
            Keeps employees busy
          </label>
          <ReactStars
            count={5}
            name="keepsBusy"
            value={formData.keepsBusy}
            onChange={(rating) =>
              handleManagerRatingChange("keepsBusy", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="knowsJobWell"
          >
            Knows his/her job well
          </label>
          <ReactStars
            count={5}
            name="knowsJobWell"
            value={formData.knowsJobWell}
            onChange={(rating) =>
              handleManagerRatingChange("knowsJobWell", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="welcomesSuggestions"
          >
            Welcomes suggestions
          </label>
          <ReactStars
            count={5}
            name="welcomesSuggestions"
            value={formData.welcomesSuggestions}
            onChange={(rating) =>
              handleManagerRatingChange("welcomesSuggestions", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="maintainsDiscipline"
          >
            Maintains discipline
          </label>
          <ReactStars
            count={5}
            name="maintainsDiscipline"
            value={formData.maintainsDiscipline}
            onChange={(rating) =>
              handleManagerRatingChange("maintainsDiscipline", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>
      </div>

      <div className="col-span-4">
        <title className="text-base block w-full mt-2 mb-1 text-left underline">
          Rate your Manager on the following:{" "}
          <span className="text-red-600 no-underline">*</span>
        </title>
      </div>

      <div className="col-span-4 border p-3 bg-gray-200">
        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="teamwork"
          >
            Cooperation/teamwork in the department
          </label>
          <ReactStars
            count={5}
            name="teamwork"
            value={formData.teamwork}
            onChange={(rating) =>
              handleDepartmentRatingChange("teamwork", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="interDepartmentCooperation"
          >
            Cooperation with other departments
          </label>
          <ReactStars
            count={5}
            name="interDepartmentCooperation"
            value={formData.interDepartmentCooperation}
            onChange={(rating) =>
              handleDepartmentRatingChange("interDepartmentCooperation", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="training"
          >
            Department training and OTJ training
          </label>
          <ReactStars
            count={5}
            name="training"
            value={formData.training}
            onChange={(rating) =>
              handleDepartmentRatingChange("training", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="communication"
          >
            Communication
          </label>
          <ReactStars
            count={5}
            name="communication"
            value={formData.communication}
            onChange={(rating) =>
              handleDepartmentRatingChange("communication", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="workingConditions"
          >
            working Conditions
          </label>
          <ReactStars
            count={5}
            name="workingConditions"
            value={formData.workingConditions}
            onChange={(rating) =>
              handleDepartmentRatingChange("workingConditions", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>

        <div className="col-span-4">
          <label
            className="text-base block w-full mt-2 text-left "
            htmlFor="workSchedule"
          >
            Work Schedule
          </label>
          <ReactStars
            count={5}
            name="workSchedule"
            value={formData.workSchedule}
            onChange={(rating) =>
              handleDepartmentRatingChange("workSchedule", rating)
            }
            size={35}
            activeColor="gold"
          />
        </div>
      </div>

      <div className="col-span-4">
        {/* Checkbox for hasViolations */}
        <label className="text-base block w-full mt-2 mb-1 text-left underline">
          Corporate Compliance Violations{" "}
          <span className="text-red-600">*</span>
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="hasViolations"
            checked={formData.corporateComplianceAcknowledgement.hasViolations}
            onChange={(e) => handleComplianceChange(e)}
          />
          <span className="ml-2 text-sm">
            I have no knowledge of any violation of the law or any corporate
            policies or standards of conduct by me or any other employees while
            I have been employed at the company. If I recall any suspected
            violations in the future, I will immediately report them to the
            Compliance Officer.
          </span>
        </div>
      </div>

      <div className="col-span-4 mt-4">
        {/* Date input for acknowledgementDate */}
        <label className="text-base block w-full mt-2 mb-1 text-left">
          Acknowledgement Date <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          name="acknowledgementDate"
          className=" bg-white block p-2 text-sm rounded-md border"
          value={
            formData.corporateComplianceAcknowledgement.acknowledgementDate
          }
          onChange={(e) => handleComplianceChange(e)}
          required
        />
      </div>

      <div className="col-span-3 mt-3">
        <button className="bg-blue-500" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default ExitForm;
