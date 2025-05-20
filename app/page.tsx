'use client';

import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Filters from '../components/Filters';

interface Entitlement {
  name: string;
  headline: string;
  description: string;
  govLink: string;
  valueEstimate: string;
  state: string[];
  ageGroups: string[];
  pensionType: string[];
  homeOwnership: string[];
  relationshipStatus: string[];
  lifeStageMoment: string[];
}

export default function Home() {
  const [data, setData] = useState<Entitlement[]>([]);
  const [filters, setFilters] = useState({
    ageGroups: [],
    pensionTypes: [],
    state: '',
    homeOwnership: '',
    relationshipStatus: '',
    lifeStageMoment: ''
  });

  useEffect(() => {
    // Fetch data from your Flask API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/entitlements`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const filteredData = data.filter((item) => {
    const ageMatch = filters.ageGroups.length === 0 || filters.ageGroups.some(age => item.ageGroups?.includes(age));
    const pensionMatch = filters.pensionTypes.length === 0 || filters.pensionTypes.some(p => item.pensionType?.includes(p));
    const stateMatch = !filters.state || item.state?.includes(filters.state);
    const homeMatch = !filters.homeOwnership || item.homeOwnership?.includes(filters.homeOwnership);
    const relationMatch = !filters.relationshipStatus || item.relationshipStatus?.includes(filters.relationshipStatus);
    const stageMatch = !filters.lifeStageMoment || item.lifeStageMoment?.includes(filters.lifeStageMoment);

    return ageMatch && pensionMatch && stateMatch && homeMatch && relationMatch && stageMatch;
  });

  return (
    <div className="p-6 space-y-6">
      <Filters onFilterChange={setFilters} />
      <div className="grid gap-4 md:grid-cols-2">
        {filteredData.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    </div>
  );
}