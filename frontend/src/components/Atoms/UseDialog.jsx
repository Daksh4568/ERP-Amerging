// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
// import { Button } from "../ui/button";

// const useDialog = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");

//   const showDialog = (msg) => {
//     setMessage(msg);
//     setIsOpen(true);
//   };

//   const DialogComponent = () => (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Notification</DialogTitle>
//         </DialogHeader>
//         <p>{message}</p>
//         <DialogFooter>
//           <Button onClick={() => setIsOpen(false)}>OK</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );

//   return { DialogComponent, showDialog };
// };

// export default useDialog;





// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
// import { Button } from "../ui/button";

// const useDialog = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate(); // Use the navigate hook

//   const showDialog = (msg) => {
//     setMessage(msg);
//     setIsOpen(true);
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     navigate("/dashboard"); // Navigate to the dashboard on close
//   };

//   const DialogComponent = () => (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Notification</DialogTitle>
//         </DialogHeader>
//         <p>{message}</p>
//         <DialogFooter>
//           <Button onClick={handleClose}>OK</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );

//   return { DialogComponent, showDialog };
// };

// export default useDialog;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [onClose, setOnClose] = useState(null); // Optional onClose callback
  const navigate = useNavigate();

  const showDialog = (msg, closeCallback = null) => {
    setMessage(msg);
    setOnClose(() => closeCallback); // Store the optional callback
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose(); // Execute the provided callback
    }
  };

  const DialogComponent = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogFooter>
          <Button onClick={handleClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { DialogComponent, showDialog };
};

export default useDialog;
