import React, { useState } from "react";

/**
 * Payin vs Payout Trend Graph Component
 * Recreates the exact curved spline chart from the reference screenshot
 * styled with SaveDost's brand theme (SaveDost Blue #018EDE & Amber #F59E0B).
 */
export const PayinPayoutTrendChart = ({ trendData = [] }) => {
  const [filter, setFilter] = useState("both"); // 'both' | 'payin' | 'payout'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Default data matching the screenshot trajectory if not supplied
  const data = trendData.length
    ? trendData
    : [
        { date: "13 Oct", payin: 800000, payout: 850000 },
        { date: "14 Oct", payin: 600000, payout: 720000 },
        { date: "15 Oct", payin: 1100000, payout: 400000 },
        { date: "16 Oct", payin: 1300000, payout: 1600000 },
        { date: "17 Oct", payin: 1650000, payout: 1350000 },
        { date: "18 Oct", payin: 1650000, payout: 980000 },
        { date: "19 Oct", payin: 250000, payout: 980000 },
      ];

  // Calculate dynamic scale based on actual trend data points
  const rawMax = Math.max(
    ...data.map((d) => Math.max(Number(d.payin) || 0, Number(d.payout) || 0)),
    1000
  );

  const getNiceMax = (val) => {
    if (val <= 2000) return 2000;
    if (val <= 5000) return 5000;
    if (val <= 10000) return 10000;
    if (val <= 25000) return 25000;
    if (val <= 50000) return 50000;
    if (val <= 100000) return 100000;
    if (val <= 500000) return 500000;
    if (val <= 1000000) return 1000000;
    return Math.ceil(val / 500000) * 500000;
  };

  const maxVal = getNiceMax(rawMax);
  const ySteps = [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0,
  ];

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 20;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Convert data points to SVG coordinates
  const getCoordinates = (value, index) => {
    const x = paddingX + (index / (data.length - 1)) * plotWidth;
    const clamped = Math.max(0, Math.min(value, maxVal));
    const y = paddingY + plotHeight - (clamped / maxVal) * plotHeight;
    return { x, y };
  };

  const payinPoints = data.map((d, i) => getCoordinates(d.payin, i));
  const payoutPoints = data.map((d, i) => getCoordinates(d.payout, i));

  // Build smooth cubic bezier curve SVG path
  const buildSmoothPath = (points) => {
    if (!points.length) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) / 2;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) / 2;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const payinPath = buildSmoothPath(payinPoints);
  const payoutPath = buildSmoothPath(payoutPoints);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-white border border-[#E2EEF5] rounded-3xl p-6 shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-brand-navy">
            Payin vs payout trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct gateway settlements vs provider outflows
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-full border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("both")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
              filter === "both"
                ? "bg-brand-navy text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Both
          </button>
          <button
            type="button"
            onClick={() => setFilter("payin")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
              filter === "payin"
                ? "bg-brand-blue text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Payin
          </button>
          <button
            type="button"
            onClick={() => setFilter("payout")}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-150 ${
              filter === "payout"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Payout
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end space-x-5 text-xs font-medium text-slate-500 mb-4">
        {(filter === "both" || filter === "payin") && (
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
            <span className="font-semibold text-slate-700">Payin</span>
          </div>
        )}
        {(filter === "both" || filter === "payout") && (
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-slate-700">Payout</span>
          </div>
        )}
      </div>

      {/* Chart Canvas with Y-Axis and SVG Curves */}
      <div className="relative flex">
        {/* Y-Axis scale labels */}
        <div className="flex flex-col justify-between text-[11px] font-medium text-slate-400 pr-3 select-none h-56 pb-6 text-right min-w-[70px]">
          {ySteps.map((step, idx) => (
            <span key={idx}>{formatCurrency(step)}</span>
          ))}
        </div>

        {/* SVG Drawing Container */}
        <div className="relative flex-1 h-56">
          {/* Dashed Horizontal Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-dashed border-slate-200" />
            <div className="w-full border-b border-slate-200" />
          </div>

          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="payinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#018EDE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#018EDE" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="payoutGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Payin Curve */}
            {(filter === "both" || filter === "payin") && (
              <>
                <path
                  d={`${payinPath} L ${payinPoints[payinPoints.length - 1].x} ${
                    paddingY + plotHeight
                  } L ${payinPoints[0].x} ${paddingY + plotHeight} Z`}
                  fill="url(#payinGradient)"
                />
                <path
                  d={payinPath}
                  fill="none"
                  stroke="#018EDE"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Payout Curve */}
            {(filter === "both" || filter === "payout") && (
              <>
                <path
                  d={`${payoutPath} L ${payoutPoints[payoutPoints.length - 1].x} ${
                    paddingY + plotHeight
                  } L ${payoutPoints[0].x} ${paddingY + plotHeight} Z`}
                  fill="url(#payoutGradient)"
                />
                <path
                  d={payoutPath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}

            {/* Interactive Data Nodes */}
            {data.map((item, idx) => {
              const pPayin = payinPoints[idx];
              const pPayout = payoutPoints[idx];
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible vertical hover column */}
                  <rect
                    x={pPayin.x - 20}
                    y={0}
                    width={40}
                    height={svgHeight}
                    fill="transparent"
                  />

                  {/* Vertical highlight line on hover */}
                  {isHovered && (
                    <line
                      x1={pPayin.x}
                      y1={paddingY}
                      x2={pPayin.x}
                      y2={paddingY + plotHeight}
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Payin point node */}
                  {(filter === "both" || filter === "payin") && (
                    <circle
                      cx={pPayin.x}
                      cy={pPayin.y}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke="#018EDE"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />
                  )}

                  {/* Payout point node */}
                  {(filter === "both" || filter === "payout") && (
                    <circle
                      cx={pPayout.x}
                      cy={pPayout.y}
                      r={isHovered ? 6 : 4}
                      fill="#FFFFFF"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      className="transition-all duration-150"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute pointer-events-none bg-slate-900 text-white rounded-xl py-2 px-3 shadow-xl text-xs z-20 border border-slate-700"
              style={{
                left: `${(hoveredIndex / (data.length - 1)) * 90}%`,
                top: "10px",
                transform: "translateX(-40%)",
              }}
            >
              <div className="font-bold border-b border-slate-700 pb-1 mb-1 text-[11px] text-slate-300">
                {data[hoveredIndex].date}
              </div>
              {(filter === "both" || filter === "payin") && (
                <div className="flex items-center justify-between space-x-3 text-cyan-300">
                  <span>Payin:</span>
                  <span className="font-semibold">{formatCurrency(data[hoveredIndex].payin)}</span>
                </div>
              )}
              {(filter === "both" || filter === "payout") && (
                <div className="flex items-center justify-between space-x-3 text-amber-300">
                  <span>Payout:</span>
                  <span className="font-semibold">{formatCurrency(data[hoveredIndex].payout)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* X-Axis Date Labels */}
      <div className="flex justify-between text-xs font-semibold text-slate-400 pl-16 pr-4 pt-2 select-none">
        {data.map((item, idx) => (
          <span
            key={idx}
            className={`transition-colors duration-150 ${
              hoveredIndex === idx ? "text-[#0C3D4C] font-bold" : ""
            }`}
          >
            {item.date}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PayinPayoutTrendChart;
