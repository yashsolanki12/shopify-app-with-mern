import { boundary } from "@shopify/shopify-app-react-router/server";
import { Suspense } from "react";
import { Spinner } from "@shopify/polaris";
import PhonePage, { loader as phoneLoader } from "./app.phone";

export const loader = phoneLoader;

export default function Index() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Spinner size="large" /></div>}>
      <PhonePage />
    </Suspense>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
