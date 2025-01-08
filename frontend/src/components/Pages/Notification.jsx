// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
// import { ScrollArea } from "../ui/scroll-area";

// const Notification = () => {
//   const [leaveData, setLeaveData] = useState([]); // Ensure default is an empty array
//   const [isManager, setIsManager] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLeaveData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const empData = JSON.parse(localStorage.getItem("empData") || "{}");
//         setIsManager(empData.role === "Manager");

//         const response = await axios.get("http://localhost:5000/notifications/manager", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log(response);

//         // Handle different status codes
//         if (response.status === 200) {
//           // Success
//           setLeaveData(response.data || []); // Fallback to an empty array if no data
//         } else {
//           // Handle unexpected successful status codes (e.g., 204 No Content)
//           console.error("Unexpected response status:", response.status);
//           alert("Unexpected response from the server. Please try again.");
//           setLeaveData([]);
//         }
//       } catch (error) {
//         // Handle 500 errors and other possible errors
//         if (error.response) {
//           if (error.response.status === 500) {
//             console.error("Server error:", error.response.data);
//             alert("Internal server error. Please try again later.");
//           } else {
//             console.error("Error response from server:", error.response.data);
//             alert(`Error: ${error.response.statusText}`);
//           }
//         } else {
//           console.error("Network or unknown error:", error);
//           alert("An error occurred. Please check your internet connection.");
//         }
//         setLeaveData([]); // Fallback to an empty array on error
//       } finally {
//         setLoading(false); // Ensure loading is set to false
//       }
//     };

//     fetchLeaveData();
//   }, []);

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   const renderLeaveCards = (leaves = [], isPending) => (
//     <ScrollArea className="space-y-4 max-h-[400px]">
//       {leaves.map((leave) => (
//         <Card key={leave.id} className="border shadow-md">
//           <CardHeader>
//             <h3 className="text-lg font-bold">{leave.employeeName}</h3>
//             <p className="text-sm text-muted-foreground">
//               {leave.startDate} to {leave.endDate}
//             </p>
//           </CardHeader>
//           <CardContent>
//             <p>
//               Status: <strong>{leave.status}</strong>
//             </p>
//           </CardContent>
//           {isPending && (
//             <CardFooter className="flex justify-end gap-2">
//               <Button variant="outline" color="success">
//                 Approve
//               </Button>
//               <Button variant="destructive">Reject</Button>
//             </CardFooter>
//           )}
//         </Card>
//       ))}
//     </ScrollArea>
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Leave Notifications</h1>
//       <div className="space-y-6">
//         {isManager ? (
//           <>
//             <section>
//               <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
//               {leaveData && leaveData.filter((leave) => leave.status === "Pending").length > 0 ? (
//                 renderLeaveCards(
//                   leaveData.filter((leave) => leave.status === "Pending"),
//                   true
//                 )
//               ) : (
//                 <p>No pending leave approvals.</p>
//               )}
//             </section>

//             <section>
//               <h2 className="text-xl font-semibold mb-2">Approved/Rejected Leaves</h2>
//               {leaveData && leaveData.filter((leave) => leave.status !== "Pending").length > 0 ? (
//                 renderLeaveCards(
//                   leaveData.filter((leave) => leave.status !== "Pending"),
//                   false
//                 )
//               ) : (
//                 <p>No previous leave approvals/rejections.</p>
//               )}
//             </section>
//           </>
//         ) : (
//           <section>
//             <h2 className="text-xl font-semibold mb-2">Your Leave Applications</h2>
//             {leaveData && leaveData.length > 0 ? (
//               renderLeaveCards(leaveData, false)
//             ) : (
//               <p>You have not applied for any leaves yet.</p>
//             )}
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notification;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({}); // Store manager comments by notificationId

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get("http://localhost:5000/notifications/manager", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setNotifications(response.data || []);
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          alert("Unauthorized. Please log in again.");
        } else if (error.response?.status === 500) {
          alert("Internal server error. Please try later.");
        } else {
          alert("Failed to fetch notifications.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle Approve/Reject actions
  const handleAction = async (notificationId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      const comment = comments[notificationId] || ""; // Manager's comment

      console.log("Sending payload:", {
        notificationId,
        status,
        managerComment: comment,
      });

      const response = await axios.patch(
        "http://localhost:5000/notifications/handle",
        {
          notificationId,
          status,
          managerComment: comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert(`Leave ${status.toLowerCase()}d successfully!`);

        // Update UI
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === notificationId
              ? { ...n, isRead: true, status, managerComment: comment }
              : n
          )
        );
      } else {
        console.error("Unexpected response:", response);
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      const message =
        error.response?.data?.error || error.response?.statusText || "Unknown error";
      alert(`Failed to ${status.toLowerCase()} the leave: ${message}`);
      console.error(error);
    }
  };

  // Handle comment changes
  const handleCommentChange = (notificationId, value) => {
    setComments((prev) => ({
      ...prev,
      [notificationId]: value,
    }));
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Notifications</h1>
      <ScrollArea className="space-y-4 max-h-[500px]">
        {notifications.map((notification) => (
          <Card
            key={notification.notificationId}
            className={`border shadow-md ${
              notification.isRead ? "bg-gray-100" : "bg-white"
            }`}
          >
            <CardHeader>
              <h3 className="text-lg font-bold">{notification.title}</h3>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Type:</strong> {notification.type}
              </p>
              <p>
                <strong>Status:</strong> {notification.isRead ? notification.status : "Pending"}
              </p>
              {notification.isRead && notification.managerComment && (
                <p className="mt-2">
                  <strong>Manager Comment:</strong> {notification.managerComment}
                </p>
              )}
            </CardContent>
            {!notification.isRead && (
              <CardFooter className="flex flex-col gap-4">
                <Textarea
                  placeholder="Add a comment for this request"
                  value={comments[notification.notificationId] || ""}
                  onChange={(e) => handleCommentChange(notification.notificationId, e.target.value)}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="success"
                    onClick={() =>
                      handleAction(notification.notificationId, "Approved")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      handleAction(notification.notificationId, "Rejected")
                    }
                  >
                    Reject
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Notification;
