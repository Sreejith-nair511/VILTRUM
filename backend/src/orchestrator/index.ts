import { Server } from 'socket.io';
import { initializeNodes, updateNodes } from '../simulation/nodeSimulator';
import { generatePredictions, generateAlerts } from '../ai-engine/predictor';
import { NodeData, AIAlert, SystemHealth, TrafficFlow } from '../types';

let alertHistory: AIAlert[] = [];
let trafficHistory: TrafficFlow[] = [];
let startTime = Date.now();

function computeSystemHealth(nodes: NodeData[], alerts: AIAlert[]): SystemHealth {
  const online = nodes.filter((n) => n.status !== 'offline').length;
  const activeAlerts = alerts.filter((a) => !a.resolved).length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && !a.resolved).length;
  const avgRisk = nodes.reduce((s, n) => s + n.riskScore, 0) / nodes.length;

  return {
    totalNodes: nodes.length,
    onlineNodes: online,
    activeAlerts,
    criticalAlerts,
    avgRiskScore: Math.round(avgRisk),
    systemUptime: Math.floor((Date.now() - startTime) / 1000),
    predictionAccuracy: 87 + Math.random() * 8,
    responseLatency: 12 + Math.random() * 20,
  };
}

function generateTrafficFlows(nodes: NodeData[]): TrafficFlow[] {
  return nodes.map((node) => ({
    nodeId: node.id,
    timestamp: Date.now(),
    inflow: Math.round(node.vehicleDensity * 1.2),
    outflow: Math.round(node.vehicleDensity * 0.9),
    avgSpeed: Math.round(Math.max(5, 60 - node.vehicleDensity * 0.5)),
    congestionIndex: Math.round(node.vehicleDensity),
  }));
}

export function startOrchestrator(io: Server): void {
  initializeNodes();

  // Fast update: node data + predictions every 1.5s
  setInterval(() => {
    const nodes = updateNodes();
    const predictions = generatePredictions(nodes);
    const newAlerts = generateAlerts(nodes, predictions);

    // Keep alert history capped at 50
    alertHistory = [...newAlerts, ...alertHistory].slice(0, 50);

    const flows = generateTrafficFlows(nodes);
    trafficHistory = [...flows, ...trafficHistory].slice(0, 200);

    const health = computeSystemHealth(nodes, alertHistory);

    io.emit('nodes:update', nodes);
    io.emit('predictions:update', predictions);
    io.emit('health:update', health);
    io.emit('traffic:update', flows);

    if (newAlerts.length > 0) {
      io.emit('alerts:new', newAlerts);
    }
  }, 1500);

  // Slower: full alert state every 3s
  setInterval(() => {
    io.emit('alerts:history', alertHistory.slice(0, 20));
  }, 3000);

  // MQTT simulation events every 4s
  setInterval(() => {
    const mqttEvents = [
      { topic: 'rasta/node/heartbeat', payload: { timestamp: Date.now(), status: 'ok' } },
      { topic: 'rasta/ai/inference', payload: { model: 'RiskNet-v2', latency: Math.round(8 + Math.random() * 15) } },
      { topic: 'rasta/network/sync', payload: { syncedNodes: 5, protocol: 'MQTT-SN' } },
    ];
    io.emit('mqtt:event', mqttEvents[Math.floor(Math.random() * mqttEvents.length)]);
  }, 4000);
}
