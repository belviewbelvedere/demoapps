import { useState, useRef, useCallback } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RenderedLocation } from '@/models/warehouse';
import { LOCATION_TYPE_LABELS } from '@/utils/colorMapping';
import { LocationType } from '@/models/enums';

interface LocationBoxProps {
  loc: RenderedLocation;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (id: string) => void;
}

export default function LocationBox({ loc, isSelected, isHighlighted, onSelect }: LocationBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect(loc.locationId);
    },
    [loc.locationId, onSelect],
  );

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const scale = isSelected ? 1.08 : hovered ? 1.04 : 1;
  const emissiveIntensity = isSelected ? 0.4 : isHighlighted ? 0.3 : hovered ? 0.15 : 0;
  const finalOpacity = isHighlighted ? Math.max(loc.opacity, 0.95) : loc.opacity;

  const outlineColor = isSelected ? '#38bdf8' : isHighlighted ? '#facc15' : undefined;

  return (
    <group position={[loc.x, loc.y, loc.z]}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[loc.width, loc.height, loc.depth]} />
        <meshStandardMaterial
          color={loc.color}
          opacity={finalOpacity}
          transparent
          wireframe={loc.wireframe}
          emissive={loc.color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {outlineColor && (
        <mesh scale={1.12}>
          <boxGeometry args={[loc.width, loc.height, loc.depth]} />
          <meshBasicMaterial color={outlineColor} wireframe transparent opacity={0.6} />
        </mesh>
      )}

      {hovered && (
        <Html distanceFactor={18} center style={{ pointerEvents: 'none' }}>
          <div className="glass-panel px-3 py-2 text-xs whitespace-nowrap rounded-lg shadow-xl">
            <p className="font-bold text-white">{loc.locationId}</p>
            <p className="text-slate-300">
              {LOCATION_TYPE_LABELS[loc.metadata.locationType as LocationType]}
            </p>
            <p className="text-slate-400">
              {loc.metadata.itemCount} items · {Math.round(loc.metadata.fillPercent)}% full
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
