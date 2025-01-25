import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const LeaveStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const employeeData = JSON.parse(localStorage.getItem("empData"));
        const employeeId = employeeData?.eID;
        // console.log(employeeId);

        if (!employeeId) {
          alert("Employee ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        // const response = await axios.get("http://localhost:3000/api/leave-data", {
        const response = await axios.get("https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/leave-data", {
          headers: { 
            Authorization: `Bearer ${token}` ,
            "Content-Type": "application/json",
          },
        });

        setEmployeeData(employeeData);

        if (response.status === 200) {
          // Update the filter condition to match the correct field in the response
          const employeeLeaves = response.data.filter(
            (leave) => leave.eID === employeeId
          );
          setLeaves(employeeLeaves || []);
        } else {
          alert("Failed to fetch leave data.");
        }
      } catch (error) {
        console.error("Error fetching leaves:", error);
        alert("An error occurred while fetching leave data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  useEffect(() => {
    let filtered = leaves;

    if (filterStatus !== "all") {
      filtered = leaves.filter(
        (leave) => leave.status.toLowerCase() === filterStatus
      );
    }

    if (sortOrder === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
    } else {
      filtered = filtered.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
    }

    setFilteredLeaves(filtered);
  }, [leaves, filterStatus, sortOrder]);

  if (loading) {
    return <div className="text-center">Loading leave data...</div>;
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">

      {employeeData && (
        <div className="mb-10 grid">
          <p className="text-lg"><strong>Name:</strong> {employeeData.name}</p>
          <p className="text-lg"><strong>Employee ID:</strong> {employeeData.eID}</p>
          <p className="text-lg"><strong>Designation:</strong> {employeeData.designation}</p>
          <p className="text-lg"><strong>Department:</strong> {employeeData.department}</p>
        </div>
        
      )}

      {/* leave balance logic goes here */}
      {/* <div>Leave Balance</div> */}

      <h2 className="text-2xl font-semibold mb-4 text-center">Leave History</h2>


      <div className="flex items-center justify-between mb-4">
        <div>
          <label htmlFor="">Filter :</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-md bg-blue-500 m-2 cursor-pointer"
          >
            <option value="all">All Leaves</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        
          <label htmlFor="">Sort :</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-md bg-blue-500 m-2 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div>
        <Button className='bg-blue-500 text-black hover:bg-blue-200' onClick={() => (navigate('/dashboard/leave-form'))}>Apply Leave</Button>
        </div>
      </div>

      {filteredLeaves.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No leaves found for the selected filters.</p>
        </div>
      ) : (
        <table className="min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2">Leave Type</th>
              <th className="border border-gray-200 px-4 py-2">Start Date</th>
              <th className="border border-gray-200 px-4 py-2">End Date</th>
              <th className="border border-gray-200 px-4 py-2">No. Of Days</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Reason</th>
              <th className="border border-gray-200 px-4 py-2">Manager Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaves.map((leave, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-200 px-4 py-2">
                  {leave.typeOfLeave}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {leave.numberOfDays}
                </td>
                <td
                  className={`border border-gray-200 px-4 py-2 ${
                    leave.status === "Approved"
                      ? "text-green-500"
                      : leave.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                >
                  {leave.status}
                </td>
                <td className=" border border-gray-200 px-4 py-2">
                  {leave.reasonForLeave}
                </td>
                <td className=" border border-gray-200 px-4 py-2">
                  {leave.managerComment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveStatusPage;
