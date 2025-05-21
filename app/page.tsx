'use client';

import { useState, useEffect, useMemo } from 'react';

interface Entitlement {
  name: string;
  type: string[];
  category: string[];
  state: string[];
  ageGroup: string[];
  lifeStage: string[];
  paymentType: string[];
  relationshipStatus: string[];
  homeOwnership: string[];
  lifeStageMoment: string[];
  cardType: string[];
  headline: string;
  description: string;
  govLink: string;
  explainerLink: string;
  valueEstimate: string;
  eligibilityNotes: string;
  status: 'Publish' | 'Draft';
}

interface FilterState {
  type: string[];
  category: string[];
  state: string[];
  ageGroup: string[];
  lifeStage: string[];
  paymentType: string[];
  relationshipStatus: string[];
  homeOwnership: string[];
  lifeStageMoment: string[];
  cardType: string[];
}

interface CardProps {
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
  CardType: string;
  Card: string;
  Category: string;
  Status: string;
  Type: string;
  LifeStage: string;
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  ageOptions: string[];
  pensionOptions: string[];
  stateOptions: string[];
  homeOptions: string[];
  relationshipOptions: string[];
  stageOptions: string[];
  cardTypeOptions: string[];
  lifeStageOptions: string[];
}

const EntitlementCard: React.FC<CardProps> = ({
  Name,
  Headline,
  Description,
  GovLink,
  ValueEstimate,
  State,
  AgeGroup,
  PaymentType,
  HomeOwnership,
  RelationshipStatus,
  LifeStageMoment,
  CardType,
  Card,
  Category,
  Status,
  Type,
  LifeStage
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{Name}</h2>
      <p className="text-gray-600 mb-4">{Headline}</p>
      <p className="text-gray-700 mb-4">{Description}</p>
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">State:</span> {State}
        </div>
        <div>
          <span className="font-medium">Age Group:</span> {AgeGroup}
        </div>
        <div>
          <span className="font-medium">Payment Type:</span> {PaymentType}
        </div>
        <div>
          <span className="font-medium">Home Ownership:</span> {HomeOwnership}
        </div>
        <div>
          <span className="font-medium">Relationship Status:</span> {RelationshipStatus}
        </div>
        <div>
          <span className="font-medium">Life Stage Moment:</span> {LifeStageMoment}
        </div>
        <div>
          <span className="font-medium">Card Type:</span> {CardType}
        </div>
        <div>
          <span className="font-medium">Category:</span> {Category}
        </div>
        <div>
          <span className="font-medium">Type:</span> {Type}
        </div>
        <div>
          <span className="font-medium">Life Stage:</span> {LifeStage}
        </div>
      </div>
      {ValueEstimate && (
        <div className="mt-4 text-green-600 font-medium">
          Estimated Value: {ValueEstimate}
        </div>
      )}
      {GovLink && (
        <a
          href={GovLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          View Government Link →
        </a>
      )}
    </div>
  );
};

const EntitlementFilters: React.FC<FiltersProps> = ({
  onFilterChange,
  ageOptions,
  pensionOptions,
  stateOptions,
  homeOptions,
  relationshipOptions,
  stageOptions,
  cardTypeOptions,
  lifeStageOptions
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>({
    type: [],
    category: [],
    state: [],
    ageGroup: [],
    lifeStage: [],
    paymentType: [],
    relationshipStatus: [],
    homeOwnership: [],
    lifeStageMoment: [],
    cardType: []
  });

  const handleFilterChange = (key: keyof FilterState, value: string[]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderSelect = (
    label: string,
    key: keyof FilterState,
    options: string[],
    value: string[]
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        multiple
        className="w-full border rounded-md p-2"
        value={value}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions, option => option.value) as string[];
          handleFilterChange(key, selectedValues);
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderSelect('Age Group', 'ageGroup', ageOptions, localFilters.ageGroup)}
        {renderSelect('Payment Type', 'paymentType', pensionOptions, localFilters.paymentType)}
        {renderSelect('State', 'state', stateOptions, localFilters.state)}
        {renderSelect('Home Ownership', 'homeOwnership', homeOptions, localFilters.homeOwnership)}
        {renderSelect('Relationship Status', 'relationshipStatus', relationshipOptions, localFilters.relationshipStatus)}
        {renderSelect('Life Stage', 'lifeStage', stageOptions, localFilters.lifeStage)}
        {renderSelect('Card Type', 'cardType', cardTypeOptions, localFilters.cardType)}
        {renderSelect('Life Stage Moment', 'lifeStageMoment', lifeStageOptions, localFilters.lifeStageMoment)}
      </div>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    category: [],
    state: [],
    ageGroup: [],
    lifeStage: [],
    paymentType: [],
    relationshipStatus: [],
    homeOwnership: [],
    lifeStageMoment: [],
    cardType: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://entitlemate-backend.onrender.com';
        const response = await fetch(`${apiUrl}/data`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterOptions = useMemo(() => {
    if (!data) return {
      type: [],
      category: [],
      state: [],
      ageGroup: [],
      lifeStage: [],
      paymentType: [],
      relationshipStatus: [],
      homeOwnership: [],
      lifeStageMoment: [],
      cardType: []
    };

    const flattenAndUnique = (items: Entitlement[], key: keyof Entitlement): string[] => {
      const values = items.flatMap(item => {
        const value = item[key];
        return Array.isArray(value) ? value : [value];
      });
      return [...new Set(values.filter(Boolean))] as string[];
    };

    return {
      type: flattenAndUnique(data, 'type'),
      category: flattenAndUnique(data, 'category'),
      state: flattenAndUnique(data, 'state'),
      ageGroup: flattenAndUnique(data, 'ageGroup'),
      lifeStage: flattenAndUnique(data, 'lifeStage'),
      paymentType: flattenAndUnique(data, 'paymentType'),
      relationshipStatus: flattenAndUnique(data, 'relationshipStatus'),
      homeOwnership: flattenAndUnique(data, 'homeOwnership'),
      lifeStageMoment: flattenAndUnique(data, 'lifeStageMoment'),
      cardType: flattenAndUnique(data, 'cardType')
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => {
      const matchesType = filters.type.length === 0 || 
        filters.type.some(type => item.type.includes(type));
      const matchesCategory = filters.category.length === 0 || 
        filters.category.some(category => item.category.includes(category));
      const matchesState = filters.state.length === 0 || 
        filters.state.some(state => item.state.includes(state));
      const matchesAgeGroup = filters.ageGroup.length === 0 || 
        filters.ageGroup.some(age => item.ageGroup.includes(age));
      const matchesLifeStage = filters.lifeStage.length === 0 || 
        filters.lifeStage.some(stage => item.lifeStage.includes(stage));
      const matchesPaymentType = filters.paymentType.length === 0 || 
        filters.paymentType.some(type => item.paymentType.includes(type));
      const matchesRelationshipStatus = filters.relationshipStatus.length === 0 || 
        filters.relationshipStatus.some(status => item.relationshipStatus.includes(status));
      const matchesHomeOwnership = filters.homeOwnership.length === 0 || 
        filters.homeOwnership.some(ownership => item.homeOwnership.includes(ownership));
      const matchesLifeStageMoment = filters.lifeStageMoment.length === 0 || 
        filters.lifeStageMoment.some(moment => item.lifeStageMoment.includes(moment));
      const matchesCardType = filters.cardType.length === 0 || 
        filters.cardType.some(type => item.cardType.includes(type));
      
      return matchesType && matchesCategory && matchesState && matchesAgeGroup && 
             matchesLifeStage && matchesPaymentType && matchesRelationshipStatus && 
             matchesHomeOwnership && matchesLifeStageMoment && matchesCardType;
    });
  }, [data, filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading entitlements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Entitlements Finder</h1>
        <EntitlementFilters
          onFilterChange={(newFilters: FilterState) => setFilters(newFilters)}
          ageOptions={filterOptions.ageGroup}
          pensionOptions={filterOptions.paymentType}
          stateOptions={filterOptions.state}
          homeOptions={filterOptions.homeOwnership}
          relationshipOptions={filterOptions.relationshipStatus}
          stageOptions={filterOptions.lifeStage}
          cardTypeOptions={filterOptions.cardType}
          lifeStageOptions={filterOptions.lifeStageMoment}
        />
        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No entitlements found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, index) => {
              // Map backend fields to expected Card props
              const cardItem = {
                Name: item.name || '',
                Headline: item.headline || '',
                Description: item.description || '',
                GovLink: item.govLink || '',
                ValueEstimate: item.valueEstimate || '',
                State: Array.isArray(item.state) ? item.state.join(', ') : '',
                AgeGroup: Array.isArray(item.ageGroup) ? item.ageGroup.join(', ') : '',
                PaymentType: Array.isArray(item.paymentType) ? item.paymentType.join(', ') : '',
                HomeOwnership: Array.isArray(item.homeOwnership) ? item.homeOwnership.join(', ') : '',
                RelationshipStatus: Array.isArray(item.relationshipStatus) ? item.relationshipStatus.join(', ') : '',
                LifeStageMoment: Array.isArray(item.lifeStageMoment) ? item.lifeStageMoment.join(', ') : '',
                CardType: Array.isArray(item.cardType) ? item.cardType.join(', ') : '',
                Card: '',
                Category: Array.isArray(item.category) ? item.category.join(', ') : '',
                Status: item.status === 'Publish' ? 'Published' : 'Draft',
                Type: Array.isArray(item.type) ? item.type.join(', ') : '',
                LifeStage: Array.isArray(item.lifeStage) ? item.lifeStage.join(', ') : ''
              };
              return <EntitlementCard key={index} {...cardItem} />;
            })}
          </div>
        )}
      </div>
    </main>
  );
}