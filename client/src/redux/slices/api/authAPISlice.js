import { apiSlice } from "../features/apiSlice.js";
import { removeCredentials, setCredentials } from "../features/authSlice.js";

const authAPISlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data));
        } catch (err) {
          console.log(err);
        }
      },
    }),

    logout: build.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(removeCredentials());
          dispatch(apiSlice.util.resetApiState());
          localStorage.clear(); // clear any additional data stored in local storage
        } catch (err) {
          console.error(err);
        }
      },
      invalidatesTags: () => ["User", "Task", "Notification"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authAPISlice;
