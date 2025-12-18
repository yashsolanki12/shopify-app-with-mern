import { boundary } from "@shopify/shopify-app-react-router/server";

export default function Index() {
  return (
    <s-page heading="Shopify app template">
      <s-section heading="Congrats on creating a new Shopify app 🎉">
        <s-paragraph>This is a shopify app with react + node.</s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
