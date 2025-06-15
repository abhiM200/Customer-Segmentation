import { Customer, ClusterStats, SegmentationResults } from '../types/customer';

// Parse CSV data
export function parseCSV(csvText: string): Customer[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      CustomerID: parseInt(values[0]),
      Gender: values[1] as 'Male' | 'Female',
      Age: parseInt(values[2]),
      'Annual Income (k$)': parseInt(values[3]),
      'Spending Score (1-100)': parseInt(values[4])
    };
  });
}

// Calculate cluster statistics
export function calculateClusterStats(customers: Customer[]): ClusterStats[] {
  const clusterMap = new Map<number, Customer[]>();
  
  // Group customers by cluster
  customers.forEach(customer => {
    if (customer.cluster !== undefined) {
      if (!clusterMap.has(customer.cluster)) {
        clusterMap.set(customer.cluster, []);
      }
      clusterMap.get(customer.cluster)!.push(customer);
    }
  });

  const colors = ['#0ea5e9', '#d946ef', '#f97316', '#10b981', '#ef4444'];
  const descriptions = [
    'Budget Conscious Shoppers',
    'High Value Customers',
    'Young Spenders',
    'Mature Savers',
    'Premium Segment'
  ];

  return Array.from(clusterMap.entries()).map(([cluster, clusterCustomers]) => {
    const avgAge = clusterCustomers.reduce((sum, c) => sum + c.Age, 0) / clusterCustomers.length;
    const avgIncome = clusterCustomers.reduce((sum, c) => sum + c['Annual Income (k$)'], 0) / clusterCustomers.length;
    const avgSpending = clusterCustomers.reduce((sum, c) => sum + c['Spending Score (1-100)'], 0) / clusterCustomers.length;
    
    const maleCount = clusterCustomers.filter(c => c.Gender === 'Male').length;
    const femaleCount = clusterCustomers.filter(c => c.Gender === 'Female').length;

    return {
      cluster,
      count: clusterCustomers.length,
      avgAge: Math.round(avgAge * 10) / 10,
      avgIncome: Math.round(avgIncome * 10) / 10,
      avgSpending: Math.round(avgSpending * 10) / 10,
      genderDistribution: {
        Male: Math.round((maleCount / clusterCustomers.length) * 100),
        Female: Math.round((femaleCount / clusterCustomers.length) * 100)
      },
      description: descriptions[cluster] || `Cluster ${cluster}`,
      color: colors[cluster] || '#6b7280'
    };
  }).sort((a, b) => a.cluster - b.cluster);
}

// Generate marketing insights
export function generateInsights(clusterStats: ClusterStats[]): string[] {
  const insights: string[] = [];
  
  clusterStats.forEach(cluster => {
    if (cluster.avgIncome > 80 && cluster.avgSpending > 70) {
      insights.push(`${cluster.description}: Premium customers with high income and spending - target with luxury products and exclusive offers.`);
    } else if (cluster.avgIncome < 40 && cluster.avgSpending < 40) {
      insights.push(`${cluster.description}: Price-sensitive segment - focus on value propositions and discount campaigns.`);
    } else if (cluster.avgAge < 30 && cluster.avgSpending > 60) {
      insights.push(`${cluster.description}: Young high spenders - target with trendy products and social media marketing.`);
    } else if (cluster.avgAge > 50 && cluster.avgSpending < 50) {
      insights.push(`${cluster.description}: Mature conservative spenders - emphasize quality and reliability in marketing.`);
    } else {
      insights.push(`${cluster.description}: Balanced segment - use diversified marketing approach with moderate pricing.`);
    }
  });

  return insights;
}