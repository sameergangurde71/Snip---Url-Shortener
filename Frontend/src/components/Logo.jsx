export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 font-semibold text-white ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 12h6m-6 0a3 3 0 01-3-3V7a3 3 0 013-3h2a3 3 0 013 3m-5 8a3 3 0 003 3h2a3 3 0 003-3v-2a3 3 0 00-3-3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-lg tracking-tight">Snip</span>
    </div>
  );
}
