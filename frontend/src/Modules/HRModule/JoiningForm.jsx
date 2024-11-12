import {React, useState} from 'react';
import { PlusOutlined, EyeInvisibleOutlined, EyeTwoTone  } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

function JoiningForm(){
  const [componentDisabled, setcomponentDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [value, setValue] = useState(0);

  const onChange= (e) => {
    setValue(e.target.value);
  }

  return (
    <div className="">
    <Form
      className="p-3 shadow-lg rounded-lg bg-white w-full grid grid-cols-4 gap-2"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      layout="horizontal"
    >
      
        <Form.Item label="Employee ID" className="col-span-1">
          <Input />
        </Form.Item>

        <Form.Item label="Full Name" >
          <Input />
        </Form.Item>

        <Form.Item label="DOB" >
          <DatePicker />
        </Form.Item>

        <Form.Item label="Gender" >
          <Select>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Marital Status" >
          <Select>
            <Select.Option value="single">Single</Select.Option>
            <Select.Option value="married">Married</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Contact Number" >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Alternate Number" >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Personal Email" >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item label="Official Email" >
          <Input placeholder="example@mail.com" />
        </Form.Item>

        <Form.Item label="Password" >
          <Input.Password placeholder="Create Password" />
        </Form.Item>

        <Form.Item label="Blood Group" >
          <Input />
        </Form.Item>

        <Form.Item label="Address" className="col-span-1">
          <div className="bg-gray-200 w-full h-full p-3">
            <Input className="mb-2" placeholder="Permanent Address" />
            <InputNumber />
          </div>
          <Checkbox>Same as Permanent Address</Checkbox>
          <Input placeholder="Temporary Address" />
        </Form.Item>

        <Form.Item label="Employee Type" >
          <Select>
            <Select.Option value="full-time">Full-Time</Select.Option>
            <Select.Option value="part-time">Part-time</Select.Option>
            <Select.Option value="contract">Contract</Select.Option>
            <Select.Option value="consultant">Consultant</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Aadhar Card" >
          <InputNumber placeholder="XXXX-XXXX-XXXX" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="PAN" className="col-span-1 justify-start">
          <Input />
        </Form.Item>

        <Form.Item label="Passport" >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>Yes</Radio>
            <Radio value={2}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {value === 1 && (
          <Form.Item label="Passport Number" >
            <Input placeholder="Enter Passport Number" />
          </Form.Item>
        )}

        <Form.Item label="Documents" valuePropName="fileList" getValueFromEvent={normFile} >
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 2 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item label="Employee Status" >
          <Select>
            <Select.Option value="regular">Regular</Select.Option>
            <Select.Option value="relieved">Relieved</Select.Option>
            <Select.Option value="resigned">Resigned</Select.Option>
          </Select>
        </Form.Item>
      

      <Form.Item className="mt-6 flex justify-end">
        <Button className='bg-blue-500 '>Submit</Button>
      </Form.Item>
    </Form>
</div>


  )
}

export default JoiningForm;