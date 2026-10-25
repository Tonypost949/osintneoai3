import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, AlertTriangle, Eye, Compass, RotateCcw, ShieldAlert, Sparkles, MapPin, Info } from 'lucide-react';

interface ThreeSubsurfacePlumeViewProps {
  onSelectMarker?: (markerId: string) => void;
}

export const ThreeSubsurfacePlumeView: React.FC<ThreeSubsurfacePlumeViewProps> = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sliceDepth, setSliceDepth] = useState<number>(20);
  const [showParticles, setShowParticles] = useState<boolean>(true);
  const [showCap, setShowCap] = useState<boolean>(true);
  const [showWaterTable, setShowWaterTable] = useState<boolean>(true);
  const [showBreachPoints, setShowBreachPoints] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>('breach-1');

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const plumeParticlesRef = useRef<THREE.Points | null>(null);
  const capMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const breachGroupRef = useRef<THREE.Group | null>(null);
  const soilLayersGroupRef = useRef<THREE.Group | null>(null);

  // Mouse drag rotation state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.45, y: -0.6 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // slate-950
    scene.fog = new THREE.FogExp2(0x030712, 0.025);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 10, 22);
    camera.lookAt(0, -2, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialias
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Clear previous canvas if any
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(10, 18, 10);
    scene.add(dirLight);

    const redSpotLight = new THREE.SpotLight(0xf43f5e, 3, 30, Math.PI / 4, 0.5);
    redSpotLight.position.set(0, 5, 0);
    redSpotLight.target.position.set(0, -3, 0);
    scene.add(redSpotLight);
    scene.add(redSpotLight.target);

    // 5. Build Subsurface Soil Stratigraphy Layers
    const soilGroup = new THREE.Group();
    soilLayersGroupRef.current = soilGroup;

    // Layer 0: Asphalt Cap (2-inch representation at surface y=0)
    const capGeo = new THREE.BoxGeometry(16, 0.4, 16);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 0, 0);
    soilGroup.add(capMesh);
    capMeshRef.current = capMesh;

    // Outline for 1-Year Asphalt Warranty Boundary (Laserfiche #5406552)
    const capBorderGeo = new THREE.EdgesGeometry(capGeo);
    const capBorderMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
    const capBorderLine = new THREE.LineSegments(capBorderGeo, capBorderMat);
    capMesh.add(capBorderLine);

    // Layer 1: Vadose Zone Contaminated Soil (0 to 5 ft depth, represented as y = -0.4 to -3.5)
    const vadoseGeo = new THREE.BoxGeometry(15.8, 3.0, 15.8);
    const vadoseMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      transparent: true,
      opacity: 0.75,
      roughness: 0.8,
    });
    const vadoseMesh = new THREE.Mesh(vadoseGeo, vadoseMat);
    vadoseMesh.position.set(0, -1.7, 0);
    soilGroup.add(vadoseMesh);

    // Layer 2: Alluvium / Silt Stratum (5 to 12 ft depth, y = -3.5 to -7.5)
    const alluviumGeo = new THREE.BoxGeometry(15.8, 4.0, 15.8);
    const alluviumMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.6,
      roughness: 0.9,
    });
    const alluviumMesh = new THREE.Mesh(alluviumGeo, alluviumMat);
    alluviumMesh.position.set(0, -5.2, 0);
    soilGroup.add(alluviumMesh);

    // Layer 3: Groundwater Saturated Aquifer (12+ ft depth, y = -7.5 to -11.0)
    const waterGeo = new THREE.BoxGeometry(15.8, 3.5, 15.8);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.3,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -8.95, 0);
    soilGroup.add(waterMesh);
    waterMeshRef.current = waterMesh;

    scene.add(soilGroup);

    // 6. Plume Contaminant Particles (Hexavalent Chromium 980 µg/kg Cloud)
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Concentrate around center (bed breach point) and disperse southwest
      const radius = Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius - 0.5;
      const z = Math.sin(angle) * radius + (Math.random() * 2 - 1);
      // Depth inside vadose and upper groundwater (-0.5 to -8.0)
      const y = -0.5 - Math.random() * 7.5;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Color: Intense neon amber-rose gradient
      const intensity = Math.max(0.3, 1 - Math.sqrt(x * x + z * z) / 8);
      particleColors[i * 3] = 0.95 * intensity; // R
      particleColors[i * 3 + 1] = 0.25 * intensity; // G
      particleColors[i * 3 + 2] = 0.15; // B
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const plumeParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(plumeParticles);
    plumeParticlesRef.current = plumeParticles;

    // 7. HBNC Shelter Floor & Bed Breach Markers (Surface y = 0.25)
    const breachGroup = new THREE.Group();
    breachGroupRef.current = breachGroup;

    // Bed frames on shelter floor
    const bedGeo = new THREE.BoxGeometry(1.6, 0.35, 2.8);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x475569 });

    // Anchor bolt breach marker (where cap was penetrated)
    const boltGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const boltMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, roughness: 0.3 });

    // Hotspot 1: Primary Bed Breach (Scripps EHR p. 985, GPS 33.706389, -117.988611)
    const bed1 = new THREE.Mesh(bedGeo, bedMat);
    bed1.position.set(-1.5, 0.4, 0);
    breachGroup.add(bed1);

    const bolt1 = new THREE.Mesh(boltGeo, boltMat);
    bolt1.position.set(-1.5, -0.2, 0);
    breachGroup.add(bolt1);

    // Glowing alert ring around breach point
    const ringGeo = new THREE.RingGeometry(0.4, 0.55, 16);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0055, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(-1.5, 0.22, 0);
    breachGroup.add(ringMesh);

    // Bed 2 & 3 nearby
    const bed2 = new THREE.Mesh(bedGeo, bedMat);
    bed2.position.set(1.8, 0.4, 0.5);
    breachGroup.add(bed2);

    const bed3 = new THREE.Mesh(bedGeo, bedMat);
    bed3.position.set(1.8, 0.4, -3.2);
    breachGroup.add(bed3);

    scene.add(breachGroup);

    // Grid Floor Guide at bottom
    const grid = new THREE.GridHelper(20, 20, 0x0284c7, 0x1e293b);
    grid.position.set(0, -11.0, 0);
    scene.add(grid);

    // 8. Animation & Render Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle continuous rotation of plume particles to show vapor intrusion & soil kinetics
      if (plumeParticlesRef.current) {
        plumeParticlesRef.current.rotation.y = elapsed * 0.08;
        const positions = plumeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        // Subtle vertical oscillation
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(elapsed * 2 + i) * 0.002;
        }
        plumeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Rotate camera around origin based on user drag
      const radius = 22;
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      camera.position.x = radius * Math.cos(rx) * Math.sin(ry);
      camera.position.y = radius * Math.sin(rx);
      camera.position.z = radius * Math.cos(rx) * Math.cos(ry);
      camera.lookAt(0, -3.5, 0);

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update layer visibility when toggles change
  useEffect(() => {
    if (capMeshRef.current) capMeshRef.current.visible = showCap;
    if (waterMeshRef.current) waterMeshRef.current.visible = showWaterTable;
    if (plumeParticlesRef.current) plumeParticlesRef.current.visible = showParticles;
    if (breachGroupRef.current) breachGroupRef.current.visible = showBreachPoints;
  }, [showCap, showWaterTable, showParticles, showBreachPoints]);

  // Adjust slice depth
  useEffect(() => {
    if (!soilLayersGroupRef.current) return;
    soilLayersGroupRef.current.position.y = (20 - sliceDepth) * 0.15;
  }, [sliceDepth]);

  // Mouse Drag handlers for 3D navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    rotationRef.current.y -= deltaX * 0.008;
    rotationRef.current.x = Math.max(0.1, Math.min(1.4, rotationRef.current.x + deltaY * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetCamera = () => {
    rotationRef.current = { x: 0.45, y: -0.6 };
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col my-6">
      {/* 3D Visualizer Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white font-mono uppercase tracking-wider">
                3D Subsurface Toxic Plume &amp; Cap Stratigraphy
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-500/50 text-[10px] font-mono font-bold animate-pulse">
                980 µg/kg Cr(VI) &middot; 49× DTSC Level
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              17631 Cameron Lane, Huntington Beach &middot; Anchor Bolt Breach Point &middot; 1-Year Asphalt Warranty (Laserfiche #5406552)
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div className="relative w-full h-112 bg-slate-950 cursor-grab active:cursor-grabbing select-none">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full"
        />

        {/* 3D HUD Overlay: Top Left Legend & Geological Strata */}
        <div className="absolute top-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs backdrop-blur-md shadow-xl max-w-xs pointer-events-auto space-y-2 font-mono">
          <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>STRATIGRAPHY CROSS-SECTION</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                <span>2&quot; Asphalt Cap (1-Yr Warranty)</span>
              </span>
              <span className="text-amber-400 font-bold">0.0 ft</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-rose-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-600 inline-block animate-pulse" />
                <span>Cr(VI) Contaminated Vadose</span>
              </span>
              <span className="text-rose-400 font-bold">0 – 5 ft</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block" />
                <span>Unconsolidated Silt Stratum</span>
              </span>
              <span className="text-slate-400">5 – 12 ft</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sky-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
                <span>Groundwater Aquifer</span>
              </span>
              <span className="text-sky-400 font-bold">12 – 18 ft</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400">
            Click &amp; drag mouse to orbit 360° around plume.
          </div>
        </div>

        {/* 3D HUD Overlay: Top Right Hotspot Inspector */}
        <div className="absolute top-3 right-3 bg-slate-950/90 border border-rose-500/50 rounded-lg p-3 text-xs backdrop-blur-md shadow-xl max-w-sm pointer-events-auto font-sans">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>POINT OF BREACH INSPECTOR</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">GPS: 33.706389, -117.988611</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-2">
            On November 7, 2023, corroded bed anchor bolts penetrated through the 2-inch asphalt cap. Raw sub-slab soil with <b>980 µg/kg Hexavalent Chromium</b> (49× DTSC residential threshold) made direct contact with resident sleeping quarters.
          </p>

          <div className="bg-slate-900/80 rounded p-2 text-[11px] font-mono text-slate-300 space-y-1 border border-slate-800">
            <div>&bull; <b>County Condition:</b> Shelter lawful ONLY so long as cap intact</div>
            <div>&bull; <b>City Warranty:</b> Expired after only 1 year (Laserfiche #5406552)</div>
            <div>&bull; <b>Worker Class:</b> Non-HAZWOPER laborers assigned to cap maintenance</div>
          </div>
        </div>

        {/* 3D HUD Overlay: Bottom Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 text-xs backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          {/* Layer toggles */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase hidden sm:inline">LAYERS:</span>
            
            <button
              onClick={() => setShowCap(!showCap)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                showCap ? 'bg-amber-950 text-amber-300 border border-amber-600/70' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Asphalt Cap (2&quot;)
            </button>

            <button
              onClick={() => setShowParticles(!showParticles)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                showParticles ? 'bg-rose-950 text-rose-300 border border-rose-600/70' : 'bg-slate-800 text-slate-400'
              }`}
            >
              49× Cr(VI) Plume Cloud
            </button>

            <button
              onClick={() => setShowBreachPoints(!showBreachPoints)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                showBreachPoints ? 'bg-red-950 text-red-300 border border-red-600/70' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Bed Anchor Breach
            </button>

            <button
              onClick={() => setShowWaterTable(!showWaterTable)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                showWaterTable ? 'bg-sky-950 text-sky-300 border border-sky-600/70' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Water Table (12ft)
            </button>
          </div>

          {/* Depth Slice Slider */}
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">DEPTH SLICE:</span>
            <input
              type="range"
              min="5"
              max="25"
              value={sliceDepth}
              onChange={(e) => setSliceDepth(parseInt(e.target.value, 10))}
              className="w-24 accent-rose-500 cursor-pointer"
            />
            <span className="text-rose-400 font-bold w-12 text-right">-{sliceDepth} ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
