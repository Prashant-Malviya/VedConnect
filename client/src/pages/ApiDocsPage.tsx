import { ExternalLink, FileJson, KeyRound, Server, Globe } from "lucide-react";

// The backend serves the actual interactive Swagger UI (with a working
// "Try it out" button) at /api/docs, and the raw OpenAPI spec at
// /api/docs.json - Postman can import that URL directly via
// "Import > Link". This page just gives it a home inside the app, plus a
// readable summary table for anyone skimming without opening the iframe.
const LIVE_FRONTEND_URL = "https://ved-connect-wbg8.vercel.app";
const LIVE_BACKEND_URL = "https://vedconnect-if8e.onrender.com";

const API_ORIGIN = (import.meta.env.VITE_API_URL || `${LIVE_BACKEND_URL}/api`).replace(/\/api\/?$/, "");
const SWAGGER_UI_URL = `${API_ORIGIN}/api/docs`;
const OPENAPI_JSON_URL = `${API_ORIGIN}/api/docs.json`;

interface EndpointRow {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: boolean;
  description: string;
}

const ENDPOINTS: EndpointRow[] = [
  { method: "POST", path: "/api/auth/signup", auth: false, description: "Create an account" },
  { method: "POST", path: "/api/auth/login", auth: false, description: "Log in, receive a JWT" },
  { method: "GET", path: "/api/auth/me", auth: true, description: "Get the current logged-in user" },
  { method: "GET", path: "/api/users", auth: true, description: "List every user except yourself" },
  { method: "GET", path: "/api/conversations", auth: true, description: "List your conversations (communities + private)" },
  { method: "GET", path: "/api/conversations/:id/messages", auth: true, description: "Full message history for one conversation" },
  { method: "POST", path: "/api/messages", auth: true, description: "Send a message - mention @ved to bring the AI in" },
  { method: "GET", path: "/api/communities", auth: true, description: "List/search communities (?mine=true or ?q=search)" },
  { method: "POST", path: "/api/communities", auth: true, description: "Create a community" },
  { method: "GET", path: "/api/communities/:id", auth: true, description: "Get a single community" },
  { method: "PATCH", path: "/api/communities/:id", auth: true, description: "Update a community (owner/admin)" },
  { method: "DELETE", path: "/api/communities/:id", auth: true, description: "Delete a community (owner)" },
  { method: "POST", path: "/api/communities/:id/join", auth: true, description: "Join a public community" },
  { method: "POST", path: "/api/communities/:id/leave", auth: true, description: "Leave a community" },
  { method: "POST", path: "/api/communities/:id/invite", auth: true, description: "Add an existing user (owner/admin)" },
  { method: "GET", path: "/api/communities/:id/members", auth: true, description: "List a community's members" },
  { method: "PATCH", path: "/api/communities/:id/members/:userId", auth: true, description: "Change a member's role (owner)" },
  { method: "DELETE", path: "/api/communities/:id/members/:userId", auth: true, description: "Remove a member (owner/admin)" },
  { method: "GET", path: "/api/calls", auth: true, description: "Your call history, newest first" },
  { method: "GET", path: "/api/calls/:callId/transcript", auth: true, description: "Live transcript for an ongoing call" },
];

const methodClass = (method: EndpointRow["method"]) => {
  switch (method) {
    case "GET":
      return "bg-emerald-50 text-emerald-700";
    case "POST":
      return "bg-purple-50 text-purple-700";
    case "PATCH":
      return "bg-amber-50 text-amber-700";
    case "DELETE":
      return "bg-rose-50 text-rose-700";
  }
};

const ApiDocsPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">API Documentation</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">
          Every VedConnect REST endpoint, generated from a single OpenAPI spec. Use the interactive
          Swagger UI below to try requests straight from the browser, or import the spec into Postman.
          Realtime features (messages, calls, live transcript, Ved's status) run over Socket.io and
          aren't part of this REST spec.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <a
          href={LIVE_FRONTEND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white rounded-2xl border border-purple-100/60 shadow-soft p-4 hover-lift hover:shadow-card transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Live Frontend</p>
            <p className="text-sm font-medium text-slate-800 truncate">{LIVE_FRONTEND_URL.replace("https://", "")}</p>
          </div>
        </a>
        <a
          href={LIVE_BACKEND_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white rounded-2xl border border-purple-100/60 shadow-soft p-4 hover-lift hover:shadow-card transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Live Backend</p>
            <p className="text-sm font-medium text-slate-800 truncate">{LIVE_BACKEND_URL.replace("https://", "")}</p>
          </div>
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <a
          href={SWAGGER_UI_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Open Swagger UI
        </a>
        <a
          href={OPENAPI_JSON_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-purple-200 text-purple-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 transition-colors"
        >
          <FileJson className="w-4 h-4" />
          Download OpenAPI JSON
        </a>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <KeyRound className="w-3.5 h-3.5" />
          Log in first, then paste the token into Swagger's "Authorize" button
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-purple-100/60 shadow-soft mb-8">
        <table className="w-full text-sm">
          <thead className="bg-purple-50/60 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Method</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Endpoint</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Auth</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {ENDPOINTS.map((endpoint) => (
              <tr key={`${endpoint.method}-${endpoint.path}`} className="bg-white hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${methodClass(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-700">{endpoint.path}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{endpoint.auth ? "Bearer token" : "Public"}</td>
                <td className="px-4 py-3 text-slate-600">{endpoint.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-purple-100/60 shadow-soft overflow-hidden bg-white">
        <div className="px-4 py-3 border-b border-purple-100 bg-purple-50/60">
          <p className="text-sm font-medium text-slate-700">Interactive Swagger UI</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Loaded live from the backend at {SWAGGER_UI_URL}. If it doesn't appear, the backend may be
            spinning up (Render free-tier instances sleep when idle) - use "Open Swagger UI" above instead.
          </p>
        </div>
        <iframe
          src={SWAGGER_UI_URL}
          title="VedConnect Swagger UI"
          className="w-full"
          style={{ height: "80vh", border: "none" }}
        />
      </div>
    </div>
  );
};

export default ApiDocsPage;
