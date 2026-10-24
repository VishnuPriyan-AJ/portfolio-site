import { Canvas } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import { useMemo, useRef, useState } from "react"
import { ArrowUpRight, Compass, RotateCcw, X } from "lucide-react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { site } from "@/data"
import { ButtonLink } from "@/components/ui/button"
import { worldLandmarks, type WorldLandmark } from "@/world-data"

const WORLD_SCALE = 6

function terrainHeight(x: number, z: number) {
  return Math.sin(x * .48) * .18 + Math.cos(z * .62) * .14 + Math.sin((x + z) * .8) * .1 + (z > 1.1 ? (z - 1.1) * .12 : 0)
}

function worldPosition(landmark: WorldLandmark) {
  const x = (landmark.x - 50) / WORLD_SCALE
  const z = (50 - landmark.y) / WORLD_SCALE
  return [x, terrainHeight(x, z), z] as [number, number, number]
}

function Terrain() {
  const geometry = useMemo(() => {
    const result = new THREE.PlaneGeometry(22, 14, 32, 24)
    const position = result.attributes.position
    for (let index = 0; index < position.count; index += 1) {
      const x = position.getX(index)
      const z = -position.getY(index)
      position.setZ(index, terrainHeight(x, z))
    }
    result.rotateX(-Math.PI / 2)
    result.computeVertexNormals()
    return result
  }, [])
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#8fb47d" roughness={1} flatShading /></mesh>
}

function Route() {
  const geometry = useMemo(() => {
    const points = worldLandmarks.map((landmark) => { const [x, y, z] = worldPosition(landmark); return new THREE.Vector3(x, y + .08, z) })
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 80, .055, 6, false)
  }, [])
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#d49b57" roughness={.9} /></mesh>
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return <group position={position} scale={scale}><mesh position={[0, .18, 0]} castShadow><cylinderGeometry args={[.035, .05, .36, 6]} /><meshStandardMaterial color="#76543b" /></mesh><mesh position={[0, .48, 0]} castShadow><coneGeometry args={[.25, .65, 7]} /><meshStandardMaterial color="#527f55" flatShading /></mesh></group>
}

function LandmarkModel({ landmark, selected, onSelect }: { landmark: WorldLandmark; selected: boolean; onSelect: () => void }) {
  const [x, y, z] = worldPosition(landmark)
  const color = selected ? "#e6b866" : landmark.category === "education" ? "#b7d2ae" : "#d99d59"
  return <group position={[x, y, z]} onClick={(event) => { event.stopPropagation(); onSelect() }}>
    <mesh position={[0, .14, 0]} castShadow><cylinderGeometry args={[.38, .48, .18, 8]} /><meshStandardMaterial color={selected ? "#f4d78e" : "#6e9b65"} /></mesh>
    {landmark.landmarkType === "home" && <><mesh position={[0, .68, 0]} castShadow><boxGeometry args={[.55, 1, .55]} /><meshStandardMaterial color={color} /></mesh><mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.5, .55, 4]} /><meshStandardMaterial color="#9d6749" /></mesh></>}
    {landmark.landmarkType === "hospital" && <><mesh position={[0, .65, 0]} castShadow><boxGeometry args={[.95, 1.1, .72]} /><meshStandardMaterial color="#eee7d1" /></mesh><mesh position={[0, 1.28, 0]}><boxGeometry args={[.22, .45, .06]} /><meshStandardMaterial color="#c66c62" /></mesh><mesh position={[0, 1.28, .05]} rotation={[0, 0, Math.PI / 2]}><boxGeometry args={[.22, .45, .06]} /><meshStandardMaterial color="#c66c62" /></mesh></>}
    {landmark.landmarkType === "school" && <><mesh position={[0, .65, 0]} castShadow><boxGeometry args={[.85, 1.05, .7]} /><meshStandardMaterial color="#d8b06b" /></mesh><mesh position={[.45, 1, 0]} castShadow><cylinderGeometry args={[.22, .22, 1.8, 6]} /><meshStandardMaterial color="#b77c4c" /></mesh></>}
    {landmark.landmarkType !== "home" && landmark.landmarkType !== "hospital" && landmark.landmarkType !== "school" && <><mesh position={[0, .65, 0]} castShadow><boxGeometry args={[.8, 1.05, .65]} /><meshStandardMaterial color={color} roughness={.82} /></mesh><mesh position={[0, 1.32, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[.62, .45, 4]} /><meshStandardMaterial color={landmark.landmarkType === "connected" ? "#4d7b77" : "#9d6749"} /></mesh></>}
    {landmark.landmarkType === "connected" && <><mesh position={[.55, .75, 0]} castShadow><boxGeometry args={[.32, .72, .32]} /><meshStandardMaterial color="#567eaa" /></mesh><mesh position={[-.55, .52, .2]} castShadow><boxGeometry args={[.35, .42, .35]} /><meshStandardMaterial color="#c4864c" /></mesh></>}
    {selected && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .03, 0]}><ringGeometry args={[.58, .66, 32]} /><meshBasicMaterial color="#fff1b0" transparent opacity={.9} /></mesh>}
    <Html position={[0, 1.8, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}><span className={`world-3d-label${selected ? " is-selected" : ""}`}><b>{landmark.number}</b>{landmark.title}</span></Html>
  </group>
}

