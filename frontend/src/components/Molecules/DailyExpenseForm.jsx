// import React, { useState } from "react";
// import axios from "axios";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Card, CardHeader, CardContent } from "../ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// const ExpenseForm = () => {
//   const [formData, setFormData] = useState({
//     date: "",
//     previousBalance: 0,
//     department: "",
//     expenses: [
//       {
//         date: "",
//         expenseType: "",
//         description: "",
//         amount: 0,
//         incurredBy: "",
//         supportingDocument: "",
//       },
//     ],
//     supportingDocuments: "",
//     approvalStatus: "Pending",
//   });

//   const handleChange = (e, index = null) => {
//     const { name, value } = e.target;
//     if (index === null) {
//       setFormData({ ...formData, [name]: value });
//     } else {
//       const updatedExpenses = [...formData.expenses];
//       updatedExpenses[index][name] = value;
//       setFormData({ ...formData, expenses: updatedExpenses });
//     }
//   };

//   const handleAddExpense = () => {
//     setFormData({
//       ...formData,
//       expenses: [
//         ...formData.expenses,
//         {
//           date: "",
//           expenseType: "",
//           description: "",
//           amount: 0,
//           incurredBy: "",
//           supportingDocument: "",
//         },
//       ],
//     });
//   };

//   const handleRemoveExpense = (index) => {
//     const updatedExpenses = [...formData.expenses];
//     updatedExpenses.splice(index, 1);
//     setFormData({ ...formData, expenses: updatedExpenses });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         alert("No token available. Please log in again.");
//         return;
//       }

//       const response = await axios.post("http://localhost:5000/expenses", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 201) {
//         alert("Expense recorded successfully!");
//         setFormData({
//           date: "",
//           previousBalance: 0,
//           department: "",
//           expenses: [
//             {
//               date: "",
//               expenseType: "",
//               description: "",
//               amount: 0,
//               incurredBy: "",
//               supportingDocument: "",
//             },
//           ],
//           supportingDocuments: "",
//           approvalStatus: "Pending",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting expense form:", error);
//       alert("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto p-6">
//       <Card>
//         <CardHeader>
//           <h2 className="text-2xl font-semibold text-center">Expense Entry Form</h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Date */}
//             <div>
//               <Label>Date</Label>
//               <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
//             </div>

//             {/* Previous Balance */}
//             <div>
//               <Label>Previous Balance</Label>
//               <Input type="number" name="previousBalance" value={formData.previousBalance} onChange={handleChange} />
//             </div>

//             {/* Department */}
//             <div>
//               <Label>Department</Label>
//               <Input type="text" name="department" value={formData.department} onChange={handleChange} required />
//             </div>

//             {/* Expense Items */}
//             <h3 className="text-lg font-semibold mt-4">Expense Details</h3>
//             {formData.expenses.map((expense, index) => (
//               <Card key={index} className="p-4 mb-2">
//                 <div className="space-y-3">
//                   <div>
//                     <Label>Date</Label>
//                     <Input type="date" name="date" value={expense.date} onChange={(e) => handleChange(e, index)} required />
//                   </div>

//                   <div>
//                     <Label>Expense Type</Label>
//                     <Select
//                       onValueChange={(value) => handleChange({ target: { name: "expenseType", value } }, index)}
//                       value={expense.expenseType}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Expense Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[
//                           "cash",
//                           "Courier and postage",
//                           "housekeeping expense",
//                           "local transportation",
//                           "Misc office expense",
//                           "mobile tariff expense",
//                           "pantry",
//                           "refreshment",
//                           "salary",
//                           "staff welfare",
//                           "tour expenses",
//                           "vehicle running & maintenance charges",
//                           "vendor payment",
//                         ].map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label>Description</Label>
//                     <Input type="text" name="description" value={expense.description} onChange={(e) => handleChange(e, index)} required />
//                   </div>

//                   <div>
//                     <Label>Amount</Label>
//                     <Input type="number" name="amount" value={expense.amount} onChange={(e) => handleChange(e, index)} required min="0" />
//                   </div>

