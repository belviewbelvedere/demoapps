import { useWarehouseStore } from '@/store/warehouseStore';
import { VIEW_MODE_OPTIONS } from '@/utils/viewModes';

export default function Toolbar() {
  const viewMode = useWarehouseStore((s) => s.viewMode);
  const setViewMode = useWarehouseStore((s) => s.setViewMode);
  const searchQuery = useWarehouseStore((s) => s.searchQuery);
  const setSearchQuery = useWarehouseStore((s) => s.setSearchQuery);
  const showKPIPanel = useWarehouseStore((s) => s.showKPIPanel);
  const toggleKPIPanel = useWarehouseStore((s) => s.toggleKPIPanel);
  const kpis = useWarehouseStore((s) => s.kpis);
  const theme = useWarehouseStore((s) => s.theme);
  const toggleTheme = useWarehouseStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <div className="glass-panel p-3 flex items-center gap-4 rounded-xl">
      <div className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          DT
        </div>
        <div className="hidden lg:block">
          <h1 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Warehouse Digital Twin</h1>
          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{kpis.totalLocations} locations</p>
        </div>
      </div>

      <div className={`w-px h-8 ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />

      <div className="flex gap-1">
        {VIEW_MODE_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            onClick={() => setViewMode(opt.mode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === opt.mode
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : isDark
                ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={opt.description}
          >
            <span className="mr-1">{opt.icon}</span>
            <span className="hidden xl:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      <div className="relative">
        <input
          type="text"
          placeholder="Search location, item, LP..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDark
              ? 'bg-slate-800/80 border border-slate-600 text-white placeholder-slate-500'
              : 'bg-white/80 border border-slate-300 text-slate-900 placeholder-slate-400'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
          >
            ✕
          </button>
        )}
      </div>

      <button
        onClick={toggleTheme}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isDark
            ? 'text-slate-300 hover:bg-slate-700'
            : 'text-slate-600 hover:bg-slate-200'
        }`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <button
        onClick={toggleKPIPanel}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
          showKPIPanel
            ? 'bg-emerald-600 text-white'
            : isDark
            ? 'text-slate-300 hover:bg-slate-700'
            : 'text-slate-600 hover:bg-slate-200'
        }`}
        title="Toggle KPI Dashboard"
      >
        📊 KPIs
      </button>
    </div>
  );
}
