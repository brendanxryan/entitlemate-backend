'use client';
import { useEffect, useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: any) => void;
}

const ageOptions = ['<55', '55–60', '60–65', '65–67', '67–75', '75+'];
const pensionOptions = ['PAP', 'AP', 'CSHC'];
const stateOptions = ['NSW', 'VIC', 'QLD', 'All'];
const homeOptions = ['Homeowner', 'Non-homeowner'];
const relationshipOptions = ['Single', 'Couple'];
const stageOptions = ['Turning67', 'StartingAFamily', 'AgedCare', 'RetirementVillage', 'Downsizing'];

export default function Filters({ onFilterChange }: FiltersProps) {
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [pensionTypes, setPensionTypes] = useState<string[]>([]);
  const [state, setState] = useState('');
  const [homeOwnership, setHomeOwnership] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [lifeStageMoment, setLifeStageMoment] = useState('');

  useEffect(() => {
    onFilterChange({
      ageGroups,
      pensionTypes,
      state,
      homeOwnership,
      relationshipStatus,
      lifeStageMoment,
    });
  }, [ageGroups, pensionTypes, state, homeOwnership, relationshipStatus, lifeStageMoment]);

  const toggle = (list: string[], value: string, setter: Function) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">Age Group</p>
        <div className="flex flex-wrap gap-2">
          {ageOptions.map(option => (
            <button
              key={option}
              onClick={() => toggle(ageGroups, option, setAgeGroups)}
              className={`px-3 py-1 rounded border ${
                ageGroups.includes(option) ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold">Pension Type</p>
        <div className="flex flex-wrap gap-2">
          {pensionOptions.map(option => (
            <button
              key={option}
              onClick={() => toggle(pensionTypes, option, setPensionTypes)}
              className={`px-3 py-1 rounded border ${
                pensionTypes.includes(option) ? 'bg-green-500 text-white' : 'bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-semibold">State</p>
        <select
          value={state}
          onChange={e => setState(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          {stateOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="font-semibold">Home Ownership</p>
        <select
          value={homeOwnership}
          onChange={e => setHomeOwnership(e.target.value)}
          className="border rounded px-2 py-1"
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
        <p className="font-semibold">Relationship Status</p>
        <select
          value={relationshipStatus}
          onChange={e => setRelationshipStatus(e.target.value)}
          className="border rounded px-2 py-1"
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
        <p className="font-semibold">Life Stage Moment</p>
        <select
          value={lifeStageMoment}
          onChange={e => setLifeStageMoment(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Any</option>
          {stageOptions.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}