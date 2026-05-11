import { NodeData } from '../types';

// 12 real Bangalore intersections spread across the city
const NODE_CONFIGS = [
  {
    id: 'NODE-01',
    name: 'Silk Board Junction',
    location: { lat: 12.9177, lng: 77.6228, x: 300, y: 400 },
    connectedNodes: ['NODE-02', 'NODE-05'],
  },
  {
    id: 'NODE-02',
    name: 'Marathahalli Bridge',
    location: { lat: 12.9591, lng: 77.6974, x: 500, y: 300 },
    connectedNodes: ['NODE-01', 'NODE-03', 'NODE-06'],
  },
  {
    id: 'NODE-03',
    name: 'KR Puram Junction',
    location: { lat: 13.0050, lng: 77.6940, x: 520, y: 200 },
    connectedNodes: ['NODE-02', 'NODE-04'],
  },
  {
    id: 'NODE-04',
    name: 'Hebbal Flyover',
    location: { lat: 13.0358, lng: 77.5970, x: 300, y: 120 },
    connectedNodes: ['NODE-03', 'NODE-05', 'NODE-07'],
  },
  {
    id: 'NODE-05',
    name: 'MG Road Signal',
    location: { lat: 12.9757, lng: 77.6011, x: 280, y: 280 },
    connectedNodes: ['NODE-01', 'NODE-04', 'NODE-06', 'NODE-08'],
  },
  {
    id: 'NODE-06',
    name: 'Whitefield Main',
    location: { lat: 12.9698, lng: 77.7499, x: 620, y: 310 },
    connectedNodes: ['NODE-02', 'NODE-05'],
  },
  {
    id: 'NODE-07',
    name: 'Yeshwanthpur Circle',
    location: { lat: 13.0218, lng: 77.5511, x: 160, y: 160 },
    connectedNodes: ['NODE-04', 'NODE-08'],
  },
  {
    id: 'NODE-08',
    name: 'Jayanagar 4th Block',
    location: { lat: 12.9250, lng: 77.5938, x: 260, y: 380 },
    connectedNodes: ['NODE-05', 'NODE-07', 'NODE-09'],
  },
  {
    id: 'NODE-09',
    name: 'Electronic City',
    location: { lat: 12.8458, lng: 77.6603, x: 380, y: 520 },
    connectedNodes: ['NODE-08', 'NODE-10'],
  },
  {
    id: 'NODE-10',
    name: 'Bannerghatta Road',
    location: { lat: 12.8731, lng: 77.5975, x: 260, y: 470 },
    connectedNodes: ['NODE-09', 'NODE-08'],
  },
  {
    id: 'NODE-11',
    name: 'Koramangala 80ft',
    location: { lat: 12.9352, lng: 77.6245, x: 320, y: 350 },
    connectedNodes: ['NODE-01', 'NODE-05', 'NODE-12'],
  },
  {
    id: 'NODE-12',
    name: 'Indiranagar 100ft',
    location: { lat: 12.9784, lng: 77.6408, x: 400, y: 270 },
    connectedNodes: ['NODE-05', 'NODE-11', 'NODE-02'],
  },
];

function smoothRandom(current: number, min: number, max: number, step: number): number {
  const delta = (Math.random() - 0.5) * step * 2;
  return Math.max(min, Math.min(max, current + delta));
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

const nodeState: Record<string, NodeData> = {};

function initNode(config: typeof NODE_CONFIGS[0]): NodeData {
  return {
    id: config.id,
    name: config.name,
    location: config.location,
    connectedNodes: config.connectedNodes,
    status: 'online',
    vehicleDensity: 30 + Math.random() * 40,
    obstacleDetected: false,
    waterloggingRisk: Math.random() * 30,
    crowdDensity: Math.random() * 50,
    ambientVisibility: 70 + Math.random() * 30,
    pedestrianActivity: Math.random() * 60,
    signalState: 'green',
    temperature: 22 + Math.random() * 10,
    humidity: 40 + Math.random() * 40,
    windSpeed: Math.random() * 20,
    lastUpdated: Date.now(),
    riskScore: 0,
  };
}

export function initializeNodes(): void {
  NODE_CONFIGS.forEach((cfg) => {
    nodeState[cfg.id] = initNode(cfg);
  });
}

export function updateNodes(): NodeData[] {
  NODE_CONFIGS.forEach((cfg) => {
    const node = nodeState[cfg.id];

    node.vehicleDensity    = smoothRandom(node.vehicleDensity,    0,  100, 8);
    node.waterloggingRisk  = smoothRandom(node.waterloggingRisk,  0,  100, 5);
    node.crowdDensity      = smoothRandom(node.crowdDensity,      0,  100, 7);
    node.ambientVisibility = smoothRandom(node.ambientVisibility, 10, 100, 4);
    node.pedestrianActivity= smoothRandom(node.pedestrianActivity,0,  100, 6);
    node.temperature       = smoothRandom(node.temperature,       15,  45, 0.5);
    node.humidity          = smoothRandom(node.humidity,          20,  95, 2);
    node.windSpeed         = smoothRandom(node.windSpeed,         0,   60, 3);
    node.obstacleDetected  = Math.random() < 0.08;

    node.riskScore = clamp(
      node.vehicleDensity * 0.25 +
      node.waterloggingRisk * 0.3 +
      node.crowdDensity * 0.15 +
      (100 - node.ambientVisibility) * 0.15 +
      node.pedestrianActivity * 0.1 +
      (node.obstacleDetected ? 20 : 0),
      0, 100
    );

    if (node.riskScore > 75)      node.status = 'critical';
    else if (node.riskScore > 50) node.status = 'warning';
    else                          node.status = 'online';

    if (node.riskScore > 75)      node.signalState = 'emergency';
    else if (node.riskScore > 55) node.signalState = 'red';
    else if (node.riskScore > 35) node.signalState = 'yellow';
    else                          node.signalState = 'green';

    node.lastUpdated = Date.now();
  });

  return Object.values(nodeState);
}

export function getNodes(): NodeData[] {
  return Object.values(nodeState);
}

export function getNodeById(id: string): NodeData | undefined {
  return nodeState[id];
}
