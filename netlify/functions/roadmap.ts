import { getStore } from "@netlify/blobs";
import { AuthError, getUser, verifyRequestOrigin } from "@netlify/identity";
import type { Context } from "@netlify/functions";
import {
  emptyRoadmapData,
  isRoadmapData,
} from "../../src/roadmap-data.ts";

const allowedEmails = new Set([
  "amelrc@gmail.com",
  "jay@justcommonpeople.com",
]);
const maximumBodySize = 1_000_000;
const store = getStore("protected-roadmap");
const responseHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

export default async function roadmap(
  request: Request,
  _context: Context,
): Promise<Response> {
  void _context;

  if (request.method !== "GET" && request.method !== "PUT") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, PUT" },
    });
  }

  const user = await getUser();
  const email = user?.email?.trim().toLowerCase();
  if (!email) return new Response("Unauthorized", { status: 401 });
  if (!allowedEmails.has(email)) return new Response("Forbidden", { status: 403 });

  if (request.method === "GET") {
    const stored = await store.get("shared-roadmap", { type: "json" });
    if (stored === null) return jsonResponse(emptyRoadmapData);
    if (!isRoadmapData(stored)) {
      console.error("Stored roadmap data has an invalid shape");
      return new Response("Stored roadmap data is invalid", { status: 500 });
    }
    return jsonResponse(stored);
  }

  try {
    verifyRequestOrigin(request);
  } catch (error) {
    if (error instanceof AuthError) {
      return new Response("Forbidden", { status: 403 });
    }
    throw error;
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maximumBodySize) {
    return new Response("Request body is too large", { status: 413 });
  }

  const bodyText = await request.text();
  if (new TextEncoder().encode(bodyText).byteLength > maximumBodySize) {
    return new Response("Request body is too large", { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!isRoadmapData(body)) return new Response("Invalid roadmap data", { status: 400 });

  await store.setJSON("shared-roadmap", body);
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
