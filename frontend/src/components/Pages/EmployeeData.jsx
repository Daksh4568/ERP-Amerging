import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useDialog from "../Atoms/UseDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const EmployeeList = () => {
  const { DialogComponent, showDialog } = useDialog();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [filters, setFilters] = useState({ department: "all", role: "all" }); // Filter state
  const navigate = useNavigate();

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const empData = JSON.parse(localStorage.getItem("empData") || "{}");

        // Role-based authorization
        if (empData.role !== "admin" && empData.role !== "HR") {
          showDialog("You are not authorized to access this data.", () =>
            navigate("/dashboard")
          );
          return;
        }

        const response = await axios.get(
          "https://risabllrw6.execute-api.ap-south-1.amazonaws.com/api/getemp",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setEmployees(response.data || []);
          setFilteredEmployees(response.data || []); // Initialize filtered employees
        } else {
          showDialog("Failed to fetch employee data.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          showDialog("Unauthorized. Please log in again.", () => navigate("/"));
        } else {
          console.error("Error fetching employees:", error);
          showDialog("An error occurred while fetching employees.");
        }
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchEmployees();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    // Filter employees based on selected department and role
    let filtered = employees;

    if (filters.department !== "all") {
      filtered = filtered.filter(
        (emp) => emp.department === filters.department
      );
    }

    if (filters.role !== "all") {
      filtered = filtered.filter((emp) => emp.role === filters.role);
    }

    setFilteredEmployees(filtered);
  }, [filters, employees]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-bold">Loading employee records...</div>
      </div>
    );
  }

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "N/A";
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <DialogComponent />
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Employee List
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Filter by Department */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Filter by Department
          </label>
          <Select
            onValueChange={(value) => handleFilterChange("department", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Instrumentation">Instrumentation</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="R&D">R&D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Role */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Filter by Role
          </label>
          <Select onValueChange={(value) => handleFilterChange("role", value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="p-2 text-left">S.No</TableHead>
              <TableHead className="p-2 text-left">Employee ID</TableHead>
              <TableHead className="p-2 text-left">Name</TableHead>
              <TableHead className="p-2 text-left">Department</TableHead>
              <TableHead className="p-2 text-left">Designation</TableHead>
              <TableHead className="p-2 text-left">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp, index) => (
                <TableRow
                  key={emp.eID}
                  onClick={() => handleRowClick(emp)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="p-2">{index + 1}</TableCell>
                  <TableCell className="p-2">{emp.eID}</TableCell>
                  <TableCell className="p-2">{emp.name}</TableCell>
                  <TableCell className="p-2">{emp.department}</TableCell>
                  <TableCell className="p-2">{emp.designation}</TableCell>
                  <TableCell className="p-2">{emp.role}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-2 text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for employee details */}
      {selectedEmployee && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center">
                Employee Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                <strong>Employee ID:</strong> {selectedEmployee.eID}
              </p>
              <p>
                <strong>Name:</strong> {selectedEmployee.name}
              </p>
              <p>
                <strong>Department:</strong> {selectedEmployee.department}
              </p>
              <p>
                <strong>Designation:</strong> {selectedEmployee.designation}
              </p>
              <p>
                <strong>Role:</strong> {selectedEmployee.role}
              </p>
              <p>
                <strong>Official Email:</strong>{" "}
                {selectedEmployee.officialEmail}
              </p>
              <p>
                <strong>Status:</strong> {selectedEmployee.stat}
              </p>
              <p>
                <strong>Employment Type:</strong>{" "}
                {selectedEmployee.employmentType}
              </p>
              <p>
                <strong>DOB:</strong> {formatDate(selectedEmployee.DOB)}
              </p>
              <p>
                <strong>Contact Number:</strong>{" "}
                {selectedEmployee.personalContactNumber}
              </p>
              <p>
                <strong>Blood Group:</strong> {selectedEmployee.bloodGroup}
              </p>
              <p>
                <strong>Date Of Joining:</strong> {formatDate(selectedEmployee.createdAt)}
              </p>
              <p>
                <strong>Aadhar Number:</strong> {selectedEmployee.empAadhar}
              </p>
              <p>
                <strong>PAN Number:</strong> {selectedEmployee.empPan}
              </p>
              <p>
                <strong>Current Address:</strong>{" "}
                {selectedEmployee.address?.current
                  ? `${selectedEmployee.address.current.street}, ${selectedEmployee.address.current.city}, ${selectedEmployee.address.current.state}, ${selectedEmployee.address.current.postalCode}, ${selectedEmployee.address.current.country}`
                  : "N/A"}
              </p>
              <p>
                <strong>Permanent Address:</strong>{" "}
                {selectedEmployee.address?.permanent
                  ? `${selectedEmployee.address.permanent.street}, ${selectedEmployee.address.permanent.city}, ${selectedEmployee.address.permanent.state}, ${selectedEmployee.address.permanent.postalCode}, ${selectedEmployee.address.permanent.country}`
                  : "N/A"}
              </p>
            </div>
            <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeList;
