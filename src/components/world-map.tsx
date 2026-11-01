import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Html, OrbitControls } from "@react-three/drei"
import { useMemo, useRef, useState, useEffect } from "react"
import { ArrowUpRight, Compass, RotateCcw, X } from "lucide-react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { site } from "@/data"
import { ButtonLink } from "@/components/ui/button"
import { worldLandmarks, type WorldLandmark } from "@/world-data"

const WATER_Y = -0.2
const OVERVIEW_ZOOM = 34
const FOCUSED_ZOOM = 60

// Island positions distributed across the ocean map:
// Home & School sits at (0, 0, 0) right at the heart of the world.
function islandPosition(landmark: WorldLandmark): [number, number, number] {
  const x = (landmark.x - 50) / 3.7
  const z = (50 - landmark.y) / 4.0
  return [x, 0, z]
}

// Compute Island radius based on years spent!
// 1 week (0.02 yr) -> tiny rock island ~0.72
// 1.5 - 2 yrs -> medium island ~1.2 - 1.35
// 3 yrs -> ~1.55
// 5 yrs (B.Arch) -> large island ~1.95
// 18 yrs (Home & School) -> grand continent island ~2.65
function getIslandRadius(yearsSpent: number): number {
  if (yearsSpent < 0.1) return 0.72 // 1 week Hospital
  if (yearsSpent <= 1.5) return 1.2
  if (yearsSpent <= 2.0) return 1.35
  if (yearsSpent <= 3.0) return 1.55
  if (yearsSpent <= 5.0) return 1.95
  return 2.65 // 18 Years Home & School
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED OCEAN & UNDERWATER REALM (Turtles, Divers, Corals)
   ───────────────────────────────────────────────────────────── */

function AnimatedOcean() {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geo } = useMemo(() => {
    // Huge ocean expanse reaching past the horizon in every direction
    const g = new THREE.PlaneGeometry(160, 140, 64, 52)
    g.rotateX(-Math.PI / 2)
    return { geo: g }
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const time = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position
    const count = pos.count

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const wave =
        Math.sin(x * 0.42 + time * 1.3) * 0.08 +
        Math.cos(z * 0.52 + time * 1.05) * 0.07 +
        Math.sin((x + z) * 0.28 + time * 1.7) * 0.04
      pos.setY(i, WATER_Y + wave)
    }
    pos.needsUpdate = true
  })

  return (
    <mesh ref={meshRef} geometry={geo} receiveShadow>
      <meshPhysicalMaterial
        color="#246a7d"
        transmission={0.42}
        opacity={0.92}
        transparent
        roughness={0.16}
        metalness={0.08}
        ior={1.333}
        flatShading
      />
    </mesh>
  )
}

/* Sea Turtle swimming with flipper strokes */
function SeaTurtle({
  startX,
  startZ,
  speed,
  phase,
}: {
  startX: number
  startZ: number
  speed: number
  phase: number
}) {
  const turtleRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!turtleRef.current) return
    const t = clock.getElapsedTime()
    const angle = t * speed * 0.18 + phase
    const x = startX + Math.sin(angle) * 4.2
    const z = startZ + Math.cos(angle) * 3.2
    const y = WATER_Y - 0.75 + Math.sin(t * 1.2 + phase) * 0.15

    turtleRef.current.position.set(x, y, z)
    turtleRef.current.rotation.y = angle + Math.PI / 2
    turtleRef.current.rotation.z = Math.sin(t * 1.2 + phase) * 0.08

    // Flapping front flippers
    const leftFlip = turtleRef.current.children[1]
    const rightFlip = turtleRef.current.children[2]
    const stroke = Math.sin(t * 2.2 + phase) * 0.35
    if (leftFlip) leftFlip.rotation.z = stroke
    if (rightFlip) rightFlip.rotation.z = -stroke
  })

  return (
    <group ref={turtleRef} scale={0.75}>
      {/* Oval Carapace Shell */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.34, 8, 8]} />
        <meshStandardMaterial color="#425f38" roughness={0.7} />
      </mesh>
      {/* Left Front Flipper */}
      <mesh position={[0.28, 0, 0.18]} rotation={[0, 0.3, -0.4]}>
        <boxGeometry args={[0.26, 0.02, 0.14]} />
        <meshStandardMaterial color="#354d2d" />
      </mesh>
      {/* Right Front Flipper */}
      <mesh position={[-0.28, 0, 0.18]} rotation={[0, -0.3, 0.4]}>
        <boxGeometry args={[0.26, 0.02, 0.14]} />
        <meshStandardMaterial color="#354d2d" />
      </mesh>
      {/* Turtle Head */}
      <mesh position={[0, 0.02, 0.42]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#507043" />
      </mesh>
      {/* Rear flippers */}
      <mesh position={[0.16, 0, -0.3]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.12, 0.015, 0.1]} />
        <meshStandardMaterial color="#354d2d" />
      </mesh>
      <mesh position={[-0.16, 0, -0.3]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.015, 0.1]} />
        <meshStandardMaterial color="#354d2d" />
      </mesh>
    </group>
  )
}

