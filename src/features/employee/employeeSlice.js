import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addNewEmployeeLocal, editEmployeeLocal, removeEmployeeLocal } from '../company/companySlice';

export const addNewEmployee = createAsyncThunk(
    'employees/addNewEmployee',
    async (newEmployeeData, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch('http://localhost:3004/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEmployeeData)
            });

            if (!response.ok) {
                throw new Error('Can\'t add new employee. Server error.');
            }

            dispatch(addNewEmployeeLocal(newEmployeeData))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const removeEmployee = createAsyncThunk(
    'employees/removeEmployee',
    async (removeData, { rejectWithValue, dispatch }) => {
        const idsArray = removeData.arrayIds
        for (let index = 0; index < idsArray.length; index++) {
            const id = idsArray[index];
            try {
                const response = await fetch(`http://localhost:3004/employees/${id}`, {
                    method: 'DELETE'
                })

                if (!response.ok) {
                    throw new Error('Can\'t delete employee. Server error.');
                }

                dispatch(removeEmployeeLocal(removeData))

            } catch (error) {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const updateEmployeeData = createAsyncThunk(
    'employees/updateEmployeeData',
    async (updatedCompanyValues, { rejectWithValue, dispatch }) => {
        try {
            const response = await fetch(`http://localhost:3004/employees/${updatedCompanyValues.employeeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: `{"${updatedCompanyValues.fieldName}":"${updatedCompanyValues.newValue}"}`,
            })

            if (response.status !== 200) {
                throw new Error('Can\'t change employee data. Server error.');
            }

            dispatch(editEmployeeLocal(updatedCompanyValues))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const setError = (state, action) => {
    state.status = 'rejected';
    state.error = action.payload
}

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        status: null,
        error: null,
        selectedEmployeeId: ''
    },
    reducers: {
        setEmpoyees(state, action) {
            const tempValue = action.payload
            tempValue.length === 1 ? state.employees = tempValue[0] : state.employees = [];
        },
        setSelectedEmployeeId(state, action) {
            state.selectedEmployeeId = action.payload
        },
    },
    extraReducers: {
        [addNewEmployee.rejected]: setError,
        [removeEmployee.rejected]: setError,
        [updateEmployeeData.rejected]: setError
    }
})

export const { setEmpoyees, setSelectedEmployeeId } = employeeSlice.actions
export default employeeSlice.reducer