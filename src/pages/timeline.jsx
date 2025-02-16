import React from 'react';

const TimelineData = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'Our journey began in a small garage with big dreams.',
    imageAlt: 'Company founding'
  },
  {
    year: '2021',
    title: 'First Major Project',
    description: 'Successfully launched our flagship product to market.',
    imageAlt: 'Product launch'
  },
  {
    year: '2022',
    title: 'International Expansion',
    description: 'Opened offices in three new countries.',
    imageAlt: 'Global expansion'
  },
  {
    year: '2023',
    title: 'Industry Award',
    description: 'Recognized as the most innovative company in our sector.',
    imageAlt: 'Award ceremony'
  }
];

const Timeline = () => {
  return (
    <div className="max-w-4xl p-4 mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-center">Our Journey</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute w-1 h-full transform -translate-x-1/2 bg-blue-200 left-1/2"></div>
        
        {TimelineData.map((item, index) => (
          <div key={index} className="relative mb-12">
            {/* Content container */}
            <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              {/* Timeline content */}
              <div className="w-1/2 px-6">
                <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                 
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2">
                <div className="w-4 h-4 bg-blue-500 border-4 border-white rounded-full"></div>
              </div>

              {/* Image container */}
              <div className="w-1/2 px-6">
                <div className={`${index % 2 === 0 ? 'pl-6' : 'pr-6'}`}>
                  <img
                    src={`/api/placeholder/300/200`}
                    alt={item.imageAlt}
                    className="object-cover w-full rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;