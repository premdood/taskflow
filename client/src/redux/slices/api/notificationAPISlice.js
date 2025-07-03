import { apiSlice } from "../features/apiSlice";

const notificationsAPISlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      query: () => ({
        url: "/users/notifications",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? result.data.map((notification) => ({
              type: "Notification",
              id: notification._id,
            }))
          : ["Notification"],
    }),

    markNotificationRead: build.mutation({
      query: (data) => ({
        url: `/users/notifications`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, args) => {
        if (args.readType === "all") return ["Notification"];
        else return [{ type: "Notification", id: args.notificationId }];
      },
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } =
  notificationsAPISlice;
