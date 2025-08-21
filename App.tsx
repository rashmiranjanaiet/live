import React, { useState, useMemo } from 'react';
import { Globe, Satellite } from 'lucide-react';
import { useGDACSData } from './hooks/useGDACSData';
import { DisasterAlert } from './types/disaster';
import AlertCard from './components/AlertCard';
import AlertModal from './components/AlertModal';
import FilterControls from './components/FilterControls';
import StatsOverview from './components/StatsOverview';
import DisasterMap from './components/DisasterMap';

function App() {
  const { alerts, isLoading, error, lastUpdate, refetch } = useGDACSData();
  const [selectedAlert, setSelectedAlert] = useState<DisasterAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlertLevel, setSelectedAlertLevel] = useState('All');
  const [selectedEventType, setSelectedEventType] = useState('All');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAlertLevel = selectedAlertLevel === 'All' || alert.alertLevel === selectedAlertLevel;
      const matchesEventType = selectedEventType === 'All' || alert.eventType === selectedEventType;
      
      return matchesSearch && matchesAlertLevel && matchesEventType;
    });
  }, [alerts, searchTerm, selectedAlertLevel, selectedEventType]);

  const handleAlertClick = (alert: DisasterAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Satellite className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GDACS Dashboard</h1>
                <p className="text-gray-600">Global Disaster Alert and Coordination System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Real-time disaster monitoring</div>
              <div className="text-xs text-gray-400">Powered by GDACS</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview alerts={alerts} lastUpdate={lastUpdate} />

        {/* Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedAlertLevel={selectedAlertLevel}
          onAlertLevelChange={setSelectedAlertLevel}
          selectedEventType={selectedEventType}
          onEventTypeChange={setSelectedEventType}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {/* Interactive Map */}
        <div className="mb-8">
          <DisasterMap
            alerts={filteredAlerts}
            onAlertClick={handleAlertClick}
            selectedAlert={selectedAlert}
          />
        </div>

        {/* Alert Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Active Disaster Alerts ({filteredAlerts.length})
            </h2>
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-sm">Updating...</span>
              </div>
            )}
          </div>

          {filteredAlerts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <Satellite className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No alerts found</h3>
              <p className="text-gray-500">Try adjusting your search filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDetailsClick={handleAlertClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <AlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;