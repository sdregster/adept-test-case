import React, { useState } from 'react'
import BaseModal from './BaseModal'
import { useDispatch, useSelector } from 'react-redux';
import { setAddCompanyModalStatus} from '../../features/modal/modalSlice';
import { addNewCompany} from '../../features/company/companySlice';
import TextField from '../UI/TextField';
import Button from '../UI/Button';

const AddCompanyModal = () => {
    const dispatch = useDispatch()

    const addCompanyModalStatus = useSelector(state => state.modal.addCompanyModal)
    const [addCompanyValues, setAddCompanyValues] = useState({
        companyName: '',
        companyCity: ''
    })
    const addCompanyModalHandler = (boolean) => {
        dispatch(setAddCompanyModalStatus(!boolean))
        setAddCompanyValues({ companyName: '', companyCity: ''})
    }
    const addCompanyHandler = () => {
        dispatch(addNewCompany(addCompanyValues))
        dispatch(setAddCompanyModalStatus(!addCompanyModalStatus))
        setAddCompanyValues({ companyName: '', companyCity: ''})
    }

    return (
        <BaseModal active={addCompanyModalStatus} setActive={addCompanyModalHandler}>
                    <div className="">
                        <TextField
                            label='Company Name'
                            value={addCompanyValues.companyName}
                            onChange={(e) => setAddCompanyValues({...addCompanyValues, companyName: e.target.value})}
                            inputProps={{ type: 'text', placeholder: 'Facebook' }}
                        />
                        <TextField
                            label='City'
                            value={addCompanyValues.companyCity}
                            onChange={(e) => setAddCompanyValues({...addCompanyValues, companyCity: e.target.value})}
                            inputProps={{ type: 'text', placeholder: 'Menlo Park' }}
                        />
                        <div className='flex w-full mt-4'>
                            <Button onClick={addCompanyModalHandler}>Cancel</Button>
                            <div className='w-[4px]' />
                            <Button onClick={addCompanyHandler}>Add</Button>
                        </div>
                    </div>
        </BaseModal>
    )
}

export default AddCompanyModal