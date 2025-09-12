import { useEffect, useMemo, useState } from "react";
import { useTitle } from "../hooks/useTitle";

interface Dataset {
  key: string;
  label: string;
}

interface Column {
  name: string;
}

interface Preview {
  view: string;
  columns: Column[];
  rows: Record<string, any>[];
}

export default function Data() {
  useTitle("Data | Data Portal");

  const [views, setViews] = useState<Dataset[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/sources")
      .then((r) => r.json())
      .then((res) => {
        const list = (res.sources ?? []).map((s: string) => ({
          key: s,
          label: s.replace(/_/g, " "),
        }));
        setViews(list);
      })
      .catch(() => {
        const fallback = [
          "Bloomberg_User_ReportTable",
          "HR_Employees",
          "RightFax_Users",
        ].map((s) => ({ key: s, label: s.replace(/_/g, " ") }));
        setViews(fallback);
      });
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? views.filter((v) => v.label.toLowerCase().includes(term)) : [];
  }, [q, views]);

  useEffect(() => {
    if (!selected) {
      setPreview(null);
      return;
    }
    setErr(null);
    setLoading(true);
    fetch(`http://localhost:8000/data/${selected.key}?limit=100`)
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const first = res[0];
          const columns = Object.keys(first).map((k) => ({ name: k }));
          setPreview({ view: selected.key, columns, rows: res });
        } else {
          setPreview({ view: selected.key, columns: [], rows: [] });
        }
        setQ("");
      })
      .catch((e) => setErr(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [selected]);

  function downloadCsv() {
    if (!selected) return;
    const a = document.createElement("a");
    a.href = `http://localhost:8000/data/${selected.key}/download`;
    a.download = `${selected.label.replace(/\W+/g, "_")}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto w-full max-w-[1400px] min-h-[72vh] rounded-2xl bg-white text-gray-900 shadow-2xl ring-1 ring-gray-200 p-4 md:p-8">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <span className="text-sm font-semibold tracking-wide text-gray-700 uppercase">Datasets</span>
          <form className="ml-auto flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search datasets, e.g. "macro indicators"'
              className="w-[520px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-red-600"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="rounded-lg bg-gray-200 px-2 py-2 text-sm text-gray-800 hover:bg-gray-300"
                title="Clear search"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              Search
            </button>
            <button
              type="button"
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-gray-900 hover:brightness-110"
              onClick={() => alert("Chatbot coming soon")}
            >
              Chat with a Bot
            </button>
          </form>
        </div>

        <div className="grid grid-cols-12 gap-6 pt-6 h-full">
          {!q && (
            <aside className="col-span-12 md:col-span-3 md:pr-4 md:border-r md:border-gray-200">
              <div className="md:sticky md:top-28 md:h-[calc(72vh-5rem)] overflow-auto">
                <ul className="space-y-2">
                  {(q ? filtered : views).map((v: Dataset) => {
                    const active = selected?.key === v.key;
                    return (
                      <li key={v.key}>
                        <button
                          onClick={() => setSelected(v)}
                          className={["w-full rounded-xl border px-3 py-2 text-left text-sm", active ? "border-red-600 bg-red-50" : "border-gray-200 bg-white hover:bg-gray-50"].join(" ")}
                        >
                          {v.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          )}

          <main className={`col-span-12 ${!q ? "md:col-span-9" : "md:col-span-12"}`}>
            {!selected && q && (
              <div className="space-y-2">
                {filtered.map((v: Dataset) => (
                  <button
                    key={v.key}
                    onClick={() => setSelected(v)}
                    className="w-full rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 text-left text-sm"
                  >
                    {v.label}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-gray-500">No datasets found for "{q}"</p>
                )}
              </div>
            )}

            {selected && (
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <h2 className="m-0 text-xl font-semibold">{selected.label}</h2>
                  <span className="text-xs text-gray-500">Preview (top 100)</span>
                </div>

                {err && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
                {loading && <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">Loading…</div>}

                {preview && !loading && (
                  <>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <dl className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        <div>
                          <dt className="text-gray-500">Columns</dt>
                          <dd className="font-semibold">{preview.columns.length}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Rows (shown)</dt>
                          <dd className="font-semibold">{preview.rows.length}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Object</dt>
                          <dd className="font-semibold">{preview.view}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="max-h-[52vh] overflow-auto rounded-xl border border-gray-200">
                      <table className="w-full border-separate text-sm" style={{ borderSpacing: 0 }}>
                        <thead className="sticky top-0 z-10 bg-gray-100">
                          <tr>
                            {preview.columns.map((c) => (
                              <th key={c.name} className="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-700">{c.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.rows.map((r, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              {preview.columns.map((c) => (
                                <td key={c.name} className="border-b border-gray-100 px-3 py-2">{formatCell(r[c.name])}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={downloadCsv}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:brightness-110"
                      >
                        Download CSV
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

function formatCell(v: any) {
  if (v == null) return "";
  if (v instanceof Date) return v.toLocaleString();
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
