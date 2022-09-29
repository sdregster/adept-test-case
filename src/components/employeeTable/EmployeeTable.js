import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { setCellEditing } from '../../features/company/companySlice';
import { updateEmployeeData } from '../../features/employee/employeeSlice';
import { CheckBox } from '../UI/CheckBox';
import { COLUMNS } from './employeeColumns';
import { EmployeeGlobalFilter } from './EmployeeGlobalFilter';

const EmployeeTable = () => {
    const dispatch = useDispatch()
    const columns = useMemo(() => COLUMNS, [])
    const data = useSelector(state => state.employee.employees.employees)

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows,
    } = useTable({
        columns: columns,
        data: data,
        autoResetFilters: false,
        autoResetSortBy: false
    }, useGlobalFilter, useSortBy, usePagination, useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <CheckBox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({ row }) => (
                            <CheckBox {...row.getToggleRowSelectedProps()} />
                        )
                    },
                    ...columns
                ]
            })
        }
    )
    const { globalFilter } = state


    // Редактирования ячеек
    const currentEditCellStatus = useSelector(state => state.company.isCellEditing)
    const [editCellValues, setEditCellValues] = useState({companyId: '', employeeId: '', fieldName: '', oldValue: ''})
    const startEditCell = (e) => {
        if (e.column.id !== 'selection') {
            dispatch(setCellEditing(!currentEditCellStatus))
            setEditCellValues({
                companyId: e.row.original.companyId,
                employeeId: e.row.original.id,
                fieldName: e.column.id,
                oldValue: e.value
            })
        } 
    };
    const endEditCell = (targetValue) => {
        dispatch(setCellEditing(!currentEditCellStatus))
        const newValues = {
            ...editCellValues,
            newValue: targetValue
        };
        if (editCellValues.oldValue !== targetValue) {
            dispatch(updateEmployeeData(newValues))
        }
        setEditCellValues({companyId: '', fieldName: '', oldValue: ''})
    }

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <EmployeeGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} rowsArray={selectedFlatRows} />
                    <div className="overflow-hidden border rounded-lg">
                        <table
                            className="min-w-full divide-y divide-gray-200 table-auto"
                            {...getTableProps()}
                        >
                            <thead className="bg-teal-600">
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th
                                                className="group px-6 py-3 text-center text-white uppercase tracking-wider text-xs font-medium hover:bg-teal-700 transition-colors"
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                            >
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted ? (column.isSortedDesc ? ' ▲' : ' ▼') : ''}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody
                                className="bg-white divide-y divide-gray-200"
                                {...getTableBodyProps()}
                            >
                                {page.map(row => {
                                    prepareRow(row)
                                    return (
                                        <tr
                                            className={!row.isSelected ? 'hover:bg-gray-50 transition-colors' : 'bg-gray-100 hover:bg-gray-50'}
                                            {...row.getRowProps()}
                                        >
                                            {row.cells.map((cell, j) => {
                                                return (
                                                    <td
                                                    // onClick={currentEditCellStatus? (e) => e.stopPropagation() : () => startEditCell(cell)}
                                                    onClick={() => startEditCell(cell)}
                                                    onBlur={(e) => endEditCell(e.target.textContent)}
                                                        contentEditable={j !== 0? 'true' : 'false'}
                                                        suppressContentEditableWarning='true'
                                                        className="px-6 py-4 whitespace-nowrap"
                                                        {...cell.getCellProps()}
                                                    >
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {data.length > 10 && <div className='flex justify-between mt-1'>
                        <button
                            className={!canPreviousPage
                                ?
                                'py-2 px-6 w-full text-sm text-teal-600 border rounded-lg border-teal-600 bg-white'
                                :
                                'py-2 px-6 w-full text-sm text-white hover:bg-teal-700 bg-teal-600 rounded-lg transition-colors'
                            }
                            onClick={() => previousPage()} disabled={!canPreviousPage}
                        >
                            Previous page
                        </button>
                        <div className='w-[4px]' />
                        <button
                            className={!canNextPage
                                ?
                                'py-2 px-6 w-full text-sm text-teal-600 border rounded-lg border-teal-600 bg-white'
                                :
                                'py-2 px-6 w-full text-sm text-white hover:bg-teal-700 bg-teal-600 rounded-lg transition-colors'
                            }
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                        >
                            Next page
                        </button>
                    </div>}
                    {data.length === 0 && <div className='py-5 px-4'>There are not any employees yet.</div>}
                </div>
            </div>
        </div>
    )
}

export default EmployeeTable
