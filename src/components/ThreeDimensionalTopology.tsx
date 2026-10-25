import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Box, 
  RotateCcw, 
  Eye, 
  Zap, 
  ShieldAlert, 
  Compass, 
  Sliders, 
  Crosshair,
  Layers,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';
import { EVIDENCE_GRAPH, GraphNode } from '../data/evidenceGraphData';

interface ThreeDimensionalTopologyProps {
  onSelectNode?: (node: GraphNode) => void;
  demoTourActive?: boolean;
}

export const ThreeDimensionalTopology: React.FC<ThreeDimensionalTopologyProps> = ({
  onSelectNode,
  demoTourActive = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);
  const [activeHeroNode, setActiveHeroNode] = useState<string>('CAMERON_LANE_HOLDINGS_LLC');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [particlePulseSpeed, setParticlePulseSpeed] = useState(1.0);
  const [autoRotate, setAutoRotate] = useState(false);

  // References to keep animation loop decoupled from React state re-renders
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const pulseUniformsRef = useRef<{ time: { value: number } }>({ time: { value: 0 } });
  const heroGroupMapRef = useRef<Map<string, THREE.Group>>(new Map());

  // Automated 3D button & spire flight sequence during Cinematic Demo Act 16
  useEffect(() => {
    if (!demoTourActive) return;
    const targets = [
      'CAMERON_LANE_HOLDINGS_LLC',
      'APN_PERMIT_HB_2024_081',
      'MANAGING_BROKER_WEST_COAST',
    ];
    let step = 0;
    const initialTimer = window.setTimeout(() => {
      flyToNode(targets[0]);
    }, 600);

    const interval = window.setInterval(() => {
      step = (step + 1) % (targets.length + 1);
      if (step < targets.length) {
        flyToNode(targets[step]);
        setParticlePulseSpeed(step === 1 ? 1.8 : step === 2 ? 2.4 : 1.2);
      } else {
        resetCamera();
        setParticlePulseSpeed(1.0);
      }
    }, 5200);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [demoTourActive]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Atmospheric Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const fogColor = new THREE.Color(0x030712);
    scene.background = fogColor;
    scene.fog = new THREE.FogExp2(fogColor.getHex(), 0.016);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 35, 65);
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmicToneMapping & PBR Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Damped OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Keep camera above ground plane
    controls.minDistance = 10;
    controls.maxDistance = 180;
    controls.target.set(0, 5, 0);
    controlsRef.current = controls;

    // 5. Studio PBR Lighting System
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.7);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    dirLight.position.set(30, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 160;
    const shadowD = 45;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Subtle blue point accents
    const pointAccent1 = new THREE.PointLight(0x06b6d4, 1.8, 60);
    pointAccent1.position.set(-25, 12, -20);
    scene.add(pointAccent1);

    const pointAccent2 = new THREE.PointLight(0xa855f7, 1.8, 60);
    pointAccent2.position.set(25, 12, 20);
    scene.add(pointAccent2);

    // 6. Procedural Ground CanvasTexture (Concentric Forensic Grid)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 1024; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1024);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(1024, x);
        ctx.stroke();
      }

      // Radar circles
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let r = 80; r < 500; r += 80) {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(512, 470);
      ctx.lineTo(512, 554);
      ctx.moveTo(470, 512);
      ctx.lineTo(554, 512);
      ctx.stroke();
    }

    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 4);

    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTexture,
      roughness: 0.85,
      metalness: 0.2,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 7. Procedural Contact Shadow Disc Geometry
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0,0,0,0.75)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });

    // 8. Composite 3-12 Part Hero Structure Builder
    const createHeroNodeMesh = (
      nodeId: string,
      label: string,
      colorHex: number,
      position: THREE.Vector3,
      scaleMultiplier: number = 1.0
    ): THREE.Group => {
      const group = new THREE.Group();
      group.position.copy(position);
      group.userData = { nodeId, label };

      // Part 1: Contact shadow plane (flush with ground)
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.03;
      shadow.scale.set(scaleMultiplier * 1.5, scaleMultiplier * 1.5, 1);
      group.add(shadow);

      // Part 2: Tiered Beveled Base 1 (Heavy Metallic foundation)
      const base1Geo = new THREE.CylinderGeometry(3.2 * scaleMultiplier, 3.8 * scaleMultiplier, 0.8, 16);
      const base1Mat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.35,
      });
      const base1 = new THREE.Mesh(base1Geo, base1Mat);
      base1.position.y = 0.4;
      base1.castShadow = true;
      base1.receiveShadow = true;
      group.add(base1);

      // Part 3: Tiered Beveled Base 2 (Upper ring)
      const base2Geo = new THREE.CylinderGeometry(2.4 * scaleMultiplier, 2.9 * scaleMultiplier, 0.6, 16);
      const base2Mat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.6,
        roughness: 0.4,
      });
      const base2 = new THREE.Mesh(base2Geo, base2Mat);
      base2.position.y = 1.0;
      base2.castShadow = true;
      group.add(base2);

      // Part 4: Inner Core (Translucent Glowing Cylinder)
      const coreGeo = new THREE.CylinderGeometry(1.4 * scaleMultiplier, 1.4 * scaleMultiplier, 5.0 * scaleMultiplier, 16);
      const coreMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.9,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 1.3 + (2.5 * scaleMultiplier);
      core.castShadow = true;
      group.add(core);

      // Part 5-8: Four Supporting Perimeter Pillars
      const pillarGeo = new THREE.BoxGeometry(0.4 * scaleMultiplier, 5.2 * scaleMultiplier, 0.4 * scaleMultiplier);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
      });
      const radius = 2.0 * scaleMultiplier;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(Math.cos(angle) * radius, 1.3 + (2.6 * scaleMultiplier), Math.sin(angle) * radius);
        pillar.castShadow = true;
        group.add(pillar);
      }

      // Part 9: Floating Concentric Halo Ring (Torus)
      const ringGeo = new THREE.TorusGeometry(2.8 * scaleMultiplier, 0.15 * scaleMultiplier, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.9,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 1.3 + (3.5 * scaleMultiplier);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);

      // Part 10: Top Pinnacle Beacon Spire
      const spireGeo = new THREE.ConeGeometry(0.8 * scaleMultiplier, 2.5 * scaleMultiplier, 8);
      const spireMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: colorHex,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.15,
      });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.position.y = 1.3 + (5.0 * scaleMultiplier) + (1.25 * scaleMultiplier);
      spire.castShadow = true;
      group.add(spire);

      // Part 11: Rotating Orbital Satellite Dot
      const satelliteGeo = new THREE.SphereGeometry(0.4 * scaleMultiplier, 12, 12);
      const satelliteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const satellite = new THREE.Mesh(satelliteGeo, satelliteMat);
      satellite.name = 'satellite';
      satellite.position.set(3.4 * scaleMultiplier, 1.3 + (3.5 * scaleMultiplier), 0);
      group.add(satellite);

      scene.add(group);
      heroGroupMapRef.current.set(nodeId, group);
      return group;
    };

    // Hero Nodes Spatial Coordinates
    const heroNodesConfig = [
      { id: 'CAMERON_LANE_HOLDINGS_LLC', label: 'Cameron Lane Holdings LLC', color: 0xef4444, pos: new THREE.Vector3(0, 0, 0), scale: 1.5 },
      { id: 'APN_PERMIT_HB_2024_081', label: 'Encroachment Permit 2024-081', color: 0xa855f7, pos: new THREE.Vector3(18, 0, -12), scale: 1.35 },
      { id: 'MANAGING_BROKER_WEST_COAST', label: 'Managing Broker (Nest Seekers)', color: 0xf59e0b, pos: new THREE.Vector3(-20, 0, -10), scale: 1.3 },
      { id: 'CITY_OF_HUNTINGTON_BEACH_PW', label: 'City of HB Public Works', color: 0x10b981, pos: new THREE.Vector3(26, 0, 16), scale: 1.25 },
      { id: 'CITY_OF_NEWPORT_BEACH', label: 'City of Newport Beach', color: 0x06b6d4, pos: new THREE.Vector3(-14, 0, 24), scale: 1.2 },
      { id: 'EEC_ENGINEERING_CORP', label: 'EEC Engineering Corp', color: 0x38bdf8, pos: new THREE.Vector3(34, 0, -22), scale: 1.15 },
      { id: 'TTS_ENVIRONMENTAL_CONSULTANTS', label: 'TTS Environmental Consultants', color: 0x14b8a6, pos: new THREE.Vector3(6, 0, -32), scale: 1.15 },
      { id: 'STORMTECH_WATER_SYSTEMS', label: 'StormTech Drainage Systems', color: 0x3b82f6, pos: new THREE.Vector3(30, 0, 2), scale: 1.1 },
      { id: 'WEST_HOLLYWOOD_BROKERAGE_HUB', label: 'West Hollywood Annex', color: 0xf97316, pos: new THREE.Vector3(-35, 0, -26), scale: 1.15 },
      { id: 'FIDUCIARY_TRUST_NETWORK', label: 'Private Trust Registry', color: 0x8b5cf6, pos: new THREE.Vector3(-28, 0, 12), scale: 1.3 },
    ];

    heroNodesConfig.forEach(cfg => {
      createHeroNodeMesh(cfg.id, cfg.label, cfg.color, cfg.pos, cfg.scale);
    });

    // 9. Procedural 3D Volumetric Connecting Energy Splines
    const connections = [
      { from: 'CAMERON_LANE_HOLDINGS_LLC', to: 'APN_PERMIT_HB_2024_081', color: 0xef4444 },
      { from: 'CAMERON_LANE_HOLDINGS_LLC', to: 'MANAGING_BROKER_WEST_COAST', color: 0xf59e0b },
      { from: 'APN_PERMIT_HB_2024_081', to: 'CITY_OF_HUNTINGTON_BEACH_PW', color: 0x10b981 },
      { from: 'APN_PERMIT_HB_2024_081', to: 'EEC_ENGINEERING_CORP', color: 0x38bdf8 },
      { from: 'APN_PERMIT_HB_2024_081', to: 'STORMTECH_WATER_SYSTEMS', color: 0x3b82f6 },
      { from: 'MANAGING_BROKER_WEST_COAST', to: 'WEST_HOLLYWOOD_BROKERAGE_HUB', color: 0xf97316 },
      { from: 'CITY_OF_HUNTINGTON_BEACH_PW', to: 'CITY_OF_NEWPORT_BEACH', color: 0x06b6d4 },
      { from: 'CITY_OF_NEWPORT_BEACH', to: 'MANAGING_BROKER_WEST_COAST', color: 0xf59e0b },
      { from: 'CAMERON_LANE_HOLDINGS_LLC', to: 'FIDUCIARY_TRUST_NETWORK', color: 0x8b5cf6 },
      { from: 'TTS_ENVIRONMENTAL_CONSULTANTS', to: 'APN_PERMIT_HB_2024_081', color: 0x14b8a6 },
    ];

    const splineGroups: THREE.Group[] = [];

    connections.forEach((conn) => {
      const fromGroup = heroGroupMapRef.current.get(conn.from);
      const toGroup = heroGroupMapRef.current.get(conn.to);
      if (!fromGroup || !toGroup) return;

      const p1 = fromGroup.position.clone().add(new THREE.Vector3(0, 4, 0));
      const p2 = toGroup.position.clone().add(new THREE.Vector3(0, 4, 0));
      const mid = p1.clone().lerp(p2, 0.5).add(new THREE.Vector3(0, 6, 0));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.22, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: conn.color,
        emissive: conn.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);

      // Animated energy pulse particle along spline
      const pulseGeo = new THREE.SphereGeometry(0.55, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.userData = { curve, tOffset: Math.random() };
      scene.add(pulse);
      splineGroups.push(pulse as any);
    });

    // 10. InstancedMesh for 600+ Perimeter Shell LLC Data Nodes (Lossless 60fps)
    const shellCount = 450;
    const instancedGeo = new THREE.OctahedronGeometry(0.7, 0);
    const instancedMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: false,
    });
    const instancedMesh = new THREE.InstancedMesh(instancedGeo, instancedMat, shellCount);
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < shellCount; i++) {
      const angle = (i / shellCount) * Math.PI * 2 * 6 + Math.random() * 0.4;
      const dist = 38 + Math.random() * 65;
      const height = 0.5 + Math.random() * 18;
      dummy.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const s = 0.6 + Math.random() * 0.7;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      if (i % 7 === 0) color.setHex(0xef4444); // Shell alert
      else if (i % 5 === 0) color.setHex(0xf59e0b); // Fiduciary
      else if (i % 9 === 0) color.setHex(0x38bdf8); // Engineering
      else color.setHex(0x1e293b);
      instancedMesh.setColorAt(i, color);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
    scene.add(instancedMesh);

    // 11. Raycaster for Interactive Node Picking & Hover Tooltips
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const heroMeshes: THREE.Object3D[] = [];
      heroGroupMapRef.current.forEach(g => heroMeshes.push(...g.children));

      const intersects = raycaster.intersectObjects(heroMeshes, false);
      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && topGroup.parent && topGroup.parent !== scene) {
          topGroup = topGroup.parent;
        }
        if (topGroup?.userData?.label) {
          setHoveredNodeName(topGroup.userData.label);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredNodeName(null);
      container.style.cursor = 'default';
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const heroMeshes: THREE.Object3D[] = [];
      heroGroupMapRef.current.forEach(g => heroMeshes.push(...g.children));

      const intersects = raycaster.intersectObjects(heroMeshes, false);
      if (intersects.length > 0) {
        let topGroup: THREE.Object3D | null = intersects[0].object;
        while (topGroup && topGroup.parent && topGroup.parent !== scene) {
          topGroup = topGroup.parent;
        }
        if (topGroup?.userData?.nodeId) {
          const matchedNode = EVIDENCE_GRAPH.nodes.find(n => n.id === topGroup?.userData?.nodeId);
          if (matchedNode && onSelectNode) {
            onSelectNode(matchedNode);
            setActiveHeroNode(matchedNode.id);
          }
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 12. Lossless 60fps Render Loop with Clock Delta Damping
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Controls damping update
      controls.update();

      // Rotate orbital satellites around hero nodes
      heroGroupMapRef.current.forEach((group) => {
        const sat = group.getObjectByName('satellite');
        if (sat) {
          const t = elapsed * 1.5;
          sat.position.x = Math.cos(t) * 4.2;
          sat.position.z = Math.sin(t) * 4.2;
        }
      });

      // Animate spline particle pulses along curves
      splineGroups.forEach((pulse: any) => {
        if (pulse.userData?.curve) {
          const t = ((elapsed * 0.25 * particlePulseSpeed) + pulse.userData.tOffset) % 1.0;
          pulse.position.copy(pulse.userData.curve.getPoint(t));
        }
      });

      // Subtle slow rotation of perimeter instanced shell galaxy
      if (instancedMesh) {
        instancedMesh.rotation.y = elapsed * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [particlePulseSpeed]);

  // Smooth Fly-to camera helper
  const flyToNode = (nodeId: string) => {
    setActiveHeroNode(nodeId);
    const group = heroGroupMapRef.current.get(nodeId);
    if (!group || !cameraRef.current || !controlsRef.current) return;

    const targetPos = group.position.clone();
    controlsRef.current.target.set(targetPos.x, targetPos.y + 4, targetPos.z);
    cameraRef.current.position.set(targetPos.x + 12, targetPos.y + 14, targetPos.z + 20);
  };

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    controlsRef.current.target.set(0, 5, 0);
    cameraRef.current.position.set(0, 35, 65);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas Host */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Hover Entity HUD Indicator */}
      {hoveredNodeName && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 bg-slate-900/95 border border-cyan-500/80 rounded-xl shadow-2xl backdrop-blur-md text-center animate-in fade-in">
          <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
            Interactive 3D Entity Target
          </p>
          <p className="text-sm font-bold text-white mt-0.5">{hoveredNodeName}</p>
          <span className="text-[10px] text-slate-400">Click to lock target in evidence docket</span>
        </div>
      )}

      {/* Compact Collapsible Control Dock (<= 15% Viewport Footprint, solid rgba surface) */}
      <div className="absolute top-4 right-4 z-20 w-72 bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl text-xs text-slate-200 overflow-hidden">
        {/* Dock Header */}
        <div 
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="p-3 bg-[#1e293b] border-b border-slate-700/80 flex items-center justify-between cursor-pointer hover:bg-slate-700/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs">3D Spatial Holo-Dock</span>
          </div>
          <button className="text-slate-400 hover:text-white p-0.5">
            {isControlsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {!isControlsCollapsed && (
          <div className="p-3.5 space-y-3">
            {/* Quick Fly-To Targets */}
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Fly-To Tactical Focus
              </span>
              <div className="grid grid-cols-1 gap-1.5 font-sans">
                <button
                  onClick={() => flyToNode('CAMERON_LANE_HOLDINGS_LLC')}
                  className={`w-full text-left p-1.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    activeHeroNode === 'CAMERON_LANE_HOLDINGS_LLC'
                      ? 'bg-red-950/80 border-red-500 text-red-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">Cameron Lane Holdings</span>
                  <span className="text-[9px] font-mono text-red-400 ml-1">BC: 53.85%</span>
                </button>

                <button
                  onClick={() => flyToNode('APN_PERMIT_HB_2024_081')}
                  className={`w-full text-left p-1.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    activeHeroNode === 'APN_PERMIT_HB_2024_081'
                      ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">Permit 2024-081 Spire</span>
                  <span className="text-[9px] font-mono text-purple-400 ml-1">BC: 51.28%</span>
                </button>

                <button
                  onClick={() => flyToNode('MANAGING_BROKER_WEST_COAST')}
                  className={`w-full text-left p-1.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                    activeHeroNode === 'MANAGING_BROKER_WEST_COAST'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">Managing Broker Nexus</span>
                  <span className="text-[9px] font-mono text-amber-400 ml-1">BC: 33.33%</span>
                </button>
              </div>
            </div>

            {/* Particle Pulse Velocity */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  Conduit Pulse Speed:
                </span>
                <span className="font-mono text-cyan-300">{particlePulseSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.2"
                value={particlePulseSpeed}
                onChange={(e) => setParticlePulseSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Camera Actions */}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={resetCamera}
                className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-5 left-5 z-20 hidden md:block bg-[#0f172a] border border-slate-800 p-3 rounded-xl shadow-2xl text-[11px] text-slate-300 max-w-xs">
        <div className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-xs text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          Three.js Procedural PBR Structures
        </div>
        <p className="text-slate-400 leading-relaxed mb-2">
          Composite 3–12 part architectural pedestals, volumetric bezier spline tubes, contact shadows, and 450+ orbiting shell nodes.
        </p>
        <div className="space-y-1 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span>Red Spire: Cameron Lane Title Anchor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" />
            <span>Purple Tower: Municipal Encroachment Permit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            <span>Gold Pavilion: Nest Seekers Fiduciary Conduit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
