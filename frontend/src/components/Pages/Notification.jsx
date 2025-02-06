// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { ScrollArea } from "../ui/scroll-area";
// import { useNavigate } from "react-router-dom";

// const NotificationDialog = ({ isOpen, onClose }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         // const response = await axios.get("http://localhost:3000/api/notifications/manager", {
//         const response = await axios.get("https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/manager", {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 200) {
//           setNotifications(response.data || []);
//         } else {
//           alert("Unexpected response from the server.");
//         }
//       } catch (error) {
//         if (error.response?.status === 401) {
//           alert("Unauthorized. Please log in again.");
//         } else if (error.response?.status === 500) {
//           // alert("Internal server error. Please try later.");
//           console.log("Internal server error. Please try later.");
//         } 
//         // else {
//         //   alert("Failed to fetch notifications.");
//         // }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleViewDetails = (notification) => {
//     navigate(`/leave-approval/${notification.notificationId}`);
//     onClose(); // Close the dialog
//   };

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Notifications</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="space-y-4 pr-3 max-h-[500px]">
//           {notifications.length === 0 ? (
//             <p>No notifications available.</p>
//           ) : (
//             notifications.map((notification) => (
//               <div
//                 key={notification.notificationId}
//                 className={`p-4 rounded-md ${
//                   notification.isRead ? "bg-gray-200" : "bg-gray-100"
//                 } mb-2`}
//               >
//                 <h4 className="text-sm font-bold">{notification.title}</h4>
//                 <p className="text-xs text-muted-foreground">{notification.message}</p>
//                 <Button
//                   variant="link"
//                   className="text-blue-500 mt-2"
//                   onClick={() => handleViewDetails(notification)}
//                 >
//                   View Details
//                 </Button>
//               </div>
//             ))
//           )}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NotificationDialog;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { ScrollArea } from "../ui/scroll-area";
// import { useNavigate } from "react-router-dom";

// const NotificationDialog = ({ isOpen, onClose }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Fetch notifications for the logged-in user
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const empId = JSON.parse(localStorage.getItem("empData"))?.eID; // Assuming empId is stored in userData

//         if (!empId) {
//           alert("No user identifier found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get("https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/manager", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           params: {
//             empId, // Pass the logged-in user's empId
//           },
//         });

//         if (response.status === 200) {
//           setNotifications(response.data || []);
//         } else {
//           alert("Unexpected response from the server.");
//         }
//       } catch (error) {
//         if (error.response?.status === 401) {
//           alert("Unauthorized. Please log in again.");
//         } else if (error.response?.status === 500) {
//           alert("Internal server error. Please try later.");
//         } else {
//           alert("Failed to fetch notifications.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleViewDetails = (notification) => {
//     navigate(`/leave-approval/${notification.notificationId}`);
//     onClose(); // Close the dialog
//   };

//   if (loading) {
//     return <div className="text-center">Loading...</div>;
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Notifications</DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="space-y-4 pr-3 max-h-[500px]">
//           {notifications.length === 0 ? (
//             <p>No notifications available.</p>
//           ) : (
//             notifications.map((notification) => (
//               <div
//                 key={notification.notificationId}
//                 className={`p-4 rounded-md ${
//                   notification.isRead ? "bg-gray-200" : "bg-gray-100"
//                 } mb-2`}
//               >
//                 <h4 className="text-sm font-bold">{notification.title}</h4>
//                 <p className="text-xs text-muted-foreground">{notification.message}</p>
//                 <Button
//                   variant="link"
//                   className="text-blue-500 mt-2"
//                   onClick={() => handleViewDetails(notification)}
//                 >
//                   View Details
//                 </Button>
//               </div>
//             ))
//           )}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default NotificationDialog;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";

const NotificationDialog = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/manager",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setNotifications(response.data || []);
        } else {
          alert("Unexpected response from the server.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Function to mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state to reflect change
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to handle clicking a notification (mark as read and navigate)
  const handleViewDetails = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.notificationId);
    }
    navigate(`/leave-approval/${notification.notificationId}`);
    onClose(); // Close the dialog
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="space-y-4 pr-3 max-h-[500px]">
          {notifications.length === 0 ? (
            <p>No notifications available.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`p-4 rounded-md ${
                  notification.isRead ? "bg-gray-300" : "bg-gray-100"
                } mb-2`}
              >
                <h4 className="text-sm font-bold">{notification.title}</h4>
                <p className="text-xs text-muted-foreground">{notification.message}</p>

                {/* Mark as Read Button */}
                {!notification.isRead && (
                  <Button
                    variant="secondary"
                    className="text-green-500 mt-2"
                    onClick={() => markAsRead(notification.notificationId)}
                  >
                    Mark as Read
                  </Button>
                )}

                <Button
                  variant="link"
                  className="text-blue-500 mt-2"
                  onClick={() => handleViewDetails(notification)}
                >
                  View Details
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
