import { useAppBridge } from "@shopify/app-bridge-react";

export const useShopDomain = () => {
  const app = useAppBridge();
  return app.config.shop;
};
