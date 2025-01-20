# ERP Backend

This repository contains the backend code for an ERP project built using Node.js, Express.js, and MongoDB. The backend handles various modules including employee leave management, evaluation, notifications, and more.

## Modules and APIs

### 1. **Employee Leave Management**

- **APIs**: `handleleave.js`, `empLeave.js`, `empLeaveModel.js`
- **Functionality**: Manage employee leave applications, approvals, and tracking.

### 2. **Employee Evaluation**

- **APIs**: `empEvaluation.js`, `employeeEvaluationModel.js`
- **Functionality**: Handle employee performance evaluations and feedback.

### 3. **Notifications**

- **APIs**: `notificationSchema.js`
- **Functionality**: Manage notifications for employee activities and system updates.

### 4. **Employee Exit Management**

- **APIs**: `EmpExit.js`, `empExitFormModel.js`
- **Functionality**: Handle employee resignation and exit formalities.

### 5. **Authentication**

- **APIs**: `auth.js`
- **Functionality**: Manage user authentication and authorization.

### 6. **Employee Master Management**

- **APIs**: `empMaster-model.js`, `empMaster-route.js`
- **Functionality**: CRUD operations for managing employee master data.

#### APIs in `empMaster-route.js`

1. **GET /getemp**
   - **Description**: Retrieve all employee data.
   - **Authorization**: Requires roles `HR`, `admin`, `Manager`, or `Employee`.

2. **POST /addemp**
   - **Description**: Add a new employee to the system.
   - **Authorization**: Requires `HR` or `admin` role.

3. **PUT /updateemp/:id**
   - **Description**: Update details of an existing employee by ID.
   - **Authorization**: Requires `HR` or `admin` role.

4. **DELETE /deleteemp/:id**
   - **Description**: Remove an employee from the system using their ID.
   - **Authorization**: Requires `HR` or `admin` role.

5. **POST /uploadresume**
   - **Description**: Upload an employee's resume for record-keeping.
   - **Authorization**: Requires `HR` or `admin` role.

6. **GET /getmanagerlist**
   - **Description**: Retrieve a list of managers for assigning or referencing in employee records.
   - **Authorization**: Accessible to authorized roles.

7. **POST /assignmanager/:empId**
   - **Description**: Assign a manager to a specific employee by their ID.
   - **Authorization**: Requires `HR` role.

8. **GET /getempbyid/:id**
   - **Description**: Fetch detailed information of an employee by their ID.
   - **Authorization**: Requires roles `HR`, `admin`, `Manager`, or `Employee`.

9. **GET /getmanageremployees/:managerId**
   - **Description**: Retrieve all employees under a specific manager using the manager's ID.
   - **Authorization**: Requires `Manager` role.

10. **POST /uploadphoto**
    - **Description**: Upload an employee's profile photo.
    - **Authorization**: Requires `HR` or `admin` role.

### 7. **Email Communication**

- **APIs**: `sendMail.js`, `sendmail.js`
- **Functionality**: Manage email notifications and communication.

### 8. **Counter Management**

- **APIs**: `counterMaster.js`
- **Functionality**: Manage counters for unique identifiers.

### 9. **Database Configuration**

- **APIs**: `db.js`
- **Functionality**: MongoDB connection and configuration.

### 10. **Main Server File**

- **APIs**: `index.js`
- **Functionality**: Entry point for the backend application.

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Backend framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling.


