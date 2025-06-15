import { Customer } from '../types/customer';

// K-means clustering implementation
export class KMeans {
  private k: number;
  private maxIterations: number;
  private centroids: number[][];
  private clusters: number[];

  constructor(k: number, maxIterations: number = 100) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.centroids = [];
    this.clusters = [];
  }

  // Normalize data to 0-1 range
  private normalize(data: number[][]): { normalized: number[][], mins: number[], maxs: number[] } {
    const mins = new Array(data[0].length).fill(Infinity);
    const maxs = new Array(data[0].length).fill(-Infinity);

    // Find min and max for each feature
    data.forEach(point => {
      point.forEach((value, index) => {
        mins[index] = Math.min(mins[index], value);
        maxs[index] = Math.max(maxs[index], value);
      });
    });

    // Normalize data
    const normalized = data.map(point =>
      point.map((value, index) => {
        const range = maxs[index] - mins[index];
        return range === 0 ? 0 : (value - mins[index]) / range;
      })
    );

    return { normalized, mins, maxs };
  }

  // Calculate Euclidean distance
  private distance(point1: number[], point2: number[]): number {
    return Math.sqrt(
      point1.reduce((sum, val, index) => sum + Math.pow(val - point2[index], 2), 0)
    );
  }

  // Initialize centroids randomly
  private initializeCentroids(data: number[][]): void {
    this.centroids = [];
    const numFeatures = data[0].length;

    for (let i = 0; i < this.k; i++) {
      const centroid = new Array(numFeatures);
      for (let j = 0; j < numFeatures; j++) {
        centroid[j] = Math.random();
      }
      this.centroids.push(centroid);
    }
  }

  // Assign points to nearest centroid
  private assignClusters(data: number[][]): boolean {
    const newClusters = new Array(data.length);
    let changed = false;

    for (let i = 0; i < data.length; i++) {
      let minDistance = Infinity;
      let closestCentroid = 0;

      for (let j = 0; j < this.k; j++) {
        const dist = this.distance(data[i], this.centroids[j]);
        if (dist < minDistance) {
          minDistance = dist;
          closestCentroid = j;
        }
      }

      if (this.clusters[i] !== closestCentroid) {
        changed = true;
      }
      newClusters[i] = closestCentroid;
    }

    this.clusters = newClusters;
    return changed;
  }

  // Update centroids
  private updateCentroids(data: number[][]): void {
    const numFeatures = data[0].length;
    const newCentroids = new Array(this.k).fill(null).map(() => new Array(numFeatures).fill(0));
    const counts = new Array(this.k).fill(0);

    // Sum points in each cluster
    for (let i = 0; i < data.length; i++) {
      const cluster = this.clusters[i];
      counts[cluster]++;
      for (let j = 0; j < numFeatures; j++) {
        newCentroids[cluster][j] += data[i][j];
      }
    }

    // Calculate averages
    for (let i = 0; i < this.k; i++) {
      if (counts[i] > 0) {
        for (let j = 0; j < numFeatures; j++) {
          newCentroids[i][j] /= counts[i];
        }
      }
    }

    this.centroids = newCentroids;
  }

  // Fit the model
  fit(data: number[][]): number[] {
    const { normalized } = this.normalize(data);
    this.initializeCentroids(normalized);
    this.clusters = new Array(data.length).fill(0);

    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      const changed = this.assignClusters(normalized);
      if (!changed) break;
      this.updateCentroids(normalized);
    }

    return this.clusters;
  }
}

// Perform customer segmentation
export function performSegmentation(customers: Customer[]): Customer[] {
  // Prepare data for clustering (Age, Income, Spending Score)
  const data = customers.map(customer => [
    customer.Age,
    customer['Annual Income (k$)'],
    customer['Spending Score (1-100)']
  ]);

  // Perform K-means clustering with k=5
  const kmeans = new KMeans(5);
  const clusters = kmeans.fit(data);

  // Add cluster assignments to customers
  return customers.map((customer, index) => ({
    ...customer,
    cluster: clusters[index]
  }));
}