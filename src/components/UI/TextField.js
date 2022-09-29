import React from 'react'

const TextField = ({ label, inputProps, onChange, value }) => {
  return (
    <div className='flex flex-col'>
      <label className='mt-2 mb-1 text-base text-gray-800'>{label}</label>
      <input
        className='bg-gray-50 p-1 pl-5 border-2 outline-none rounded-md border-gray-300 shadow-sm focus:border-teal-600 focus:ring-teal-600'
        {...inputProps}
        onChange={onChange}
        value={value}
      />
    </div>
  )
}

export default TextField