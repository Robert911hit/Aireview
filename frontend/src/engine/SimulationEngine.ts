import * as THREE from 'three';
import type { AgentEntity, SimulationPacket } from '../types/simulation';

const COLOR_BY_EVENT: Record<string, THREE.Color> = {
  session_start: new THREE.Color('#25d9ff'),
  navigation: new THREE.Color('#1f7aff'),
  click: new THREE.Color('#f97316'),
  scroll: new THREE.Color('#a78bfa'),
  input: new THREE.Color('#22c55e'),
  network_load: new THREE.Color('#facc15'),
  error: new THREE.Color('#ef4444'),
  session_end: new THREE.Color('#94a3b8'),
};

export class SimulationEngine {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000);
  readonly renderer: THREE.WebGLRenderer;
  private readonly entities = new Map<string, AgentEntity>();
  private readonly meshByEntity = new Map<string, THREE.Mesh>();
  private readonly clock = new THREE.Clock();
  private animationId = 0;
  private selected?: string;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.position.set(0, 9, 15);
    this.camera.lookAt(0, 0, 0);
    this.scene.fog = new THREE.FogExp2('#050713', 0.045);
    this.scene.add(new THREE.AmbientLight('#6ea8ff', 1.1));
    const key = new THREE.PointLight('#25d9ff', 90, 32);
    key.position.set(6, 10, 8);
    this.scene.add(key);
    this.scene.add(new THREE.GridHelper(28, 28, '#1f7aff', '#0d1b2f'));
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  ingest(packet: SimulationPacket) {
    const id = packet.session_id;
    const entity = this.entities.get(id) ?? this.createEntity(id, packet);
    entity.type = packet.event_type;
    entity.lifecycle = packet.event_type === 'session_end' ? 'decay' : 'evolve';
    entity.intensity = packet.payload.intensity ?? entity.intensity;
    entity.velocity[0] = packet.payload.vx ?? entity.velocity[0];
    entity.velocity[1] = packet.payload.vy ?? entity.velocity[1];
    entity.velocity[2] = packet.payload.vz ?? entity.velocity[2];
    if (packet.payload.x !== undefined) entity.position[0] = packet.payload.x;
    if (packet.payload.y !== undefined) entity.position[1] = packet.payload.y;
    if (packet.payload.z !== undefined) entity.position[2] = packet.payload.z;
    entity.history.push(packet);
    this.applyVisualState(entity);
  }

  selectAt(normalizedX: number, normalizedY: number): string | undefined {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), this.camera);
    const hits = raycaster.intersectObjects([...this.meshByEntity.values()]);
    this.selected = hits[0]?.object.name;
    return this.selected;
  }

  start() {
    const render = () => {
      this.animationId = requestAnimationFrame(render);
      this.step(Math.min(this.clock.getDelta(), 0.05));
      this.renderer.render(this.scene, this.camera);
    };
    render();
  }

  stop() {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }

  private createEntity(id: string, packet: SimulationPacket): AgentEntity {
    const entity: AgentEntity = {
      id,
      type: packet.event_type,
      position: new Float32Array([packet.payload.x ?? 0, packet.payload.y ?? 0, packet.payload.z ?? 0]),
      velocity: new Float32Array([packet.payload.vx ?? 0, packet.payload.vy ?? 0, packet.payload.vz ?? 0]),
      intensity: packet.payload.intensity ?? 0.5,
      lifecycle: 'spawn',
      history: [packet],
    };
    const geometry = new THREE.SphereGeometry(0.12, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: COLOR_BY_EVENT[packet.event_type], emissive: COLOR_BY_EVENT[packet.event_type], emissiveIntensity: 1.4 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = id;
    this.scene.add(mesh);
    this.entities.set(id, entity);
    this.meshByEntity.set(id, mesh);
    return entity;
  }

  private step(delta: number) {
    for (const entity of this.entities.values()) {
      entity.position[0] += entity.velocity[0] * delta * 3;
      entity.position[1] += Math.sin(performance.now() / 500 + entity.position[0]) * 0.002;
      entity.position[2] += entity.velocity[2] * delta * 3;
      entity.velocity[0] *= 0.985;
      entity.velocity[1] *= 0.985;
      entity.velocity[2] *= 0.985;
      const mesh = this.meshByEntity.get(entity.id);
      if (!mesh) continue;
      mesh.position.set(entity.position[0], entity.position[1], entity.position[2]);
      const scale = entity.id === this.selected ? 2.2 : 0.9 + entity.intensity * 1.9;
      mesh.scale.setScalar(scale);
    }
    this.camera.position.x = Math.sin(performance.now() / 9000) * 8;
    this.camera.position.z = 15 + Math.cos(performance.now() / 9000) * 4;
    this.camera.lookAt(0, 0, 0);
  }

  private applyVisualState(entity: AgentEntity) {
    const mesh = this.meshByEntity.get(entity.id);
    const material = mesh?.material as THREE.MeshStandardMaterial | undefined;
    const color = COLOR_BY_EVENT[entity.type] ?? COLOR_BY_EVENT.navigation;
    material?.color.copy(color);
    material?.emissive.copy(color);
    if (material) material.emissiveIntensity = entity.type === 'error' ? 3.2 : 1.5 + entity.intensity;
  }
}
