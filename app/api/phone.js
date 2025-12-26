import axiosInstance from "./axiosInstance";
// import { useShopDomain } from "../utils/helper";

// const getRequestHeaders = () => ({
//   "Content-Type": "application/json",
//   Accept: "application / json",
//   "ngrok-skip-browser-warning": "true",
//   "X-Requested-With": "XMLHttpRequest",
// });

const getShopDomain = () => {
  // Get shop domain from URL parameters (works in both client and server)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    console.log("params", params.get("shop"));
    return params.get("shop") || "";
  }
  return "";

  //  const shop = useShopDomain();
  //  return shop;
};

export const getAllPhone = async () => {
  const shopDomain = getShopDomain();
  return axiosInstance
    .get("/phone", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data);
};

export const deletePhone = async (id) => {
  return axiosInstance.delete(`/phone/${id}`).then((res) => res.data);
};

export const getPhone = async (id) => {
  return axiosInstance.get(`/phone/${id}`).then((res) => res.data);
};

export const createPhone = async (data) => {
  return axiosInstance.post("/phone/add", data).then((res) => res.data);
};

export const editPhone = async (id, data) => {
  return axiosInstance.put(`/phone/${id}`, data).then((res) => res.data);
};

export const getCurrentSession = async () => {
  const shopDomain = getShopDomain();
  return axiosInstance
    .get("/phone/session/current", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
      // withCredentials: true, // only if you need cookies
    })
    .then((res) => res.data);
};
