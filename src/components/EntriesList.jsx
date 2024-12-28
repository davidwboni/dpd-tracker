import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import _ from 'lodash';

const EntriesList = ({ logs, onDeleteEntry }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedLogs = _.orderBy(logs, [sortBy], [sortOrder]);
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const paginatedLogs = sortedLogs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const SortButton = ({ field, label }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
    >
      {label}
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
      {sortBy !== field && <ArrowUpDown className="w-4 h-4" />}
    </Button>
  );

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-gray-800 dark:text-white">Delivery Entries</span>
          <div className="flex gap-2 text-sm">
            <SortButton field="date" label="Date" />
            <SortButton field="stops" label="Stops" />
            <SortButton field="total" label="Amount" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-2">
            {paginatedLogs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {new Date(log.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {log.stops} stops {log.extra > 0 ? `+ £${log.extra}` : ''}
                  </div>
                  {log.notes && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {log.notes}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-medium text-gray-800 dark:text-white">
                    £{log.total.toFixed(2)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteEntry(log.id)}
                    className="hover:text-red-500 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-gray-600 dark:text-gray-300"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-gray-600 dark:text-gray-300"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntriesList;