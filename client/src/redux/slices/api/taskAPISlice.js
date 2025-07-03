import { apiSlice } from "../features/apiSlice.js";

const taskAPISlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllTask: build.query({
      query: (params) => ({
        url: `/users/tasks`,
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result?.success
          ? [
              result.data.map(({ _id }) => ({ id: _id, type: "Task" })),
              { type: "Task" },
            ]
          : ["Task"],
    }),

    createTask: build.mutation({
      query: (data) => ({
        url: "/admin/tasks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: () => ["Task"],
    }),

    getSingleTask: build.query({
      query: ({ taskId }) => ({
        url: `users/tasks/${taskId}`,
        method: "GET",
      }),
      providesTags: (_result, _err, arg) => [{ id: arg.taskId, type: "Task" }],
    }),

    updateTask: build.mutation({
      query: ({ taskId, data }) => ({
        url: `/admin/tasks/${taskId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _err, arg) => [
        { id: arg.taskId, type: "Task" },
        { type: "Task" },
      ],
    }),

    trashSingleTask: build.mutation({
      query: ({ taskId }) => ({
        url: `/admin/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, arg) => [
        { id: arg.taskId, type: "Task" },
        { type: "Task" },
      ],
    }),

    addSubTask: build.mutation({
      query: ({ taskId, data }) => ({
        url: `/admin/tasks/${taskId}/sub-tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, args) => [
        { type: "Task", id: args.taskId },
        { type: "Task" },
      ],
    }),

    toggleSubTaskCompletion: build.mutation({
      query: ({ taskId, subTaskId }) => ({
        url: `/users/tasks/${taskId}/sub-task/${subTaskId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _err, args) => [
        { type: "Task", id: args.taskId },
      ],
    }),

    postActivity: build.mutation({
      query: ({ taskId, data }) => ({
        url: `/users/tasks/${taskId}/activities`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _err, args) => [
        { type: "Task", id: args.taskId },
      ],
    }),

    duplicateTask: build.mutation({
      query: ({ taskId }) => ({
        url: `/admin/tasks/${taskId}/duplicate`,
        method: "POST",
      }),
      invalidatesTags: () => ["Task"],
    }),

    restoreSingleTask: build.mutation({
      query: ({ taskId }) => ({
        url: `/admin/trash/${taskId}`,
        method: "PATCH",
      }),
      invalidatesTags: () => ["Task"],
    }),

    deleteSingleTask: build.mutation({
      query: ({ taskId }) => ({
        url: `/admin/trash/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: () => ["Task"],
    }),

    restoreAllTAsk: build.mutation({
      query: () => ({
        url: "/admin/trash",
        method: "PATCH",
      }),
      invalidatesTags: () => ["Task"],
    }),

    deleteAllTask: build.mutation({
      query: () => ({
        url: "/admin/trash",
        method: "DELETE",
      }),
      invalidatesTags: () => ["Task"],
    }),
  }),
});

export const {
  useGetAllTaskQuery,
  useCreateTaskMutation,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
  useTrashSingleTaskMutation,
  useAddSubTaskMutation,
  useToggleSubTaskCompletionMutation,
  usePostActivityMutation,
  useDuplicateTaskMutation,
  useRestoreSingleTaskMutation,
  useDeleteSingleTaskMutation,
  useRestoreAllTAskMutation,
  useDeleteAllTaskMutation,
} = taskAPISlice;
