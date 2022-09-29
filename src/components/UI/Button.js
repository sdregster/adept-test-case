import React from 'react'

const Button = ({ onClick, children, showProps=true }) => {
  return (
    <button className='bg-teal-600 text-white text-sm py-2 px-4 my-2 rounded hover:bg-teal-700 w-full'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button