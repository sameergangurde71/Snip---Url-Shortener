import { useEffect, useState } from "react";
import { api, extractErrorMessage, getShortLink } from "../api/client";
import Navbar from "../components/Navbar";
import GradientBackground from "../components/GradientBackground";
import UrlItem from "../components/UrlItem";

export default function Dashboard() {
  const [codes, setCodes] = useState([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [lastCreated, setLastCreated] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchCodes() {
    setLoadingCodes(true);
    try {
      const { data } = await api.get("/codes");
      setCodes(data.codes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      setError(extractErrorMessage(err, "Could not load your links"));
    } finally {
      setLoadingCodes(false);
    }
  }

  useEffect(() => {
    fetchCodes();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLastCreated(null);
    setCreating(true);
    try {
      const { data } = await api.post("/shorten", {
        url,
        ...(customCode ? { code: customCode } : {}),
      });
      setLastCreated(data);
      setUrl("");
      setCustomCode("");
      fetchCodes();
    } catch (err) {
      setError(extractErrorMessage(err, "Could not shorten that URL"));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setCodes((prev) => prev.filter((c) => c.id !== id));
    try {
      await api.delete(`/${id}`);
    } catch {
      fetchCodes();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Your links</h1>
          <p className="mt-1 text-sm text-gray-400">Shorten a new URL or manage your existing ones.</p>
        </div>

        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/a-very-long-link-to-shorten"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="custom-code (optional)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 sm:w-56"
            />
            <button
              type="submit"
              disabled={creating}
              className="shrink-0 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Shortening…" : "Shorten"}
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {lastCreated && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <span className="truncate">
                Created{" "}
                <a
                  href={getShortLink(lastCreated.shortCode)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline decoration-emerald-500/50 underline-offset-2"
                >
                  {getShortLink(lastCreated.shortCode).replace(/^https?:\/\//, "")}
                </a>
              </span>
            </div>
          )}
        </form>

        <div className="mt-8 space-y-2.5">
          {loadingCodes ? (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          ) : codes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
              <p className="text-sm text-gray-500">No links yet — shorten your first URL above.</p>
            </div>
          ) : (
            codes.map((item) => (
              <UrlItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                deleting={deletingId === item.id}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
