'use client';
import { useEffect, useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: {
    ageGroups: string[];
    pensionTypes: string[];
    state: string;
    homeOwnership: string;
    relationshipStatus: string;
    lifeStageMoment: string;
  }) => void;
}

// Updated options to match backend data
const ageOptions = ['<55', '55-60', '60-65', '65-67', '67-75', '75+'];
const pensionOptions = ['AgePensionFull', 'AgePensionPart', 'Commonwealth Seniors Health Card'];
const stateOptions = ['NSW', 'VIC', 'QLD', 'All'];
const homeOptions = ['HomeOwner', 'Non-homeowner'];
const relationshipOptions = ['Single', 'Couple'];
const stageOptions = ['Turning67', 'StartingaFamily', 'AgedCare', 'RetirementVillage', 'Downsizing'];

export default function Filters({ onFilterChange }: FiltersProps) {
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [pensionTypes, setPensionTypes] = useState<string[]>([]);
  const [state, setState] = useState('');
  const [homeOwnership, setHomeOwnership] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [lifeStageMoment, setLifeStageMoment] = useState('');

  useEffect(() => {
    console.log('Filters updated:', {
      ageGroups,
      pensionTypes,
      state,
      homeOwnership,
      relationshipStatus,
      lifeStageMoment,
    });
    
    onFilterChange({
      ageGroups,
      pensionTypes,
      state,
      homeOwnership,
      relationshipStatus,
      lifeStageMoment,
    });
  }, [ageGroups, pensionTypes, state, homeOwnership, relationshipStatus, lifeStageMoment, onFilterChange]);

  const toggle = (list: string[], value: string, setter: Function) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  return (
    <form id="filters-form" className="space-y-4 p-4 bg-gray-50 rounded-lg" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="age-group" className="font-semibold mb-2 block">Age Group</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="age-group">
          {ageOptions.map(option => (
            <button
              key={option}
              id={`age-${option}`}
              name="age-group"
              type="button"
              onClick={() => toggle(ageGroups, option, setAgeGroups)}
              className={`px-3 py-1 rounded border ${
                ageGroups.includes(option) ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="pension-type" className="font-semibold mb-2 block">Pension Type</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="pension-type">
          {pensionOptions.map(option => (
            <button
              key={option}
              id={`pension-${option}`}
              name="pension-type"
              type="button"
              onClick={() => toggle(pensionTypes, option, setPensionTypes)}
              className={`px-3 py-1 rounded border ${
                pensionTypes.includes(option) ? 'bg-green-500 text-white' : 'bg-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="state-select" className="font-semibold mb-2 block">State</label>
        <select
          id="state-select"
          name="state"
          value={state}
          onChange={e => setState(e.target.value)}
          className="border rounded px-2 py-1 bg-white w-full"
        >
          <option value="">All States</option>
          {stateOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="home-ownership" className="font-semibold mb-2 block">Home Ownership</label>
        <select
          id="home-ownership"
          name="home-ownership"
          value={homeOwnership}
          onChange={e => setHomeOwnership(e.target.value)}
          className="border rounded px-2 py-1 bg-white w-full"
        >
          <option value="">Any</option>
          {homeOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="relationship-status" className="font-semibold mb-2 block">Relationship Status</label>
        <select
          id="relationship-status"
          name="relationship-status"
          value={relationshipStatus}
          onChange={e => setRelationshipStatus(e.target.value)}
          className="border rounded px-2 py-1 bg-white w-full"
        >
          <option value="">Any</option>
          {relationshipOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="life-stage" className="font-semibold mb-2 block">Life Stage Moment</label>
        <select
          id="life-stage"
          name="life-stage"
          value={lifeStageMoment}
          onChange={e => setLifeStageMoment(e.target.value)}
          className="border rounded px-2 py-1 bg-white w-full"
        >
          <option value="">Any</option>
          {stageOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}