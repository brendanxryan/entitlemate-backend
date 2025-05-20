'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Filters from '../components/Filters';

interface Entitlement {
  Name: string;
  Type: string;
  Category: string;
  State: string;
  AgeGroup: string;
  LifeStage: string;
  PaymentType: string;
  RelationshipStatus: string;
  HomeOwnership: string;
  LifeStageMoment: string;
  CardType: string;
  Card: string;
  Headline: string;
  Description: string;
  GovLink: string;
  ValueEstimate: string;
  Status: string;
}

interface FilterState {
  ageGroups: string[];
  pensionTypes: string[];
  state: string;
  homeOwnership: string;
  relationshipStatus: string;
  lifeStageMoment: string;
}

export default function Home() {
  const [data, setData] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    ageGroups: [],
    pensionTypes: [],
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

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Split comma-separated values into arrays and normalize
      const itemAgeGroups = item.AgeGroup?.split(',').map(age => age.trim().toLowerCase()) || [];
      const itemPensionTypes = item.PaymentType?.split(',').map(type => type.trim().toLowerCase()) || [];
      
      // Normalize filter values
      const normalizedAgeGroups = filters.ageGroups.map(age => age.toLowerCase());
      const normalizedPensionTypes = filters.pensionTypes.map(type => type.toLowerCase());
      
      const ageMatch = normalizedAgeGroups.length === 0 || 
        normalizedAgeGroups.some(age => itemAgeGroups.includes(age));
      
      const pensionMatch = normalizedPensionTypes.length === 0 || 
        normalizedPensionTypes.some(p => itemPensionTypes.includes(p));
      
      const stateMatch = !filters.state || 
        item.State?.toLowerCase() === filters.state.toLowerCase() || 
        item.State?.toLowerCase() === 'all';
      
      const homeMatch = !filters.homeOwnership || 
        item.HomeOwnership?.toLowerCase() === filters.homeOwnership.toLowerCase();
      
      const relationMatch = !filters.relationshipStatus || 
        item.RelationshipStatus?.toLowerCase() === filters.relationshipStatus.toLowerCase();
      
      const stageMatch = !filters.lifeStageMoment || 
        item.LifeStageMoment?.toLowerCase() === filters.lifeStageMoment.toLowerCase();

      return ageMatch && pensionMatch && stateMatch && homeMatch && relationMatch && stageMatch;
    });
  }, [data, filters]);

  // Extract unique filter options from data with proper normalization
  const filterOptions = useMemo(() => {
    return {
      ageOptions: Array.from(new Set(data.flatMap(item => 
        item.AgeGroup?.split(',').map(a => a.trim()) || []
      ))).filter(Boolean).sort(),
      
      pensionOptions: Array.from(new Set(data.flatMap(item => 
        item.PaymentType?.split(',').map(p => p.trim()) || []
      ))).filter(Boolean).sort(),
      
      stateOptions: Array.from(new Set(data.map(item => item.State).filter(Boolean))).sort(),
      
      homeOptions: Array.from(new Set(data.map(item => item.HomeOwnership).filter(Boolean))).sort(),
      
      relationshipOptions: Array.from(new Set(data.map(item => item.RelationshipStatus).filter(Boolean))).sort(),
      
      stageOptions: Array.from(new Set(data.map(item => item.LifeStageMoment).filter(Boolean))).sort()
    };
  }, [data]);

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
        onFilterChange={(newFilters: FilterState) => setFilters(newFilters)}
        ageOptions={filterOptions.ageOptions}
        pensionOptions={filterOptions.pensionOptions}
        stateOptions={filterOptions.stateOptions}
        homeOptions={filterOptions.homeOptions}
        relationshipOptions={filterOptions.relationshipOptions}
        stageOptions={filterOptions.stageOptions}
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