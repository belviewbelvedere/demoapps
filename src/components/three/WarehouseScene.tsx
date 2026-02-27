import { useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { useWarehouseStore } from '@/store/warehouseStore';
import LocationBox from './LocationBox';
import ZoneFloor from './ZoneFloor';

export default function WarehouseScene() {
  const renderedLocations = useWarehouseStore((s) => s.renderedLocations);
  const zoneLayouts = useWarehouseStore((s) => s.zoneLayouts);
  const selectedLocationId = useWarehouseStore((s) => s.selectedLocationId);
  const highlightedLocations = useWarehouseStore((s) => s.highlightedLocations);
  const selectLocation = useWarehouseStore((s) => s.selectLocation);
  const theme = useWarehouseStore((s) => s.theme);
  const isDark = theme === 'dark';

  const highlightSet = useMemo(() => new Set(highlightedLocations), [highlightedLocations]);

  const sceneCenter = useMemo(() => {
    if (zoneLayouts.length === 0) return [0, 2, 0] as [number, number, number];
    const minX = Math.min(...zoneLayouts.map((z) => z.x));
    const maxX = Math.max(...zoneLayouts.map((z) => z.x + z.width));
    const minZ = Math.min(...zoneLayouts.map((z) => z.z));
    const maxZ = Math.max(...zoneLayouts.map((z) => z.z + z.depth));
    return [(minX + maxX) / 2, 2, (minZ + maxZ) / 2] as [number, number, number];
  }, [zoneLayouts]);

  const cameraPos = useMemo(() => {
    const totalWidth = Math.max(...zoneLayouts.map((z) => z.x + z.width)) - Math.min(...zoneLayouts.map((z) => z.x));
    const totalDepth = Math.max(...zoneLayouts.map((z) => z.z + z.depth)) - Math.min(...zoneLayouts.map((z) => z.z));
    const span = Math.max(totalWidth, totalDepth);
    const dist = Math.max(span * 0.9, 30);
    return [sceneCenter[0], dist * 0.6, sceneCenter[2] + dist * 0.7] as [number, number, number];
  }, [sceneCenter, zoneLayouts]);

  const handleBackgroundClick = useCallback(() => {
    selectLocation(null);
  }, [selectLocation]);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        onPointerMissed={handleBackgroundClick}
        gl={{ antialias: true, alpha: false }}
        style={{ background: isDark ? '#0a0f1a' : '#e2e8f0' }}
      >
        <PerspectiveCamera makeDefault position={cameraPos} fov={50} near={0.1} far={500} />
        <OrbitControls
          target={sceneCenter}
          enableDamping
          dampingFactor={0.1}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={200}
        />

        <ambientLight intensity={isDark ? 0.4 : 0.7} />
        <directionalLight position={[30, 40, 20]} intensity={isDark ? 0.8 : 1.0} castShadow />
        <directionalLight position={[-20, 30, -10]} intensity={isDark ? 0.3 : 0.5} />
        <hemisphereLight args={[isDark ? '#1e3a5f' : '#87ceeb', isDark ? '#0f172a' : '#f1f5f9', isDark ? 0.5 : 0.6]} />

        <Grid
          args={[200, 200]}
          cellSize={2}
          cellThickness={0.5}
          cellColor={isDark ? '#1e293b' : '#cbd5e1'}
          sectionSize={10}
          sectionThickness={1}
          sectionColor={isDark ? '#334155' : '#94a3b8'}
          fadeDistance={150}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
          position={[sceneCenter[0], -0.05, sceneCenter[2]]}
        />

        {zoneLayouts.map((layout) => (
          <ZoneFloor key={layout.zoneId} layout={layout} isDark={isDark} />
        ))}

        {renderedLocations.map((loc) => (
          <LocationBox
            key={loc.locationId}
            loc={loc}
            isSelected={loc.locationId === selectedLocationId}
            isHighlighted={highlightSet.has(loc.locationId)}
            onSelect={selectLocation}
          />
        ))}
      </Canvas>
    </div>
  );
}
