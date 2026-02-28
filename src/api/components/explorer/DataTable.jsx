import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Wind, Droplets, Leaf, Volume2, Search, Filter, Download, ChevronLeft, ChevronRight, Eye, Trash2, FlaskConical, Sun, Activity, HelpCircle, CheckCircle, Flag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const typeIcons = {
  air_quality: Wind,
  water_quality: Droplets,
  biodiversity: Leaf,
  noise_level: Volume2,
  waste: Trash2,
  soil_quality: FlaskConical,
  weather: Sun,
  radiation: Activity,
  custom: HelpCircle
};

const typeColors = {
  air_quality: "bg-sky-100 text-sky-700",
  water_quality: "bg-blue-100 text-blue-700",
  biodiversity: "bg-emerald-100 text-emerald-700",
  noise_level: "bg-amber-100 text-amber-700",
  waste: "bg-violet-100 text-violet-700",
  soil_quality: "bg-stone-100 text-stone-700",
  weather: "bg-indigo-100 text-indigo-700",
  radiation: "bg-rose-100 text-rose-700",
  custom: "bg-slate-100 text-slate-700"
};

const statusColors = {
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  validated: "bg-emerald-100 text-emerald-700 border-emerald-200",
  flagged: "bg-amber-100 text-amber-700 border-amber-200",
  rejected: "bg-rose-100 text-rose-700 border-rose-200"
};

const severityColors = {
  low: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-rose-100 text-rose-700"
};

export default function DataTable({ observations, onStatusUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedObs, setSelectedObs] = useState(null);
  const perPage = 10;

  const filteredData = observations?.filter(obs => {
    const matchesSearch = obs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obs.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || obs.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || obs.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage);

  const exportToCSV = () => {
    const headers = ['Title', 'Type', 'Location', 'Status', 'Severity', 'Date', 'Measurement'];
    const rows = filteredData.map(obs => [
      obs.title,
      obs.type,
      obs.location_name || `${obs.latitude}, ${obs.longitude}`,
      obs.status,
      obs.severity,
      format(new Date(obs.created_date), 'yyyy-MM-dd'),
      obs.measurement_value ? `${obs.measurement_value} ${obs.measurement_unit}` : ''
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'observations.csv';
    a.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header & Filters */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search observations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="air_quality">Air Quality</SelectItem>
                <SelectItem value="water_quality">Water Quality</SelectItem>
                <SelectItem value="biodiversity">Biodiversity</SelectItem>
                <SelectItem value="noise_level">Noise Level</SelectItem>
                <SelectItem value="waste">Waste Management</SelectItem>
                <SelectItem value="soil_quality">Soil Quality</SelectItem>
                <SelectItem value="weather">Weather</SelectItem>
                <SelectItem value="radiation">Radiation</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="validated">Validated</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-3">
          Showing {filteredData.length} observations
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Measurement</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right px-10">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((obs, index) => {
              const Icon = typeIcons[obs.type] || Wind;
              return (
                <motion.tr
                  key={obs.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell>
                    <div className={`w-9 h-9 rounded-lg ${typeColors[obs.type]} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{obs.title}</p>
                    {obs.species_name && (
                      <p className="text-sm text-slate-500 italic">{obs.species_name}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {obs.location_name || `${obs.latitude?.toFixed(4)}, ${obs.longitude?.toFixed(4)}`}
                  </TableCell>
                  <TableCell>
                    {obs.measurement_value ? (
                      <span className="font-medium">{obs.measurement_value} {obs.measurement_unit}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[obs.status]} border`}>
                      {obs.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={severityColors[obs.severity]}>
                      {obs.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {format(new Date(obs.created_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="px-10">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const count = (obs.upvotes || 0) + 1;
                          alert(`You validated this observation! Current community score: ${count}`);
                        }}
                        className="h-8 w-8 text-slate-300 hover:text-blue-500 hover:bg-blue-50 group/vote"
                        title="Community Upvote"
                      >
                        <div className="relative">
                          <CheckCircle className="w-4 h-4 group-hover/vote:scale-110 transition-transform" />
                          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-blue-500 text-white text-[7px] rounded-full flex items-center justify-center font-black">
                            {obs.upvotes || 0}
                          </span>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedObs(obs)}
                        className="h-8 w-8 text-slate-400 hover:text-teal-600 hover:bg-teal-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => typeof onStatusUpdate === 'function' && onStatusUpdate(obs.id, 'validated')}
                        className={`h-8 w-8 transition-colors ${obs.status === 'validated' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-emerald-600 hover:bg-emerald-50'}`}
                        title="Validate"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => typeof onStatusUpdate === 'function' && onStatusUpdate(obs.id, 'flagged')}
                        className={`h-8 w-8 transition-colors ${obs.status === 'flagged' ? 'text-amber-600 bg-amber-50' : 'text-slate-300 hover:text-amber-600 hover:bg-amber-50'}`}
                        title="Flag Issue"
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => typeof onStatusUpdate === 'function' && onStatusUpdate(obs.id, 'pending')}
                        className={`h-8 w-8 transition-colors ${obs.status === 'pending' ? 'text-slate-600 bg-slate-100' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
                        title="Reset to Pending"
                      >
                        <Clock className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedObs} onOpenChange={() => setSelectedObs(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedObs?.title}</DialogTitle>
          </DialogHeader>
          {selectedObs && (
            <div className="space-y-4">
              {selectedObs.image_url && (
                <img
                  src={selectedObs.image_url}
                  alt={selectedObs.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <p className="text-slate-600">{selectedObs.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="font-medium capitalize">{selectedObs.type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <Badge className={statusColors[selectedObs.status]}>{selectedObs.status}</Badge>
                </div>
                <div>
                  <p className="text-slate-500">Location</p>
                  <p className="font-medium">{selectedObs.location_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Coordinates</p>
                  <p className="font-medium">{selectedObs.latitude?.toFixed(4)}, {selectedObs.longitude?.toFixed(4)}</p>
                </div>
                {selectedObs.measurement_value && (
                  <div>
                    <p className="text-slate-500">Measurement</p>
                    <p className="font-medium">{selectedObs.measurement_value} {selectedObs.measurement_unit}</p>
                  </div>
                )}
                {selectedObs.confidence_score && (
                  <div>
                    <p className="text-slate-500">AI Confidence</p>
                    <p className="font-medium">{selectedObs.confidence_score}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}