interface CardProps {
    item: {
      name: string;
      headline: string;
      description: string;
      govLink: string;
      explainerLink?: string;
      valueEstimate?: string;
    };
  }
  
  export default function Card({ item }: CardProps) {
    return (
      <div className="border rounded-xl p-4 shadow bg-white">
        <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
        <p className="text-gray-700">{item.headline}</p>
        {item.valueEstimate && (
          <p className="text-sm mt-1 font-medium text-green-600">
            {item.valueEstimate}
          </p>
        )}
        <div className="mt-3 flex gap-3">
          <a
            href={item.govLink}
            className="text-blue-700 underline text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
          {item.explainerLink && (
            <a
              href={item.explainerLink}
              className="text-blue-700 underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    );
  }