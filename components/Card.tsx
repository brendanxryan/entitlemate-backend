interface CardProps {
  item: {
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
    CardType: string;
    LifeStage: string;
  };
  className?: string;
}

export default function Card({ item, className = '' }: CardProps) {
  // Only apply bg-white if no color class is present
  const hasBg = className.includes('bg-');
  return (
    <div className={`border rounded-xl p-4 shadow ${hasBg ? '' : 'bg-white'} ${className}`}>
      <div className="mb-2 font-bold text-lg text-gray-800">{item.Headline}</div>
      <div className="inline-block bg-blue-100 text-blue-900 font-semibold px-3 py-1 rounded mb-2" style={{fontSize: '1.1rem'}}>{item.Name}</div>
      <p className="text-gray-700 mt-2">{item.Description}</p>
      {item.ValueEstimate && (
        <p className="text-sm mt-2 font-medium text-green-600">
          Estimated value: ${item.ValueEstimate}
        </p>
      )}
      <div className="mt-3 text-sm text-gray-500">
        <p>Available in: {item.State}</p>
        <p>Age groups: {item.AgeGroup}</p>
        {item.Card && <p>Required card: {item.Card}</p>}
        {item.Category && <p>Category: {item.Category}</p>}
      </div>
      {item.GovLink && (
        <div className="mt-3">
          <a
            id={`apply-link-${item.Name.toLowerCase().replace(/\s+/g, '-')}`}
            href={item.GovLink}
            className="text-blue-700 underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </div>
      )}
    </div>
  );
}