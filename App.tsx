import React, { useState, useEffect } from 'react';
import { Customer, ClusterStats } from './types/customer';
import { parseCSV, calculateClusterStats, generateInsights } from './utils/dataProcessor';
import { performSegmentation } from './utils/clustering';
import DataOverview from './components/DataOverview';
import ClusterChart from './components/ClusterChart';
import ClusterStatsComponent from './components/ClusterStats';
import InsightsPanel from './components/InsightsPanel';
import { BarChart3, Users, Target, TrendingUp, Database } from 'lucide-react';

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segmentedCustomers, setSegmentedCustomers] = useState<Customer[]>([]);
  const [clusterStats, setClusterStats] = useState<ClusterStats[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'segmentation' | 'analysis' | 'insights'>('overview');
  const [chartConfig, setChartConfig] = useState({
    xAxis: 'Annual Income (k$)' as 'Age' | 'Annual Income (k$)' | 'Spending Score (1-100)',
    yAxis: 'Spending Score (1-100)' as 'Age' | 'Annual Income (k$)' | 'Spending Score (1-100)'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/Mall_Customers.csv');
      const csvText = await response.text();
      const parsedCustomers = parseCSV(csvText);
      
      setCustomers(parsedCustomers);
      
      // Perform segmentation
      const segmented = performSegmentation(parsedCustomers);
      setSegmentedCustomers(segmented);
      
      // Calculate statistics
      const stats = calculateClusterStats(segmented);
      setClusterStats(stats);
      
      // Generate insights
      const generatedInsights = generateInsights(stats);
      setInsights(generatedInsights);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const TabButton: React.FC<{
    id: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-md hover:shadow-lg'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Customer Segmentation Analysis</h1>
                <p className="text-gray-600 mt-1">Discover customer patterns and optimize marketing strategies</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-4">
          <TabButton
            id="overview"
            label="Data Overview"
            icon={<Database size={20} />}
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            id="segmentation"
            label="Customer Segmentation"
            icon={<Users size={20} />}
            active={activeTab === 'segmentation'}
            onClick={() => setActiveTab('segmentation')}
          />
          <TabButton
            id="analysis"
            label="Cluster Analysis"
            icon={<TrendingUp size={20} />}
            active={activeTab === 'analysis'}
            onClick={() => setActiveTab('analysis')}
          />
          <TabButton
            id="insights"
            label="Marketing Insights"
            icon={<Target size={20} />}
            active={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {activeTab === 'overview' && (
          <DataOverview customers={customers} />
        )}

        {activeTab === 'segmentation' && (
          <div className="space-y-8">
            {/* Chart Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Visualization Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                  <select
                    value={chartConfig.xAxis}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, xAxis: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Age">Age</option>
                    <option value="Annual Income (k$)">Annual Income</option>
                    <option value="Spending Score (1-100)">Spending Score</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
                  <select
                    value={chartConfig.yAxis}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, yAxis: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Age">Age</option>
                    <option value="Annual Income (k$)">Annual Income</option>
                    <option value="Spending Score (1-100)">Spending Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cluster Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Customer Clusters: {chartConfig.xAxis} vs {chartConfig.yAxis}
              </h2>
              <ClusterChart
                customers={segmentedCustomers}
                xAxis={chartConfig.xAxis}
                yAxis={chartConfig.yAxis}
              />
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <ClusterStatsComponent clusterStats={clusterStats} />
        )}

        {activeTab === 'insights' && (
          <InsightsPanel insights={insights} />
        )}
      </main>
    </div>
  );
}

export default App;