import React from 'react'
import { Form, Input, Button, Select, DatePicker, Typography, Checkbox, InputNumber, List, Row, Col } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

function ExitForm() {


    const handleFormChange = (changedValues) => {
        setFormData((prev) => ({ ...prev, ...changedValues }));
      };
    
    const handleSubmit = () => {
       console.log('Form Data:', formData);
       // Add form submission logic here
    };

    return (
        <div>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
                Exit Form
            </Title>
            <Form
              className='grid grid-cols-4 gap-x-16'
              layout='vertical'
              onValuesChange={handleFormChange}
              onFinish={handleSubmit}
              >
                
                <Form.Item className='col-span-2' label="Employee Name" name="employeeName" rules={[{ required: true }]}>
                <Input />
                </Form.Item>

                <Form.Item className='col-span-2'  label="Designation" name="designation" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
        
                <Form.Item className='col-span-2'  label="Department" name="department" rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value="Sales">Sales</Select.Option>
                    <Select.Option value="Design">Design</Select.Option>
                    <Select.Option value="Process">Process</Select.Option>
                    <Select.Option value="HR">HR</Select.Option>
                    <Select.Option value="IT">IT</Select.Option>
                  </Select>
                </Form.Item>
        
                <Form.Item className='col-span-2' label="Last Working Day" name="lastWorkingDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item> 

                <Title level={5} className='col-span-4 text-start'>
                I kindly request that you take a few moments to provide your input by responding to the questions below. Please rest assured that all your responses will be treated with the utmost confidentiality. Your cooperation is greatly appreciated. Thank you.
                </Title>

                <Form.Item className='col-span-4' label="Reason for leaving the Company ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="How was your experience working at the company ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you feel that your skills and talents were effectively utilized in your role ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you receive the necessary training and support to perform your job effectively ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you feel that your ideas and opinions were valued and heard within the company ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="What areas do you think the company could improve upon ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Do you have any final comments or suggestions for the company ?" name="reasonOfLeaving" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Title level={5} className='col-span-4 text-start underline'>
                Rate your manager on the following
                </Title>

            </Form>
        </div>
    )
}

export default ExitForm