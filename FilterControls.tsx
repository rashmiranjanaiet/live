import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedAlertLevel: string;
  onAlertLevelChange: (level: string) => void;
  selectedEventType: string;
  onEventTypeChange: (type: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  onSearchChange,
  selectedAlertLevel,
  onAlertLevelChange,
  selectedEventType,
  onEventTypeChange,
  onRefresh,
  isLoading
}) => {
  const alertLevels = ['All', 'Red', 'Orange', 'Green'];
  const eventTypes = ['All', 'Earthquake', 'Cyclone', 'Flood', 'Wildfire', 'Tsunami', 'Volcano', 'Other'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search disasters, countries, or descriptions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedAlertLevel}
              onChange={(e) => onAlertLevelChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {alertLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'All' ? 'All Levels' : `${level} Alert`}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedEventType}
            onChange={(e) => onEventTypeChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Events' : type}
              </option>
            ))}
          </select>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;