import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const LeaveApproval = () => {
  const { notificationId } = useParams(); // Extract notificationId from the route
  const [leaveDetails, setLeaveDetails] = useState(null); // State for leave details
  const [managerComment, setManagerComment] = useState(""); // State for manager's comment
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:5000/notifications/manager", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // console.log("API Response:", response.data); // Debug log

        // Find the notification by notificationId
        const notification = response.data.find(
          (n) => n.notificationId === notificationId
        );

        if (notification) {
        //   console.log("Matched Notification:", notification); // Debug log
          setLeaveDetails({
            employeeName: notification.title.replace("Leave Request from ", ""),
            reason: notification.reasonForLeave, // Updated field
            status: notification.isRead ? "Processed" : "Pending",
            startDate: notification.startDate, // Updated field
            endDate: notification.endDate, // Updated field
          });
        } else {
          console.error("Notification not found with ID:", notificationId); // Debug log
          alert("Notification not found.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        alert("An error occurred while fetching leave details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveDetails();
  }, [notificationId]);

  const handleAction = async (status) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `http://localhost:5000/notifications/handle`,
        { notificationId, status, managerComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert(`Leave ${status.toLowerCase()} !`);
        setLeaveDetails((prev) => ({
          ...prev,
          status,
          managerComment,
        }));
      } else {
        alert("Failed to update leave status.");
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("An error occurred while updating leave status.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading leave details...</div>;
  }

  if (!leaveDetails) {
    return <div className="text-center">Leave details not found.</div>;
  }

  return (
    <div className="p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Leave Approval</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Employee Name:</strong> {leaveDetails.employeeName}
          </p>
          <p>
            <strong>Leave Dates:</strong> {new Date(leaveDetails.startDate).toDateString()} to{" "}
            {new Date(leaveDetails.endDate).toDateString()}
          </p>
          <p>
            <strong>Reason:</strong> {leaveDetails.reason}
          </p>
          <p>
            <strong>Status:</strong> {leaveDetails.status}
          </p>
          <Textarea
            placeholder="Add a comment"
            value={managerComment}
            onChange={(e) => setManagerComment(e.target.value)}
            className="resize-none mt-2"
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button className='bg-green-500' variant="success" onClick={() => handleAction("Approved")}>
            Approve
          </Button>
          <Button variant="destructive" onClick={() => handleAction("Rejected")}>
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeaveApproval;