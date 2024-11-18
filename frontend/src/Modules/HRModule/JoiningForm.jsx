import {React, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
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
  // const [componentDisabled, setcomponentDisabled] = useState(true);
  // const [passwordVisible, setPasswordVisible] = useState(false);
  const [value, setValue] = useState();
  const [form] = Form.useForm();

  const handleForm = (values) => {
    // to include address 
    const fullFormData = {
      ...values, permanentAddress, temporaryAddress
    }

    console.log(fullFormData);
    form.resetFields();

    setPermanentAddress({
      street: '',
      city: '',
      state: '',
      pinCode: '',
    });
  
    setTemporaryAddress({
      street: '',
      city: '',
      state: '',
      pinCode: '',
    });
  
    // Reset the "Same as Permanent Address" checkbox
    setisSameAddress(false);
  }
  
  const [permanentAddress, setPermanentAddress] = useState({
    street:'',
    city: '',
    state: '',
    pinCode: '',
  });

  const [temporaryAddress, setTemporaryAddress] = useState({
    street:'',
    city: '',
    state: '',
    pinCode: '',
  });

  const [isSameAddress, setisSameAddress] = useState(false);

  // handling eprmanent address input change
  const handlePermanentAddressChange = (field, value) => {
    const updatedAddress = { ...permanentAddress, [field]: value};
    setPermanentAddress(updatedAddress);

    if(isSameAddress)
    {
      setTemporaryAddress(updatedAddress);
    }
  }

  // address checkbox toggle
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setisSameAddress(checked);

    // temporary adddress handler
    if(checked) {
      setTemporaryAddress(permanentAddress);
    }
    else {
      setTemporaryAddress({
        street:'',
        city: '',
        state: '',
        pinCode: '',
      });
    }
  }

  const onChange= (e) => {
    setValue(e.target.value);
  }

  return (
    <div>

      
      <Form
        form={form}
        className=" grid grid-cols-4 gap-x-16"
        layout='vertical'
        onFinish={handleForm}
        >
        
          <Form.Item label="Employee ID" name='employeeId' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <Input type='text'  />
          </Form.Item>

          <Form.Item label="Full Name" className="col-span-2" name='employeeName' rules={[{required: true,
              message: 'This is a required field.'}]}>
            <Input type='text'  />
          </Form.Item>

          <Form.Item label="DOB" className="col-span-2" name='dateOFBirth' rules={[{required: true,
              message: 'This is a required field.'}]}>
            <DatePicker type='date' className='w-full'  />
          </Form.Item>

          <Form.Item label="Gender" name='gender' className="col-span-2" rules={[
            {
              required: true,
              message: 'This is a required field.',
            }, ]}>
            <Select >
              <Select.Option value='male'>Male</Select.Option>
              <Select.Option value='female'>Female</Select.Option>
              <Select.Option value='others'>Others</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Marital Status" name='maritalStatus' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <Select  >
              <Select.Option value='single'>Single</Select.Option>
              <Select.Option value='married'>Married</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Contact Number" name='contactNumber' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <InputNumber  type='number' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Alternate Number" name='alternateNumber' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <InputNumber  type='number' style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Personal Email" name='personalEmail' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <Input  type='email' placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item label="Official Email" name='officialEmail' className="col-span-2" >
            <Input  type='email' placeholder="example@mail.com" />
          </Form.Item>

          <Form.Item label="Password" className="col-span-2" name='createPassword' rules={[{required: true,
              message: 'This is a required field.'}]}>
            <Input.Password type='password'  placeholder="Create Password" />
          </Form.Item>

          <Form.Item label="Blood Group" name='bloodGroup' className="col-span-2" >
            <Input type='text'  />
          </Form.Item>

          <Form.Item label="Employee Status" name='employeeStatus' className="col-span-2" >
            <Select  >
              <Select.Option value='Regular'>Regular</Select.Option>
              <Select.Option value='Relieved'>Relieved</Select.Option>
              <Select.Option value='Resigned'>Resigned</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name='address' label="Address" className="col-span-4" rules={[{required: true,
              message: 'This is a required field.'}]}>
            <div className="bg-indigo-100 w-full p-4 rounded grid grid-cols-4 gap-x-8">       

              <Form.Item className='col-span-2' label="Street">
                <Input
                    value={permanentAddress.street}
                    onChange={(e) => handlePermanentAddressChange('street', e.target.value)}
                />
              </Form.Item>              

              <Form.Item className='col-span-2' label="City">
                <Input
                  value={permanentAddress.city}
                  onChange={(e) => handlePermanentAddressChange('city', e.target.value)}
                />
              </Form.Item>

              <Form.Item className='col-span-2' label="State">
                <Input
                  value={permanentAddress.state}
                    onChange={(e) => handlePermanentAddressChange('state', e.target.value)}
                />
              </Form.Item>

              <Form.Item
                className='col-span-2'
                label="Pin Code"
                rules={[
                  {
                    required: true,
                    message: 'Pin Code must be 6 digits.',
                    len: 6,
                  },
                ]}
              >
                <Input
                  maxLength={6}
                  value={permanentAddress.pinCode}
                  onChange={(e) => handlePermanentAddressChange('pinCode', e.target.value)}
                />
              </Form.Item>
                                    
              <Checkbox
                checked={isSameAddress}
                onChange={handleCheckboxChange}
                className="mb-2 col-span-4"
              >
                Same as Permanent Address
              </Checkbox>
                                    
              <Form.Item label="Street" className='col-span-2'>
                <Input
                  placeholder="Temporary Street"
                  value={temporaryAddress.street}
                  onChange={(e) => setTemporaryAddress({ ...temporaryAddress, street: e.target.value })}
                  disabled={isSameAddress}
                />
              </Form.Item>
                  
              <Form.Item label="City" className='col-span-2'>
                <Input
                  placeholder="Temporary City"
                  value={temporaryAddress.city}
                  onChange={(e) => setTemporaryAddress({ ...temporaryAddress, city: e.target.value })}
                  disabled={isSameAddress}
                />
              </Form.Item>
                  
                  
              <Form.Item label="State" className='col-span-2'>
                <Input
                  placeholder="Temporary State"
                  value={temporaryAddress.state}
                  onChange={(e) => setTemporaryAddress({ ...temporaryAddress, state: e.target.value })}
                  disabled={isSameAddress}
                />
              </Form.Item>
              
              <Form.Item
                className='col-span-2'
                label="Pin Code"
                rules={[
                  {
                    required: true,
                    message: 'Pin Code must be 6 digits.',
                    len: 6,
                },
                ]}
              >
                <Input
                  placeholder="Temporary Pin Code"
                  maxLength={6}
                  value={temporaryAddress.pinCode}
                  onChange={(e) => setTemporaryAddress({ ...temporaryAddress, pinCode: e.target.value })}
                  disabled={isSameAddress}
                />
              </Form.Item>
            </div>
        </Form.Item>

        <Form.Item label="Employee Type" name='employeeType' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
          <Select  >
            <Select.Option value='Full-time'>Full-time</Select.Option>
            <Select.Option value='Part-time'>Part-time</Select.Option>
            <Select.Option value='Contract'>Contract</Select.Option>
            <Select.Option value='Consultant'>Consultant</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Aadhar Card" name='aadharNumber' className="col-span-2" rules={[{required: true,
              message: 'This is a required field.'}]}>
          <InputNumber maxLength={12} placeholder="XXXX-XXXX-XXXX" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="PAN" name='panNumber' className="col-span-2" >
          <Input />
        </Form.Item>

        <Form.Item label="Passport" className="col-span-2" >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>Yes</Radio>
            <Radio value={2}>No</Radio>
          </Radio.Group>
        </Form.Item>

        {value === 1 && (
          <Form.Item label="Passport Number" name='panNumber' className="col-span-2" rules={[{required: true,
            message: 'This is a required field.'}]}>
            <Input placeholder="Enter Passport Number" />
          </Form.Item>
        )}

        <Form.Item className="col-span-2" name='document' label="Documents" valuePropName="fileList" getValueFromEvent={normFile} >
          <Upload action="/endpoint.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 0 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item className='flex justify-end'>
          <Button htmlType='submit' className='bg-blue-500 w-40 text-white'>Submit</Button>
        </Form.Item>        
      
      </Form>
    </div>

  )
}

export default JoiningForm;