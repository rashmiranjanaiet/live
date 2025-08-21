import React from 'react';
import { DisasterAlert } from '../types/disaster';
import { AlertTriangle, Globe, Users, Clock } from 'lucide-react';

interface StatsOverviewProps {
  alerts: DisasterAlert[];
  lastUpdate: string;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ alerts, lastUpdate }) => {
  const redAlerts = alerts.filter(alert => alert.alertLevel === 'Red').length;
  const orangeAlerts = alerts.filter(alert => alert.alertLevel === 'Orange').length;
  const greenAlerts = alerts.filter(alert => alert.alertLevel === 'Green').length;
  const totalPopulation = alerts.reduce((sum, alert) => sum + alert.population, 0);
  const uniqueCountries = new Set(alerts.map(alert => alert.country)).size;

  const formatPopulation = (population: number) => {
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  const formatLastUpdate = (dateString: string) => {
    const now = new Date();
    const update = new Date(dateString);
    const diffMs = now.getTime() - update.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Alerts</p>
            <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">{redAlerts} Red</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">{orangeAlerts} Orange</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{greenAlerts} Green</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Countries Affected</p>
            <p className="text-3xl font-bold text-gray-900">{uniqueCountries}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Across multiple regions worldwide</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">People Affected</p>
            <p className="text-3xl font-bold text-gray-900">{formatPopulation(totalPopulation)}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Estimated population impact</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Last Update</p>
            <p className="text-3xl font-bold text-gray-900">{formatLastUpdate(lastUpdate)}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Data from GDACS</p>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;