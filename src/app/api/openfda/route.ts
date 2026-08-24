import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Drug name parameter required" }, { status: 400 });
  }

  const apiKey = process.env.OPENFDA_API_KEY;
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
    name
  )}"+openfda.generic_name:"${encodeURIComponent(name)}"&limit=1${apiKey ? `&api_key=${apiKey}` : ""}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) {
      return NextResponse.json({ source: "openfda", results: [] }, { status: 200 });
    }
    const data = await res.json();
    return NextResponse.json({ source: "openfda", results: data.results || [] });
  } catch (err: unknown) {
    console.error("OpenFDA API Error:", err);
    return NextResponse.json({ error: "Failed to fetch OpenFDA data" }, { status: 500 });
  }
}
