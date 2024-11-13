import React from 'react'
import { Form, Input, Button, Select, DatePicker, Typography, Checkbox, Table, InputNumber, List, Row, Col } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

function ExitForm() {
    const rateManagerQuestions = [
        "Follow policies & procedures",
        "Treats employees in a fair and equal way",
        "Provides recognition for a job well done",
        "Resolves complaints and problems",
        "Gives needed information",
        "Keeps employees busy",
        "Knows his/her job well",
        "Welcomes suggestions",
        "Maintains discipline",
    ]
    const managerRatingOptions = ["Always", "Usually", "Sometimes", "Never"];

    // defining columns of the table with eact rating option as a column
    const columns = [
        {
          title: '',
          dataIndex: 'rateManagerQuestion',
          key: 'rateManagerQuestion',
          width: '40%',
        },
        ...managerRatingOptions.map((option) => ({
          title: option,
          dataIndex: option.toLowerCase(),
          key: option.toLowerCase(),
          render: () => <Checkbox />,
          width: '15%',
          className:'text-center'
        })),
    ];
    // mapping questions to data source for the table
    const dataSourceManager = rateManagerQuestions.map((rateManagerQuestion, index) => ({
        key: index,
        rateManagerQuestion,
        always: false,
        usually: false,
        sometimes: false,
        never: false,
    }));
    
    const rateDepartmentQuestions = [
        "Cooperation/teamwork in the department",
        "Cooperation with other departments",
        "Department training and OTJ training",
        "Communications",
        "Working Conditions",
        "Work Schedule",
    ]
    const departmentRatingOptions = ["Excellent", "Good", "Fair", "Poor"]

    const columnsOp = [
        {
            title: '',
            dataIndex: 'rateDepartmentQuestions',
            key: 'rateDepartmentQuestions',
            width: '40%',
        },
        
        ...departmentRatingOptions.map((options) => ({
            title: options,
            dateIndex: options.toLowerCase(),
            key: options.toLowerCase(),
            render: () => <Checkbox /> ,
            width: '15%',
            className:'text-center'
        })),       
    ]

    const dataSourceDepartment = rateDepartmentQuestions.map((rateDepartmentQuestions, index) => ({
        key: index,
        rateDepartmentQuestions,
        always: false,
        usually: false,
        sometimes: false,
        never: false,
    }))

    


    const handleFormChange = (changedValues) => {
        setFormData((prev) => ({ ...prev, ...changedValues }));
      };
    
    const handleSubmit = () => {
       console.log('Form Data:', formData);
       // Add form submission logic here
    };

    return (
        <div>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '4px' }}>
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

                <Title level={5} className='col-span-4 text-start '>
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

                <Table 
                    className='col-span-4 mb-4'
                    columns={columns}
                    dataSource={dataSourceManager}
                    pagination={false}
                    bordered
                />

                <Title level={5} className='col-span-4 text-start underline'>
                    What do you think of the following in your Department ?
                </Title>

                <Table
                    className='col-span-4 mb-4'
                    columns={columnsOp}
                    dataSource={dataSourceDepartment}
                    pagination={false}
                    bordered
                />

                <Form.Item className='col-span-4 flex items-center' label='I have no knowledge of any violation of the law or any corporate policies or standards of conduct by me or any other employees while I have been employed at the company. If I recall any suspected violations in the future, I will immediately report them to the Compliance Officer.' rules={[{ required: true }]}>
                    <Checkbox />
                    
                </Form.Item> 

            </Form>
            <Form.Item className='flex justify-end'>
                <Button type="primary" htmlType="submit" block>
                  Submit Evaluation
                </Button>
            </Form.Item>
        </div>
    )
}

export default ExitForm