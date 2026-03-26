import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'distributorList/state',
    initialState: {
        deleteConfirmation: false,
        selectedDistributor: '',
        newDialog: false,
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedDistributor: (state, action) => {
            state.selectedDistributor = action.payload
        },
        toggleNewDialog: (state, action) => {
            state.newDialog = action.payload
        },
    },
})

export const { toggleDeleteConfirmation, setSelectedDistributor,toggleNewDialog } =
    stateSlice.actions

export default stateSlice.reducer