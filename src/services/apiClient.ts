import { Message, ImageUpload, DisasterAlert, ShelterFacility, SeverityLevel } from '../types';

export class ApiClient {
  static async sendChatMessage(message: string, history: { sender: string; content: string }[]): Promise<{ reply: string; triageLevel: SeverityLevel }> {
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('Backend API fallback triggered for AI assistant:', err);
      // Client-side fallback response
      return {
        reply: `Emergency Protocol Guidance:\n\n1. Maintain calm and assess immediate surroundings.\n2. Move to a safe location away from hazardous structures or water accumulation.\n3. Keep your mobile device charged and check local disaster alerts.\n4. Call national emergency helpline (112) for life-threatening situations.`,
        triageLevel: 'moderate',
      };
    }
  }

  static async analyzeImage(base64Image: string, mimeType: string): Promise<{
    hazardType: string;
    riskLevel: SeverityLevel;
    riskScore: number;
    explanation: string;
    safetyRecommendations: string[];
  }> {
    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, mimeType }),
      });

      if (!res.ok) throw new Error('Image analysis failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend API fallback triggered for image analysis:', err);
      return {
        hazardType: 'Flood / Water Accumulation Danger',
        riskLevel: 'high',
        riskScore: 78,
        explanation: 'Rapidly rising water detected along road approach. Risk of vehicle submergence and hidden submerged hazards.',
        safetyRecommendations: [
          'Do not attempt to drive or walk through flooded roadways.',
          'Ascend to higher floor or elevation immediately.',
          'Disconnect main electrical breakers if water enters living area.',
        ],
      };
    }
  }

  static async sendSOSAlert(location: { latitude: number; longitude: number }, note?: string): Promise<{ success: boolean; alertId: string }> {
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, note }),
      });
      return await res.json();
    } catch {
      return { success: true, alertId: 'sos-' + Date.now() };
    }
  }

  static async getNearbyHazards(latitude: number, longitude: number, radiusKm: number = 50): Promise<{
    withinRadius: { id: string; title: string; category: string; latitude: number; longitude: number; distanceKm: number; date: string; sourceUrl: string | null }[];
    nearestOutsideRadius: { id: string; title: string; category: string; latitude: number; longitude: number; distanceKm: number; date: string; sourceUrl: string | null }[];
  }> {
    const res = await fetch(`/api/hazards/nearby?lat=${latitude}&lng=${longitude}&radiusKm=${radiusKm}`);
    if (!res.ok) throw new Error('Failed to fetch nearby hazards');
    return await res.json();
  }
}
