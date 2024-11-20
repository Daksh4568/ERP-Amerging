import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  InputNumber,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const SelfEvaluationForm = () => {
  // const [keyResponsibilities, setKeyResponsibilities] = useState(['']);
  
  // const [goalInput, setGoalInput] = useState('');
  
  // const handleAddGoal = () => {
  //     if (goalInput) {
  //         setFormData((prev) => ({
  //             ...prev,
  //             performanceGoals: [...prev.performanceGoals, goalInput],
  //           }));
  //           setGoalInput('');
  //         }
  //       };

  // const handleDeleteGoal = (index) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     performanceGoals: prev.performanceGoals.filter((_, i) => i !== index),
  //   }));
  // };
  
  // const handleFormChange = (changedValues) => {
  //     setFormData((prev) => ({ ...prev, ...changedValues }));
  //   };
    
    const [formData, setFormData] = useState({
      employeeName: "",
      dateOfReview: "",
      designation: "",
      department: "",
      dateOfJoining: "",
      totalTenure: "",
      previousSalary: "",
      incrementedSalary: "",
      incrementedSalaryDate: "",
      numberOfProjectsHandled: "",
      keyResponsibility: "",
      additionalResponsibility: "",
      performanceGoals: "",
      surplusResources: "",
      challengesFaced: "",
    });

    
    const handleChanges = (e) => {
      setFormData({ ...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      const values = JSON.stringify(formData);
      console.log(values);
    };
    
    return (
    //   <div className=''>
    //       <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
    //         Self Evaluation Form
    //       </Title>
    //     <Form
    //       className='w-full h-full grid grid-cols-4 gap-x-16 '
    //       layout="vertical"
    //       // onValuesChange={handleFormChange}
    //       form={form}
    //       onFinish={handleSubmit}
    //     >
    //       <Form.Item className='col-span-2' label="Employee Name" name="employeeName" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Date of Review" name="dateOfReview" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <DatePicker className='w-full'/>
    //       </Form.Item>

    //       <Form.Item className='col-span-2'  label="Designation" name="designation" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input />
    //       </Form.Item>

    //       <Form.Item className='col-span-2'  label="Department" name="department" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Select>
    //           <Select.Option value="Sales">Sales</Select.Option>
    //           <Select.Option value="Marketing">Design</Select.Option>
    //           <Select.Option value="Engineering">Process</Select.Option>
    //           <Select.Option value="HR">HR</Select.Option>
    //           <Select.Option value="Finance">IT</Select.Option>
    //         </Select>
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Joining Date" name="joiningDate" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <DatePicker style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Total Tenure (years)" name="totalTenure" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber min={0} style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Previous Salary" name="previousSalary" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber min={0} style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Incremented Salary" name="incrementedSalary" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber min={0} style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Date of Last Increment" name="incrementSalaryDate" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <DatePicker style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Number of Projects Handled" name="numberOfProjectsHandled" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber min={0} style={{ width: '100%' }} />
    //       </Form.Item>

    //       <div className='col-span-4 border'>
    //         <Form.Item label="Current Responsibility" name="currentResponsibility" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //           <Input />
    //         </Form.Item>

    //         <Form.Item  label="Additional Responsibility" name="additionalResponsibility">
    //           <TextArea autoSize={{ minRows: 2 }} />
    //         </Form.Item>
    //       </div>

    //       {/* <Form.Item label="Key Responsibilities" required>
    //         <List
    //           dataSource={keyResponsibilities}
    //           renderItem={(responsibility, index) => (
    //             <List.Item>
    //               <Input
    //                 placeholder="Key Responsibility"
    //                 value={responsibility}
    //                 // onChange={(e) => handleKeyResponsibilityChange(e.target.value, index)}
    //                 style={{ width: '90%' }}
    //               />
    //               <Button
    //                 type="text"
    //                 icon={<DeleteOutlined />}
    //                 // onClick={() => handleDeleteKeyResponsibility(index)}
    //                 disabled={keyResponsibilities.length === 1}
    //               />
    //             </List.Item>
    //           )}
    //           footer={
    //             <Button type="dashed"
    //             // onClick={handleAddKeyResponsibility}
    //             icon={<PlusOutlined />}>
    //               Add Key Responsibility
    //             </Button>
    //           }
    //         />
    //       </Form.Item>

    //       <Form.Item label="Performance Goals">
    //         <Input.Group compact>
    //           <Input
    //             style={{ width: 'calc(100% - 40px)' }}
    //             placeholder="Add Performance Goal"
    //             value={goalInput}
    //             onChange={(e) => setGoalInput(e.target.value)}
    //           />
    //           <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal} />
    //         </Input.Group>
    //         <List
    //           bordered
    //           dataSource={formData.performanceGoals}
    //           renderItem={(goal, index) => (
    //             <List.Item
    //               actions={[
    //                 <Button
    //                   type="text"
    //                   icon={<DeleteOutlined />}
    //                   onClick={() => handleDeleteGoal(index)}
    //                 />,
    //               ]}
    //             >
    //               {goal}
    //             </List.Item>
    //           )}
    //           style={{ marginTop: '10px' }}
    //         />
    //       </Form.Item> */}

    //       <Form.Item className='col-span-2' label="Performance Goals" name="performanceGoals">
    //         <TextArea autoSize={{ minRows: 2 }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Surplus Resources" name="surplusResources">
    //         <TextArea autoSize={{ minRows: 2 }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Additional Contribution" name="additionalContribution">
    //         <TextArea autoSize={{ minRows: 2 }} />
    //       </Form.Item>

    //       <Form.Item className='col-span-2' label="Challenges Faced" name="challengesFaced">
    //         <TextArea autoSize={{ minRows: 2 }} />
    //       </Form.Item>

    //     <Form.Item className='flex justify-end'>
    //         <Button htmlType='submit' type="primary" block>
    //           Submit
    //         </Button>
    //     </Form.Item>

    //   </Form>
    // </div>

    <form 
      onSubmit={handleSubmit}
      className="text-black grid grid-cols-4 gap-x-20 gap-y-2">

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employeeName"
        >
          Employee Name
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="employeeName"
          value={formData.employeeName}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="dateOfReview"
        >
          Date of Review
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="dateOfReview"
          value={formData.dateOfReview}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="designation"
        >
          Designation
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="designation"
          value={formData.designation}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="department"
        >
          Department
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="department"
          value={formData.department}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="dateOfJoining"
        >
          Date of Joining
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="totalTenure"
        >
          Total Tenure
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="totalTenure"
          value={formData.totalTenure}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="previousSalary"
        >
          Previous Salary
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="previousSalary"
          value={formData.previousSalary}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="incrementedSalary"
        >
          Incremented Salary
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="incrementedSalary"
          value={formData.incrementedSalary}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="incrementedSalaryDate"
        >
          Incremented Salary Date
        </label>
        <input
          className=" w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Contact Number"
          name="incrementedSalaryDate"
          value={formData.incrementedSalaryDate}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="numberOfProjectsHandled"
        >
          Number of Projects Handled
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="numberOfProjectsHandled"
          value={formData.numberOfProjectsHandled}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="keyResponsibility"
        >
          Key Responsibility
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="keyResponsibility"
          value={formData.keyResponsibility}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="additionalResponsibility"
        >
          Additional Responsibilities
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="additionalResponsibility"
          value={formData.additionalResponsibility}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="performanceGoals"
        >
          Performance Goals
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="performanceGoals"
          value={formData.performanceGoals}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="surplusResources"
        >
          Surplus Resources
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="surplusResources"
          value={formData.surplusResources}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="additionalContribution"
        >
          Additional Contribution
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="additionalContribution"
          value={formData.additionalContribution}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-4">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="challengesFaced"
        >
          Challenges Faced
        </label>
        <textarea
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          rows='3'
          name="challengesFaced"
          value={formData.challengesFaced}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-3 mt-3">
        <button className="bg-blue-500" type="submit">
          Submit
        </button>
      </div>

    </form>
  );
};

export default SelfEvaluationForm;