/* Scuba Diver exploring the reefs */
function ScubaDiver() {
  const diverRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!diverRef.current) return
    const t = clock.getElapsedTime()
    const pathAngle = t * 0.15 + 1.2
    const x = -1.2 + Math.sin(pathAngle) * 3.6
    const z = 2.4 + Math.cos(pathAngle) * 2.8
    const y = WATER_Y - 0.85 + Math.sin(t * 1.1) * 0.18

    diverRef.current.position.set(x, y, z)
    diverRef.current.rotation.y = pathAngle + Math.PI / 2
    diverRef.current.rotation.x = 0.35 // Horizontal swimming posture

    // Flutter kick fins
    const finL = diverRef.current.children[4]
    const finR = diverRef.current.children[5]
    const kick = Math.sin(t * 3.5) * 0.45
    if (finL) finL.rotation.x = kick
    if (finR) finR.rotation.x = -kick
  })

  return (
    <group ref={diverRef} scale={0.65}>
      {/* Diver Wet-suit Torso */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.14, 0.45]} />
        <meshStandardMaterial color="#1a1e24" roughness={0.5} />
      </mesh>
      {/* Yellow Oxygen Tank */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.34, 8]} />
        <meshStandardMaterial color="#f5a623" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Diver Mask & Hood */}
      <mesh position={[0, 0, 0.28]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#222b30" />
      </mesh>
      {/* Mask Glass */}
      <mesh position={[0, 0.02, 0.35]}>
        <boxGeometry args={[0.1, 0.05, 0.02]} />
        <meshStandardMaterial color="#38b6d8" metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Left Swim Fin */}
      <mesh position={[0.07, 0, -0.38]}>
        <boxGeometry args={[0.08, 0.015, 0.22]} />
        <meshStandardMaterial color="#38b6d8" />
      </mesh>
      {/* Right Swim Fin */}
      <mesh position={[-0.07, 0, -0.38]}>
        <boxGeometry args={[0.08, 0.015, 0.22]} />
        <meshStandardMaterial color="#38b6d8" />
      </mesh>
      {/* Air Bubbles trail floating up */}
      <mesh position={[0, 0.2, 0.2]}>
        <sphereGeometry args={[0.04, 5, 5]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function UnderWaterRealm() {
  const seabedGeo = useMemo(() => {
    // Vast seabed extending far past the viewing bounds
    const g = new THREE.PlaneGeometry(130, 110, 48, 38)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const y = p.getY(i)
      const dune = Math.sin(x * 0.18) * 0.65 + Math.cos(y * 0.22) * 0.55
      p.setZ(i, dune)
    }
    g.rotateX(-Math.PI / 2)
    g.computeVertexNormals()
    return g
  }, [])

  const fishSchools = useMemo(() => [
    { cx: -5.5, cz: 1.5, count: 9, color: "#f27938", speed: 1.1 },
    { cx: 3.5, cz: -1.2, count: 8, color: "#ffd034", speed: 0.95 },
    { cx: -1.2, cz: 4.8, count: 10, color: "#38b6d8", speed: 1.2 },
    { cx: 7.5, cz: 2.8, count: 7, color: "#e84393", speed: 1.05 },
    { cx: 0.5, cz: -3.8, count: 8, color: "#a29bfe", speed: 1.15 },
    { cx: -6.8, cz: 4.2, count: 6, color: "#00cec9", speed: 0.9 },
  ], [])

  const schoolRefs = useRef<THREE.Group[]>([])

  const corals = useMemo(() => [
    { x: -7.5, z: 2.8, scale: 1.1, color: "#e06c75" },
    { x: -4.0, z: 0.8, scale: 1.25, color: "#e5c07b" },
    { x: 1.2, z: 4.2, scale: 0.95, color: "#98c379" },
    { x: 5.8, z: -1.8, scale: 1.3, color: "#c678dd" },
    { x: 9.0, z: 1.8, scale: 1.0, color: "#e06c75" },
    { x: -1.8, z: -3.5, scale: 1.15, color: "#ff7675" },
    { x: 3.2, z: 3.8, scale: 1.05, color: "#74b9ff" },
    { x: -6.5, z: -2.2, scale: 1.2, color: "#fdcb6e" },
    { x: 7.5, z: 5.5, scale: 1.1, color: "#55efc4" },
  ], [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    schoolRefs.current.forEach((group, idx) => {
      if (!group) return
      const s = fishSchools[idx]
      const angle = t * s.speed * 0.38 + idx
      group.position.x = s.cx + Math.sin(angle) * 2.6
      group.position.z = s.cz + Math.cos(angle) * 1.9
      group.rotation.y = angle + Math.PI / 2
    })
  })

  return (
    <group position={[0, -2.8, 0]}>
      {/* Sandy Ocean Floor with Corals and Seaweed */}
      <mesh geometry={seabedGeo} receiveShadow>
        <meshStandardMaterial color="#2a4e52" roughness={0.92} />
      </mesh>

      {/* Deep underwater front wall — fills the bottom of the canvas with ocean colour
          instead of letting the sky background show through below the waterline */}
      <mesh position={[0, 1.45, -18]}>
        <planeGeometry args={[200, 10]} />
        <meshStandardMaterial color="#0d3545" roughness={1} />
      </mesh>

      {/* Massive underwater ambient water block sealing in the aquatic volume */}      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[126, 2.9, 106]} />
        <meshStandardMaterial
          color="#0d313a"
          transparent
          opacity={0.82}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Extra deep-water fill plane — sits just at the waterline (world y=-0.2) to
          ensure no background bleeds through below the surface. local y=2.6 */}
      <mesh position={[0, 2.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1e5c6e" roughness={1} />
      </mesh>      {/* Foreground underwater wall — sits at the front of the scene where the orthographic
          camera's bottom edge would otherwise show the sky background colour.
          Positioned at high +z (closest to viewer) and rendered with a vertical plane
          filled with deep-ocean teal so the bottom strip is always ocean, never sky. */}
      <mesh position={[0, 1.2, 14]}>
        <planeGeometry args={[200, 6]} />
        <meshStandardMaterial color="#174d5a" roughness={1} side={THREE.DoubleSide} />
      </mesh>

      {/* Additional coral/seaweed clusters near the front for the foreground strip */}
      {[
        { x: -8, z: 10, color: "#e06c75", scale: 1.2 },
        { x: -4, z: 11, color: "#55efc4", scale: 1.0 },
        { x: 0.5, z: 10.5, color: "#fdcb6e", scale: 1.3 },
        { x: 4.5, z: 11, color: "#74b9ff", scale: 1.1 },
        { x: 8.5, z: 10, color: "#e06c75", scale: 0.95 },
        { x: -11, z: 9.5, color: "#a29bfe", scale: 1.0 },
        { x: 11.5, z: 9.5, color: "#98c379", scale: 1.15 },
      ].map((c, i) => (
        <group key={`fg-coral-${i}`} position={[c.x, 0.2, c.z]} scale={c.scale}>
          <mesh position={[0, 0.3, 0]}>
            <dodecahedronGeometry args={[0.44, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          <mesh position={[0.3, 0.52, 0.1]}>
            <dodecahedronGeometry args={[0.28, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          <mesh position={[-0.28, 0.44, -0.12]}>
            <dodecahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          {/* Seaweed */}
          <mesh position={[-0.38, 0.5, 0]} rotation={[0.15, 0, 0.2]}>
            <cylinderGeometry args={[0.02, 0.07, 1.0, 4]} />
            <meshStandardMaterial color="#2d7348" roughness={0.7} />
          </mesh>
          <mesh position={[0.42, 0.6, 0.15]} rotation={[-0.1, 0, -0.25]}>
            <cylinderGeometry args={[0.02, 0.05, 1.2, 4]} />
            <meshStandardMaterial color="#3b8c5a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* More sea turtles near front */}
      <SeaTurtle startX={1.5} startZ={8.5} speed={0.7} phase={1.5} />
      <SeaTurtle startX={-7.0} startZ={7.5} speed={0.9} phase={5.0} />

      {/* Coral Reef Clusters & Seaweed Fronds */}
      {corals.map((c, i) => (
        <group key={i} position={[c.x, 0.25, c.z]} scale={c.scale}>
          <mesh position={[0, 0.3, 0]}>
            <dodecahedronGeometry args={[0.42, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          <mesh position={[0.25, 0.48, 0.12]}>
            <dodecahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          <mesh position={[-0.22, 0.4, -0.1]}>
            <dodecahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial color={c.color} roughness={0.8} />
          </mesh>
          {/* Seaweed */}
          <mesh position={[-0.32, 0.42, 0]} rotation={[0.15, 0, 0.25]}>
            <cylinderGeometry args={[0.02, 0.06, 0.85, 4]} />
            <meshStandardMaterial color="#2d7348" roughness={0.7} />
          </mesh>
          <mesh position={[-0.42, 0.52, 0.12]} rotation={[-0.15, 0, -0.2]}>
            <cylinderGeometry args={[0.02, 0.05, 1.05, 4]} />
            <meshStandardMaterial color="#3b8c5a" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Swimming Sea Turtles */}
      <SeaTurtle startX={-4.5} startZ={1.8} speed={0.85} phase={0} />
      <SeaTurtle startX={3.8} startZ={-2.2} speed={0.75} phase={3.1} />

      {/* Scuba Diver */}
      <ScubaDiver />

      {/* Multiple Schools of Swimming Fish */}
      {fishSchools.map((s, idx) => (
        <group
          key={idx}
          ref={(el) => {
            if (el) schoolRefs.current[idx] = el
          }}
          position={[s.cx, 1.5, s.cz]}
        >
          {Array.from({ length: s.count }).map((_, fIdx) => {
            const ox = (fIdx % 3) * 0.28 - 0.28
            const oy = (fIdx % 2) * 0.18 - 0.09
            const oz = Math.floor(fIdx / 3) * 0.28 - 0.28
            return (
              <group key={fIdx} position={[ox, oy, oz]} scale={0.72}>
                <mesh>
                  <coneGeometry args={[0.07, 0.28, 4]} />
                  <meshStandardMaterial color={s.color} roughness={0.25} />
                </mesh>
                <mesh position={[0, 0, -0.16]} rotation={[0, 0, Math.PI / 2]}>
                  <boxGeometry args={[0.012, 0.12, 0.07]} />
                  <meshStandardMaterial color={s.color} />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}
    </group>
  )
}

function ShoreFoam({ radius, seed }: { radius: number; seed: number }) {
  const foamRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!foamRef.current) return
    const t = clock.getElapsedTime() * 1.8 + seed
    const scale = 1 + Math.sin(t) * 0.07
    const opacity = 0.45 + Math.cos(t) * 0.25
    foamRef.current.scale.set(scale, scale, 1)
    const mat = foamRef.current.material as THREE.MeshBasicMaterial
    if (mat) mat.opacity = Math.max(0.15, opacity)
  })

  return (
    <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_Y + 0.02, 0]}>
      <ringGeometry args={[radius * 0.98, radius * 1.25, 28]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────────
   SEAGULLS HUNTING FISH (Circling, Banking & Diving to Water)
   ───────────────────────────────────────────────────────────── */

function HuntingSeagulls() {
  const gullData = useMemo(() => [
    { targetX: -5.5, targetZ: 2.2, radius: 2.8, speed: 1.1, phase: 0 },
    { targetX: 2.5, targetZ: -1.2, radius: 3.2, speed: 0.95, phase: 2.3 },
    { targetX: -1.2, targetZ: 5.2, radius: 2.5, speed: 1.15, phase: 4.1 },
  ], [])

  const gullRefs = useRef<THREE.Group[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    gullData.forEach((g, i) => {
      const el = gullRefs.current[i]
      if (!el) return

      // Full hunt cycle: circle high -> spot fish -> steep dive to water -> scoop fish & ascend
      const cycle = (t * g.speed * 0.5 + g.phase) % (Math.PI * 2)
      const circleAngle = t * 0.65 + g.phase
      const cx = g.targetX + Math.sin(circleAngle) * g.radius
      const cz = g.targetZ + Math.cos(circleAngle) * g.radius

      // Hunting dive:
      // cycle < Math.PI * 1.3: circling high (y ~ 5.5 - 7.5)
      // cycle >= Math.PI * 1.3: swoops down to hit water (y ~ 0.2) and zooms back up
      let y: number
      let divePitch: number
      let flapSpeed: number

      if (cycle < Math.PI * 1.3) {
        // High circling reconnaissance
        y = 6.2 + Math.sin(t * 1.5 + i) * 0.6
        divePitch = 0.05
        flapSpeed = 6
      } else {
        // Diving swoop towards fish!
        const diveProg = (cycle - Math.PI * 1.3) / (Math.PI * 0.7) // 0 to 1
        // Dip down to skim water surface at progress = 0.5
        const dip = Math.sin(diveProg * Math.PI)
        y = 6.2 - dip * 5.8
        // Downward dive pitch, then pull-up pitch
        divePitch = (0.5 - diveProg) * 1.6
        flapSpeed = 12 // Fast frantic flapping during pull-up
      }

      el.position.set(cx, y, cz)

      // Bank angle into circular turn + dive pitch
      const yaw = circleAngle + Math.PI / 2
      const roll = -0.32
      el.rotation.set(divePitch, yaw, roll)

      // Animated wings flapping
      const leftWing = el.children[0]
      const rightWing = el.children[1]
      const flap = Math.sin(t * flapSpeed + i) * 0.55
      if (leftWing) leftWing.rotation.z = flap
      if (rightWing) rightWing.rotation.z = -flap
    })
  })

  return (
    <group>
      {gullData.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) gullRefs.current[i] = el
          }}
          scale={0.85}
        >
          {/* Left Wing (Angled seagull wing) */}
          <group position={[-0.12, 0, 0]}>
            <mesh position={[-0.24, 0, 0]} rotation={[0, 0.2, 0]}>
              <boxGeometry args={[0.45, 0.015, 0.12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </mesh>
            {/* Black wingtip */}
            <mesh position={[-0.45, 0, -0.02]} rotation={[0, 0.3, 0]}>
              <boxGeometry args={[0.16, 0.014, 0.09]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
          </group>

          {/* Right Wing */}
          <group position={[0.12, 0, 0]}>
            <mesh position={[0.24, 0, 0]} rotation={[0, -0.2, 0]}>
              <boxGeometry args={[0.45, 0.015, 0.12]} />
              <meshStandardMaterial color="#ffffff" roughness={0.6} />
            </mesh>
            {/* Black wingtip */}
            <mesh position={[0.45, 0, -0.02]} rotation={[0, -0.3, 0]}>
              <boxGeometry args={[0.16, 0.014, 0.09]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
          </group>

          {/* Seagull Body */}
          <mesh position={[0, 0, 0]}>
            <capsuleGeometry args={[0.07, 0.32, 4, 8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>

          {/* Yellow Beak */}
          <mesh position={[0, -0.02, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.025, 0.14, 4]} />
            <meshStandardMaterial color="#f0a500" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   BOATS, LUXURY YACHTS & FISHING VESSELS
   ───────────────────────────────────────────────────────────── */

function MarineTraffic() {
  const yachtRef = useRef<THREE.Group>(null)
  const fishingRef = useRef<THREE.Group>(null)
  const sailBoatRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // 1. Sleek Modern Luxury Yacht cruising between Cognizant & Motorq
    if (yachtRef.current) {
      const yAngle = t * 0.18 + 1.2
      yachtRef.current.position.set(6.8 + Math.sin(yAngle) * 4.2, WATER_Y + 0.08, 0.5 + Math.cos(yAngle) * 3.5)
      yachtRef.current.rotation.y = yAngle + Math.PI / 2
      // Gentle ship roll in water
      yachtRef.current.rotation.z = Math.sin(t * 1.5) * 0.04
    }

    // 2. Rugged Wooden Fishing Boat trawling near the archipelago route
    if (fishingRef.current) {
      const fAngle = t * 0.14 + 3.8
      fishingRef.current.position.set(-2.5 + Math.sin(fAngle) * 5.0, WATER_Y + 0.06, 3.2 + Math.cos(fAngle) * 3.8)
      fishingRef.current.rotation.y = fAngle + Math.PI / 2
      fishingRef.current.rotation.z = Math.cos(t * 1.8) * 0.06
    }

    // 3. Elegant White Sailboat / Private Yacht near Architecture College
    if (sailBoatRef.current) {
      const sAngle = t * 0.16 + 0.4
      sailBoatRef.current.position.set(-1.8 + Math.sin(sAngle) * 4.5, WATER_Y + 0.06, -2.8 + Math.cos(sAngle) * 3.2)
      sailBoatRef.current.rotation.y = sAngle + Math.PI / 2
      sailBoatRef.current.rotation.z = Math.sin(t * 1.6) * 0.07
    }
  })

  return (
    <group>
      {/* ── Luxury Motor Yacht ── */}
      <group ref={yachtRef} scale={0.72}>
        {/* Sleek V-Hull */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.55, 0.28, 1.7]} />
          <meshStandardMaterial color="#f8f9fa" metalness={0.2} roughness={0.2} />
        </mesh>
        {/* Pointed Yacht Bow */}
        <mesh position={[0, 0.14, 0.95]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.26, 0.5, 3]} />
          <meshStandardMaterial color="#f8f9fa" metalness={0.2} roughness={0.2} />
        </mesh>
        {/* Dark Hull Stripe */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.57, 0.06, 1.65]} />
          <meshStandardMaterial color="#1a2d42" />
        </mesh>
        {/* Luxury Flybridge Superstructure */}
        <mesh position={[0, 0.38, -0.15]}>
          <boxGeometry args={[0.42, 0.26, 0.85]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Tinted Panoramic Salon Windows */}
        <mesh position={[0, 0.38, -0.05]}>
          <boxGeometry args={[0.44, 0.14, 0.7]} />
          <meshStandardMaterial color="#2d4253" metalness={0.8} roughness={0.1} />
        </mesh>
        {/* Radar Arch */}
        <mesh position={[0, 0.62, -0.38]}>
          <boxGeometry args={[0.38, 0.18, 0.06]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Wake froth */}
        <mesh position={[0, -0.05, -0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* ── Classic Working Fishing Boat (Trawler) ── */}
      <group ref={fishingRef} scale={0.65}>
        {/* Weathered Wooden Hull */}
        <mesh position={[0, 0.16, 0]}>
          <boxGeometry args={[0.6, 0.32, 1.4]} />
          <meshStandardMaterial color="#944835" roughness={0.8} />
        </mesh>
        {/* Bow */}
        <mesh position={[0, 0.16, 0.78]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.28, 0.45, 3]} />
          <meshStandardMaterial color="#944835" roughness={0.8} />
        </mesh>
        {/* White Wheelhouse Cabin */}
        <mesh position={[0, 0.42, -0.2]}>
          <boxGeometry args={[0.44, 0.36, 0.48]} />
          <meshStandardMaterial color="#e8ece9" roughness={0.5} />
        </mesh>
        {/* Wheelhouse Windows */}
        <mesh position={[0, 0.44, 0.05]}>
          <boxGeometry args={[0.36, 0.12, 0.03]} />
          <meshStandardMaterial color="#354955" />
        </mesh>
        {/* Trawler Crane / Mast */}
        <mesh position={[0, 0.65, 0.25]}>
          <cylinderGeometry args={[0.02, 0.03, 0.8, 6]} />
          <meshStandardMaterial color="#4a3e35" />
        </mesh>
        {/* Fishing Net Rigging Boom */}
        <mesh position={[0, 0.85, 0.1]} rotation={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.65, 6]} />
          <meshStandardMaterial color="#4a3e35" />
        </mesh>
      </group>

      {/* ── Private Sailboat with Tall White Sail ── */}
      <group ref={sailBoatRef} scale={0.65}>
        {/* Teak & Fiberglass Hull */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.48, 0.26, 1.3]} />
          <meshStandardMaterial color="#f0f3f5" roughness={0.3} />
        </mesh>
        {/* Pointed Bow */}
        <mesh position={[0, 0.14, 0.72]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.22, 0.42, 3]} />
          <meshStandardMaterial color="#f0f3f5" />
        </mesh>
        {/* Tall Sail Mast */}
        <mesh position={[0, 0.95, 0.08]}>
          <cylinderGeometry args={[0.02, 0.03, 1.75, 6]} />
          <meshStandardMaterial color="#61676b" metalness={0.4} />
        </mesh>
        {/* Main White Canvas Sail */}
        <mesh position={[0, 1.05, -0.28]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.01, 1.3, 0.65]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   DIVING DOLPHINS
   ───────────────────────────────────────────────────────────── */

function DolphinMesh({ flex }: { flex: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const baseGeo = useMemo(() => {
    const profile: [number, number][] = [
      [0.015, 0.55],
      [0.038, 0.48],
      [0.075, 0.40],
      [0.125, 0.32],
      [0.155, 0.20],
      [0.160, 0.08],
      [0.145, -0.06],
      [0.120, -0.18],
      [0.085, -0.30],
      [0.055, -0.40],
      [0.035, -0.48],
      [0.012, -0.54],
    ]
    const pts = profile.map(([r, y]) => new THREE.Vector2(r, y))
    const g = new THREE.LatheGeometry(pts, 20)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position
    const basePos = baseGeo.attributes.position

    for (let i = 0; i < pos.count; i++) {
      const bx = basePos.getX(i)
      const by = basePos.getY(i)
      const bz = basePos.getZ(i)
      const x = bx * 0.72
      const bend = -Math.cos(bz * 3.1) * flex * 0.28
      pos.setXYZ(i, x, by + bend, bz)
    }
    pos.needsUpdate = true
    meshRef.current.geometry.computeVertexNormals()
  })

  return (
    <group scale={0.78}>
      <mesh ref={meshRef} geometry={baseGeo.clone()} castShadow>
        <meshStandardMaterial color="#355563" roughness={0.25} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.17, -0.04]} rotation={[-0.55, 0, 0]} castShadow>
        <coneGeometry args={[0.045, 0.22, 5]} />
        <meshStandardMaterial color="#27414d" roughness={0.3} />
      </mesh>
      <mesh position={[0.13, -0.04, 0.15]} rotation={[0.25, 0.45, -0.85]} castShadow>
        <boxGeometry args={[0.018, 0.18, 0.08]} />
        <meshStandardMaterial color="#27414d" />
      </mesh>
      <mesh position={[-0.13, -0.04, 0.15]} rotation={[0.25, -0.45, 0.85]} castShadow>
        <boxGeometry args={[0.018, 0.18, 0.08]} />
        <meshStandardMaterial color="#27414d" />
      </mesh>
      <group position={[0, -0.06 - flex * 0.15, -0.52]}>
        <mesh position={[0.11, 0, -0.04]} rotation={[0, -0.38, 0.08]}>
          <boxGeometry args={[0.15, 0.014, 0.08]} />
          <meshStandardMaterial color="#27414d" />
        </mesh>
        <mesh position={[-0.11, 0, -0.04]} rotation={[0, 0.38, -0.08]}>
          <boxGeometry args={[0.15, 0.014, 0.08]} />
          <meshStandardMaterial color="#27414d" />
        </mesh>
      </group>
    </group>
  )
}

function DivingDolphins() {
  const dolphinData = useMemo(() => [
    { startX: -6.5, startZ: 2.5, radius: 3.4, speed: 0.9, phase: 0 },
    { startX: 4.5, startZ: -3.2, radius: 3.6, speed: 0.82, phase: 2.1 },
    { startX: -1.0, startZ: 6.8, radius: 3.0, speed: 0.95, phase: 4.2 },
  ], [])

  const dolphinRefs = useRef<THREE.Group[]>([])
  const [flexVals, setFlexVals] = useState<number[]>([0, 0, 0])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const newFlex: number[] = []

    dolphinData.forEach((d, i) => {
      const g = dolphinRefs.current[i]
      if (!g) return

      const cycle = (t * d.speed + d.phase) % (Math.PI * 2)
      const trackAngle = t * 0.22 + d.phase
      const cx = d.startX + Math.sin(trackAngle) * d.radius
      const cz = d.startZ + Math.cos(trackAngle) * d.radius

      let y: number
      let pitch: number
      let flexFactor: number

      if (cycle < Math.PI) {
        const underwaterProgress = cycle / Math.PI
        y = WATER_Y - 0.7 + Math.sin(underwaterProgress * Math.PI) * 0.45
        pitch = 0.25 * Math.cos(underwaterProgress * Math.PI)
        flexFactor = 0.1
      } else {
        const airProgress = (cycle - Math.PI) / Math.PI
        const leapArc = Math.sin(airProgress * Math.PI)
        y = WATER_Y + leapArc * 1.35
        pitch = (0.5 - airProgress) * 1.9
        flexFactor = leapArc * 1.2
      }

      newFlex.push(flexFactor)
      g.position.set(cx, y, cz)
      const yaw = trackAngle + Math.PI / 2
      g.rotation.set(pitch, yaw, 0)
    })

    setFlexVals(newFlex)
  })

  return (
    <group>
      {dolphinData.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) dolphinRefs.current[i] = el
          }}
        >
          <DolphinMesh flex={flexVals[i] || 0} />
        </group>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   ORGANIC BLOB ISLANDS (Scaled to Years Spent!)
   ───────────────────────────────────────────────────────────── */

function OrganicIsland({
  index,
  radius,
  selected = false,
}: {
  index: number
  radius: number
  selected?: boolean
}) {
  const { grassGeo, cliffGeo } = useMemo(() => {
    const shapeSeed = index * 1.37
    const blobPoints = 26

    const gTop = new THREE.CylinderGeometry(radius, radius * 0.94, 0.45, blobPoints, 4)
    const pTop = gTop.attributes.position

    for (let i = 0; i < pTop.count; i++) {
      const x = pTop.getX(i)
      const z = pTop.getZ(i)
      const y = pTop.getY(i)
      const angle = Math.atan2(z, x)
      const dist = Math.sqrt(x * x + z * z)

      const blobFactor =
        1 +
        Math.sin(angle * 3 + shapeSeed) * 0.18 +
        Math.cos(angle * 2 - shapeSeed * 1.5) * 0.12 +
        Math.sin(angle * 5 + index) * 0.08

      pTop.setX(i, x * blobFactor)
      pTop.setZ(i, z * blobFactor)

      if (y > 0.05) {
        const hill =
          Math.sin(x * 1.6 + shapeSeed) * 0.08 +
          Math.cos(z * 1.8) * 0.07 +
          Math.max(0, 1 - dist / radius) * 0.18
        pTop.setY(i, y + hill)
      }
    }
    gTop.computeVertexNormals()

    const gCliff = new THREE.CylinderGeometry(radius * 0.94, radius * 0.28, 1.5, blobPoints, 4)
    const pCliff = gCliff.attributes.position

    for (let i = 0; i < pCliff.count; i++) {
      const x = pCliff.getX(i)
      const z = pCliff.getZ(i)
      const y = pCliff.getY(i)
      const angle = Math.atan2(z, x)
      const blobFactor =
        1 +
        Math.sin(angle * 3 + shapeSeed) * 0.18 +
        Math.cos(angle * 2 - shapeSeed * 1.5) * 0.12

      const crag = 1 + Math.sin(y * 8 + angle * 4) * 0.12
      pCliff.setX(i, x * blobFactor * crag)
      pCliff.setZ(i, z * blobFactor * crag)
    }
    gCliff.computeVertexNormals()

    return { grassGeo: gTop, cliffGeo: gCliff }
  }, [index, radius])

  return (
    <group>
      <ShoreFoam radius={radius} seed={index} />
      <mesh geometry={grassGeo} position={[0, 0.48, 0]} receiveShadow castShadow>
        <meshStandardMaterial
          color={selected ? "#9fcb88" : "#86af72"}
          roughness={0.9}
          flatShading
        />
      </mesh>
      <mesh geometry={cliffGeo} position={[0, -0.35, 0]} castShadow>
        <meshStandardMaterial color="#8a735c" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[radius * 1.04, radius * 0.98, 0.12, 26]} />
        <meshStandardMaterial color="#decba4" roughness={0.9} />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.78, 0]}>
          <ringGeometry args={[radius + 0.12, radius + 0.26, 36]} />
          <meshBasicMaterial color="#ffe885" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   TREES & BOTANICAL LIFE PROPORTIONAL TO ISLAND SIZE
   ───────────────────────────────────────────────────────────── */

function RealisticTree({
  position,
  scale = 1,
  type = "pine",
}: {
  position: [number, number, number]
  scale?: number
  type?: "pine" | "oak"
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.06, 0.38, 6]} />
        <meshStandardMaterial color="#66462c" roughness={0.9} />
      </mesh>
      {type === "pine" ? (
        <>
          <mesh position={[0, 0.32, 0]} castShadow>
            <coneGeometry args={[0.26, 0.32, 6]} />
            <meshStandardMaterial color="#3d6840" flatShading roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow>
            <coneGeometry args={[0.21, 0.28, 6]} />
            <meshStandardMaterial color="#49784c" flatShading roughness={0.8} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, 0.44, 0]} castShadow>
          <dodecahedronGeometry args={[0.26, 1]} />
          <meshStandardMaterial color="#517e47" flatShading roughness={0.85} />
        </mesh>
      )}
    </group>
  )
}

function IslandFlora({ index, radius }: { index: number; radius: number }) {
  const flora = useMemo(() => {
    const items: Array<{
      pos: [number, number, number]
      scale: number
      type: "pine" | "oak"
    }> = []

    // Tiny island gets 1 tree, large island (home & school) gets lush grove of 6 trees
    const count = Math.max(1, Math.round(radius * 2.2))

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + index * 0.9
      const dist = radius * (0.58 + (i % 3) * 0.12)
      const x = Math.cos(angle) * dist
      const z = Math.sin(angle) * dist
      items.push({
        pos: [x, 0.68, z],
        scale: 0.75 + ((i + index) % 3) * 0.14,
        type: i % 2 === 0 ? "oak" : "pine",
      })
    }
    return items
  }, [index, radius])

  return (
    <>
      {flora.map((item, i) => (
        <RealisticTree key={i} position={item.pos} scale={item.scale} type={item.type} />
      ))}
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   STAGE ARCHITECTURAL BUILDINGS
   ───────────────────────────────────────────────────────────── */

function StageBuilding({ landmark, selected }: { landmark: WorldLandmark; selected: boolean }) {
  const y = 0.68
  const warmHighlight = selected ? "#ffdf79" : "#ffffff"

  // 01: HOSPITAL (Tiny Island - 1 week birth)
  if (landmark.id === "hospital") {
    return (
      <group position={[0, y, 0]} scale={0.75}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.65, 0.85, 0.55]} />
          <meshStandardMaterial color="#eef2eb" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.72, 0.29]}>
          <boxGeometry args={[0.12, 0.3, 0.03]} />
          <meshStandardMaterial color="#d94336" />
        </mesh>
        <mesh position={[0, 0.72, 0.29]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.12, 0.3, 0.03]} />
          <meshStandardMaterial color="#d94336" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 14]} />
          <meshStandardMaterial color="#707974" />
        </mesh>
      </group>
    )
  }

  // 02: HOME & SCHOOL COMBINED (Grand Island - 18 Formative Years: House + Academy Clock Tower + Playground)
  if (landmark.id === "home-school") {
    return (
      <group position={[0, y, 0]}>
        {/* Childhood Home Cottage */}
        <group position={[-0.75, 0, -0.1]}>
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.62, 0.7, 0.58]} />
            <meshStandardMaterial color="#edd4a6" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.52, 0.45, 4]} />
            <meshStandardMaterial color="#b35436" roughness={0.6} />
          </mesh>
          <mesh position={[0.2, 0.88, 0.1]} castShadow>
            <boxGeometry args={[0.12, 0.38, 0.12]} />
            <meshStandardMaterial color="#884433" />
          </mesh>
          {/* Chimney smoke */}
          <mesh position={[0.22, 1.15, 0.1]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
          {/* Warm Home Window */}
          <mesh position={[-0.15, 0.38, 0.3]}>
            <boxGeometry args={[0.14, 0.16, 0.02]} />
            <meshBasicMaterial color={warmHighlight} />
          </mesh>
        </group>

        {/* School Main Academy Hall & Clock Tower */}
        <group position={[0.65, 0, 0.1]}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.95, 0.82, 0.6]} />
            <meshStandardMaterial color="#b85f43" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.92, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.6, 0.4, 4]} />
            <meshStandardMaterial color="#4a5550" />
          </mesh>
          {/* Academy Clock Spire */}
          <mesh position={[0.34, 0.82, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 1.4, 6]} />
            <meshStandardMaterial color="#d4b47e" />
          </mesh>
          <mesh position={[0.34, 1.58, 0]} castShadow>
            <coneGeometry args={[0.18, 0.45, 6]} />
            <meshStandardMaterial color="#36453f" />
          </mesh>
          <mesh position={[0.34, 1.28, 0.18]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 12]} />
            <meshStandardMaterial color="#f7f7f0" />
          </mesh>
        </group>

        {/* Paved path connecting home to school */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.2, 0.28]} />
          <meshStandardMaterial color="#d6ba8f" />
        </mesh>
      </group>
    )
  }

  // 03: ARCHITECTURE COLLEGE (5 Years - Monumental Colonnade & Large Drafting Quad)
  if (landmark.id === "architecture-college") {
    return (
      <group position={[0, y, 0]} scale={1.12}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <boxGeometry args={[1.15, 0.26, 0.85]} />
          <meshStandardMaterial color="#dfd8cb" roughness={0.6} />
        </mesh>
        {[-0.42, -0.14, 0.14, 0.42].map((px, i) => (
          <mesh key={i} position={[px, 0.46, 0.32]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.46, 8]} />
            <meshStandardMaterial color="#eee8dc" />
          </mesh>
        ))}
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[1.05, 0.5, 0.78]} />
          <meshStandardMaterial color="#c2b49d" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.08, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.58, 0.42, 4]} />
          <meshStandardMaterial color="#6893a4" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
    )
  }

  // 04: SPACESCAPE ARCHITECTS (2 Years - Studio with Monopitch Roof & Deck)
  if (landmark.id === "spacescape") {
    return (
      <group position={[0, y, 0]}>
        <mesh position={[-0.1, 0.35, 0]} castShadow>
          <boxGeometry args={[0.62, 0.7, 0.55]} />
          <meshStandardMaterial color="#f0ece1" roughness={0.5} />
        </mesh>
        <mesh position={[-0.1, 0.76, 0]} rotation={[0.22, 0, -0.25]} castShadow>
          <boxGeometry args={[0.72, 0.08, 0.64]} />
          <meshStandardMaterial color="#303838" />
        </mesh>
        <mesh position={[0.08, 0.36, 0.22]}>
          <boxGeometry args={[0.26, 0.52, 0.16]} />
          <meshStandardMaterial color="#558899" roughness={0.1} metalness={0.6} />
        </mesh>
        <mesh position={[0.3, 0.14, 0]} castShadow>
          <boxGeometry args={[0.42, 0.1, 0.55]} />
          <meshStandardMaterial color="#8a5b3a" roughness={0.8} />
        </mesh>
      </group>
    )
  }

  // 05: WARP ARCHITECTS (1.5 Years - Cantilevered Folded Workshop)
  if (landmark.id === "warp") {
    return (
      <group position={[0, y, 0]} scale={0.92}>
        <mesh position={[0, 0.26, 0]} castShadow>
          <boxGeometry args={[0.65, 0.52, 0.58]} />
          <meshStandardMaterial color="#2d3536" roughness={0.6} />
        </mesh>
        <mesh position={[0.14, 0.68, 0.08]} rotation={[0.1, 0.35, -0.15]} castShadow>
          <boxGeometry args={[0.55, 0.48, 0.55]} />
          <meshStandardMaterial color="#d49b57" roughness={0.7} />
        </mesh>
        <mesh position={[0.16, 0.68, 0.35]} rotation={[0.1, 0.35, -0.15]}>
          <boxGeometry args={[0.38, 0.32, 0.03]} />
          <meshStandardMaterial color="#407788" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>
    )
  }

  // 06: DESIGN COLLEGE (2 Years - Industrial Sawtooth Roof Lab)
  if (landmark.id === "design-college") {
    return (
      <group position={[0, y, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.9, 0.64, 0.58]} />
          <meshStandardMaterial color="#b2bac2" roughness={0.5} />
        </mesh>
        {[-0.26, 0.04, 0.34].map((rx, i) => (
          <group key={i} position={[rx, 0.72, 0]}>
            <mesh rotation={[0, 0, 0.6]} position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.26, 0.05, 0.56]} />
              <meshStandardMaterial color="#ea7a38" />
            </mesh>
            <mesh position={[-0.07, 0, 0]}>
              <boxGeometry args={[0.04, 0.16, 0.54]} />
              <meshStandardMaterial color="#7ab0c4" roughness={0.1} />
            </mesh>
          </group>
        ))}
      </group>
    )
  }

  // 07: COGNIZANT (1.5 Years - Twin Corporate Towers with Skybridge)
  if (landmark.id === "cognizant") {
    return (
      <group position={[0, y, 0]} scale={0.92}>
        <mesh position={[-0.24, 0.68, 0]} castShadow>
          <boxGeometry args={[0.42, 1.35, 0.48]} />
          <meshStandardMaterial color="#2c5e7a" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0.24, 0.52, 0]} castShadow>
          <boxGeometry args={[0.38, 1.05, 0.44]} />
          <meshStandardMaterial color="#356d8c" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.24, 0.18, 0.28]} />
          <meshStandardMaterial color="#9cbcd1" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  // 08: MOTORQ (3 Years - Connected Vehicle IoT Intelligence Hub)
  return (
    <group position={[0, y, 0]} scale={1.05}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.68, 1.1, 0.58]} />
        <meshStandardMaterial color="#e6a44c" roughness={0.4} />
      </mesh>
      <mesh position={[0.38, 0.42, 0.05]} castShadow>
        <boxGeometry args={[0.36, 0.84, 0.45]} />
        <meshStandardMaterial color="#2e649e" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.55, 0.38, 4]} />
        <meshStandardMaterial color="#316358" />
      </mesh>
      <mesh position={[-0.22, 1.25, 0]} rotation={[0.4, 0.3, 0]}>
        <cylinderGeometry args={[0.18, 0.02, 0.06, 14]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} />
      </mesh>
      <mesh position={[-0.22, 1.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
        <meshStandardMaterial color="#55605b" />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   CHRONOLOGICAL SEA ROUTE (Hospital -> Home -> Arch College ->
   Spacescape -> WARP -> Design College -> Cognizant -> Motorq)
   ───────────────────────────────────────────────────────────── */

function ArchipelagoRoute() {
  const { routeGeo, wakeGeo } = useMemo(() => {
    // Exact chronological waypoint sequence
    const chronologicalOrder = [
      "hospital",
      "home-school",
      "architecture-college",
      "spacescape",
      "warp",
      "design-college",
      "cognizant",
      "motorq",
    ]

    const pts = chronologicalOrder
      .map((id) => {
        const lm = worldLandmarks.find((l) => l.id === id)
        if (!lm) return null
        const [x, , z] = islandPosition(lm)
        return new THREE.Vector3(x, WATER_Y + 0.05, z)
      })
      .filter((p): p is THREE.Vector3 => p !== null)

    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5)

    // Golden luminous nautical path
    const tube = new THREE.TubeGeometry(curve, 160, 0.048, 8, false)

    // Soft water wake / light glow ribbon beneath the line
    const wake = new THREE.TubeGeometry(curve, 140, 0.095, 6, false)

    return { routeGeo: tube, wakeGeo: wake }
  }, [])

  return (
    <group>
      {/* Outer soft wake glow */}
      <mesh geometry={wakeGeo}>
        <meshStandardMaterial
          color="#ffdf88"
          roughness={0.9}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Luminous navigational path */}
      <mesh geometry={routeGeo}>
        <meshStandardMaterial
          color="#f5a623"
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   ISLAND COMBINED COMPONENT
   ───────────────────────────────────────────────────────────── */

function IslandLandmark({
  landmark,
  index,
  selected,
  onSelect,
}: {
  landmark: WorldLandmark
  index: number
  selected: boolean
  onSelect: () => void
}) {
  const pos = islandPosition(landmark)
  const radius = getIslandRadius(landmark.yearsSpent)

  return (
    <group position={pos} onClick={(e) => { e.stopPropagation(); onSelect() }}>
      <OrganicIsland index={index} radius={radius} selected={selected} />
      <StageBuilding landmark={landmark} selected={selected} />
      <IslandFlora index={index} radius={radius} />

      <Html position={[0, 2.15, 0]} center sprite={false} style={{ pointerEvents: "none" }} zIndexRange={[2, 0]}>
        <span className={`world-3d-label${selected ? " is-selected" : ""}`}>
          <b>{landmark.number}</b>
          {landmark.title}
        </span>
      </Html>
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   CAMERA CONTROLLER
   ───────────────────────────────────────────────────────────── */

function CameraController({
  targetPos,
  zoom,
}: {
  targetPos: [number, number, number]
  zoom: number
}) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const camera = useThree((s) => s.camera) as THREE.OrthographicCamera
  const target = useMemo(() => new THREE.Vector3(...targetPos), [targetPos])
  const animating = useRef(false)

  useEffect(() => {
    animating.current = true
  }, [targetPos, zoom])

  useFrame(() => {
    if (!controls) return
    const d = controls.target.distanceTo(target)
    const zd = Math.abs(camera.zoom - zoom)

    if (d > 0.02 || zd > 0.2) {
      controls.target.lerp(target, 0.065)
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoom, 0.065)
      camera.updateProjectionMatrix()
      controls.update()
    } else if (animating.current) {
      controls.target.copy(target)
      camera.zoom = zoom
      camera.updateProjectionMatrix()
      controls.update()
      animating.current = false
    }
  })

  return null
}

/* ─────────────────────────────────────────────────────────────
   BACKDROP: MAJESTIC MOUNTAINS
   ───────────────────────────────────────────────────────────── */

function Mountains() {
  const peaks = useMemo<[number, number, number, number, number, string][]>(() => [
    [-22, 0, -14, 5.5, 12, "#7a9b72"],
    [-13, 0, -16, 7, 15, "#688d60"],
    [-4, 0, -18, 5, 11, "#7d9e75"],
    [5, 0, -15, 7.5, 16, "#688d60"],
    [14, 0, -17, 6, 13, "#7a9b72"],
    [23, 0, -14, 4.5, 10, "#82a17a"],
    [-16, 0, -22, 9, 18, "#8aaa82"],
    [0, 0, -24, 10, 21, "#86a67e"],
    [17, 0, -21, 8, 15, "#8aaa82"],
  ], [])

  return (
    <group>
      {peaks.map(([x, , z, r, h, c], i) => (
        <group key={i}>
          <mesh position={[x, h / 2, z]}>
            <coneGeometry args={[r, h, 7]} />
            <meshStandardMaterial color={c} flatShading />
          </mesh>
          {h > 12 && (
            <mesh position={[x, h * 0.82, z]}>
              <coneGeometry args={[r * 0.3, h * 0.2, 7]} />
              <meshStandardMaterial color="#e4ece0" flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   3D SCENE ROOT
   ───────────────────────────────────────────────────────────── */

function WorldScene({
  selectedId,
  onSelect,
  controlsRef,
}: {
  selectedId: string | null
  onSelect: (id: string | null) => void
  controlsRef: React.RefObject<OrbitControlsImpl | null>
}) {
  const camTarget = useMemo<[number, number, number]>(() => {
    const sel = worldLandmarks.find((l) => l.id === selectedId)
    if (!sel) return [0, 0, 0]
    const [x, y, z] = islandPosition(sel)
    return [x + 0.8, y, z]
  }, [selectedId])

  const camZoom = selectedId ? FOCUSED_ZOOM : OVERVIEW_ZOOM

  return (
    <>
      {/* Sky background — the Canvas CSS gradient handles the underwater bottom area */}
      <fog attach="fog" args={["#b8cdd8", 24, 55]} />

      {/* Horizontal ocean fill planes below the water surface to prevent the sky
          background colour showing through at the bottom of the canvas */}
      {/* Close-to-camera front fill */}
      <mesh position={[0, -1.5, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 30]} />
        <meshStandardMaterial color="#12404e" roughness={1} />
      </mesh>
      {/* Wide mid-scene fill */}
      <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0d3040" roughness={1} />
      </mesh>
      <ambientLight intensity={1.5} color="#fff8e7" />
      <directionalLight
        castShadow
        position={[-8, 14, 10]}
        intensity={2.7}
        color="#fff1cc"
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight intensity={0.65} color="#cce7ff" groundColor="#5b8658" />

      <AnimatedOcean />
      <UnderWaterRealm />
      <Mountains />

      {/* Living Sea: Hunting Seagulls, Diving Dolphins & Ships */}
      <HuntingSeagulls />
      <DivingDolphins />
      <MarineTraffic />

      <ArchipelagoRoute />

      {worldLandmarks.map((lm, index) => (
        <IslandLandmark
          key={lm.id}
          index={index}
          landmark={lm}
          selected={selectedId === lm.id}
          onSelect={() => onSelect(selectedId === lm.id ? null : lm.id)}
        />
      ))}

      <CameraController targetPos={camTarget} zoom={camZoom} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 3.0} // Prevents camera from dipping below the waterline
        minDistance={6}
        maxDistance={26}
        dampingFactor={0.08}
        enableDamping
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   WORLD MAP MAIN EXPORT
   ───────────────────────────────────────────────────────────── */

export function WorldMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const selectedLandmark = worldLandmarks.find((lm) => lm.id === selectedId)
  const relatedProjects = selectedLandmark
    ? site.caseStudies.filter((p) => selectedLandmark.relatedProjectIds?.includes(p.slug))
    : []

  return (
    <section className="world-section" id="journey" aria-labelledby="world-title">
      <div className="world-section-intro">
        <div>
          <p className="world-kicker">A personal atlas</p>
          <h2 id="world-title">The part of the map I've explored so far.</h2>
        </div>
        <p>Drag to explore and select a landmark to open its story.</p>
      </div>
      <div className="world-layout">
        <div className="world-map-frame world-3d-frame">
          <div className="world-map-toolbar">
            <span>Vishnu's world</span>
            <span>Drag to explore · Select a landmark</span>
          </div>

          <Canvas
            shadows
            orthographic
            camera={{ position: [10, 10, 13], zoom: OVERVIEW_ZOOM, near: 1, far: 100 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true }}
            onPointerMissed={() => setSelectedId(null)}
            style={{ background: "linear-gradient(to bottom, #b8cdd8 50%, #174d5a 74%, #0d3040 100%)" }}
            fallback={
              <div className="world-webgl-fallback">
                Your browser could not load the interactive world. Use the journey list below or
                continue to selected work.
              </div>
            }
          >
            <WorldScene selectedId={selectedId} onSelect={setSelectedId} controlsRef={controlsRef} />
          </Canvas>

          {selectedLandmark && (
            <div className="world-map-overlay-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className="world-island-detail-number">{selectedLandmark.number}</span>
                <button
                  type="button"
                  className="world-overlay-close"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close stage details"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="world-island-detail-category">{selectedLandmark.category} chapter</p>
              <h3>{selectedLandmark.title}</h3>
              {selectedLandmark.dateRange && (
                <p className="world-island-detail-date">{selectedLandmark.dateRange}</p>
              )}
              <p className="world-island-detail-desc">{selectedLandmark.description}</p>
              {relatedProjects.length > 0 && (
                <div className="world-island-detail-links">
                  <span>Selected work</span>
                  {relatedProjects.map((p) => (
                    <ButtonLink
                      key={p.slug}
                      href={`project.html?slug=${encodeURIComponent(p.slug)}`}
                      variant="outline"
                    >
                      {p.title}
                      <ArrowUpRight size={14} />
                    </ButtonLink>
                  ))}
                </div>
              )}
            </div>
          )}

          <button type="button" className="world-reset" onClick={() => setSelectedId(null)}>
            <RotateCcw size={14} /> Overview
          </button>
          <nav className="world-journey-list" aria-label="Journey landmarks">
            {worldLandmarks.map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => setSelectedId(lm.id)}
                aria-pressed={selectedId === lm.id}
              >
                {lm.number} <span>{lm.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}

export function WorldHero() {
  return (
    <section className="world-hero" aria-labelledby="world-hero-title">
      <div className="world-hero-copy">
        <p className="world-kicker">Vishnu Priyan A J · Product Designer</p>
        <h1 id="world-hero-title">Life is an unexplored map.</h1>
        <p>Here's the part I've explored so far.</p>
        <div className="world-hero-actions">
          <ButtonLink href="#case-studies">View selected work</ButtonLink>
          <a className="world-secondary-action" href="#journey">Explore my journey</a>
        </div>
      </div>
      <div className="world-hero-compass" aria-hidden="true">
        <Compass size={24} />
        <span>North is wherever curiosity leads.</span>
      </div>
    </section>
  )
}
