import { filters } from '../utils/filter.js';

function generateFilter (points) {
  return Object.entries(filters).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length
    }),
  );
}

export { generateFilter };
