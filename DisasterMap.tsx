import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DisasterAlert } from '../types/disaster';
import { MapPin, Calendar, Users, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DisasterMapProps {
  alerts: DisasterAlert[];
  onAlertClick: (alert: DisasterAlert) => void;
  selectedAlert?: DisasterAlert | null;
}

// Custom marker icons for different alert levels
const createCustomIcon = (alertLevel: string) => {
  const color = alertLevel === 'Red' ? '#ef4444' : 
               alertLevel === 'Orange' ? '#f97316' : '#22c55e';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapUpdater: React.FC<{ alerts: DisasterAlert[] }> = ({ alerts }) => {
  const map = useMap();
  
  useEffect(() => {
    if (alerts.length > 0) {
      const group = new L.FeatureGroup(
        alerts.map(alert => 
          L.marker([alert.coordinates.lat, alert.coordinates.lng])
        )
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [alerts, map]);
  
  return null;
};

const DisasterMap: React.FC<DisasterMapProps> = ({ alerts, onAlertClick, selectedAlert }) => {
  const mapRef = useRef<L.Map>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Global Disaster Map
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Interactive map showing active disaster alerts worldwide
        </p>
      </div>
      
      <div className="h-96 relative">
        <MapContainer
          ref={mapRef}
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater alerts={alerts} />
          
          {alerts.map((alert) => (
            <Marker
              key={alert.id}
              position={[alert.coordinates.lat, alert.coordinates.lng]}
              icon={createCustomIcon(alert.alertLevel)}
              eventHandlers={{
                click: () => onAlertClick(alert),
              }}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.alertLevel === 'Red' ? 'bg-red-500' :
                      alert.alertLevel === 'Orange' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-xs font-semibold text-gray-600 uppercase">
                      {alert.alertLevel} Alert
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight">
                    {alert.title}
                  </h4>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{alert.country}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{formatDate(alert.dateTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{formatPopulation(alert.population)} affected</span>
                    </div>
                    <div className="flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{alert.eventType}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onAlertClick(alert)}
                    className="mt-3 w-full px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Red Alert</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Orange Alert</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Green Alert</span>
            </div>
          </div>
          <span className="text-gray-500">{alerts.length} active alerts</span>
        </div>
      </div>
    </div>
  );
};

export default DisasterMap;