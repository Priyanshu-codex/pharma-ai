"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function PricesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const drug = searchParams.get("drug");

  useEffect(() => {
    if (drug) {
      router.replace(`/alternatives?drug=${encodeURIComponent(drug)}`);
    } else {
      router.replace("/alternatives");
    }
  }, [router, drug]);

  return (
    <div className="p-12 text-center text-slate-500 text-sm font-medium">
      Redirecting to Generic Alternatives & Price Comparison…
    </div>
  );
}

export default function PricesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading…</div>}>
      <PricesRedirect />
    </Suspense>
  );
}
