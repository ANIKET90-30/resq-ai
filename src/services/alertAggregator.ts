import { DisasterAlert, SavedCoordinates, AggregatedAlert, SeverityLevel } from '../types';

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function computeAlertPriority(
  alert: DisasterAlert,
  userCoords: SavedCoordinates
): AggregatedAlert {
  const alertLat = alert.latitude ?? 30.91;
  const alertLon = alert.longitude ?? 75.86;
  const distanceKm = calculateDistanceKm(
    userCoords.latitude,
    userCoords.longitude,
    alertLat,
    alertLon
  );

  const issuedTime = new Date(alert.issuedAt).getTime();
  const timeAgoMinutes = Math.max(0, Math.floor((Date.now() - issuedTime) / 60000));

  // Severity Base Score
  let severityScore = 25;
  if (alert.severity === 'critical') severityScore = 100;
  else if (alert.severity === 'high') severityScore = 75;
  else if (alert.severity === 'moderate') severityScore = 50;

  // Proximity Score
  let proximityScore = 5;
  if (distanceKm <= 3) proximityScore = 45;
  else if (distanceKm <= 8) proximityScore = 30;
  else if (distanceKm <= 20) proximityScore = 15;

  // Recency Score
  let recencyScore = 2;
  if (timeAgoMinutes <= 15) recencyScore = 25;
  else if (timeAgoMinutes <= 60) recencyScore = 15;
  else if (timeAgoMinutes <= 180) recencyScore = 8;

  // Radius Overlap
  const radiusKm = alert.radiusKm ?? 10;
  const isWithinRadius = distanceKm <= radiusKm;
  const radiusBonus = isWithinRadius ? 20 : 0;

  const priorityScore = severityScore + proximityScore + recencyScore + radiusBonus;

  let priorityLabel: 'P1 - Critical' | 'P2 - High' | 'P3 - Moderate' | 'P4 - Info' = 'P4 - Info';
  if (priorityScore >= 120) priorityLabel = 'P1 - Critical';
  else if (priorityScore >= 85) priorityLabel = 'P2 - High';
  else if (priorityScore >= 50) priorityLabel = 'P3 - Moderate';

  return {
    ...alert,
    distanceKm,
    priorityScore,
    priorityLabel,
    isWithinRadius,
    timeAgoMinutes,
  };
}

export type SortMethod = 'priority' | 'proximity' | 'severity' | 'recency';

export class AlertAggregatorService {
  static processAlerts(
    alerts: DisasterAlert[],
    userCoords: SavedCoordinates,
    options?: {
      sortMethod?: SortMethod;
      maxDistanceKm?: number | 'all';
      category?: string;
      minSeverity?: SeverityLevel | 'all';
    }
  ): AggregatedAlert[] {
    const {
      sortMethod = 'priority',
      maxDistanceKm = 'all',
      category = 'all',
      minSeverity = 'all',
    } = options || {};

    let processed = alerts.map((a) => computeAlertPriority(a, userCoords));

    // Category filter
    if (category !== 'all') {
      processed = processed.filter((a) => a.category === category);
    }

    // Radius distance filter
    if (typeof maxDistanceKm === 'number') {
      processed = processed.filter((a) => a.distanceKm <= maxDistanceKm);
    }

    // Min severity filter
    if (minSeverity !== 'all') {
      const severityRanks: Record<SeverityLevel, number> = {
        critical: 4,
        high: 3,
        moderate: 2,
        low: 1,
      };
      const minRank = severityRanks[minSeverity as SeverityLevel] || 1;
      processed = processed.filter((a) => severityRanks[a.severity] >= minRank);
    }

    // Sorting
    processed.sort((a, b) => {
      if (sortMethod === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      if (sortMethod === 'proximity') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortMethod === 'severity') {
        const ranks: Record<SeverityLevel, number> = { critical: 4, high: 3, moderate: 2, low: 1 };
        return ranks[b.severity] - ranks[a.severity];
      }
      if (sortMethod === 'recency') {
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      }
      return b.priorityScore - a.priorityScore;
    });

    return processed;
  }
}
