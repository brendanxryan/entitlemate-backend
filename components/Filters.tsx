'use client';
import { useEffect, useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: {
    ageGroups: string[];
    pensionTypes: string[];
    state: string;
    homeOwnership: string[];
    relationshipStatus: string[];
    lifeStageMoment: string[];
    cardTypes: string[];
    lifeStages: string[];
  }) => void;
  ageOptions: string[];
  pensionOptions: string[];
  stateOptions: string[];
  homeOptions: string[];
  relationshipOptions: string[];
  stageOptions: string[];
  cardTypeOptions: string[];
  lifeStageOptions: string[];
}

export default function Filters({ 
  onFilterChange, 
  ageOptions, 
  pensionOptions, 
  stateOptions, 
  homeOptions, 
  relationshipOptions, 
  stageOptions,
  cardTypeOptions,
  lifeStageOptions 
}: FiltersProps) {
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [pensionTypes, setPensionTypes] = useState<string[]>([]);
  const [state, setState] = useState('');
  const [homeOwnership, setHomeOwnership] = useState<string[]>([]);
  const [relationshipStatus, setRelationshipStatus] = useState<string[]>([]);
  const [lifeStageMoment, setLifeStageMoment] = useState<string[]>([]);
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [lifeStages, setLifeStages] = useState<string[]>([]);

  useEffect(() => {
    console.log('Filters updated:', {
      ageGroups,
      pensionTypes,
      state,
      homeOwnership,
      relationshipStatus,
      lifeStageMoment,
      cardTypes,
      lifeStages
    });
    
    onFilterChange({
      ageGroups,
      pensionTypes,
      state,
      homeOwnership,
      relationshipStatus,
      lifeStageMoment,
      cardTypes,
      lifeStages
    });
  }, [ageGroups, pensionTypes, state, homeOwnership, relationshipStatus, lifeStageMoment, cardTypes, lifeStages, onFilterChange]);

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
        <label className="font-semibold mb-2 block">Home Ownership</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="home-ownership">
          {homeOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={homeOwnership.includes(option)}
                onChange={() => toggle(homeOwnership, option, setHomeOwnership)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold mb-2 block">Relationship Status</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="relationship-status">
          {relationshipOptions.map(option => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={relationshipStatus.includes(option)}
                onChange={() => toggle(relationshipStatus, option, setRelationshipStatus)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold mb-2 block">Life Stage</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="life-stage">
          {lifeStageOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggle(lifeStages, option, setLifeStages)}
              className={`px-3 py-1 rounded border ${lifeStages.includes(option) ? 'bg-purple-500 text-white' : 'bg-white'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-semibold mb-2 block">Life Stage Moment</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="life-stage-moment">
          {stageOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggle(lifeStageMoment, option, setLifeStageMoment)}
              className={`px-3 py-1 rounded border ${lifeStageMoment.includes(option) ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="card-type" className="font-semibold mb-2 block">Card Type</label>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="card-type">
          {cardTypeOptions.map(option => (
            <button
              key={option}
              id={`card-type-${option}`}
              name="card-type"
              type="button"
              onClick={() => toggle(cardTypes, option, setCardTypes)}
              className={`px-3 py-1 rounded border ${
                cardTypes.includes(option) ? 'bg-orange-500 text-white' : 'bg-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}