import { ZoneLayout } from '@/models/warehouse';

interface ZoneFloorProps {
  layout: ZoneLayout;
  isDark: boolean;
}

export default function ZoneFloor({ layout, isDark }: ZoneFloorProps) {
  const centerX = layout.x + layout.width / 2;
  const centerZ = layout.z + layout.depth / 2;

  return (
    <group>
      <mesh position={[centerX, -0.02, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[layout.width + 1, layout.depth + 1]} />
        <meshStandardMaterial
          color={isDark ? '#1e293b' : '#cbd5e1'}
          opacity={0.4}
          transparent
          roughness={0.9}
        />
      </mesh>

      <mesh position={[centerX, -0.01, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[layout.width + 1.2, layout.depth + 1.2]} />
        <meshBasicMaterial color={isDark ? '#334155' : '#94a3b8'} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
