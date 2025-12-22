import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate, registerAppUninstalledWebhook } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  // Register the webhook for this shop
  await registerAppUninstalledWebhook(session);
  await authenticate.admin(request);

  return null;
};;

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
