'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Filters from '../components/Filters';

interface Entitlement {
  Name?: string;
  Type?: string;
  Category?: string;
  State?: string;
  AgeGroup?: string;
  ageGroups?: string[];
  LifeStage?: string;
  PaymentType?: string;
  RelationshipStatus?: string;
  HomeOwnership?: string;
  LifeStageMoment?: string;
  CardType?: string;
  Card?: string;
  Headline?: string;
  Description?: string;
  GovLink?: string;
  ValueEstimate?: string;
  Status?: string;
  // Backend camelCase fields
  name?: string;
  headline?: string;
  description?: string;
  govLink?: string;
  valueEstimate?: string;
  state?: string[] | string;
  pensionType?: string[];
  homeOwnership?: string[];
  relationshipStatus?: string[];
  lifeStageMoment?: string[];
  cardType?: string[];
}

interface FilterState {
  ageGroups: string[];
  pensionTypes: string[];
  state: string;
  homeOwnership: string;
  relationshipStatus: string;
  lifeStageMoment: string;
  cardTypes: string[];
  lifeStages: string[];
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
    lifeStageMoment: '',
    cardTypes: [],
    lifeStages: []
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
      // Use backend field names
      const itemAgeGroups = Array.isArray(item.ageGroups)
        ? (item.ageGroups.filter(Boolean) as string[]).map(age => (age as string).trim().toLowerCase())
        : [];
      const itemPensionTypes = Array.isArray(item.pensionType)
        ? (item.pensionType.filter(Boolean) as string[]).map(type => (type as string).trim().toLowerCase())
        : [];
      const itemLifeStages = Array.isArray(item.lifeStageMoment)
        ? (item.lifeStageMoment.filter(Boolean) as string[]).map(stage => (stage as string).trim().toLowerCase())
        : [];
      const itemCardTypes = Array.isArray(item.cardType)
        ? (item.cardType.filter(Boolean) as string[]).map(type => (type as string).trim().toLowerCase())
        : [];
      // Normalize filter values
      const normalizedAgeGroups = filters.ageGroups.map(age => age.toLowerCase());
      const normalizedPensionTypes = filters.pensionTypes.map(type => type.toLowerCase());
      const normalizedLifeStages = filters.lifeStages.map(stage => stage.toLowerCase());
      const normalizedCardTypes = filters.cardTypes.map(type => type.toLowerCase());
      const ageMatch = normalizedAgeGroups.length === 0 || 
        normalizedAgeGroups.some(age => itemAgeGroups.includes(age));
      const pensionMatch = normalizedPensionTypes.length === 0 || 
        normalizedPensionTypes.some(p => itemPensionTypes.includes(p));
      const lifeStageMatch = normalizedLifeStages.length === 0 ||
        normalizedLifeStages.some(stage => itemLifeStages.includes(stage));
      const cardTypeMatch = normalizedCardTypes.length === 0 ||
        normalizedCardTypes.some(type => itemCardTypes.includes(type));
      const stateMatch = !filters.state || 
        (Array.isArray(item.state) ? item.state.map(s => (s as string).toLowerCase()).includes(filters.state.toLowerCase()) : (item.state as string)?.toLowerCase() === filters.state.toLowerCase()) ||
        (Array.isArray(item.state) ? item.state.map(s => (s as string).toLowerCase()).includes('all') : (item.state as string)?.toLowerCase() === 'all');
      const homeMatch = !filters.homeOwnership || 
        (Array.isArray(item.homeOwnership) ? item.homeOwnership.map(h => (h as string).toLowerCase()).includes(filters.homeOwnership.toLowerCase()) : (item.homeOwnership as string)?.toLowerCase() === filters.homeOwnership.toLowerCase());
      const relationMatch = !filters.relationshipStatus || 
        (Array.isArray(item.relationshipStatus) ? item.relationshipStatus.map(r => (r as string).toLowerCase()).includes(filters.relationshipStatus.toLowerCase()) : (item.relationshipStatus as string)?.toLowerCase() === filters.relationshipStatus.toLowerCase());
      const stageMatch = !filters.lifeStageMoment || 
        (Array.isArray(item.lifeStageMoment) ? item.lifeStageMoment.map(s => (s as string).toLowerCase()).includes(filters.lifeStageMoment.toLowerCase()) : (item.lifeStageMoment as string)?.toLowerCase() === filters.lifeStageMoment.toLowerCase());
      return ageMatch && pensionMatch && stateMatch && homeMatch && relationMatch && stageMatch && lifeStageMatch && cardTypeMatch;
    });
  }, [data, filters]);

  // Extract unique filter options from data with proper normalization
  const filterOptions = useMemo(() => {
    return {
      ageOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.ageGroups) ? (item.ageGroups.filter(Boolean) as string[]).map(a => (a as string).trim()) : []
      ))).filter(Boolean).sort(),
      pensionOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.pensionType) ? (item.pensionType.filter(Boolean) as string[]).map(p => (p as string).trim()) : []
      ))).filter(Boolean).sort(),
      stateOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.state) ? (item.state.filter(s => typeof s === 'string') as string[]) : [item.state].filter(s => typeof s === 'string')
      ))).sort(),
      homeOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.homeOwnership) ? (item.homeOwnership.filter(s => typeof s === 'string') as string[]) : [item.homeOwnership].filter(s => typeof s === 'string')
      ))).sort(),
      relationshipOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.relationshipStatus) ? (item.relationshipStatus.filter(s => typeof s === 'string') as string[]) : [item.relationshipStatus].filter(s => typeof s === 'string')
      ))).sort(),
      stageOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.lifeStageMoment) ? (item.lifeStageMoment.filter(s => typeof s === 'string') as string[]) : [item.lifeStageMoment].filter(s => typeof s === 'string')
      ))).sort(),
      cardTypeOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.cardType) ? (item.cardType.filter(Boolean) as string[]).map(t => (t as string).trim()) : []
      ))).filter(Boolean).sort(),
      lifeStageOptions: Array.from(new Set(data.flatMap(item => 
        Array.isArray(item.lifeStageMoment) ? (item.lifeStageMoment.filter(Boolean) as string[]).map(s => (s as string).trim()) : []
      ))).filter(Boolean).sort()
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
        cardTypeOptions={filterOptions.cardTypeOptions}
        lifeStageOptions={filterOptions.lifeStageOptions}
      />
      {filteredData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No entitlements found matching your filters.</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your filter criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
          {filteredData.map((item, i) => {
            // Support State as array or string
            const states = Array.isArray(item.state)
              ? (item.state.filter(s => typeof s === 'string') as string[]).map(s => s.toLowerCase())
              : [typeof item.state === 'string' ? (item.state as string).toLowerCase() : ''].filter(Boolean);
            let cardBg = '';
            if (states.includes('nsw')) cardBg = 'bg-blue-50';
            if (states.includes('all')) cardBg = 'bg-green-50';
            // Map backend fields to expected Card props
            const cardItem = {
              Name: item.Name || item.name || '',
              Headline: item.Headline || item.headline || '',
              Description: item.Description || item.description || '',
              GovLink: item.GovLink || item.govLink || '',
              ValueEstimate: item.ValueEstimate || item.valueEstimate || '',
              State: item.State || (Array.isArray(item.state) ? item.state.join(', ') : item.state) || '',
              AgeGroup: item.AgeGroup || (Array.isArray(item.ageGroups) ? item.ageGroups.join(', ') : item.ageGroups) || '',
              PaymentType: item.PaymentType || (Array.isArray(item.pensionType) ? item.pensionType.join(', ') : item.pensionType) || '',
              HomeOwnership: item.HomeOwnership || (Array.isArray(item.homeOwnership) ? item.homeOwnership.join(', ') : item.homeOwnership) || '',
              RelationshipStatus: item.RelationshipStatus || (Array.isArray(item.relationshipStatus) ? item.relationshipStatus.join(', ') : item.relationshipStatus) || '',
              LifeStageMoment: item.LifeStageMoment || (Array.isArray(item.lifeStageMoment) ? item.lifeStageMoment.join(', ') : item.lifeStageMoment) || '',
              CardType: item.CardType || (Array.isArray(item.cardType) ? item.cardType.join(', ') : item.cardType) || '',
              Card: item.Card || '',
              Category: item.Category || '',
              Status: item.Status || '',
              Type: item.Type || '',
              LifeStage: item.LifeStage || '',
            };
            return (
              <Card 
                key={i} 
                item={cardItem} 
                className={cardBg}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}