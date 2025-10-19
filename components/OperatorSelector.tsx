'use client';

import { useState, useEffect } from 'react';

interface Operator {
  id: string;
  name: string;
  location: string;
}

interface OperatorSelectorProps {
  onOperatorChange: (operatorId: string | null) => void;
  selectedOperator: string | null;
}

export default function OperatorSelector({
  onOperatorChange,
  selectedOperator,
}: OperatorSelectorProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOperators() {
      try {
        const response = await fetch('/api/gbfs/operators');
        const data = await response.json();
        setOperators(data.operators);
      } catch (error) {
        console.error('Error fetching operators:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOperators();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <label
        htmlFor="operator-select"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Select Operator
      </label>
      <select
        id="operator-select"
        value={selectedOperator || ''}
        onChange={(e) => onOperatorChange(e.target.value || null)}
        className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Operators (Top 3)</option>
        {operators.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.name} - {operator.location}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Select an operator to view detailed live data
      </p>
    </div>
  );
}
