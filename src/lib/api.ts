// src/lib/api.ts

export interface DataView {
  key: string;   // e.g., "Bloomberg_User_ReportView"
  label: string; // e.g., "Bloomberg.User_ReportView"
}

export interface DataPreview {
  view: string;
  columns: { name: string; type: string }[];
  rows: Record<string, any>[];
}

export const dataApi = {
  /**
   * Fetch the list of dataset names.
   */
  async listViews(): Promise<{ views: DataView[] }> {
    const res = await fetch("/sources");
    const sources = await res.json();

    const views: DataView[] = sources.sources.map((name: string) => ({
      key: name,
      label: name.replace(/_/g, ".")  // Optional: stylize for UI
    }));

    return { views };
  },

  /**
   * Fetch preview rows from a dataset.
   */
  async preview(source: string, limit: number): Promise<DataPreview> {
    const res = await fetch(`/data/${source}?limit=${limit}`);
    const rows = await res.json();

    const columns =
      rows.length > 0
        ? Object.keys(rows[0]).map((key) => ({
            name: key,
            type: typeof rows[0][key],
          }))
        : [];

    return {
      view: source,
      columns,
      rows,
    };
  },

  /**
   * Build URL to download a dataset as CSV.
   */
  downloadCsvUrl(source: string, limit: number = 2000): string {
    return `/data/${source}/download?limit=${limit}`;
  },
};
