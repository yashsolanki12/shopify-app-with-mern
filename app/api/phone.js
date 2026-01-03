import axiosInstance from "./axiosInstance";
import { currentShopDomain } from "../utils/helper";

const getShopDomain = () => {
  // Get shop domain from URL parameters (works in both client and server)
  // if (typeof window !== "undefined") {
  //   const params = new URLSearchParams(window.location.search);
  //   const shop = params.get("shop");
  //   return shop || "";
  // }
  // return "";
  const app = currentShopDomain();
  return app;
};

export const getAllPhone = async () => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found in URL parameters");
    throw new Error("Shop domain is required");
  }

  return axiosInstance
    .get("/phone", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in getAllPhone:", error);
      throw error;
    });
};

export const deletePhone = async (id) => {
  return axiosInstance.delete(`/phone/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in deletePhone:", error);
      throw error;
    });
};

export const getPhone = async (id) => {
  return axiosInstance.get(`/phone/${id}`).then((res) => res.data);
};

export const createPhone = async (data) => {
  return axiosInstance.post("/phone/add", data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in createPhone:", error);
      throw error;
    });
};

export const editPhone = async (id, data) => {
  return axiosInstance.put(`/phone/${id}`, data)
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in editPhone:", error);
      throw error;
    });
};

export const getCurrentSession = async () => {
  const shopDomain = getShopDomain();

  if (!shopDomain) {
    console.error("No shop domain found for session request");
    throw new Error("Shop domain is required for session");
  }

  return axiosInstance
    .get("/phone/session/current", {
      headers: {
        "x-shopify-shop-domain": shopDomain,
      },
      // withCredentials: true, // only if you need cookies
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error("API Error in getCurrentSession:", error);
      throw error;
    });
};
