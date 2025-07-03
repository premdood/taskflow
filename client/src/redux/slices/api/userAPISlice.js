import { apiSlice } from "../features/apiSlice.js";
import { setCredentials } from "../features/authSlice.js";

const userAPISlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getDashboardStatistics: build.query({
      query: () => ({
        url: "/users/dashboard",
        method: "GET",
      }),
      providesTags: () => [{ type: "Task" }, { type: "User" }],
    }),

    getAllUsers: build.query({
      query: (queryParams) => ({
        url: `/admin/users`,
        params: queryParams,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.success
          ? [...result.data.map(({ _id }) => ({ id: _id, type: "User" }))]
          : ["User"],
    }),

    addUser: build.mutation({
      query: (data) => ({
        url: `/admin/users`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: () => ["User"],
    }),

    updateUser: build.mutation({
      query: ({ userId, values }) => ({
        url: "/users/profile",
        method: "PATCH",
        body: { ...values, userId },
      }),

      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        // if the user updated is the current logged in user then updated the
        // auth details in localStorage and store
        if (getState().auth.user._id === args.userId) {
          try {
            const { data } = await queryFulfilled;
            const token = getState().auth.token;
            dispatch(setCredentials({ token, user: data.data }));
          } catch (err) {
            console.log(err);
          }
        }
      },
      invalidatesTags: (_result, _err, args) => [
        { type: "User", id: args.userId },
        { type: "User" },
      ],
    }),

    updatePassword: build.mutation({
      query: (data) => ({
        url: "/users/password",
        method: "PATCH",
        body: data,
      }),
    }),

    changeUserStatus: build.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: () => ["User"],
    }),

    deleteUser: build.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["User"],
    }),
  }),
});

export const {
  useGetDashboardStatisticsQuery,
  useGetAllUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} = userAPISlice;
