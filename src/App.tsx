import WarehouseScene from '@/components/three/WarehouseScene';
import Toolbar from '@/components/ui/Toolbar';
import Legend from '@/components/ui/Legend';
import KPIDashboard from '@/components/ui/KPIDashboard';
import LocationDetailPanel from '@/components/ui/LocationDetailPanel';
import { useWarehouseStore } from '@/store/warehouseStore';

export default function App() {
  const theme = useWarehouseStore((s) => s.theme);
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

      <div className="absolute bottom-3 right-3 z-10">
        <LocationDetailPanel />
      </div>
    </div>
  );
}
