import React, { useEffect, useState } from "react";

const Dashboard = () => {

  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = JSON.parse(localStorage.getItem("empData"));

        if (storedData && storedData.name) {
          setEmployeeName(storedData.name); // Set the employee name in state
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex text-2xl font-extrabold">
      <h2>
        Welcome {employeeName} to the Amerging ERP Dashboard. (Beta Version)
      </h2>
    </main>
  );
};

export default Dashboard;
