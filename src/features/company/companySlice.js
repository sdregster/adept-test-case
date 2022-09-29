import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export const fetchData = createAsyncThunk(
    'companies/fetchCompaniesData',
    async (page=1, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:3004/companies?_embed=employees&_limit=12&_page=${page}`);
            const data = await response.json();
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const addNewCompany = createAsyncThunk(
    'companies/addNewCompany',
    async (newCompanyValues, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch('http://localhost:3004/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: uuidv4(),
                    company_name: newCompanyValues.companyName,
                    city: newCompanyValues.companyCity
                })
            });

            if (!response.ok) {
                throw new Error('Can\'t add new company. Server error.');
            }

            const data = await response.json();
            data.employees = []
            dispatch(addCompanyLocal(data))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeCompany = createAsyncThunk(
    'companies/removeCompanies',
    async (idsArray, { rejectWithValue, dispatch }) => {
        for (let index = 0; index < idsArray.length; index++) {
            const id = idsArray[index];
            try {
                const response = await fetch(`http://localhost:3004/companies/${id}`, {
                    method: 'DELETE'
                })

                if (!response.ok) {
                    throw new Error('Can\'t delete company. Server error.');
                }

                dispatch(removeCompanyLocal(idsArray))

            } catch (error) {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const updateCompanyData = createAsyncThunk(
    'companies/updateCompanyName',
    async (updatedCompanyValues, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`http://localhost:3004/companies/${updatedCompanyValues.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: `{"${updatedCompanyValues.field}":"${updatedCompanyValues.newValue}"}`
            })

            if (response.status !== 200) {
                throw new Error('Can\'t change name. Server error.');
            }

            dispatch(editCompanyLocal(updatedCompanyValues))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)


const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload
}

const companySlice = createSlice({
    name: 'companies',
    initialState: {
        companies: [],
        status: null,
        error: null,
        selectedId: '',
        isCellEditing: false
    },
    reducers: {
        addCompanyLocal(state, action) {
            state.companies.unshift(action.payload)
        },
        removeCompanyLocal(state, action) {
            const idsArray = action.payload
            for (let index = 0; index < idsArray.length; index++) {
                const id = idsArray[index];
                state.companies = state.companies.filter(company => company.id !== id)
            }
        },
        editCompanyLocal(state, action) {
            const editingValues = action.payload
            const editedField = editingValues.field
            const existingCompany = state.companies.find(company => company.id === editingValues.id)
            if (existingCompany) {
                existingCompany[editedField] = editingValues.newValue;
            }
        },
        setSelectedId(state, action) {
            state.selectedId = action.payload
        },
        addNewEmployeeLocal(state, action) {
            const newEmployeeValues = action.payload
            state.companies.find(company => company.id === newEmployeeValues.companyId).employees.push(newEmployeeValues)
        },
        removeEmployeeLocal(state, action) {
            const removeValues = action.payload
            let currentEmployeesArray = JSON.parse(JSON.stringify(state.companies.find(company => company.id === removeValues.id).employees));
            for (let index = 0; index < removeValues.arrayIds.length; index++) {
                const id = removeValues.arrayIds[index];
                currentEmployeesArray = currentEmployeesArray.filter(employee => employee.id !== id)
            }
            state.companies.find(company => company.id === removeValues.id).employees = currentEmployeesArray
        },
        editEmployeeLocal(state, action) {
            const updatedEmployeeData = action.payload;
            const existingEmployee = state.companies.find(company => company.id === updatedEmployeeData.companyId)
            .employees.find(employee => employee.id === updatedEmployeeData.employeeId);
            if (existingEmployee) {
                existingEmployee[updatedEmployeeData.fieldName] = updatedEmployeeData.newValue
            }
        },
        setCellEditing(state, action) {
            state.isCellEditing = action.payload
        }
    },
    extraReducers: {
        [fetchData.pending]: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        [fetchData.fulfilled]: (state, action) => {
            state.status = 'resolved';
            state.companies = JSON.parse(JSON.stringify(state.companies)).concat(action.payload);
        },
        [fetchData.rejected]: setError,
        [addNewCompany.rejected]: setError,
        [removeCompany.rejected]: setError,
        [updateCompanyData.rejected]: setError,
    }
})

const { addCompanyLocal, removeCompanyLocal, editCompanyLocal} = companySlice.actions
export const {setSelectedId, setCellEditing, addNewEmployeeLocal, removeEmployeeLocal, editEmployeeLocal} = companySlice.actions
export default companySlice.reducer