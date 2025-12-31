import { useAppBridge } from "@shopify/app-bridge-react";

export const currentShopDomain = () => {
  const app = useAppBridge();
  return app.config.shop;
};