//                   <div>
//                     <Label>Incurred By</Label>
//                     <Input type="text" name="incurredBy" value={expense.incurredBy} onChange={(e) => handleChange(e, index)} required />
//                   </div>

//                   <div className="flex justify-end">
//                     <Button variant="destructive" onClick={() => handleRemoveExpense(index)}>
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}

//             {/* Add Expense Button */}
//             <Button variant="outline" onClick={handleAddExpense}>
//               + Add Expense
//             </Button>

//             {/* Supporting Documents */}
//             <div>
//               <Label>Upload Supporting Document</Label>
//               <Input type="file" name="supportingDocuments" onChange={handleChange} />
//             </div>

//             {/* Submit Button */}
//             <Button type="submit" className="w-full">
//               Submit Expense
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ExpenseForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Card, CardHeader, CardContent } from "../ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";

// const ExpenseForm = () => {
//   const [formData, setFormData] = useState({
//     referenceNo: "",
//     date: "",
//     previousBalance: 0,
//     department: "",
//     expenses: [],
//     approvalStatus: "Pending",
//   });

//   useEffect(() => {
//     const fetchLastReferenceNo = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/expenses/last-ref"
//         );
//         if (response.data.lastRefNo) {
//           const lastNumber = parseInt(
//             response.data.lastRefNo.replace("EXP-", ""),
//             10
//           );
//           const newRefNo = `EXP-${String(lastNumber + 1).padStart(3, "0")}`;
//           setFormData((prev) => ({ ...prev, referenceNo: newRefNo }));
//         } else {
//           setFormData((prev) => ({ ...prev, referenceNo: "EXP-001" }));
//         }
//       } catch (error) {
//         console.error("Error fetching last reference number:", error);
//         setFormData((prev) => ({ ...prev, referenceNo: "EXP-001" }));
//       }
//     };

//     fetchLastReferenceNo();
//   }, []);

//   const handleChange = (e, index = null) => {
//     const { name, value, files } = e.target;
//     if (index === null) {
//       setFormData({ ...formData, [name]: value });
//     } else {
//       const updatedExpenses = [...formData.expenses];
//       updatedExpenses[index][name] = files ? files[0] : value;
//       setFormData({ ...formData, expenses: updatedExpenses });
//     }
//   };

//   const handleAddExpense = () => {
//     setFormData((prev) => ({
//       ...prev,
//       expenses: [
//         ...prev.expenses,
//         {
//           date: "",
//           expenseType: "",
//           description: "",
//           amount: 0,
//           incurredBy: "",
//           supportingDocument: null,
//         },
//       ],
//     }));
//   };

//   const handleRemoveExpense = (index) => {
//     const updatedExpenses = [...formData.expenses];
//     updatedExpenses.splice(index, 1);
//     setFormData({ ...formData, expenses: updatedExpenses });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         alert("No token available. Please log in again.");
//         return;
//       }

//       const formDataObj = new FormData();
//       formDataObj.append("referenceNo", formData.referenceNo);
//       formDataObj.append("date", formData.date);
//       formDataObj.append("previousBalance", formData.previousBalance);
//       formDataObj.append("department", formData.department);
//       formDataObj.append("approvalStatus", formData.approvalStatus);

//       formData.expenses.forEach((expense, index) => {
//         formDataObj.append(`expenses[${index}][date]`, expense.date);
//         formDataObj.append(
//           `expenses[${index}][expenseType]`,
//           expense.expenseType
//         );
//         formDataObj.append(
//           `expenses[${index}][description]`,
//           expense.description
//         );
//         formDataObj.append(`expenses[${index}][amount]`, expense.amount);
//         formDataObj.append(
//           `expenses[${index}][incurredBy]`,
//           expense.incurredBy
//         );
//         if (expense.supportingDocument) {
//           formDataObj.append(
//             `expenses[${index}][supportingDocument]`,
//             expense.supportingDocument
//           );
//         }
//       });

