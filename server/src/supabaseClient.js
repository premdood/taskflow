import { createClient } from "@supabase/supabase-js";
import { StatusCodes } from "http-status-codes";
import { SUPABASE } from "./config/config.js";
import CustomAPIError from "./errors/custom-error.js";

const supabaseUrl = SUPABASE.URL;
const supabaseServiceRoleKey = SUPABASE.SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const uploadFiles = async (path, file) => {
  const { _data, error } = await supabase.storage
    .from("task-files")
    .upload(path, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new CustomAPIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const copyFiles = async (fromPath, toPath) => {
  const { _data, error } = await supabase.storage
    .from("task-files")
    .copy(fromPath, toPath);

  if (error) {
    throw new CustomAPIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getFilesUrl = async (paths) => {
  const { data, error } = await supabase.storage
    .from("task-files")
    .createSignedUrls(paths, 60);

  if (error) {
    throw new CustomAPIError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }

  return data.map((file) => file.signedUrl);
};

export { copyFiles, getFilesUrl, uploadFiles };
