import { React, useState } from "react";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
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
} from "antd";

// const { RangePicker } = DatePicker;
// const { TextArea } = Input;
// const normFile = (e) => {
//   if (Array.isArray(e)) {
//     return e;
//   }
//   return e?.fileList;
// };

function JoiningForm() { 
  // const [componentDisabled, setcomponentDisabled] = useState(true);
  // const [passwordVisible, setPasswordVisible] = useState(false);
  // const [value, setValue] = useState();
  // const [form] = Form.useForm();

  // const handleForm = (values) => {
  //   // to include address
  //   const fullFormData = {
  //     ...values, permanentAddress, temporaryAddress
  //   }

  //   console.log(fullFormData);
  //   form.resetFields();

  //   setPermanentAddress({
  //     street: '',
  //     city: '',
  //     state: '',
  //     pinCode: '',
  //   });

  //   setTemporaryAddress({
  //     street: '',
  //     city: '',
  //     state: '',
  //     pinCode: '',
  //   });

  //   // Reset the "Same as Permanent Address" checkbox
  //   setisSameAddress(false);
  // }

  // const [permanentAddress, setPermanentAddress] = useState({
  //   street:'',
  //   city: '',
  //   state: '',
  //   pinCode: '',
  // });

  // const [temporaryAddress, setTemporaryAddress] = useState({
  //   street:'',
  //   city: '',
  //   state: '',
  //   pinCode: '',
  // });

  // const [isSameAddress, setisSameAddress] = useState(false);

  // // handling eprmanent address input change
  // const handlePermanentAddressChange = (field, value) => {
  //   const updatedAddress = { ...permanentAddress, [field]: value};
  //   setPermanentAddress(updatedAddress);

  //   if(isSameAddress)
  //   {
  //     setTemporaryAddress(updatedAddress);
  //   }
  // }

  // // address checkbox toggle
  // const handleCheckboxChange = (e) => {
  //   const checked = e.target.checked;
  //   setisSameAddress(checked);

  //   // temporary adddress handler
  //   if(checked) {
  //     setTemporaryAddress(permanentAddress);
  //   }
  //   else {
  //     setTemporaryAddress({
  //       street:'',
  //       city: '',
  //       state: '',
  //       pinCode: '',
  //     });
  //   }
  // }

  // const onChange= (e) => {
  //   setValue(e.target.value);
  // }

  const [formSubmissionData, setFormSubmissionData] = useState([])

  const [values, setValues] = useState({
    employeeId: "",
    employeeName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    contactNumber: "",
    alternateNumber: "",
    personalEmail: "",
    officialEmail: "",
    password: "",
    bloodGroup: "",
    employeeType: "",
    aadharCardNumber: "",
    passportNumber: "",
    employeeStatus: "",
    document: "",
  });


  const [permanentAddress, setPermanentAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [temporaryAddress, setTemporaryAddress] = useState({
    street: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  const handlePermanentAddressChange = (field, value) => {
    setPermanentAddress({ ...permanentAddress, [field]: value });
    if (isSameAddress) {
      setTemporaryAddress({ ...permanentAddress, [field]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    setIsSameAddress(e.target.checked);
    if (e.target.checked) {
      setTemporaryAddress(permanentAddress);
    }
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // combining all the data
    const finalData = {
      ...values,
      Address: {
        permanentAddress,
        temporaryAddress,
      },
    };

    // tryign with axios
    try {
      const response = await axios.post(
        "https://localhost:5000/regemp", finalData, {
          headers: {
            'Content-Type' : 'application/json',
          }
        });

        
        const jsonResponseData = JSON.stringify(response.data);
        console.log(jsonResponseData);
    } 
    catch (error) {
      console.log("Error submitting form data: ", error);
    }

    // setFormSubmissionData([...formSubmissionData, values]);

    // const formData = JSON.stringify(values);  /* converting object values to JSON*/

    // console.log(formSubmissionData);

    // setValues({
    //   employeeId: "",
    //   employeeName: "",
    //   dateOfBirth: "",
    //   gender: "",
    //   maritalStatus: "",
    //   contactNumber: "",
    //   alternateNumber: "",
    //   prsonalEmail: "",
    //   officialEmail: "",
    //   password: "",
    //   bloodGroup: "",
    //   employeeType: "",
    //   aadharCardNumber: "",
    //   passportNumber: "",
    //   employeeStatus: "",
    //   document: "",
    // });
  };

  return (
    // <div>
    //   <Form
    //     form={form}
    //     className=" grid grid-cols-4 gap-x-16"
    //     layout='vertical'
    //     onFinish={handleForm}
    //     >

    //       <Form.Item label="Employee ID" name='employeeId' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input type='text'  />
    //       </Form.Item>

    //       <Form.Item label="Full Name" className="col-span-2" name='employeeName' rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input type='text'  />
    //       </Form.Item>

    //       <Form.Item label="DOB" className="col-span-2" name='dateOFBirth' rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <DatePicker type='date' className='w-full'  />
    //       </Form.Item>

    //       <Form.Item label="Gender" name='gender' className="col-span-2" rules={[
    //         {
    //           required: true,
    //           message: 'This is a required field.',
    //         }, ]}>
    //         <Select >
    //           <Select.Option value='male'>Male</Select.Option>
    //           <Select.Option value='female'>Female</Select.Option>
    //           <Select.Option value='others'>Others</Select.Option>
    //         </Select>
    //       </Form.Item>

    //       <Form.Item label="Marital Status" name='maritalStatus' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Select  >
    //           <Select.Option value='single'>Single</Select.Option>
    //           <Select.Option value='married'>Married</Select.Option>
    //         </Select>
    //       </Form.Item>

    //       <Form.Item label="Contact Number" name='contactNumber' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber  type='number' style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item label="Alternate Number" name='alternateNumber' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <InputNumber  type='number' style={{ width: '100%' }} />
    //       </Form.Item>

    //       <Form.Item label="Personal Email" name='personalEmail' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input  type='email' placeholder="example@mail.com" />
    //       </Form.Item>

    //       <Form.Item label="Official Email" name='officialEmail' className="col-span-2" >
    //         <Input  type='email' placeholder="example@mail.com" />
    //       </Form.Item>

    //       <Form.Item label="Password" className="col-span-2" name='createPassword' rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <Input.Password type='password'  placeholder="Create Password" />
    //       </Form.Item>

    //       <Form.Item label="Blood Group" name='bloodGroup' className="col-span-2" >
    //         <Input type='text'  />
    //       </Form.Item>

    //       <Form.Item label="Employee Status" name='employeeStatus' className="col-span-2" >
    //         <Select  >
    //           <Select.Option value='Regular'>Regular</Select.Option>
    //           <Select.Option value='Relieved'>Relieved</Select.Option>
    //           <Select.Option value='Resigned'>Resigned</Select.Option>
    //         </Select>
    //       </Form.Item>

    //       <Form.Item name='address' label="Address" className="col-span-4" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //         <div className="bg-indigo-100 w-full p-4 rounded grid grid-cols-4 gap-x-8">

    //           <Form.Item className='col-span-2' label="Street">
    //             <Input
    //                 value={permanentAddress.street}
    //                 onChange={(e) => handlePermanentAddressChange('street', e.target.value)}
    //             />
    //           </Form.Item>

    //           <Form.Item className='col-span-2' label="City">
    //             <Input
    //               value={permanentAddress.city}
    //               onChange={(e) => handlePermanentAddressChange('city', e.target.value)}
    //             />
    //           </Form.Item>

    //           <Form.Item className='col-span-2' label="State">
    //             <Input
    //               value={permanentAddress.state}
    //                 onChange={(e) => handlePermanentAddressChange('state', e.target.value)}
    //             />
    //           </Form.Item>

    //           <Form.Item
    //             className='col-span-2'
    //             label="Pin Code"
    //             rules={[
    //               {
    //                 required: true,
    //                 message: 'Pin Code must be 6 digits.',
    //                 len: 6,
    //               },
    //             ]}
    //           >
    //             <Input
    //               maxLength={6}
    //               value={permanentAddress.pinCode}
    //               onChange={(e) => handlePermanentAddressChange('pinCode', e.target.value)}
    //             />
    //           </Form.Item>

    //           <Checkbox
    //             checked={isSameAddress}
    //             onChange={handleCheckboxChange}
    //             className="mb-2 col-span-4"
    //           >
    //             Same as Permanent Address
    //           </Checkbox>

    //           <Form.Item label="Street" className='col-span-2'>
    //             <Input
    //               placeholder="Temporary Street"
    //               value={temporaryAddress.street}
    //               onChange={(e) => setTemporaryAddress({ ...temporaryAddress, street: e.target.value })}
    //               disabled={isSameAddress}
    //             />
    //           </Form.Item>

    //           <Form.Item label="City" className='col-span-2'>
    //             <Input
    //               placeholder="Temporary City"
    //               value={temporaryAddress.city}
    //               onChange={(e) => setTemporaryAddress({ ...temporaryAddress, city: e.target.value })}
    //               disabled={isSameAddress}
    //             />
    //           </Form.Item>

    //           <Form.Item label="State" className='col-span-2'>
    //             <Input
    //               placeholder="Temporary State"
    //               value={temporaryAddress.state}
    //               onChange={(e) => setTemporaryAddress({ ...temporaryAddress, state: e.target.value })}
    //               disabled={isSameAddress}
    //             />
    //           </Form.Item>

    //           <Form.Item
    //             className='col-span-2'
    //             label="Pin Code"
    //             rules={[
    //               {
    //                 required: true,
    //                 message: 'Pin Code must be 6 digits.',
    //                 len: 6,
    //             },
    //             ]}
    //           >
    //             <Input
    //               placeholder="Temporary Pin Code"
    //               maxLength={6}
    //               value={temporaryAddress.pinCode}
    //               onChange={(e) => setTemporaryAddress({ ...temporaryAddress, pinCode: e.target.value })}
    //               disabled={isSameAddress}
    //             />
    //           </Form.Item>
    //         </div>
    //     </Form.Item>

    //     <Form.Item label="Employee Type" name='employeeType' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //       <Select  >
    //         <Select.Option value='Full-time'>Full-time</Select.Option>
    //         <Select.Option value='Part-time'>Part-time</Select.Option>
    //         <Select.Option value='Contract'>Contract</Select.Option>
    //         <Select.Option value='Consultant'>Consultant</Select.Option>
    //       </Select>
    //     </Form.Item>

    //     <Form.Item label="Aadhar Card" name='aadharNumber' className="col-span-2" rules={[{required: true,
    //           message: 'This is a required field.'}]}>
    //       <InputNumber maxLength={12} placeholder="XXXX-XXXX-XXXX" style={{ width: '100%' }} />
    //     </Form.Item>

    //     <Form.Item label="PAN" name='panNumber' className="col-span-2" >
    //       <Input />
    //     </Form.Item>

    //     <Form.Item label="Passport" className="col-span-2" >
    //       <Radio.Group onChange={onChange} value={value}>
    //         <Radio value={1}>Yes</Radio>
    //         <Radio value={2}>No</Radio>
    //       </Radio.Group>
    //     </Form.Item>

    //     {value === 1 && (
    //       <Form.Item label="Passport Number" name='panNumber' className="col-span-2" rules={[{required: true,
    //         message: 'This is a required field.'}]}>
    //         <Input placeholder="Enter Passport Number" />
    //       </Form.Item>
    //     )}

    //     <Form.Item className="col-span-2" name='document' label="Documents" valuePropName="fileList" getValueFromEvent={normFile} >
    //       <Upload action="/endpoint.do" listType="picture-card">
    //         <button style={{ border: 0, background: 'none' }} type="button">
    //           <PlusOutlined />
    //           <div style={{ marginTop: 0 }}>Upload</div>
    //         </button>
    //       </Upload>
    //     </Form.Item>

    //     <Form.Item className='flex justify-end'>
    //       <Button htmlType='submit' className='bg-blue-500 w-40 text-white'>Submit</Button>
    //     </Form.Item>

    //   </Form>
    // </div>

    <form
      onSubmit={handleSubmit}
      className="text-black grid grid-cols-4 gap-x-20 gap-y-2"
    >
      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employeeId"
        >
          Employee ID
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="employeeId"
          value={values.employeeId}
          onChange={handleChanges}
          required
        />
      </div>

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
          value={values.employeeName}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="dateOfBirth"
        >
          Date of Birth
        </label>
        <input
          className="w-full bg-gray-200 block p-2 text-sm rounded-md border"
          type="date"
          // placeholder="Enter employee Name"
          name="dateOfBirth"
          value={values.dateOfBirth}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="gender"
        >
          Gender
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="gender"
          value={values.gender}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="maritalStatus"
        >
          Marital Status
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="maritalStatus"
          value={values.maritalStatus}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="contactNumber"
        >
          Contact Number
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Contact Number"
          name="contactNumber"
          value={values.contactNumber}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="alternateNumber"
        >
          Alternate Number
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          // placeholder="Alternate Number"
          name="alternateNumber"
          value={values.alternateNumber}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="personalEmail"
        >
          Personal Email
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="email"
          placeholder="example@mail.com"
          name="personalEmail"
          value={values.personalEmail}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="officialEmail"
        >
          Official Email
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="email"
          placeholder="example@mail.com"
          name="officialEmail"
          value={values.officialEmail}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="password"
        >
          Create Password
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="password"
          placeholder=""
          name="password"
          value={values.password}
          onChange={handleChanges}
        />
      </div>

      <div className="bg-gray-200 mt-5 w-full p-4 rounded col-span-4 gap-x-8">
      {/* Permanent Address */}
      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="street"
        >
          Street
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="street"
          value={permanentAddress.street}
          onChange={(e) =>
            handlePermanentAddressChange('street', e.target.value)
          }
        />
      </div>

      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="city"
        >
          City
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="city"
          value={permanentAddress.city}
          onChange={(e) =>
            handlePermanentAddressChange('city', e.target.value)
          }
        />
      </div>

      <div className="col-span-2">
        
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="state"
        >
          State
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="state"
          value={permanentAddress.state}
          onChange={(e) =>
            handlePermanentAddressChange('state', e.target.value)
          }
        />
      </div>

      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="pincode"
        >
          Pincode
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="pincode"
          maxLength={6}
          value={permanentAddress.pinCode}
          onChange={(e) =>
            handlePermanentAddressChange('pinCode', e.target.value)
          }
        />
      </div>

      {/* Checkbox for Same Address */}
      <div className="col-span-4 mt-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={isSameAddress}
            onChange={handleCheckboxChange}
          />
          Same as Permanent Address
        </label>
      </div>

      {/* Temporary Address */}
      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="street"
        >
          Street
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="street"
          value={temporaryAddress.street}
          onChange={(e) =>
            setTemporaryAddress({
              ...temporaryAddress,
              street: e.target.value,
            })
          }
          disabled={isSameAddress}
        />
      </div>

      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="city"
        >
          City
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="city"
          value={temporaryAddress.city}
          onChange={(e) =>
            setTemporaryAddress({
              ...temporaryAddress,
              city: e.target.value,
            })
          }
          disabled={isSameAddress}
        />
      </div>

      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="state"
        >
          State
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="state"
          value={temporaryAddress.state}
          onChange={(e) =>
            setTemporaryAddress({
              ...temporaryAddress,
              state: e.target.value,
            })
          }
          disabled={isSameAddress}
        />
      </div>

      <div className="col-span-2">
      <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="pincode"
        >
          Pincode
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          name="pincode"
          maxLength={6}
          value={temporaryAddress.pinCode}
          onChange={(e) =>
            setTemporaryAddress({
              ...temporaryAddress,
              pinCode: e.target.value,
            })
          }
          disabled={isSameAddress}
        />
      </div>
    </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="bloodGroup"
        >
          Blood Group
        </label>
        <input
          className="w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="Enter employee Name"
          name="bloodGroup"
          value={values.bloodGroup}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employeeType"
        >
          Employee Type
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="employeeType"
          value={values.employeeType}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="consultant">Consultant</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="aadharCardNumber"
        >
          Aadhar Card Number
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="number"
          placeholder="XXXX-XXXX-XXXX"
          name="aadharCardNumber"
          value={values.aadharCardNumber}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="passportNumber"
        >
          Passport Number (if Any)
        </label>
        <input
          className=" w-full bg-white block p-2 text-sm rounded-md border"
          type="text"
          // placeholder="XXXX-XXXX-XXXX"
          name="passportNumber"
          value={values.passportNumber}
          onChange={handleChanges}
        />
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2 mb-1 text-left "
          htmlFor="employeeStatus"
        >
          Employee Status
        </label>
        <select
          className="w-full bg-white block p-2 mb-2 text-sm rounded-md border"
          name="employeeStatus"
          value={values.employeeStatus}
          onChange={handleChanges}
          required
        >
          <option value="">--Select--</option>
          <option value="regular">Regular</option>
          <option value="releived">Releived</option>
          <option value="resigned">Resigned</option>
        </select>
      </div>

      <div className="col-span-2">
        <label
          className="text-base block w-full mt-2  text-left "
          htmlFor="document"
        >
          Document
        </label>
        <input
          type="file"
          name="document"
          value={values.document}
          onChange={handleChanges}
          required
        />
      </div>

      <div className="col-span-3 mt-3">
        <button className="bg-blue-500" type="submit">
          Submit
        </button>
      </div>
      
    </form>
  );
}

export default JoiningForm;
