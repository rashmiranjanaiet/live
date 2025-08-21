import React from 'react';
import { DisasterAlert } from '../types/disaster';
import { X, MapPin, Calendar, Users, AlertTriangle, ExternalLink } from 'lucide-react';

interface AlertModalProps {
  alert: DisasterAlert | null;
  isOpen: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ alert, isOpen, onClose }) => {
  if (!isOpen || !alert) return null;

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'Red': return 'bg-red-500';
      case 'Orange': return 'bg-orange-500';
      case 'Green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertBg = (level: string) => {
    switch (level) {
      case 'Red': return 'bg-red-50 border-red-200';
      case 'Orange': return 'bg-orange-50 border-orange-200';
      case 'Green': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatPopulation = (population: number) => {
    return population.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full ${getAlertColor(alert.alertLevel)} shadow-lg`}></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Disaster Alert Details</h2>
                <p className="text-sm text-gray-600">Episode ID: {alert.episodeId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className={`rounded-xl border-2 p-4 mb-6 ${getAlertBg(alert.alertLevel)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-800">
                {alert.alertLevel} Level Alert
              </span>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">{alert.eventType}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Severity Score: {alert.severity}/3
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{alert.title}</h3>
              <p className="text-gray-600 leading-relaxed">{alert.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Location</p>
                    <p className="text-sm text-gray-600">{alert.country}</p>
                    <p className="text-xs text-gray-500">
                      {alert.coordinates.lat.toFixed(4)}, {alert.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Date & Time</p>
                    <p className="text-sm text-gray-600">{formatDate(alert.dateTime)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Population Affected</p>
                    <p className="text-sm text-gray-600">{formatPopulation(alert.population)} people</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Event Type</p>
                    <p className="text-sm text-gray-600">{alert.eventType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Data provided by GDACS
              </div>
              <a
                href={alert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Report</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;