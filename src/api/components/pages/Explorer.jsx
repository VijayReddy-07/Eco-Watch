import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import DataTable from '@api/components/explorer/DataTable';
import { Skeleton } from '@api/components/ui/skeleton';
import { generateDummyObservations } from '@/api/constants/dummyData';

export default function Explorer() {
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['observations'],
    queryFn: () => base44.entities.Observation.list('-created_date', 500),
    initialData: []
  });

  const [localObservations, setLocalObservations] = React.useState([]);

  React.useEffect(() => {
    if (apiData && apiData.length > 0) {
      setLocalObservations(apiData);
    } else {
      setLocalObservations(generateDummyObservations());
    }
  }, [apiData]);

  const handleStatusUpdate = async (id, status) => {
    // Immediate UI update
    setLocalObservations(prev => prev.map(o => o.id === id ? { ...o, status } : o));

    try {
      await base44.entities.Observation.update(id, { status });
    } catch (error) {
      console.error('Failed to update status on server:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Data Explorer</h1>
              <p className="text-slate-600 mt-1">
                Browse, search, and validate environmental observation data
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">Validation Mode Active</span>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <Skeleton className="h-[600px] rounded-2xl" />
        ) : (
          <DataTable
            observations={localObservations}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>
    </div>
  );
}