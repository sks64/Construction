import { createSlice } from '@reduxjs/toolkit'

const stateSlice = createSlice({
    name: 'assetList/state',
    initialState: {
        deleteConfirmation: false,
        selectedAsset: '',
        newDialog: false,
    },
    reducers: {
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedAsset: (state, action) => {
            state.selectedAsset = action.payload
        },
        toggleNewDialog: (state, action) => {
            state.newDialog = action.payload
        },
    },
})

export const { toggleDeleteConfirmation, setSelectedAsset, toggleNewDialog } =
    stateSlice.actions

export default stateSlice.reducer


