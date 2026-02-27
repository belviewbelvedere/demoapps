import WarehouseScene from '@/components/three/WarehouseScene';
import Toolbar from '@/components/ui/Toolbar';
import Legend from '@/components/ui/Legend';
import KPIDashboard from '@/components/ui/KPIDashboard';
import LocationDetailPanel from '@/components/ui/LocationDetailPanel';
import { useWarehouseStore } from '@/store/warehouseStore';

export default function App() {
  const theme = useWarehouseStore((s) => s.theme);
  const showKPIPanel = useWarehouseStore((s) => s.showKPIPanel);
  const toggleKPIPanel = useWarehouseStore((s) => s.toggleKPIPanel);
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? '' : 'light'} relative w-screen h-screen ${isDark ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'} overflow-hidden`}>
      <WarehouseScene />

      <div className="absolute top-3 left-3 right-3 z-10">
        <Toolbar />
      </div>

      <div className="absolute bottom-3 left-3 z-10">
        <Legend />
      </div>

      <div className="absolute top-20 right-3 z-10">
        <KPIDashboard />
      </div>

      {showKPIPanel && (
        <button
          onClick={toggleKPIPanel}
          className={`absolute top-24 right-4 z-30 h-10 w-10 rounded-full border text-lg font-bold shadow-lg ${
            isDark
              ? 'bg-slate-900/95 text-white border-slate-600'
              : 'bg-white/95 text-slate-800 border-slate-300'
          }`}
          aria-label="Close KPI Dashboard"
          title="Close KPI Dashboard"
        >
          ✕
        </button>
      )}

      <div className="absolute bottom-3 right-3 z-10">
        <LocationDetailPanel />
      </div>
    </div>
  );
}
