import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Typography, InputNumber, } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;

const SelfEvaluationForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    department: '',
    dateOfReview: null,
    joiningDate: null,
    totalTenure: '',
    previousSalary: '',
    incrementedSalary: '',
    incrementDate: null,
    numberOfProjects: '',
    keyResponsibility: '',
    additionalResponsibility: '',
    performanceGoals: [],
    challengesFaced: '',
  });
  const [keyResponsibilities, setKeyResponsibilities] = useState(['']);

  const [goalInput, setGoalInput] = useState('');

  // const handleAddGoal = () => {
  //   if (goalInput) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       performanceGoals: [...prev.performanceGoals, goalInput],
  //     }));
  //     setGoalInput('');
  //   }
  // };

  // const handleDeleteGoal = (index) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     performanceGoals: prev.performanceGoals.filter((_, i) => i !== index),
  //   }));
  // };

  const handleFormChange = (changedValues) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    
  };

  return (
    <div className=''>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
          Self Evaluation Form
        </Title>
        <Form
          className='w-full h-full grid grid-cols-4 gap-x-16 '
          layout="vertical"
          onValuesChange={handleFormChange}
          onFinish={handleSubmit}
        >
          <Form.Item className='col-span-2' label="Employee Name" name="employeeName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item className='col-span-2' label="Date of Review" name="dateOfReview" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item className='col-span-2'  label="Designation" name="designation" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item className='col-span-2'  label="Department" name="department" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Sales">Sales</Select.Option>
              <Select.Option value="Marketing">Design</Select.Option>
              <Select.Option value="Engineering">Process</Select.Option>
              <Select.Option value="HR">HR</Select.Option>
              <Select.Option value="Finance">IT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className='col-span-2' label="Joining Date" name="joiningDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Total Tenure (years)" name="totalTenure" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Previous Salary" name="previousSalary" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Incremented Salary" name="incrementedSalary" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Date of Last Increment" name="incrementSalaryDate" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Number of Projects Handled" name="numberOfProjectsHandled" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <div className='col-span-4 border'>
            <Form.Item label="Current Responsibility" name="currentResponsibility" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item  label="Additional Responsibility" name="additionalResponsibility">
              <TextArea autoSize={{ minRows: 2 }} />
            </Form.Item>
          </div>

          {/* <Form.Item label="Key Responsibilities" required>
            <List
              dataSource={keyResponsibilities}
              renderItem={(responsibility, index) => (
                <List.Item>
                  <Input
                    placeholder="Key Responsibility"
                    value={responsibility}
                    // onChange={(e) => handleKeyResponsibilityChange(e.target.value, index)}
                    style={{ width: '90%' }}
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    // onClick={() => handleDeleteKeyResponsibility(index)}
                    disabled={keyResponsibilities.length === 1}
                  />
                </List.Item>
              )}
              footer={
                <Button type="dashed" 
                // onClick={handleAddKeyResponsibility} 
                icon={<PlusOutlined />}>
                  Add Key Responsibility
                </Button>
              }
            />
          </Form.Item> */}

          {/* <Form.Item label="Performance Goals">
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 40px)' }}
                placeholder="Add Performance Goal"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGoal} />
            </Input.Group>
            <List
              bordered
              dataSource={formData.performanceGoals}
              renderItem={(goal, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteGoal(index)}
                    />,
                  ]}
                >
                  {goal}
                </List.Item>
              )}
              style={{ marginTop: '10px' }}
            />
          </Form.Item> */}

          <Form.Item className='col-span-2' label="Performance Goals" name="performanceGoals">
            <TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Surplus Resources" name="surplusResources">
            <TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Additional Contribution" name="additionalContribution">
            <TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>

          <Form.Item className='col-span-2' label="Challenges Faced" name="challengesFaced">
            <TextArea autoSize={{ minRows: 2 }} />
          </Form.Item>

          
        </Form>
        <Form.Item className='flex justify-end'>
            <Button type="primary" htmlType="submit" block>
              Submit Evaluation
            </Button>
        </Form.Item>
    </div>
  );
};

export default SelfEvaluationForm;