function WorldScene({ selectedId, onSelect, controlsRef }: { selectedId: string | null; onSelect: (id: string) => void; controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const treePositions = useMemo(() => Array.from({ length: 20 }, (_, index) => { const x = -9 + (index * 1.83) % 18; const z = -5.4 + (index * 2.47) % 10; return [x, terrainHeight(x, z), z] as [number, number, number] }), [])
  return <><color attach="background" args={["#c8d8c1"]} /><fog attach="fog" args={["#c8d8c1", 10, 22]} /><ambientLight intensity={1.7} color="#fff7df" /><directionalLight castShadow position={[-5, 10, 6]} intensity={2.5} color="#fff0c7" shadow-mapSize={[1024, 1024]} /><hemisphereLight intensity={.65} color="#eaf5ff" groundColor="#6d946b" /><Terrain /><Route />{treePositions.map((position, index) => <Tree key={index} position={position} scale={.7 + (index % 3) * .15} />)}{worldLandmarks.map((landmark) => <LandmarkModel key={landmark.id} landmark={landmark} selected={selectedId === landmark.id} onSelect={() => onSelect(landmark.id)} />)}<OrbitControls ref={controlsRef} enablePan minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.15} minDistance={8} maxDistance={18} dampingFactor={.08} enableDamping touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }} /></>
}

function LandmarkPanel({ landmark, close }: { landmark: WorldLandmark; close: () => void }) {
  const relatedProjects = site.caseStudies.filter((project) => landmark.relatedProjectIds?.includes(project.slug))
  return <aside className="world-detail-panel" aria-labelledby="world-detail-title"><div className="world-detail-header"><span className="world-detail-number">{landmark.number}</span><button type="button" className="world-close" onClick={close} aria-label="Close landmark details"><X size={17} /></button></div><p className="world-detail-category">{landmark.category} chapter</p><h2 id="world-detail-title">{landmark.title}</h2>{landmark.dateRange && <p className="world-detail-date">{landmark.dateRange}</p>}<p className="world-detail-description">{landmark.description}</p>{relatedProjects.length > 0 && <div className="world-related-work"><span>Selected work from this chapter</span>{relatedProjects.map((project) => <ButtonLink key={project.slug} href={`project.html?slug=${encodeURIComponent(project.slug)}`} variant="outline">{project.title}<ArrowUpRight size={14} /></ButtonLink>)}</div>}</aside>
}

export function WorldMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const selected = worldLandmarks.find((landmark) => landmark.id === selectedId)
  function resetView() { controlsRef.current?.reset(); setSelectedId(null) }
  return <section className="world-section" id="journey" aria-labelledby="world-title"><div className="world-section-intro"><div><p className="world-kicker">A personal atlas</p><h2 id="world-title">The part of the map I’ve explored so far.</h2></div><p>Drag to explore and select a landmark to open its story.</p></div><div className={`world-layout${selected ? " has-selection" : ""}`}><div className="world-map-frame world-3d-frame"><div className="world-map-toolbar"><span>Vishnu’s world</span><span>Drag to explore · Select a landmark</span></div><Canvas shadows orthographic camera={{ position: [10, 10, 13], zoom: 48, near: .1, far: 100 }} dpr={[1, 1.5]} fallback={<div className="world-webgl-fallback">Your browser could not load the interactive world. Use the journey list below or continue to selected work.</div>}><WorldScene selectedId={selectedId} onSelect={setSelectedId} controlsRef={controlsRef} /></Canvas><button type="button" className="world-reset" onClick={resetView}><RotateCcw size={14} /> Overview</button><nav className="world-journey-list" aria-label="Journey landmarks">{worldLandmarks.map((landmark) => <button key={landmark.id} type="button" onClick={() => setSelectedId(landmark.id)} aria-pressed={selectedId === landmark.id}>{landmark.number} <span>{landmark.title}</span></button>)}</nav></div>{selected && <LandmarkPanel landmark={selected} close={() => setSelectedId(null)} />}</div></section>
}

export function WorldHero() {
  return <section className="world-hero" aria-labelledby="world-hero-title"><div className="world-hero-copy"><p className="world-kicker">Vishnu Priyan A J · Product Designer</p><h1 id="world-hero-title">Life is an unexplored map.</h1><p>Here’s the part I’ve explored so far.</p><div className="world-hero-actions"><ButtonLink href="#case-studies">View selected work</ButtonLink><a className="world-secondary-action" href="#journey">Explore my journey</a></div></div><div className="world-hero-compass" aria-hidden="true"><Compass size={24} /><span>North is wherever curiosity leads.</span></div></section>
}