//       console.log(formDataObj);
//       const response = await axios.post(
//         "http://localhost:5000/expenses",
//         formDataObj,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 201) {
//         alert("Expense recorded successfully!");
//         setFormData({
//           referenceNo: `EXP-${String(parseInt(formData.referenceNo.replace("EXP-", ""), 10) + 1).padStart(3, "0")}`,
//           date: "",
//           previousBalance: 0,
//           department: "",
//           expenses: [],
//           approvalStatus: "Pending",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting expense form:", error);
//       alert("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto p-6">
//       <Card>
//         <CardHeader>
//           <h2 className="text-2xl font-semibold text-center">
//             Expense Entry Form
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Reference No (Auto-generated) */}
//             <div>
//               <Label>Reference No</Label>
//               <Input
//                 type="text"
//                 name="referenceNo"
//                 value={formData.referenceNo}
//                 readOnly
//                 className="bg-gray-200"
//               />
//             </div>

//             {/* Date */}
//             <div>
//               <Label>Date</Label>
//               <Input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Previous Balance */}
//             <div>
//               <Label>Previous Balance</Label>
//               <Input
//                 type="number"
//                 name="previousBalance"
//                 value={formData.previousBalance}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Department */}
//             <div>
//               <Label>Department</Label>
//               <Input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Expense Items */}
//             <h3 className="text-lg font-semibold mt-4">Expense Details</h3>
//             {formData.expenses.map((expense, index) => (
//               <Card key={index} className="p-4 mb-2">
//                 <div className="space-y-3">
//                   <div>
//                     <Label>Date</Label>
//                     <Input
//                       type="date"
//                       name="date"
//                       value={expense.date}
//                       onChange={(e) => handleChange(e, index)}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label>Expense Type</Label>
//                     <Select
//                       onValueChange={(value) =>
//                         handleChange(
//                           { target: { name: "expenseType", value } },
//                           index
//                         )
//                       }
//                       value={expense.expenseType}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Expense Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[
//                           "Cash",
//                           "Courier and Postage",
//                           "Housekeeping Expense",
//                           "Local Transportation",
//                           "Misc Office Expense",
//                           "Mobile Tariff Expense",
//                           "Pantry",
//                           "Refreshment",
//                           "Salary",
//                           "Staff Welfare",
//                           "Tour Expenses",
//                           "Vehicle Running & Maintenance Charges",
//                           "Vendor Payment",
//                         ].map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label>Description</Label>
//                     <Textarea
//                       name="description"
//                       value={expense.description}
//                       onChange={(e) => handleChange(e, index)}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <Label>Amount</Label>
//                     <Input
//                       type="number"
//                       name="amount"
//                       value={expense.amount}
//                       onChange={(e) => handleChange(e, index)}
//                       required
//                       min="0"
//                     />
//                   </div>

//                   <div>
//                     <Label>Supporting Document</Label>
//                     <Input
//                       type="file"
//                       name="supportingDocument"
//                       onChange={(e) => handleChange(e, index)}
//                     />
//                   </div>

//                   <div className="flex justify-end">
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleRemoveExpense(index)}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}

//             <Button variant="outline" onClick={handleAddExpense}>
//               + Add Expense
//             </Button>

//             <Button type="submit" className="w-full">
//               Submit Expense
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ExpenseForm;

// working
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardHeader, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import useDialog from "../Atoms/UseDialog";
import { useNavigate } from "react-router-dom";

