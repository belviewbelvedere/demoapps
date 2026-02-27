import { useWarehouseStore } from '@/store/warehouseStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { LOCATION_TYPE_LABELS, LOCATION_TYPE_COLORS } from '@/utils/colorMapping';
import { LocationType } from '@/models/enums';

const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#92400e', '#64748b', '#a78bfa'];

export default function KPIDashboard() {
  const kpis = useWarehouseStore((s) => s.kpis);
  const showKPIPanel = useWarehouseStore((s) => s.showKPIPanel);
  const theme = useWarehouseStore((s) => s.theme);
  const isDark = theme === 'dark';

  if (!showKPIPanel) return null;

  const locationTypeData = Object.entries(kpis.locationsByType).map(([type, count], idx) => ({
    name: LOCATION_TYPE_LABELS[type as LocationType] || type,
    value: count,
    color: LOCATION_TYPE_COLORS[type as LocationType] || PIE_COLORS[idx % PIE_COLORS.length],
  }));

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
    borderRadius: 8,
    fontSize: 11,
    color: isDark ? '#e2e8f0' : '#1e293b',
  };

  return (
    <div className="glass-panel p-4 rounded-xl w-72 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        KPI Dashboard
      </h3>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <KPICard label="Total Locations" value={kpis.totalLocations} isDark={isDark} />
        <KPICard label="Occupied" value={kpis.occupiedLocations} accent="text-emerald-400" isDark={isDark} />
        <KPICard label="Empty" value={kpis.emptyLocations} accent={isDark ? 'text-slate-400' : 'text-slate-500'} isDark={isDark} />
        <KPICard label="Utilization" value={`${kpis.overallUtilization}%`} accent="text-blue-400" isDark={isDark} />
        <KPICard label="Unique SKUs" value={kpis.totalSKUs} accent="text-purple-400" isDark={isDark} />
        <KPICard label="Total Qty" value={kpis.totalQuantity.toLocaleString()} accent="text-amber-400" isDark={isDark} />
        <KPICard label="Avg Fill %" value={`${kpis.avgFillPercent}%`} accent="text-cyan-400" isDark={isDark} />
      </div>

      <div className="mb-4">
        <p className={`text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Inventory Aging</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={kpis.agingBreakdown} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="range" tick={{ fontSize: 9, fill: isDark ? '#94a3b8' : '#64748b' }} />
            <YAxis tick={{ fontSize: 9, fill: isDark ? '#94a3b8' : '#64748b' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-4">
        <p className={`text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ABC Classification</p>
        <div className="flex items-center gap-2">
          {kpis.abcBreakdown.map((b) => (
            <div key={b.cls} className="flex-1 text-center">
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{b.pct}%</p>
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Class {b.cls}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`text-xs mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>By Location Type</p>
        <ResponsiveContainer width="100%" height={130}>
          <PieChart>
            <Pie
              data={locationTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={50}
              innerRadius={25}
              strokeWidth={0}
            >
              {locationTypeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  accent = 'text-white',
  isDark,
}: {
  label: string;
  value: string | number;
  accent?: string;
  isDark: boolean;
}) {
  return (
    <div className={`rounded-lg p-2 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
      <p className={`text-[10px] leading-tight ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-sm font-bold ${accent} leading-tight mt-0.5`}>{value}</p>
    </div>
  );
}
