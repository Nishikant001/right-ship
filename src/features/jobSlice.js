import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk to send application to company
export const sendApplicationToCompany = createAsyncThunk(
  'job/sendApplicationToCompany',
  async (job, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.rightships.com/company/application/create', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_id: job.companyId, // Replace with actual company ID
          rspl_no: job.rpslNo,
          company_name: job.companyName,
          hiring_for: job.hiringFor,
          open_positions: job.openPositions,
          description: job.description,
          mobile_no: job.contact.number,
          email: job.contact.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send application to company');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(sendApplicationToCompany.fulfilled, (state, action) => {
      // Handle any additional logic if needed after the application is successfully sent
      console.log('Application sent to company successfully:', action.payload);
    });
    builder.addCase(sendApplicationToCompany.rejected, (state, action) => {
      console.error('Failed to send application to company:', action.payload);
    });
  },
});

export const { applyJob, bookmarkJob, removeJob, unapplyJob } = jobSlice.actions;

export default jobSlice.reducer;
