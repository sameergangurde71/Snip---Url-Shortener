import { useState } from "react";
import { getShortLink } from "../api/client";

export default function UrlItem({ item, onDelete, deleting }) {
  const [copied, setCopied] = useState(false);
  const shortLink = getShortLink(item.shortCode);

  async function handleCopy() {
    await navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 transition hover:border-white/20">
      <div className="min-w-0 flex-1">
        <a
          href={shortLink}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-sm font-medium text-indigo-300 hover:text-indigo-200"
        >
          {shortLink.replace(/^https?:\/\//, "")}
        </a>
        <p className="mt-0.5 truncate text-xs text-gray-500">{item.targetURL}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleCopy}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-gray-300 transition hover:border-white/20 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          disabled={deleting}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
