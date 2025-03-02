import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import useDialog from "../Atoms/UseDialog";

const LeaveApproval = () => {
  const { notificationId } = useParams(); // Extract notificationId from the route
  const [leaveDetails, setLeaveDetails] = useState(null); // State for leave details
  const [managerComment, setManagerComment] = useState(""); // State for manager's comment
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // State for action loading
  const navigate = useNavigate();

  const { DialogComponent, showDialog } = useDialog();

  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        // const response = await axios.get("http://localhost:3000/api/notifications/manager", {
        const response = await axios.get(
          "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/manager",
          {
            headers: { Authorization: `Bearer ${token}` },
            "Content-Type": "application/json",
          }
        );

        // Find the notification by notificationId
        const notification = response.data.find(
          (n) => n.notificationId === notificationId
        );

        if (notification) {
          setLeaveDetails({
            employeeName: notification.title.replace("Leave Request from ", ""),
            reason: notification.reasonForLeave,
            status: notification.isRead ? "Processed" : "Pending",
            startDate: notification.startDate,
            endDate: notification.endDate,
          });
        } else {
          showDialog("Notification not found.");
        }
      } catch (error) {
        showDialog("An error occurred while fetching leave details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveDetails();
  }, [notificationId]);

  const handleAction = async (status) => {
    try {
      setActionLoading(true); // Start processing
      const token = localStorage.getItem("authToken");

      // Send the status update request to the backend
      const response = await axios.patch(
        // `http://localhost:3000/api/notifications/handle`,
        `https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/handle`,
        { notificationId, status, managerComment },
        { headers: { 
          Authorization: `Bearer ${token}` ,
          "Content-Type": "application/json",
        } 
      }
      );

      if (response.status === 200) {
        // Update the status in the UI
        setLeaveDetails((prev) => ({
          ...prev,
          status: "Processed", // Update the status in UI
          managerComment,
        }));
        showDialog(`Leave ${status.toLowerCase()} successfully!`, () => navigate("/dashboard"));
      } else {
        showDialog("Failed to update leave status.");
      }
    } catch (error) {
      showDialog("An error occurred while updating leave status.");
    } finally {
      setActionLoading(false); // Stop processing
    }
  };

  if (loading) {
    return <div className="text-center">Loading leave details...</div>;
  }

  if (!leaveDetails) {
    return <div className="text-center">Leave details not found.</div>;
  }

  const isProcessed = leaveDetails.status === "Processed";

  return (
    <div className="p-6">
      <DialogComponent/>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Leave Approval</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            <strong>Employee Name:</strong> {leaveDetails.employeeName}
          </p>
          <p>
            <strong>Leave Dates:</strong>{" "}
            {new Date(leaveDetails.startDate).toDateString()} to{" "}
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
            disabled={actionLoading || isProcessed}
          />
          {actionLoading && (
            <p className="text-center text-blue-500 mt-2">Loading...</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button
            className="bg-green-500"
            variant="success"
            onClick={() => handleAction("Approved")}
            disabled={actionLoading || isProcessed}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("Rejected")}
            disabled={actionLoading || isProcessed}
          >
            Reject
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeaveApproval;
