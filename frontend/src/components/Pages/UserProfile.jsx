import React, { useState, useEffect } from "react";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    password: "",
    personalEmail: "",
    contactNumber: "",
    // currentAddress: {
    //   street: "",
    //   city: "",
    //   state: "",
    //   country: "",
    //   postalCode: "",
    // },
    // permanentAddress: {
    //   street: "",
    //   city: "",
    //   state: "",
    //   country: "",
    //   postalCode: "",
    // },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("empData"));
        const fetchedData = {
          // eID: storedData.eID,
          password: storedData.eID,
          personalEmail: storedData.personalEmail,
          contactNumber: storedData.personalContactNumber,
          // currentAddress: storedData.address?.current || {},
          // permanentAddress: storedData.address?.permanent || {},
        };

        setFormData((prevData) => ({
          ...prevData,
          ...fetchedData,
        }));
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

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [addressType]: { ...prevData[addressType], [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      console.log(formData);
      const response = await axios.patch("https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/emp/${formData.eID}", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (response.status === 200) {
        alert("Profile updated successfully.");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col relative">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md pr-10"
            disabled={!isEditing}
          />
          <button
            type="button"
            className="absolute right-3 top-7"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Personal Email</label>
          <input
            type="email"
            name="personalEmail"
            value={formData.personalEmail}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md"
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className="mt-1 p-2 border border-gray-300 rounded-md"
            disabled={!isEditing}
          />
        </div>

        {/* {['currentAddress', 'permanentAddress'].map((addressType) => (
          <div key={addressType} className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2 capitalize">{addressType.replace('Address', ' Address')}</h3>
            {['street', 'city', 'state', 'country', 'postalCode'].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-medium">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={formData[addressType]?.[field] || ""}
                  onChange={(e) => handleAddressChange(e, addressType)}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
        ))} */}

        {isEditing && (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
