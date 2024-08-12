import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedJobs: JSON.parse(localStorage.getItem('savedJobs')) || [],
  appliedJobs: JSON.parse(localStorage.getItem('appliedJobs')) || [],
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    applyJob: (state, action) => {
      const job = action.payload;
      if (!state.appliedJobs.some(appliedJob => appliedJob.id === job.id)) {
        state.appliedJobs.push(job);
        localStorage.setItem('appliedJobs', JSON.stringify(state.appliedJobs));
      }
    },
    bookmarkJob: (state, action) => {
      const job = action.payload;
      if (!state.savedJobs.some(savedJob => savedJob.id === job.id)) {
        state.savedJobs.push(job);
        localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs));
      }
    },
    removeJob: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(job => job.id !== jobId);
      localStorage.setItem('savedJobs', JSON.stringify(state.savedJobs));
    },
    unapplyJob: (state, action) => {
      const jobId = action.payload;
      state.appliedJobs = state.appliedJobs.filter(job => job.id !== jobId);
      localStorage.setItem('appliedJobs', JSON.stringify(state.appliedJobs));
    },
  },
});

export const { applyJob, bookmarkJob, removeJob, unapplyJob } = jobSlice.actions;

export default jobSlice.reducer;
