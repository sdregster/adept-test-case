import React, { useState } from 'react'
import BaseModal from './BaseModal'
import Button from '../UI/Button'
import TextField from '../UI/TextField'
import { v4 as uuidv4 } from 'uuid';
import { addNewEmployee } from '../../features/employee/employeeSlice';
import { setAddEmployeeModalStatus} from '../../features/modal/modalSlice';
import { useDispatch, useSelector } from 'react-redux';

const AddEmployeeModal = () => {
    const dispatch = useDispatch()
    const selectedCompanyData = useSelector(state => state.employee.employees)
    const addEmployeeModalStatus = useSelector(state => state.modal.addEmployeeModal)
    const [newEmployee, setNewEmployee] = useState({
        lastname: '',
        name: '',
        jobTitle: ''
    })
    const addEmployeeModalHandler = (boolean) => {
        dispatch(setAddEmployeeModalStatus(!boolean))
        setNewEmployee({ lastname: '', name: '', jobTitle: ''})
    }
    const addEmployeeHandler = () => {
        dispatch(addNewEmployee({
            id: uuidv4(),
            name: newEmployee.name,
            lastname: newEmployee.lastname,
            job_title: newEmployee.jobTitle,
            companyId: selectedCompanyData.id
        }))
        addEmployeeModalHandler(addEmployeeModalStatus)
        setNewEmployee({ lastname: '', name: '', jobTitle: ''})
    }

    return (
        <BaseModal active={addEmployeeModalStatus} setActive={addEmployeeModalHandler}>
                <div className="">
                    <TextField
                        label='Surname'
                        value={newEmployee.lastname}
                        onChange={(e) => setNewEmployee({ ...newEmployee, lastname: e.target.value})}
                        inputProps={{ type: 'text', placeholder: 'Facebook' }}
                    />
                    <TextField
                        label='Name'
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value})}
                        inputProps={{ type: 'text', placeholder: 'Facebook' }}
                    />
                    <TextField
                        label='Job title'
                        value={newEmployee.jobTitle}
                        onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value})}
                        inputProps={{ type: 'text', placeholder: 'Facebook' }}
                    />
                    <div className='flex w-full mt-4'>
                        <Button onClick={addEmployeeModalHandler}>Cancel</Button>
                        <div className='w-[4px]' />
                        <Button onClick={addEmployeeHandler}>Add</Button>
                    </div>
                </div>
        </BaseModal>
    )
}

export default AddEmployeeModal