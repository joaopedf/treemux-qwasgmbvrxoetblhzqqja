import { ThreatEvent } from './agents';

const locations = [
  'North Perimeter Gate',
  'South Entrance',
  'Command Center',
  'Vehicle Bay',
  'East Fence Line',
  'West Checkpoint',
  'Communications Tower',
  'Supply Depot',
];

const threatTypes: Array<ThreatEvent['type']> = ['motion', 'audio', 'network', 'perimeter', 'access'];

const descriptions = {
  motion: [
    'Unauthorized movement detected in restricted zone',
    'Multiple heat signatures detected',
    'Unusual activity pattern identified',
    'Rapid movement toward facility',
  ],
  audio: [
    'Elevated noise levels detected',
    'Glass breaking sound pattern',
    'Verbal distress signals detected',
    'Mechanical cutting sounds identified',
  ],
  network: [
    'Unusual network traffic spike',
    'Unauthorized access attempt detected',
    'Potential data exfiltration activity',
    'Suspicious port scanning detected',
  ],
  perimeter: [
    'Fence integrity sensor triggered',
    'Ground pressure sensor activated',
    'Infrared beam interrupted',
    'Vibration sensor alert',
  ],
  access: [
    'Failed badge swipe attempts',
    'Unauthorized door access attempt',
    'Access credential mismatch',
    'Multiple failed biometric scans',
  ],
};

function generateRandomEvent(): ThreatEvent {
  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const severityOptions: Array<ThreatEvent['severity']> = ['low', 'low', 'medium', 'medium', 'high', 'critical'];
  const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
  const description = descriptions[type][Math.floor(Math.random() * descriptions[type].length)];

  const rawData: Record<string, any> = {
    sensorId: `SENSOR-${Math.floor(Math.random() * 1000)}`,
    coordinates: {
      lat: 37.4275 + (Math.random() - 0.5) * 0.01,
      lon: -122.1697 + (Math.random() - 0.5) * 0.01,
    },
    confidence: Math.floor(Math.random() * 30) + 70,
  };

  if (type === 'motion') {
    rawData.velocity = Math.floor(Math.random() * 20) + 1;
    rawData.targets = Math.floor(Math.random() * 5) + 1;
  } else if (type === 'network') {
    rawData.sourceIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    rawData.destPort = Math.floor(Math.random() * 65535);
    rawData.packetCount = Math.floor(Math.random() * 10000);
  } else if (type === 'access') {
    rawData.badgeId = `BADGE-${Math.floor(Math.random() * 10000)}`;
    rawData.attempts = Math.floor(Math.random() * 5) + 1;
  }

  return {
    id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    source: rawData.sensorId,
    type,
    severity,
    location,
    rawData,
    description,
  };
}

export function generateMockSensorFeed(): ThreatEvent[] {
  const eventCount = Math.floor(Math.random() * 3) + 1;
  return Array.from({ length: eventCount }, generateRandomEvent);
}

export function generateInitialEvents(count: number = 5): ThreatEvent[] {
  return Array.from({ length: count }, generateRandomEvent);
}
