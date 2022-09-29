import { configureStore } from "@reduxjs/toolkit"
import companyReducer from '../features/company/companySlice'
import employeeReducer from "../features/employee/employeeSlice"
import modalReducer from '../features/modal/modalSlice'

export const store = configureStore({
  reducer: {
    company: companyReducer,
    employee: employeeReducer,
    modal: modalReducer,
  },
})