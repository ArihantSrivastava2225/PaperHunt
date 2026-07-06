import { useEffect, useRef } from "react";
import * as THREE from "three";

type ResearchNetworkSceneProps = {
  className?: string;
};

const nodes = [
  { label: "Papers", color: "#2563eb", position: [-2.1, 1.0, 0.2] },
  { label: "AI Scout", color: "#0891b2", position: [2.0, 1.12, -0.4] },
  { label: "News", color: "#0f766e", position: [-1.55, -1.15, -0.2] },
  { label: "Library", color: "#7c3aed", position: [1.55, -1.04, 0.3] },
  { label: "Opportunities", color: "#d97706", position: [0.2, 1.95, -0.6] },
] as const;

const createLabelTexture = (title: string, accent: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.strokeStyle = "rgba(148, 163, 184, 0.65)";
  ctx.lineWidth = 3;

  const radius = 34;
  ctx.beginPath();
  ctx.moveTo(radius, 12);
  ctx.lineTo(canvas.width - radius, 12);
  ctx.quadraticCurveTo(canvas.width - 12, 12, canvas.width - 12, radius);
  ctx.lineTo(canvas.width - 12, canvas.height - radius);
  ctx.quadraticCurveTo(canvas.width - 12, canvas.height - 12, canvas.width - radius, canvas.height - 12);
  ctx.lineTo(radius, canvas.height - 12);
  ctx.quadraticCurveTo(12, canvas.height - 12, 12, canvas.height - radius);
  ctx.lineTo(12, radius);
  ctx.quadraticCurveTo(12, 12, radius, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.fillRect(48, 54, 94, 10);

  ctx.fillStyle = "#0f172a";
  ctx.font = "700 44px Inter, Arial, sans-serif";
  ctx.fillText(title, 48, 128);

  ctx.fillStyle = "#64748b";
  ctx.font = "500 24px Inter, Arial, sans-serif";
  ctx.fillText("Research signal", 48, 172);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
};

const disposeMaterial = (material: THREE.Material) => {
  const mappedMaterial = material as THREE.Material & { map?: THREE.Texture };
  mappedMaterial.map?.dispose();
  material.dispose();
};

const ResearchNetworkScene = ({ className = "" }: ResearchNetworkSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
    } catch (error) {
      console.error("Unable to initialize research network scene:", error);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    renderer.setClearColor(0xffffff, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const group = new THREE.Group();
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 2.2));

    const keyLight = new THREE.PointLight(0x38bdf8, 28, 16);
    keyLight.position.set(2.5, 3.5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x2563eb, 12, 14);
    rimLight.position.set(-3.5, -2.5, 4);
    scene.add(rimLight);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.54, 2),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.28,
        metalness: 0.35,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.25,
      }),
    );
    group.add(core);

    const glow = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.82, 2),
      new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.12,
        wireframe: true,
      }),
    );
    group.add(glow);

    const nodeGeometry = new THREE.SphereGeometry(0.16, 28, 28);
    const linePositions: number[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    nodes.forEach((node) => {
      const position = new THREE.Vector3(...node.position);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.24,
        metalness: 0.15,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.35,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(position);
      group.add(mesh);
      nodeMeshes.push(mesh);

      linePositions.push(0, 0, 0, position.x, position.y, position.z);
    });

    const nodeVectors = nodes.map((node) => new THREE.Vector3(...node.position));
    for (let i = 0; i < nodeVectors.length; i += 1) {
      const current = nodeVectors[i];
      const next = nodeVectors[(i + 2) % nodeVectors.length];
      linePositions.push(current.x, current.y, current.z, next.x, next.y, next.z);
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.24,
      }),
    );
    group.add(lines);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.012, 16, 128),
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
        transparent: true,
        opacity: 0.22,
      }),
    );
    ring.rotation.x = Math.PI / 2.7;
    ring.rotation.y = -0.34;
    group.add(ring);

    const labelGeometry = new THREE.PlaneGeometry(1.16, 0.58);
    const labelMeshes: THREE.Mesh[] = [];
    const labelOffsets: [number, number, number][] = [
      [-2.28, 1.34, 0.34],
      [2.12, 1.36, -0.12],
      [-1.88, -1.46, 0.1],
      [1.86, -1.38, 0.28],
      [0.28, 2.22, -0.38],
    ];

    nodes.forEach((node, index) => {
      const texture = createLabelTexture(node.label, node.color);
      if (!texture) return;

      const label = new THREE.Mesh(
        labelGeometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        }),
      );
      label.position.set(...labelOffsets[index]);
      label.rotation.y = index % 2 === 0 ? 0.18 : -0.2;
      group.add(label);
      labelMeshes.push(label);
    });

    const particlePositions: number[] = [];
    for (let i = 0; i < 140; i += 1) {
      particlePositions.push(
        (Math.random() - 0.5) * 6.8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 2.2,
      );
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x7dd3fc,
        transparent: true,
        opacity: 0.45,
        size: 0.028,
        sizeAttenuation: true,
      }),
    );
    group.add(particles);

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      const compact = width < 768;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      group.position.set(compact ? 0.04 : 0.55, compact ? -0.25 : 0.08, compact ? -0.3 : 0);
      group.scale.setScalar(compact ? 0.62 : 0.88);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("pointermove", handlePointerMove);
    resize();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let animationFrame = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      group.rotation.y = elapsed * 0.12 + pointer.x * 0.12;
      group.rotation.x = -0.1 + pointer.y * 0.06;
      core.rotation.x = elapsed * 0.36;
      core.rotation.y = elapsed * 0.28;
      glow.rotation.x = -elapsed * 0.18;
      glow.rotation.z = elapsed * 0.12;
      ring.rotation.z = elapsed * 0.16;
      particles.rotation.y = -elapsed * 0.03;

      nodeMeshes.forEach((mesh, index) => {
        const pulse = 1 + Math.sin(elapsed * 1.4 + index) * 0.09;
        mesh.scale.setScalar(pulse);
      });

      labelMeshes.forEach((mesh, index) => {
        mesh.position.y = labelOffsets[index][1] + Math.sin(elapsed * 1.1 + index) * 0.045;
      });

      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);

      scene.traverse((object) => {
        const mesh = object as THREE.Object3D & {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };

        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(disposeMaterial);
        } else if (mesh.material) {
          disposeMaterial(mesh.material);
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default ResearchNetworkScene;
