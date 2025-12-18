import { Suspense, lazy } from "react";
const PhoneListPage = lazy(() => import("../pages/phone-list-page"));

export default function PhonePage() {
  return (
    <Suspense fallback="">
      <PhoneListPage />
    </Suspense>
  );
}
