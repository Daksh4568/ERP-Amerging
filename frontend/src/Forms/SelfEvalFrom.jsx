import {React, useState} from 'react'
// import { Form, Input, InputNumber, DatePicker, } from 'antd';
import { TextField, Select, MenuItem, InputLabel, FormControl, DatePicker} from '@mui/material'

function SelfEvalFrom() {
    const [department, setDepartment] = useState('');

    const handleChange = (e) => {
        e.preventDefault()
        setDepartment(e.target.value)

    }

    return (
        
        <FormControl fullWidth className='flex justify-center items-center w-full h-full m-5 mt-5 bg-orange-400'>
            <TextField  label='Employee Name' />
            <TextField  label='Designation' />
            
            <Select
              className='w-52'
              labelId="dept"
              id="demo-simple-select"
              value={department}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>Design</MenuItem>
              <MenuItem value={20}>Process</MenuItem>
              <MenuItem value={30}>IT</MenuItem>
              <MenuItem value={30}>Sales</MenuItem>
            </Select>

            <DatePicker label='Date of Review' />
        </FormControl>

    )
}

export default SelfEvalFrom