const ExpenseForm = () => {
  const { DialogComponent, showDialog } = useDialog();
  const navigate = useNavigate();
  const [adminList, setAdminList] = useState([]);
  const [formData, setFormData] = useState({
    referenceNo: "",
    date: "",
    previousBalance: 0,
    department: "",
    recipientID: "",
    expenses: [],
    approvalStatus: "Pending",
  });

  useEffect(() => {
    const checkAuthorizationAndFetchRef = async () => {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("empData"));

      if (!token || !userData || userData.role !== "HR") {
        showDialog(
          "Access Denied: You are not authorized to access this page.",
          () => navigate("/dashboard")
        );
        return;
      }

      try {
        // API call to get the last reference number
      //   const response = await axios.get(
      //     "http://localhost:5000/expenses/last-ref"
      //   );

      //   if (response.data.lastRefNo) {
      //     const lastNumber = parseInt(
      //       response.data.lastRefNo.replace("EXP-", ""),
      //       10
      //     );
      //     const newRefNo = `EXP-${String(lastNumber + 1).padStart(3, "0")}`;
      //     setFormData((prev) => ({ ...prev, referenceNo: newRefNo }));
      //   } else {
      //     setFormData((prev) => ({ ...prev, referenceNo: "EXP-001" }));
      //   }
      // } catch (error) {
      //   console.error("Error fetching last reference number:", error);
      //   setFormData((prev) => ({ ...prev, referenceNo: "EXP-001" }));
      // }


      // Fetch all users and filter only Admins
         const userResponse = await axios.get(
           "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/getemp",
           {
             headers: { Authorization: `Bearer ${token}` },
           }
         );
         // console.log(userResponse);
         if (userResponse.status === 200) {
           // Filter users with role "Admin"
           const admins = userResponse.data.filter(
             (user) => user.role === "admin"
           );
           // const adminNames = admins.map((admin) => admin.name);
           // console.log(adminNames);
           setAdminList(admins);
         }
       } catch (error) {
         console.error("Error fetching data:", error);
         showDialog("Error loading form data.");
       }
    };

    checkAuthorizationAndFetchRef();
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value, files } = e.target;
    if (index === null) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      const updatedExpenses = [...formData.expenses];
      updatedExpenses[index][name] = files
        ? URL.createObjectURL(files[0])
        : value; // Store file preview
      setFormData({ ...formData, expenses: updatedExpenses });
    }
  };

  const handleAddExpense = () => {
    setFormData((prev) => ({
      ...prev,
      expenses: [
        ...prev.expenses,
        {
          date: "",
          expenseType: "",
          description: "",
          amount: 0,
          incurredBy: "",
          supportingDocument: null,
        },
      ],
    }));
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = [...formData.expenses];
    updatedExpenses.splice(index, 1);
    setFormData({ ...formData, expenses: updatedExpenses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        showDialog("No token available. Please log in again.");
        return;
      }

      // Prepare JSON payload
      const payload = {
        referenceNo: "",
        date: formData.date,
        previousBalance: formData.previousBalance,
        department: formData.department,
        approvalStatus: formData.approvalStatus,
        recipientID: formData.recipientID,
        expenses: formData.expenses.map((expense) => ({
          date: expense.date,
          expenseType: expense.expenseType,
          description: expense.description,
          amount: parseFloat(expense.amount),
          incurredBy: expense.incurredBy,
          supportingDocument: expense.supportingDocument || null,
        })),
      };

      console.log(payload);

      const response = await axios.post(
        "http://localhost:5000/expenses",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        showDialog("Expense recorded successfully!");
        setFormData({
          referenceNo: `EXP-${String(parseInt(formData.referenceNo.replace("EXP-", ""), 10) + 1).padStart(3, "0")}`,
          date: "",
          previousBalance: 0,
          department: "",
          expenses: [],
          approvalStatus: "Pending",
        });
      }
    } catch (error) {
      showDialog("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <DialogComponent />
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">
            Expense Entry Form
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reference No (Auto-generated) */}
            <div>
              <Label>Reference No</Label>
              <Input
                type="text"
                name="referenceNo"
                placeholder="EXP-00"
                value=""
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* Date */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Previous Balance */}
            <div>
              <Label>Previous Balance</Label>
              <Input
                type="number"
                name="previousBalance"
                value={formData.previousBalance}
                onChange={handleChange}
              />
            </div>

            {/* Department */}
            <div>
              <Label>Department</Label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            {/* Expense Items */}
            <h3 className="text-lg font-semibold mt-4">Expense Details</h3>
            {formData.expenses.map((expense, index) => (
              <Card key={index} className="p-4 mb-2">
                <div className="space-y-3">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={expense.date}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Expense Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleChange(
                          { target: { name: "expenseType", value } },
                          index
                        )
                      }
                      value={expense.expenseType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Expense Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Cash",
                          "Courier and Postage",
                          "Housekeeping Expense",
                          "Local Transportation",
                          "Misc Office Expense",
                          "Mobile Tariff Expense",
                          "Pantry",
                          "Refreshment",
                          "Salary",
                          "Staff Welfare",
                          "Tour Expenses",
                          "Vehicle Running & Maintenance Charges",
                          "Vendor Payment",
                        ].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      name="description"
                      value={expense.description}
                      onChange={(e) => handleChange(e, index)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      name="amount"
                      value={expense.amount}
                      onChange={(e) => handleChange(e, index)}
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <Label>Incurred By</Label>
                    <Input
                      type="text"
                      name="incurredBy"
                      value={expense.incurredBy}
                      onChange={(e) => handleChange(e, index)}
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <Label>Supporting Document</Label>
                    <Input
                      type="file"
                      name="supportingDocument"
                      onChange={(e) => handleChange(e, index)}
                    />
                    {expense.supportingDocument && (
                      <img
                        src={expense.supportingDocument}
                        alt="Preview"
                        className="mt-2 h-16 w-16 object-cover border"
                      />
                    )}
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveExpense(index)}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}

            {/* Admin Selection */}
            <div>
              <Label>Select Admin for Approval</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, recipientID: value })
                }
                value={formData.recipientID}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an Admin" />
                </SelectTrigger>
                <SelectContent>
                  {adminList.length === 0 ? (
                    <SelectItem disabled value="no-admins">
                      No Admins Available
                    </SelectItem> // Fixed issue
                  ) : (
                    adminList.map((admin) => (
                      <SelectItem key={admin.eID} value={admin.eID}>
                        {admin.name} ({admin.eID})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleAddExpense}>
              + Add Expense
            </Button>

            <Button type="submit" className="w-full">
              Submit Expense
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Label } from "../ui/label";
// import { Card, CardHeader, CardContent } from "../ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import { Textarea } from "../ui/textarea";
// import useDialog from "../Atoms/UseDialog";
// import { useNavigate } from "react-router-dom";

// const ExpenseForm = () => {
//   const { DialogComponent, showDialog } = useDialog();
//   const navigate = useNavigate();
//   const [adminList, setAdminList] = useState([]); // Stores Admin records from API
//   const [formData, setFormData] = useState({
//     referenceNo: "",
//     date: "",
//     previousBalance: 0,
//     department: "",
//     recipientID: "", // Store selected Admin eID
//     expenses: [],
//     approvalStatus: "Pending",
//   });

//   useEffect(() => {
//     const checkAuthorizationAndFetchRef = async () => {
//       const token = localStorage.getItem("authToken");
//       const userData = JSON.parse(localStorage.getItem("empData"));

//       if (!token || !userData || userData.role !== "HR") {
//         showDialog(
//           "Access Denied: You are not authorized to access this page.",
//           () => navigate("/dashboard")
//         );
//         return;
//       }

//       try {
//         // Fetch last reference number for expense form
//         // const response = await axios.get(
//         //   "http://localhost:5000/expenses/last-ref"
//         // );
//         // if (response.data.lastRefNo) {
//         //   const lastNumber = parseInt(
//         //     response.data.lastRefNo.replace("EXP-", ""),
//         //     10
//         //   );
//         //   const newRefNo = `EXP-${String(lastNumber + 1).padStart(3, "0")}`;
//         //   setFormData((prev) => ({ ...prev, referenceNo: newRefNo }));
//         // } else {
//         //   setFormData((prev) => ({ ...prev, referenceNo: "EXP-001" }));
//         // }

//         // Fetch all users and filter only Admins
//         const userResponse = await axios.get(
//           "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/getemp",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         // console.log(userResponse);

//         if (userResponse.status === 200) {
//           // Filter users with role "Admin"
//           const admins = userResponse.data.filter(
//             (user) => user.role === "admin"
//           );
//           // const adminNames = admins.map((admin) => admin.name);
//           // console.log(adminNames);
//           setAdminList(admins);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         showDialog("Error loading form data.");
//       }
//     };

//     checkAuthorizationAndFetchRef();
//   }, []);

//   const handleChange = (e, index = null) => {
//     const { name, value, files } = e.target;
//     if (index === null) {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     } else {
//       const updatedExpenses = [...formData.expenses];
//       updatedExpenses[index][name] = files
//         ? URL.createObjectURL(files[0])
//         : value;
//       setFormData({ ...formData, expenses: updatedExpenses });
//     }
//   };

//   const handleAddExpense = () => {
//     setFormData((prev) => ({
//       ...prev,
//       expenses: [
//         ...prev.expenses,
//         {
//           date: "",
//           expenseType: "",
//           description: "",
//           amount: 0,
//           incurredBy: "",
//           supportingDocument: null,
//         },
//       ],
//     }));
//   };

//   const handleRemoveExpense = (index) => {
//     const updatedExpenses = [...formData.expenses];
//     updatedExpenses.splice(index, 1);
//     setFormData({ ...formData, expenses: updatedExpenses });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         showDialog("No token available. Please log in again.");
//         return;
//       }

//       if (!formData.recipientID) {
//         showDialog("Please select an Admin for expense approval.");
//         return;
//       }

//       // Prepare JSON payload
//       const payload = {
//         referenceNo: formData.referenceNo,
//         date: formData.date,
//         previousBalance: formData.previousBalance,
//         department: formData.department,
//         approvalStatus: formData.approvalStatus,
//         recipientID: formData.recipientID, // Send selected Admin eID
//         expenses: formData.expenses.map((expense) => ({
//           date: expense.date,
//           expenseType: expense.expenseType,
//           description: expense.description,
//           amount: parseFloat(expense.amount),
//           incurredBy: expense.incurredBy,
//           supportingDocument: expense.supportingDocument || null,
//         })),
//       };

//       console.log("Submitting Data:", payload);

//       const response = await axios.post(
//         "http://localhost:5000/expenses",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200) {
//         showDialog("Expense recorded successfully!");

//         // Reset form after submission
//         setFormData({
//           referenceNo: `EXP-${String(parseInt(formData.referenceNo.replace("EXP-", ""), 10) + 1).padStart(3, "0")}`,
//           date: "",
//           previousBalance: 0,
//           department: "",
//           recipientID: "",
//           expenses: [],
//           approvalStatus: "Pending",
//         });
//       }
//     } catch (error) {
//       console.error("Error submitting expense form:", error);
//       showDialog("Error submitting form. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-full mx-auto p-6">
//       <DialogComponent />
//       <Card>
//         <CardHeader>
//           <h2 className="text-2xl font-semibold text-center">
//             Expense Entry Form
//           </h2>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Reference No (Auto-generated) */}
//             <div>
//               <Label>Reference No</Label>
//               <Input
//                 type="text"
//                 name="referenceNo"
//                 placeholder="EXP-00"
//                 // value={formData.referenceNo}
//                 readOnly
//                 className="bg-gray-100"
//               />
//             </div>

//             {/* Date */}
//             <div>
//               <Label>Date</Label>
//               <Input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Previous Balance */}
//             <div>
//               <Label>Previous Balance</Label>
//               <Input
//                 type="number"
//                 name="previousBalance"
//                 value={formData.previousBalance}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Department */}
//             <div>
//               <Label>Department</Label>
//               <Input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Admin Selection */}
//             <div>
//               <Label>Select Admin for Approval</Label>
//               <Select
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, recipientID: value })
//                 }
//                 value={formData.recipientID}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select an Admin" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {adminList.length === 0 ? (
//                     <SelectItem disabled value="no-admins">
//                       No Admins Available
//                     </SelectItem> // Fixed issue
//                   ) : (
//                     adminList.map((admin) => (
//                       <SelectItem key={admin.eID} value={admin.eID}>
//                         {admin.name} ({admin.eID})
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             <Button variant="outline" onClick={handleAddExpense}>
//               + Add Expense
//             </Button>

//             <Button type="submit" className="w-full">
//               Submit Expense
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ExpenseForm;
