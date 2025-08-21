import React from 'react';
import { DisasterAlert } from '../types/disaster';
import { Calendar, MapPin, Users, ExternalLink, AlertTriangle } from 'lucide-react';

interface AlertCardProps {
  alert: DisasterAlert;
  onDetailsClick: (alert: DisasterAlert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onDetailsClick }) => {
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'Red': return 'bg-red-500';
      case 'Orange': return 'bg-orange-500';
      case 'Green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertBorder = (level: string) => {
    switch (level) {
      case 'Red': return 'border-red-200';
      case 'Orange': return 'border-orange-200';
      case 'Green': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

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
    <div className={`bg-white rounded-xl shadow-md border-2 ${getAlertBorder(alert.alertLevel)} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${getAlertColor(alert.alertLevel)} shadow-lg`}></div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {alert.alertLevel} Alert
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{alert.eventType}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 leading-tight">
          {alert.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
          {alert.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{alert.country}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatDate(alert.dateTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{formatPopulation(alert.population)} people affected</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => onDetailsClick(alert)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Details
          </button>
          <a
            href={alert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            GDACS Report
          </a>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;