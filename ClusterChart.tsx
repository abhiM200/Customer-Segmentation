import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Customer } from '../types/customer';

interface ClusterChartProps {
  customers: Customer[];
  xAxis: 'Age' | 'Annual Income (k$)' | 'Spending Score (1-100)';
  yAxis: 'Age' | 'Annual Income (k$)' | 'Spending Score (1-100)';
}

const ClusterChart: React.FC<ClusterChartProps> = ({ customers, xAxis, yAxis }) => {
  const colors = ['#0ea5e9', '#d946ef', '#f97316', '#10b981', '#ef4444'];
  
  // Group customers by cluster
  const clusterData = customers.reduce((acc, customer) => {
    const cluster = customer.cluster ?? 0;
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push({
      x: customer[xAxis],
      y: customer[yAxis],
      cluster,
      id: customer.CustomerID
    });
    return acc;
  }, {} as Record<number, any[]>);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">Customer #{data.id}</p>
          <p className="text-sm text-gray-600">Cluster: {data.cluster}</p>
          <p className="text-sm">{xAxis}: {data.x}</p>
          <p className="text-sm">{yAxis}: {data.y}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={xAxis}
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={yAxis}
            domain={['dataMin - 5', 'dataMax + 5']}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.entries(clusterData).map(([cluster, data]) => (
            <Scatter
              key={cluster}
              name={`Cluster ${cluster}`}
              data={data}
              fill={colors[parseInt(cluster)] || '#6b7280'}
              fillOpacity={0.7}
              stroke={colors[parseInt(cluster)] || '#6b7280'}
              strokeWidth={1}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClusterChart;