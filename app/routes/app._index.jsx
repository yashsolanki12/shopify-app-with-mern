import { boundary } from "@shopify/shopify-app-react-router/server";
import PhonePage from "./app.phone";

export default function Index() {
  return <PhonePage />;
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
