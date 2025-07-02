import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Brain, Users, Calendar } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Job } from '../types';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [matchingCandidates, setMatchingCandidates] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      const mockJobs: Job[] = [
        {
          id: '1',
          title: 'Consultant Cardiologist',
          client: 'Royal London Hospital',
          location: 'London, UK',
          type: 'permanent',
          specialization: 'Cardiology',
          salary: '£80,000 - £120,000',
          description: 'We are seeking an experienced Consultant Cardiologist to join our dynamic team. The successful candidate will provide comprehensive cardiac care including diagnostic procedures, interventional cardiology, and patient management.',
          requirements: ['GMC Registration', 'CCT in Cardiology', '5+ years experience', 'Interventional cardiology experience preferred'],
          postedDate: '2024-01-10T09:00:00Z',
          status: 'open',
          urgency: 'high'
        },
        {
          id: '2',
          title: 'Emergency Medicine Registrar',
          client: 'Manchester Royal Infirmary',
          location: 'Manchester, UK',
          type: 'contract',
          specialization: 'Emergency Medicine',
          salary: '£45,000 - £55,000',
          description: 'Locum Emergency Medicine Registrar position available for immediate start. Experience in acute care and emergency procedures essential.',
          requirements: ['GMC Registration', 'MRCP or equivalent', 'Emergency medicine experience', 'ACLS certification'],
          postedDate: '2024-01-12T14:30:00Z',
          status: 'open',
          urgency: 'medium'
        },
        {
          id: '3',
          title: 'Pediatric Consultant',
          client: 'Birmingham Children\'s Hospital',
          location: 'Birmingham, UK',
          type: 'permanent',
          specialization: 'Pediatrics',
          salary: '£75,000 - £95,000',
          description: 'Join our pediatric team as a Consultant Pediatrician. You will be responsible for providing high-quality care to children and adolescents.',
          requirements: ['GMC Registration', 'CCT in Pediatrics', 'Child protection training', 'Research experience preferred'],
          postedDate: '2024-01-08T11:15:00Z',
          status: 'filled',
          urgency: 'low'
        }
      ];
      
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedType, selectedStatus]);

  const handleFindMatches = async (jobId: string) => {
    setMatchingCandidates(true);
    // Simulate AI candidate matching
    setTimeout(() => {
      setMatchingCandidates(false);
      alert('AI matching complete! Check the Dashboard for results.');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
          <p className="mt-2 text-gray-600">Manage job postings and find the perfect candidates</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Types</option>
              <option value="permanent">Permanent</option>
              <option value="contract">Contract</option>
              <option value="locum">Locum</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.client}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <StatusBadge status={job.status} type="job" />
                  <StatusBadge status={job.urgency} type="urgency" />
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{job.salary}</p>
                <p className="text-sm text-gray-600 mb-2">{job.specialization} • {job.type}</p>
                <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Key Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{job.requirements.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFindMatches(job.id)}
                    disabled={matchingCandidates || job.status !== 'open'}
                    className="flex items-center px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {matchingCandidates ? (
                      <LoadingSpinner size="sm" className="mr-1" />
                    ) : (
                      <Brain className="w-3 h-3 mr-1" />
                    )}
                    Find Matches
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found matching your criteria.</p>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.client} • {selectedJob.location}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedJob.salary}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <p className="text-gray-900 capitalize">{selectedJob.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <p className="text-gray-900">{selectedJob.specialization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={selectedJob.status} type="job" />
                    <StatusBadge status={selectedJob.urgency} type="urgency" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="text-gray-900">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleFindMatches(selectedJob.id)}
                  disabled={matchingCandidates || selectedJob.status !== 'open'}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {matchingCandidates ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Users className="w-4 h-4 mr-2" />
                  )}
                  Find Matching Candidates
                </button>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}