export interface NodeData {
  id: string;
  name: string;
  location: { lat: number; lng: number; x: number; y: number };
  status: 'online' | 'warning' | 'critical' | 'offline';
  vehicleDensity: number;       // 0-100
  obstacleDetected: boolean;
  waterloggingRisk: number;     // 0-100
  crowdDensity: number;         // 0-100
  ambientVisibility: number;    // 0-100 (100 = clear)
  pedestrianActivity: number;   // 0-100
  signalState: 'green' | 'yellow' | 'red' | 'emergency';
  temperature: number;
  humidity: number;
  windSpeed: number;
  lastUpdated: number;
  connectedNodes: string[];
  riskScore: number;            // 0-100
}

export interface AIAlert {
  id: string;
  nodeId: string;
  nodeName: string;
  type: 'collision' | 'flood' | 'congestion' | 'pedestrian' | 'obstacle' | 'visibility' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  confidence: number;           // 0-100
  predictedImpactRadius: number; // meters
  timestamp: number;
  resolved: boolean;
  adaptiveResponse?: string;
}

export interface TrafficFlow {
  nodeId: string;
  timestamp: number;
  inflow: number;
  outflow: number;
  avgSpeed: number;
  congestionIndex: number;
}

export interface SystemHealth {
  totalNodes: number;
  onlineNodes: number;
  activeAlerts: number;
  criticalAlerts: number;
  avgRiskScore: number;
  systemUptime: number;
  predictionAccuracy: number;
  responseLatency: number;
}

export interface PredictionResult {
  nodeId: string;
  collisionRisk: number;
  floodRisk: number;
  congestionProbability: number;
  pedestrianRisk: number;
  overallRisk: number;
  confidence: number;
  predictedAt: number;
}
