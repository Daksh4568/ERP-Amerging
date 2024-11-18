import React from 'react'
import { Form, Input, Button, Select, DatePicker, Typography, Checkbox, Table, InputNumber, List, Row, Col, Rate } from 'antd';

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
    const managerRatingOptions = ["Never", "Sometimes", "Usually", "Always"];

    const [form] = Form.useForm();
    
    const rateDepartmentQuestions = [
        "Cooperation/teamwork in the department",
        "Cooperation with other departments",
        "Department training and OTJ training",
        "Communications",
        "Working Conditions",
        "Work Schedule",
    ]
    const departmentRatingOptions = ["Excellent", "Good", "Fair", "Poor"]
    
    const handleSubmit = (values) => {
       console.log(values);
       form.resetFields();
    };

    return (
        <div>
            <Title level={3} style={{ textAlign: 'center', marginBottom: '4px' }}>
                Exit Form
            </Title>
            <Form
                form={form}
                className='grid grid-cols-4 gap-x-16'
                layout='vertical'
            //   onValuesChange={handleFormChange}
                onFinish={handleSubmit}
              >
                
                <Form.Item className='col-span-2' label="Employee Name" name="employeeName" rules={[{required: true, message: 'This is a required field.',}]}>
                <Input />
                </Form.Item>

                <Form.Item className='col-span-2'  label="Designation" name="designation" rules={[{required: true, message: 'This is a required field.',}]}>
                <Input />
                </Form.Item>
        
                <Form.Item className='col-span-2'  label="Department" name="department" rules={[{required: true, message: 'This is a required field.',}]}>
                  <Select>
                    <Select.Option value="Sales">Sales</Select.Option>
                    <Select.Option value="Design">Design</Select.Option>
                    <Select.Option value="Process">Process</Select.Option>
                    <Select.Option value="HR">HR</Select.Option>
                    <Select.Option value="IT">IT</Select.Option>
                  </Select>
                </Form.Item>
        
                <Form.Item className='col-span-2' label="Last Working Day" name="lastWorkingDate" rules={[{required: true, message: 'This is a required field.',}]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item> 

                <Title level={5} className='col-span-4 text-start '>
                I kindly request that you take a few moments to provide your input by responding to the questions below. Please rest assured that all your responses will be treated with the utmost confidentiality. Your cooperation is greatly appreciated. Thank you.
                </Title>

                <Form.Item className='col-span-4' label="Reason for leaving the Company ?" name="reasonOfLeaving" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="How was your experience working at the company ?" name="workingExperience" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you feel that your skills and talents were effectively utilized in your role ?" name="skillsUsedEffectively" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you receive the necessary training and support to perform your job effectively ?" name="receivedTrainingAndSupport" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Did you feel that your ideas and opinions were valued and heard within the company ?" name="ideasAndOpinionsValued" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="What areas do you think the company could improve upon ?" name="improvementForCompany" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Form.Item className='col-span-4' label="Do you have any final comments or suggestions for the company ?" name="finalComments" rules={[{required: true, message: 'This is a required field.',}]}>
                    <Input />
                </Form.Item>

                <Title level={5} className='col-span-4 text-start underline'>
                    Rate your manager on the following
                </Title>

                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager' label="Follow policies & procedures">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>

                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager2' label="Treats employees in a fair and equal way">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager3' label="Provides recognition for a job well done">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager4' label="Resolves complaints and problems">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager5' label="Gives needed information">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager6' label="Keeps employees busy">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                <Form.Item className='col-span-4 border bg-white p-3' name='ratingManager7' label="Knows his/her job well">
                    <Rate className='' defaultValue={0} tooltips={managerRatingOptions} count={4} />
                </Form.Item>
                
                <Title level={5} className='col-span-4 text-start underline'>
                    What do you think of the following in your Department ?
                </Title>

                <Form.Item className='col-span-4 border bg-white p-3' name='second' label="Follow policies & procedures">
                    <Rate className='' defaultValue={0} tooltips={departmentRatingOptions} count={4} />
                </Form.Item>

                <Form.Item className='col-span-4 flex items-center' label='I have no knowledge of any violation of the law or any corporate policies or standards of conduct by me or any other employees while I have been employed at the company. If I recall any suspected violations in the future, I will immediately report them to the Compliance Officer.' rules={[{required: true, message: 'Your Acknowledgement is required.',}]}>
                    <Checkbox />
                    
                </Form.Item> 


                <Form.Item className='flex justify-end'>
                    <Button type="primary" htmlType="submit" >
                      Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ExitForm