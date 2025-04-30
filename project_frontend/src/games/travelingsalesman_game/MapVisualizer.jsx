import React, { useMemo } from 'react';

const MapVisualizer = ({ cities, distanceMatrix, homeCity, selectedCities }) => {
  const width = 770;
  const height = 500;

  // Stable city positions
  const cityPositions = useMemo(() => {
    return cities.map(() => ({
      x: Math.floor(Math.random() * (width - 120)) + 60,
      y: Math.floor(Math.random() * (height - 120)) + 60,
    }));
  }, [cities]);

  // Track drawn lines
  const drawnLines = new Set();

  const getLineKey = (i, j) => `${Math.min(i, j)}-${Math.max(i, j)}`;

  return (
    <div style={{ marginTop: 30, padding: 16, borderRadius: 12, background: '#313131', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h3 style={{ textAlign: 'center', color: 'white', marginBottom: 12 }}>City Map</h3>

      <svg width={width} height={height} style={{ borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
        {/* Distance lines */}
        {cities.map((_, i) =>
          cities.map((_, j) => {
            const shouldDraw =
              i !== j &&
              (selectedCities.includes(i) && selectedCities.includes(j)) ||
              (i === homeCity && selectedCities.includes(j)) ||
              (j === homeCity && selectedCities.includes(i));

            const key = getLineKey(i, j);

            if (shouldDraw && !drawnLines.has(key)) {
              drawnLines.add(key);

              const x1 = cityPositions[i].x;
              const y1 = cityPositions[i].y;
              const x2 = cityPositions[j].x;
              const y2 = cityPositions[j].y;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={key}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    strokeDasharray="3"
                  />
                  <text
                    x={midX + 6}
                    y={midY - 4}
                    fontSize="11"
                    fill="#374151"
                    background="#FFF"
                    pointerEvents="none"
                  >
                    {distanceMatrix[i][j]} km
                  </text>
                </g>
              );
            }
            return null;
          })
        )}

        {/* Cities */}
        {cities.map((city, i) => (
          <g key={i}>
            <circle
              cx={cityPositions[i].x}
              cy={cityPositions[i].y}
              r={homeCity === i ? 12 : 9}
              fill={homeCity === i ? '#3B82F6' : selectedCities.includes(i) ? '#10B981' : '#D1D5DB'}
              stroke="#111827"
              strokeWidth={homeCity === i ? 2 : 1}
            />
            <text
              x={cityPositions[i].x + 12}
              y={cityPositions[i].y + 4}
              fontSize="13"
              fontWeight="bold"
              fill="#1F2937"
            >
              {city}
            </text>
            {homeCity === i && (
              <text
                x={cityPositions[i].x}
                y={cityPositions[i].y - 16}
                fontSize="10"
                fill="#1D4ED8"
                textAnchor="middle"
              >
                Home
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default MapVisualizer;
