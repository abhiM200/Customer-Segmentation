import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Customer } from '../types/customer';
import { Users, User, Calendar, DollarSign } from 'lucide-react';

interface DataOverviewProps {
  customers: Customer[];
}

const DataOverview: React.FC<DataOverviewProps> = ({ customers }) => {
  // Calculate statistics
  const totalCustomers = customers.length;
  const avgAge = Math.round(customers.reduce((sum, c) => sum + c.Age, 0) / totalCustomers);
  const avgIncome = Math.round(customers.reduce((sum, c) => sum + c['Annual Income (k$)'], 0) / totalCustomers);
  const avgSpending = Math.round(customers.reduce((sum, c) => sum + c['Spending Score (1-100)'], 0) / totalCustomers);

  // Gender distribution
  const genderData = [
    { name: 'Female', value: customers.filter(c => c.Gender === 'Female').length, color: '#d946ef' },
    { name: 'Male', value: customers.filter(c => c.Gender === 'Male').length, color: '#0ea5e9' }
  ];

  // Age distribution
  const ageRanges = [
    { range: '18-25', min: 18, max: 25 },
    { range: '26-35', min: 26, max: 35 },
    { range: '36-45', min: 36, max: 45 },
    { range: '46-55', min: 46, max: 55 },
    { range: '56-65', min: 56, max: 65 },
    { range: '65+', min: 65, max: 100 }
  ];

  const ageData = ageRanges.map(range => ({
    range: range.range,
    count: customers.filter(c => c.Age >= range.min && c.Age <= range.max).length
  }));

  // Income distribution
  const incomeRanges = [
    { range: '$0-30k', min: 0, max: 30 },
    { range: '$31-50k', min: 31, max: 50 },
    { range: '$51-70k', min: 51, max: 70 },
    { range: '$71-90k', min: 71, max: 90 },
    { range: '$91-110k', min: 91, max: 110 },
    { range: '$110k+', min: 111, max: 200 }
  ];

  const incomeData = incomeRanges.map(range => ({
    range: range.range,
    count: customers.filter(c => c['Annual Income (k$)'] >= range.min && c['Annual Income (k$)'] <= range.max).length
  }));

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
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-blue-600">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users size={24} />}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Average Age"
          value={`${avgAge} years`}
          icon={<Calendar size={24} />}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          title="Average Income"
          value={`$${avgIncome}k`}
          icon={<DollarSign size={24} />}
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Average Spending Score"
          value={`${avgSpending}/100`}
          icon={<User size={24} />}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Gender Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {genderData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
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
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Income Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataOverview;