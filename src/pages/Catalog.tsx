import { useState } from "react";

export default function Catalog() {
  const [datasets, setDatasets] = useState<string[]>([]);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadDatasets() {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/sources");
      const data = await res.json();
      setDatasets(data.sources || []);
    } catch (err) {
      console.error("Failed to load datasets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTable(dataset: string) {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/data/${dataset}?collection=DataPage&limit=100`);
      const data = await res.json();
      setPreview(data);
    } catch (err) {
      console.error("Failed to load table:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-brand-black text-white pt-24 px-4 md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Catalog</h1>
        <p className="text-lg text-gray-300 mb-6">
          This page will help us test and explore the connection between the frontend and FastAPI.
        </p>

        {/* Card box for dataset loading */}
        <div className="rounded-xl bg-white text-gray-900 p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Test: Get Datasets from FastAPI</h2>
          <button
            onClick={loadDatasets}
            className="mb-4 rounded bg-red-600 px-4 py-2 text-white font-semibold hover:brightness-110"
          >
            Load Datasets
          </button>

          {loading && <p className="text-sm text-gray-500">Loading…</p>}

          <ul className="list-disc list-inside space-y-1">
            {datasets.map((d) => (
              <li key={d}>
                <button onClick={() => loadTable(d)} className="text-blue-600 hover:underline">
                  {d}
                </button>
              </li>
            ))}
          </ul>

          {preview && (
            <div className="mt-6 overflow-auto max-h-[400px] border border-gray-300 rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    {Object.keys(preview[0] || {}).map((key) => (
                      <th key={key} className="px-3 py-2 border-b text-left font-medium text-gray-700">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      {Object.keys(preview[0] || {}).map((key) => (
                        <td key={key} className="px-3 py-2 border-b">
                          {String(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}