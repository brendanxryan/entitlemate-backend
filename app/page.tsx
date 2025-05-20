'use client';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Filters from '../components/Filters';

interface Entitlement {
  Name: string;
  Headline: string;
  Description: string;
  GovLink: string;
  ValueEstimate: string;
  State: string;
  AgeGroup: string;
  PaymentType: string;
  HomeOwnership: string;
  RelationshipStatus: string;
  LifeStageMoment: string;
  Card: string;
  Category: string;
  Status: string;
  Type: string;
}

export default function Home() {
  const [data, setData] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    ageGroups: [] as string[],
    pensionTypes: [] as string[],
    state: '',
    homeOwnership: '',
    relationshipStatus: '',
    lifeStageMoment: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://entitlemate-backend.onrender.com';
        console.log('Fetching from:', `${apiUrl}/api/entitlements`);
        
        const response = await fetch(`${apiUrl}/api/entitlements`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log('Received data:', jsonData);
        
        if (!Array.isArray(jsonData)) {
          throw new Error('Received data is not an array');
        }
        
        setData(jsonData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    // Split comma-separated values into arrays
    const itemAgeGroups = item.AgeGroup?.split(',').map(age => age.trim()) || [];
    const itemPensionTypes = item.PaymentType?.split(',').map(type => type.trim()) || [];
    
    const ageMatch = filters.ageGroups.length === 0 || 
      filters.ageGroups.some(age => itemAgeGroups.includes(age));
    
    const pensionMatch = filters.pensionTypes.length === 0 || 
      filters.pensionTypes.some(p => itemPensionTypes.includes(p));
    
    const stateMatch = !filters.state || 
      item.State === filters.state || 
      item.State === 'All';
    
    const homeMatch = !filters.homeOwnership || 
      item.HomeOwnership === filters.homeOwnership;
    
    const relationMatch = !filters.relationshipStatus || 
      item.RelationshipStatus === filters.relationshipStatus;
    
    const stageMatch = !filters.lifeStageMoment || 
      item.LifeStageMoment === filters.lifeStageMoment;

    return ageMatch && pensionMatch && stateMatch && homeMatch && relationMatch && stageMatch;
  });

  // Extract unique filter options from data
  const ageOptions = Array.from(new Set(data.flatMap(item => item.AgeGroup?.split(',').map(a => a.trim()) || []))).filter(Boolean);
  const pensionOptions = Array.from(new Set(data.flatMap(item => item.PaymentType?.split(',').map(p => p.trim()) || []))).filter(Boolean);
  const stateOptions = Array.from(new Set(data.map(item => item.State).filter(Boolean)));
  const homeOptions = Array.from(new Set(data.map(item => item.HomeOwnership).filter(Boolean)));
  const relationshipOptions = Array.from(new Set(data.map(item => item.RelationshipStatus).filter(Boolean)));
  const stageOptions = Array.from(new Set(data.map(item => item.LifeStageMoment).filter(Boolean)));

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div 
            role="status"
            aria-label="Loading entitlements data"
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
          />
          <p className="mt-4 text-gray-600" id="loading-text">Loading entitlements data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Filters
        onFilterChange={(filters) => setFilters(filters)}
        ageOptions={ageOptions}
        pensionOptions={pensionOptions}
        stateOptions={stateOptions}
        homeOptions={homeOptions}
        relationshipOptions={relationshipOptions}
        stageOptions={stageOptions}
      />
      {filteredData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No entitlements found matching your filters.</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredData.map((item, i) => (
            <Card key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}