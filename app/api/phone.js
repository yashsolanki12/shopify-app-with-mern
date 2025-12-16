import axiosInstance from "./axiosInstance";

export const getAllPhone = async (url) => {
  return axiosInstance.get(url).then((res) => res.data);
};
