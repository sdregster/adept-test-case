import React from 'react';

const BaseModal = ({ active, setActive, children }) => {
    return (
        <div
            className={!active ?
                'w-full h-full bg-black/50 fixed t-0 l-0 flex items-center justify-center scale-0'
                :
                'w-full h-full bg-black/50 fixed t-0 l-0 flex items-center justify-center scale-100'}
            onClick={() => setActive(active)}
        >
            <div
                className={!active ? 'p-[20px] rounded-lg bg-white ease-in-out duration-200 scale-0' : 'scale-100 p-[20px] rounded-lg bg-white  ease-in-out duration-200'}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default BaseModal