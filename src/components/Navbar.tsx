import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const linkBase = "hover:text-white transition";
const active = "text-white";
const idle = "text-white/80";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-brand-black/95 text-white border-b border-white/10 backdrop-blur">
        <div className="w-full h-14 px-2 md:px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-md bg-brand-red" aria-hidden="true" />
            <span className="font-semibold tracking-wide">Data Instrumentation</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 md:gap-8">
            <NavLink to="/data" className={({isActive}) => `${linkBase} ${isActive?active:idle}`}>Data</NavLink>
            <NavLink to="/apis" className={({isActive}) => `${linkBase} ${isActive?active:idle}`}>API</NavLink>
            <NavLink to="/docs" className={({isActive}) => `${linkBase} ${isActive?active:idle}`}>Docs</NavLink>
            <NavLink to="/contact" className={({isActive}) => `${linkBase} ${isActive?active:idle}`}>Contact Us</NavLink>

            <button aria-label="Search" className="rounded-md p-2 hover:bg-white/10 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <span className="hidden sm:inline text-white/70 pl-3 border-l border-white/10">
              Welcome, Guest
            </span>
          </nav>

          <div className="md:hidden flex items-center gap-1">
            <button aria-label="Search" className="rounded-md p-2 hover:bg-white/10 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L17 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="rounded-md p-2 hover:bg-white/10 transition"
            >
              <span className="sr-only">Toggle menu</span>
              {open ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed inset-0 top-14 z-40 bg-black/40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`md:hidden fixed top-14 right-0 z-50 h-[calc(100vh-3.5rem)] w-[82vw] max-w-sm
          bg-brand-black text-white border-l border-white/10 shadow-2xl
          transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 flex flex-col gap-3">
          <NavLink to="/data" onClick={()=>setOpen(false)} className="py-2 px-2 rounded-md hover:bg-white/10">Data</NavLink>
          <NavLink to="/apis" onClick={()=>setOpen(false)} className="py-2 px-2 rounded-md hover:bg-white/10">API</NavLink>
          <NavLink to="/docs" onClick={()=>setOpen(false)} className="py-2 px-2 rounded-md hover:bg-white/10">Docs</NavLink>
          <NavLink to="/analytics" onClick={()=>setOpen(false)} className="py-2 px-2 rounded-md hover:bg-white/10">Reporting &amp; Analytics</NavLink>
          <NavLink to="/contact" onClick={()=>setOpen(false)} className="py-2 px-2 rounded-md hover:bg-white/10">Contact Us</NavLink>
          <div className="mt-2 border-t border-white/10 pt-3 text-white/70">Welcome, Guest</div>
        </div>
      </aside>
    </>
  );
}
