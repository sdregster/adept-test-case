import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        addCompanyModal: false,
        addEmployeeModal: false
    },
    reducers: {
        setAddCompanyModalStatus(state, action) {
            state.addCompanyModal = action.payload
        },
        setAddEmployeeModalStatus(state, action) {
            state.addEmployeeModal = action.payload
        }
    }
});

export const { setAddCompanyModalStatus, setAddEmployeeModalStatus } = modalSlice.actions

export default modalSlice.reducer