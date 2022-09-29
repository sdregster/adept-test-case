import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalFilter, useRowSelect, useSortBy, useTable } from 'react-table';
import { fetchData, setCellEditing, updateCompanyData } from '../../features/company/companySlice';
import { setEmpoyees } from '../../features/employee/employeeSlice';
import { CheckBox } from '../UI/CheckBox';
import { COLUMNS } from './companyColumns';
import { CompanyGlobalFilter } from './CompanyGlobalFilter';

const CompanyTable = () => {
    const dispatch = useDispatch();
    const columns = useMemo(() => COLUMNS, []);
    const data = useSelector(state => state.company.companies);
    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        selectedFlatRows,
    } = useTable({
        columns: columns,
        data: data,
        autoResetSelectedRows: false,
        autoResetFilters: false,
        autoResetSortBy: false
    }, useGlobalFilter, useSortBy, useRowSelect,
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
    useEffect(() => {
        const selectedRows = selectedFlatRows.map((selectedRow) => selectedRow.original);
        if (0 <= selectedRows.length <= 1) {
            dispatch(setEmpoyees(selectedRows))
        }
    }, [selectedFlatRows, dispatch]);
    const { globalFilter } = state

    // Редактирования ячеек
    const currentEditCellStatus = useSelector(state => state.company.isCellEditing)
    const [editCellValues, setEditCellValues] = useState({companyId: '', fieldName: '', oldValue: ''})
    const startEditCell = (e) => {
        if (e.column.Header === 'Company name' || e.column.Header === 'City') {
            dispatch(setCellEditing(!currentEditCellStatus))
            setEditCellValues({
                id: e.row.original.id,
                field: e.column.id,
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
            dispatch(updateCompanyData(newValues))
        }
        setEditCellValues({companyId: '', fieldName: '', oldValue: ''})
    }

    // Подгрузка данных на скролл
    const [page, setPage] = useState(2);
    const fetchMoreData = () => {
        setPage(page + 1)
        dispatch(fetchData(page));
    }

    const listInnerRef = useRef();
    const onScroll = () => {
        if (listInnerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
          if (Math.ceil(scrollTop + clientHeight) >= scrollHeight) {
            fetchMoreData();
          }
        }
      };

    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto">
                <div className="p-1.5 w-full inline-block align-middle">
                    <CompanyGlobalFilter filter={globalFilter} setFilter={setGlobalFilter} rowsArray={selectedFlatRows} />
                    <div 
                        onScroll={onScroll} 
                        ref={listInnerRef}    
                        className="overflow-y-auto border rounded-lg max-h-[610px]">
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
                                {rows.map(row => {
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
                                                        contentEditable={j % 2 !== 0? 'true' : 'false'}
                                                        suppressContentEditableWarning='true'
                                                        className='px-6 py-4 whitespace-nowrap'
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
                </div>
            </div>
        </div>
    )
}

export default CompanyTable
