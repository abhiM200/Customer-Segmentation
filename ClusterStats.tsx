import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClusterStats } from '../types/customer';
import { Users, DollarSign, TrendingUp, User } from 'lucide-react';

interface ClusterStatsProps {
  clusterStats: ClusterStats[];
}

const ClusterStatsComponent: React.FC<ClusterStatsProps> = ({ clusterStats }) => {
  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    subtitle?: string;
  }> = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="text-white/80">
          {icon}
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`Cluster ${label}`}</p>
          <p className="text-sm text-blue-600">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clusters"
          value={clusterStats.length}
          icon={<Users size={24} />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Customers"
          value={clusterStats.reduce((sum, cluster) => sum + cluster.count, 0)}
          icon={<User size={24} />}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Avg Income"
          value={`$${Math.round(clusterStats.reduce((sum, cluster) => sum + cluster.avgIncome * cluster.count, 0) / clusterStats.reduce((sum, cluster) => sum + cluster.count, 0))}k`}
          icon={<DollarSign size={24} />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Avg Spending Score"
          value={Math.round(clusterStats.reduce((sum, cluster) => sum + cluster.avgSpending * cluster.count, 0) / clusterStats.reduce((sum, cluster) => sum + cluster.count, 0))}
          icon={<TrendingUp size={24} />}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Cluster Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {clusterStats.map((cluster) => (
          <div key={cluster.cluster} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">{cluster.description}</h3>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: cluster.color }}
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Customers</span>
                <span className="font-semibold text-gray-800">{cluster.count}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg Age</span>
                <span className="font-semibold text-gray-800">{cluster.avgAge} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg Income</span>
                <span className="font-semibold text-gray-800">${cluster.avgIncome}k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Avg Spending</span>
                <span className="font-semibold text-gray-800">{cluster.avgSpending}/100</span>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Male: {cluster.genderDistribution.Male}%</span>
                  <span className="text-gray-600">Female: {cluster.genderDistribution.Female}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cluster.genderDistribution.Male}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cluster Size Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cluster Sizes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clusterStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="cluster" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                name="Customer Count"
                radius={[4, 4, 0, 0]}
              >
                {clusterStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Average Income by Cluster</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clusterStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="cluster" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgIncome" 
                name="Average Income ($k)"
                radius={[4, 4, 0, 0]}
              >
                {clusterStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ClusterStatsComponent;