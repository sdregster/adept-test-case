import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncDebounce } from 'react-table';
import { removeCompany} from '../../features/company/companySlice';
import { setAddCompanyModalStatus} from '../../features/modal/modalSlice';


export const CompanyGlobalFilter = ({ filter, setFilter, rowsArray }) => {
    const dispatch = useDispatch()
    const [value, setValue] = useState(filter)
    const selectedRows = rowsArray.map((row) => row.original.id)

    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000)

    const addCompanyModal = useSelector(state => state.modal.addCompanyModal)
    const addCompanyModalHandler = (boolean) => {
        dispatch(setAddCompanyModalStatus(!boolean))
    }

    const removeHandler = () => {
        dispatch(removeCompany(selectedRows))
    }

    return (
        <span className='flex gap-1 mb-1'>
            <input
                className='bg-gray-50 p-1 pl-5 border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600 w-full'
                placeholder='Search...'
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value)
                    onChange(e.target.value)
                }}
            />
            <button
                onClick={() => addCompanyModalHandler(addCompanyModal)}
                className='py-0.5 px-3 transition-colors bg-gray-50 border-2 border-gray-300 active:bg-gray-200 font-medium text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
            <button
                onClick={() => removeHandler()}
                className={selectedRows.length > 0 ? 'py-0.5 px-3 transition-colors bg-gray-50 border-2 border-gray-300 active:bg-gray-200 font-medium text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50' : 'visibility: hidden'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={selectedRows.length > 0 ? '"w-5 h-5 stroke-teal-600"' : 'visibility: hidden'}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
        </span>
    )
}