import { Suspense, lazy } from "react";
const Phone = lazy(() => import("../pages/phone"));

export default function PhonePage() {
  return (
    <Suspense fallback="Loading...">
      <Phone />
    </Suspense>
  );
}
