import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'dashboardList/state',
    initialState: {
        deleteConfirmation: false,
        selectedDashboard: '',
        newDialog: false,
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedDashboard: (state, action) => {
            state.selectedDashboard = action.payload
        },
        toggleNewDialog: (state, action) => {
            state.newDialog = action.payload
        },
    },
})

export const { toggleDeleteConfirmation, setSelectedDashboard, toggleNewDialog } =
    stateSlice.actions

export default stateSlice.reducer