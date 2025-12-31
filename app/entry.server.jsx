import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { addDocumentResponseHeaders } from "./shopify.server";

export const streamTimeout = 15000;
// 5000

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
) {
  addDocumentResponseHeaders(request, responseHeaders);

  // Enable HTTP caching for better performance
  // responseHeaders.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");

  // // Add resource hints for critical resources
  // responseHeaders.set("Link", [
  //   "<https://cdn.shopify.com>; rel=preconnect; crossorigin",
  // ].join(", "));

  // // Add early hints for critical resources
  // responseHeaders.set("Link", [
  //   "<https://cdn.shopify.com>; rel=preconnect; crossorigin",
  //   "<https://cdn.shopify.com/static/fonts/inter/v4/styles.css>; rel=preload; as=style",
  // ].join(", "));

  const userAgent = request.headers.get("user-agent");
  const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

  return new Promise((resolve, reject) => {
    let hasResolved = false;
    
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        [callbackName]: () => {
          if (hasResolved) return;
          hasResolved = true;
          
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error) {
          if (hasResolved) return;
          hasResolved = true;
          console.error("Shell error:", error);
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          console.error("Render error:", error);
        },
      },
    );

    // Timeout with better error handling
    const timeoutId = setTimeout(() => {
      if (!hasResolved) {
        console.log("Stream timeout reached, aborting render");
        abort();
      }
    }, streamTimeout);
    
    // Clear timeout if resolved early
    const originalResolve = resolve;
    resolve = (...args) => {
      clearTimeout(timeoutId);
      originalResolve(...args);
    };
  });
}
