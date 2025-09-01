import { useTitle } from "../hooks/useTitle";
export default function APIs() {
  useTitle("APIs | Data Portal");
  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-6 grid place-items-center">
      <h1 className="text-5xl md:text-6xl font-extrabold">APIs</h1>
    </section>
  );
}
