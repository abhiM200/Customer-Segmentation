export interface Customer {
  CustomerID: number;
  Gender: 'Male' | 'Female';
  Age: number;
  'Annual Income (k$)': number;
  'Spending Score (1-100)': number;
  cluster?: number;
}

export interface ClusterStats {
  cluster: number;
  count: number;
  avgAge: number;
  avgIncome: number;
  avgSpending: number;
  genderDistribution: {
    Male: number;
    Female: number;
  };
  description: string;
  color: string;
}

export interface SegmentationResults {
  customers: Customer[];
  clusterStats: ClusterStats[];
  totalCustomers: number;
}