import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'accountList/state',
    initialState: {
        deleteConfirmation: false,
        selectedAccount: '',
        newDialog: false,
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedAccount: (state, action) => {
            state.selectedAccount = action.payload
        },
        toggleNewDialog: (state, action) => {
            state.newDialog = action.payload
        },
    },
})

export const { toggleDeleteConfirmation, setSelectedAccount,toggleNewDialog } =
    stateSlice.actions

export default stateSlice.reducer