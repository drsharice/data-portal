import { Link } from "react-router-dom";

type CardProps = { title: string; desc: string; icon: React.ReactNode; to: string; };

const Card: React.FC<CardProps> = ({ title, desc, icon, to }) => (
  <Link
    to={to}
    className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.06] p-8 md:p-10 text-white/90 shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:border-brand-red/80 hover:shadow-[0_24px_100px_rgba(215,30,40,0.25)] transition"
  >
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(215,30,40,0.18)] text-white">
      {icon}
    </div>
    <h3 className="text-2xl md:text-3xl font-semibold text-white">{title}</h3>
    <p className="mt-4 text-base md:text-lg leading-relaxed text-white/75">{desc}</p>
    <span className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition group-hover:border-transparent group-hover:bg-brand-red">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  </Link>
);

export default function Portfolio() {
  return (
    <section className="relative bg-brand-black py-20 md:py-28">
      <div className="mx-auto w-[92vw] max-w-6xl">
        <header className="mb-10 md:mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            <span className="block">LOOK AT OUR</span>
            <span className="block text-white/70">DATA PORTFOLIO</span>
          </h2>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* cards ... */}
        </div>
      </div>
    </section>
  );
}
