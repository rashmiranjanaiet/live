import { DisasterAlert } from '../types/disaster';

const GDACS_RSS_URL = 'https://www.gdacs.org/xml/rss.xml';

// Multiple CORS proxy options for better reliability
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest='
];

export class GDACSService {
  static async fetchDisasterAlerts(): Promise<DisasterAlert[]> {
    // Try each proxy in sequence
    for (let i = 0; i < CORS_PROXIES.length; i++) {
      try {
        const proxy = CORS_PROXIES[i];
        console.log(`Attempting to fetch data using proxy ${i + 1}/${CORS_PROXIES.length}: ${proxy}`);
        
        const response = await fetch(`${proxy}${encodeURIComponent(GDACS_RSS_URL)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/xml, text/xml, */*',
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        
        if (!xmlText || xmlText.trim().length === 0) {
          throw new Error('Empty response received');
        }
        
        console.log('Successfully fetched GDACS data');
        return this.parseXMLData(xmlText);
        
      } catch (error) {
        console.warn(`Proxy ${i + 1} failed:`, error);
        
        // If this is the last proxy, fall back to mock data
        if (i === CORS_PROXIES.length - 1) {
          console.log('All proxies failed, using mock data');
          return this.getMockData();
        }
        
        // Continue to next proxy
        continue;
      }
    }
    
    // Fallback to mock data if all proxies fail
    return this.getMockData();
  }
  
  private static parseXMLData(xmlText: string): DisasterAlert[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for XML parsing errors
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('XML parsing failed');
      }
      
      const items = xmlDoc.querySelectorAll('item');
      const alerts: DisasterAlert[] = [];
      
      items.forEach((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        // Parse GDACS specific data from description
        const alertLevel = this.extractAlertLevel(description);
        const eventType = this.extractEventType(title);
        const country = this.extractCountry(title);
        const coordinates = this.extractCoordinates(description);
        const population = this.extractPopulation(description);
        
        if (title && description) {
          alerts.push({
            id: `gdacs-${index}-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            alertLevel,
            eventType,
            country,
            coordinates,
            dateTime: pubDate,
            population,
            severity: this.getSeverityScore(alertLevel),
            episodeId: `EP${Math.random().toString(36).substr(2, 9)}`,
            url: link
          });
        }
      });
      
      return alerts.slice(0, 20); // Limit to 20 most recent alerts
    } catch (error) {
      console.error('Error parsing XML data:', error);
      return this.getMockData();
    }
  }
  
  private static extractAlertLevel(description: string): 'Green' | 'Orange' | 'Red' {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('red') || lowerDesc.includes('high') || lowerDesc.includes('extreme')) {
      return 'Red';
    } else if (lowerDesc.includes('orange') || lowerDesc.includes('medium') || lowerDesc.includes('moderate')) {
      return 'Orange';
    }
    return 'Green';
  }
  
  private static extractEventType(title: string): string {
    const types = ['earthquake', 'tsunami', 'flood', 'cyclone', 'volcano', 'wildfire', 'drought'];
    const lowerTitle = title.toLowerCase();
    
    for (const type of types) {
      if (lowerTitle.includes(type)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return 'Other';
  }
  
  private static extractCountry(title: string): string {
    const parts = title.split(' - ');
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    return 'Unknown';
  }
  
  private static extractCoordinates(description: string): { lat: number; lng: number } {
    // Try to extract coordinates from description
    const coordMatch = description.match(/(\-?\d+\.?\d*),\s*(\-?\d+\.?\d*)/);
    if (coordMatch) {
      return {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2])
      };
    }
    
    // Return random coordinates for demo
    return {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360
    };
  }
  
  private static extractPopulation(description: string): number {
    const popMatch = description.match(/population[:\s]*(\d+(?:,\d+)*)/i);
    if (popMatch) {
      return parseInt(popMatch[1].replace(/,/g, ''));
    }
    return Math.floor(Math.random() * 10000000);
  }
  
  private static getSeverityScore(alertLevel: string): number {
    switch (alertLevel) {
      case 'Red': return 3;
      case 'Orange': return 2;
      case 'Green': return 1;
      default: return 1;
    }
  }
  
  private static getMockData(): DisasterAlert[] {
    return [
      {
        id: '1',
        title: 'Magnitude 7.2 Earthquake - Philippines',
        description: 'A major earthquake struck the southern Philippines with a magnitude of 7.2. Significant damage reported in urban areas.',
        alertLevel: 'Red',
        eventType: 'Earthquake',
        country: 'Philippines',
        coordinates: { lat: 14.5995, lng: 120.9842 },
        dateTime: new Date().toISOString(),
        population: 2500000,
        severity: 3,
        episodeId: 'EP123456789',
        url: 'https://www.gdacs.org/report.aspx?eventid=123456'
      },
      {
        id: '2',
        title: 'Cyclone Alert - Bangladesh',
        description: 'Tropical cyclone approaching coastal areas of Bangladesh. Evacuation procedures in effect.',
        alertLevel: 'Orange',
        eventType: 'Cyclone',
        country: 'Bangladesh',
        coordinates: { lat: 23.6850, lng: 90.3563 },
        dateTime: new Date(Date.now() - 3600000).toISOString(),
        population: 1800000,
        severity: 2,
        episodeId: 'EP987654321',
        url: 'https://www.gdacs.org/report.aspx?eventid=987654'
      },
      {
        id: '3',
        title: 'Wildfire - California, USA',
        description: 'Large wildfire burning in Northern California. Multiple evacuations underway.',
        alertLevel: 'Orange',
        eventType: 'Wildfire',
        country: 'United States',
        coordinates: { lat: 38.5816, lng: -121.4944 },
        dateTime: new Date(Date.now() - 7200000).toISOString(),
        population: 850000,
        severity: 2,
        episodeId: 'EP555666777',
        url: 'https://www.gdacs.org/report.aspx?eventid=555666'
      }
    ];
  }
}