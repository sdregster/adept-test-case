import React from 'react';
import { useSelector } from 'react-redux';
import CompanyTable from "./components/companyTable/CompanyTable";
import EmployeeTable from './components/employeeTable/EmployeeTable';
import AddCompanyModal from './components/modals/AddCompanyModal';
import AddEmployeeModal from './components/modals/AddEmployeeModal';


function App() {
    const selectedCompanyEmployees = useSelector(state => state.employee.employees)
    const {status, error} = useSelector(state => state.company)

    return (
        <div>
            <AddCompanyModal />
            <AddEmployeeModal />
            <div className='min-h-screen h-full w-screen bg-gray-100'>
                <div className='container mx-auto px-4'>
                    <header className='flex gap-10'>
                        <div className='w-1/2 text-center mt-5'>
                            <div className="">
                                <h1 className="px-2 text-xl text-left font-semibold">Companies table</h1>
                            </div>
                            <CompanyTable />
                            {status === 'loading' && <h2>Loading...</h2>}
                            {error && <h2>An error occured: {error}</h2>}
                        </div>
                        {
                            selectedCompanyEmployees.length !== 0 &&
                            <div className='w-1/2 text-center mt-5'>
                                <div className="">
                                    <h1 className="px-2 text-xl text-left font-semibold">Empoyees table</h1>
                                </div>
                                <EmployeeTable />
                            </div>
                        }
                    </header>
                </div>
            </div>
        </div>
    );
}

export default App;
