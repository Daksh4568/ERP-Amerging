import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  EyeIcon,
  EyeOffIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  Loader2,
} from "lucide-react";
import useDialog from "../Atoms/UseDialog";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    eID: "",
    password: "",
    personalEmail: "",
    personalContactNumber: "",
  });
  const { DialogComponent, showDialog } = useDialog();
  const [isEditing, setIsEditing] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("empData"));
        const fetchedData = {
          eID: storedData.eID,
          password: storedData.eID,
          personalEmail: storedData.personalEmail,
          personalContactNumber: storedData.personalContactNumber,
        };
        setFormData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
    if (field === "password") setShowPassword(false);
  };

  const handleCancelClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleSaveClick = async (field) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const updatedField = { [field]: formData[field] };
      const response = await axios.patch(
        `https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/emp/${formData.eID}`,
        updatedField,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const { data } = response;
        const emp = data.data;
        localStorage.setItem("empData", JSON.stringify(emp));
        showDialog("Field updated successfully.");
        location.reload();
        setIsEditing((prev) => ({ ...prev, [field]: false }));
      }
    } catch (error) {
      console.error("Error updating field:", error);
      if(error.response){
        if(error.response.status === 400){
          showDialog("Bad Request, Please check the input data.");
        }
        else if (error.response.status === 500) {
          showDialog("Server error. Please try again later.")
        }
        else {
          showDialog("Failed to update field.")
        }
      } else{
        showDialog("Network error. Please check your connection");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <DialogComponent/>
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      <form className="space-y-4">
        {[
          {
            label: "Password",
            name: "password",
            type: "password",
          },
          { label: "Personal Email", 
            name: "personalEmail", 
            type: "email" 
          },
          {
            label: "Contact Number",
            name: "personalContactNumber",
            type: "text",
          },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex items-center gap-2 relative">
            <label className="text-gray-700 font-medium w-1/4">{label}</label>
            <div className="relative flex-grow">
              <input
                type={name === "password" && showPassword ? "text" : type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10"
                disabled={!isEditing[name]}
              />
              {isEditing[name] && name === "password" && (
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-1 flex items-center p-4 border-none cursor-pointer"
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </span>
              )}
            </div>
            {isEditing[name] ? (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => handleSaveClick(name)} className="text-green-500">
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckIcon size={20} />}
                </button>
                <button type="button" onClick={() => handleCancelClick(name)} className="text-red-500">
                  <XIcon size={20} />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => handleEditClick(name)} className="text-blue-500">
                <PencilIcon size={20} />
              </button>
            )}
          </div>
        ))}
      </form>
    </div>
  );
};

export default UserProfile;
