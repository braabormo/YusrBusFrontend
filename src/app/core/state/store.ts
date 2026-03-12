import { configureStore } from '@reduxjs/toolkit'
import branchDialogReducer from '@/app/features/branches/logic/branchDialogSlice';
import branchSlice from '@/app/features/branches/logic/branchSlice';


export const store = configureStore({
  reducer: {
    branch: branchSlice,
    branchDialog: branchDialogReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch