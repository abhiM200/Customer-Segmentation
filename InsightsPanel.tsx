import React from 'react';
import { Lightbulb, Target, TrendingUp, Users } from 'lucide-react';

interface InsightsPanelProps {
  insights: string[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const icons = [
    <Lightbulb className="text-yellow-500" size={20} />,
    <Target className="text-red-500" size={20} />,
    <TrendingUp className="text-green-500" size={20} />,
    <Users className="text-blue-500" size={20} />,
    <Lightbulb className="text-purple-500" size={20} />
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Lightbulb className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Marketing Insights & Recommendations</h2>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="flex-shrink-0 mt-1">
              {icons[index % icons.length]}
            </div>
            <p className="text-gray-700 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
        <h3 className="text-lg font-bold mb-3">Key Takeaways</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Personalize marketing campaigns based on cluster characteristics
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Adjust pricing strategies for different customer segments
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Focus retention efforts on high-value customer clusters
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            Develop targeted product recommendations for each segment
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InsightsPanel;