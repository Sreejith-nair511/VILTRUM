import { v4 as uuidv4 } from 'uuid';
import { NodeData, AIAlert, PredictionResult } from '../types';

const ALERT_MESSAGES = {
  collision: [
    'High vehicle density convergence detected — collision risk elevated',
    'Opposing traffic vectors indicate imminent collision probability',
    'Multi-lane conflict pattern identified by neural analysis',
    'Predictive model flags unsafe intersection approach speeds',
  ],
  flood: [
    'Waterlogging escalation detected — road surface compromised',
    'Drainage capacity exceeded — flood propagation predicted',
    'Moisture sensor array indicates critical saturation threshold',
    'Hydrological model predicts 15-min flood window',
  ],
  congestion: [
    'Traffic density exceeding adaptive threshold — congestion forming',
    'Upstream bottleneck propagation detected',
    'Vehicle queue length approaching critical capacity',
    'Flow rate anomaly — congestion cascade imminent',
  ],
  pedestrian: [
    'Unsafe pedestrian crossing pattern detected',
    'High pedestrian-vehicle conflict probability at this node',
    'Crowd surge detected — pedestrian safety protocol activated',
    'Pedestrian density exceeds safe crossing threshold',
  ],
  obstacle: [
    'Static obstacle detected in primary traffic lane',
    'Foreign object signature confirmed by sensor fusion',
    'Road obstruction triggering upstream alert cascade',
    'Obstacle classification: high-risk stationary object',
  ],
  visibility: [
    'Ambient visibility degraded — driver reaction time impaired',
    'Low visibility conditions — adaptive lighting protocol engaged',
    'Fog/particulate density exceeds safe driving threshold',
    'Visibility index critical — speed advisory issued',
  ],
  emergency: [
    'CRITICAL: Multi-factor risk convergence — emergency protocol active',
    'ALERT: System-wide hazard escalation detected',
    'EMERGENCY: Adaptive response cascade initiated across network',
    'CRITICAL: AI confidence threshold breached — human intervention advised',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePredictions(nodes: NodeData[]): PredictionResult[] {
  return nodes.map((node) => {
    const collisionRisk = Math.min(
      100,
      node.vehicleDensity * 0.6 + (node.obstacleDetected ? 30 : 0) + (100 - node.ambientVisibility) * 0.2
    );
    const floodRisk = Math.min(100, node.waterloggingRisk * 0.8 + node.humidity * 0.2);
    const congestionProbability = Math.min(100, node.vehicleDensity * 0.7 + node.crowdDensity * 0.3);
    const pedestrianRisk = Math.min(
      100,
      node.pedestrianActivity * 0.5 + node.crowdDensity * 0.3 + node.vehicleDensity * 0.2
    );
    const overallRisk = node.riskScore;
    const confidence = 70 + Math.random() * 25;

    return {
      nodeId: node.id,
      collisionRisk,
      floodRisk,
      congestionProbability,
      pedestrianRisk,
      overallRisk,
      confidence,
      predictedAt: Date.now(),
    };
  });
}

export function generateAlerts(nodes: NodeData[], predictions: PredictionResult[]): AIAlert[] {
  const alerts: AIAlert[] = [];

  nodes.forEach((node) => {
    const pred = predictions.find((p) => p.nodeId === node.id);
    if (!pred) return;

    // Collision alert
    if (pred.collisionRisk > 65 && Math.random() < 0.4) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'collision',
        severity: pred.collisionRisk > 85 ? 'critical' : pred.collisionRisk > 75 ? 'high' : 'medium',
        message: pickRandom(ALERT_MESSAGES.collision),
        confidence: Math.round(pred.confidence),
        predictedImpactRadius: Math.round(50 + pred.collisionRisk * 2),
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Signal timing adjusted — upstream vehicles alerted',
      });
    }

    // Flood alert
    if (pred.floodRisk > 60 && Math.random() < 0.35) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'flood',
        severity: pred.floodRisk > 80 ? 'critical' : pred.floodRisk > 70 ? 'high' : 'medium',
        message: pickRandom(ALERT_MESSAGES.flood),
        confidence: Math.round(pred.confidence),
        predictedImpactRadius: Math.round(100 + pred.floodRisk * 3),
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Traffic rerouted — drainage alert issued to city systems',
      });
    }

    // Congestion alert
    if (pred.congestionProbability > 70 && Math.random() < 0.3) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'congestion',
        severity: pred.congestionProbability > 85 ? 'high' : 'medium',
        message: pickRandom(ALERT_MESSAGES.congestion),
        confidence: Math.round(pred.confidence),
        predictedImpactRadius: Math.round(200 + pred.congestionProbability * 2),
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Adaptive signal cycle extended — alternate route broadcast',
      });
    }

    // Pedestrian alert
    if (pred.pedestrianRisk > 65 && Math.random() < 0.25) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'pedestrian',
        severity: pred.pedestrianRisk > 80 ? 'high' : 'medium',
        message: pickRandom(ALERT_MESSAGES.pedestrian),
        confidence: Math.round(pred.confidence),
        predictedImpactRadius: Math.round(30 + pred.pedestrianRisk),
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Pedestrian crossing phase extended — vehicle hold activated',
      });
    }

    // Obstacle alert
    if (node.obstacleDetected && Math.random() < 0.7) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'obstacle',
        severity: 'high',
        message: pickRandom(ALERT_MESSAGES.obstacle),
        confidence: Math.round(85 + Math.random() * 10),
        predictedImpactRadius: 75,
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Lane closure protocol initiated — emergency services notified',
      });
    }

    // Visibility alert
    if (node.ambientVisibility < 40 && Math.random() < 0.4) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'visibility',
        severity: node.ambientVisibility < 20 ? 'critical' : 'medium',
        message: pickRandom(ALERT_MESSAGES.visibility),
        confidence: Math.round(pred.confidence),
        predictedImpactRadius: 150,
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'Dynamic lighting activated — speed advisory broadcast',
      });
    }

    // Emergency (multi-factor)
    if (node.riskScore > 85 && Math.random() < 0.3) {
      alerts.push({
        id: uuidv4(),
        nodeId: node.id,
        nodeName: node.name,
        type: 'emergency',
        severity: 'critical',
        message: pickRandom(ALERT_MESSAGES.emergency),
        confidence: Math.round(90 + Math.random() * 9),
        predictedImpactRadius: 500,
        timestamp: Date.now(),
        resolved: false,
        adaptiveResponse: 'FULL EMERGENCY PROTOCOL — All nodes alerted — Emergency services dispatched',
      });
    }
  });

  return alerts;
}
