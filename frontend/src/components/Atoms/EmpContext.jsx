// import { createContext, useContext, useState, useEffect } from "react";

// const EmpContext = createContext();

// export const EmpProvider = ({ children }) => {
//   const [empData, setEmpData] = useState(() => {
//     return JSON.parse(localStorage.getItem("empData")) || {};
//   });

//   useEffect(() => {
//     localStorage.setItem("empData", JSON.stringify(empData)); // Sync updates to local storage
//   }, [empData]); 

//   return (
//     <EmpContext.Provider value={{ empData, setEmpData }}>
//       {children}
//     </EmpContext.Provider>
//   );
// };

// export const useEmp = () => useContext(EmpContext);






import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const EmpContext = createContext();

// Provider Component
export const EmpProvider = ({ children }) => {
  const [empData, setEmpData] = useState(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("empData"));
      return storedData ? storedData : null; // Ensure it returns an object or null
    } catch (error) {
      console.error("Error parsing empData from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (empData) {
      localStorage.setItem("empData", JSON.stringify(empData)); // Sync updates to local storage
    }
  }, [empData]);

  return (
    <EmpContext.Provider value={{ empData, setEmpData }}>
      {children}
    </EmpContext.Provider>
  );
};

// Custom Hook
export const useEmp = () => {
  const context = useContext(EmpContext);
  if (!context) {
    throw new Error("useEmp must be used within an EmpProvider");
  }
  return context;
};
