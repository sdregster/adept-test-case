export const COLUMNS = [
    {
        Header: 'Company name',
        accessor: 'company_name',
    },
    {
        Header: 'Empoyees quantity',
        id: 'employees',
        accessor: (rowInfo) => {
            return String(rowInfo.employees.length);
        }
    },
    {
        Header: 'City',
        accessor: 'city',
    }
]