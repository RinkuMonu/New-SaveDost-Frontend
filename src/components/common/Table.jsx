import React from "react";

/**
 * Reusable Responsive Table Component.
 */
const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "No records found.",
  className = "",
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-card ${className}`}>
      <table className="w-full text-left text-sm text-brand-navy">
        <thead className="bg-[#018EDE] text-white uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                scope="col"
                className={`py-3.5 px-4 font-semibold ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-brand-muted">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-6 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
                  <span className="text-xs font-medium">Loading data...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-brand-muted text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`transition-colors hover:bg-brand-bg/80 ${rowIndex % 2 === 1 ? "bg-[#F0F8FF]/40" : "bg-white"}`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key || colIndex}
                    className={`py-3 px-4 text-xs sm:text-sm ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
