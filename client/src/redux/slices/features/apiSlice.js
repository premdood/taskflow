import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import { removeCredentials } from "./authSlice.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.token;
    if (token && endpoint !== "/login") {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAutoLogout = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error && result.error?.status === 401) {
    toast.error(result?.error?.data?.message);
    api.dispatch(apiSlice.util.resetApiState());
    api.dispatch(removeCredentials());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithAutoLogout,
  tagTypes: ["Task", "User", "Notification"],
  endpoints: () => ({}),
});
