import React, { useState, useEffect } from 'react';
import { Users, Briefcase, AlertTriangle, TrendingUp, Mail, FileText } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Candidate, Job, CandidateMatch } from '../types';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setCandidates([
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+44 7700 900123',
          specialization: 'Cardiology',
          experience: 8,
          location: 'London, UK',
          lastActive: '2024-01-15T10:30:00Z',
          status: 'active',
          compliance: { dbs: true, rightToWork: true, registration: true },
          cvSummary: '• Experienced Cardiologist with 8 years in interventional cardiology\n• Specialized in complex cardiac procedures and heart failure management\n• Published researcher with strong academic background'
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          email: 'michael.chen@email.com',
          phone: '+44 7700 900124',
          specialization: 'Emergency Medicine',
          experience: 12,
          location: 'Manchester, UK',
          lastActive: '2024-01-14T15:45:00Z',
          status: 'active',
          compliance: { dbs: true, rightToWork: true, registration: false }
        }
      ]);

      setJobs([
        {
          id: '1',
          title: 'Consultant Cardiologist',
          client: 'Royal London Hospital',
          location: 'London, UK',
          type: 'permanent',
          specialization: 'Cardiology',
          salary: '£80,000 - £120,000',
          description: 'Exciting opportunity for an experienced Cardiologist...',
          requirements: ['GMC Registration', 'CCT in Cardiology', '5+ years experience'],
          postedDate: '2024-01-10T09:00:00Z',
          status: 'open',
          urgency: 'high'
        }
      ]);

      setMatches([
        {
          candidateId: '1',
          jobId: '1',
          score: 92,
          reasoning: 'Excellent match with strong cardiology background and relevant experience',
          matchedSkills: ['Cardiology', 'Clinical Experience', 'GMC Registration'],
          gaps: ['Specific hospital system experience']
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getComplianceIssues = () => {
    return candidates.filter(candidate => 
      !candidate.compliance.dbs || 
      !candidate.compliance.rightToWork || 
      !candidate.compliance.registration
    );
  };

  const getUrgentJobs = () => {
    return jobs.filter(job => job.urgency === 'high' && job.status === 'open');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your recruitment activities and AI insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Candidates</p>
              <p className="text-2xl font-bold text-gray-900">{candidates.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'open').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Compliance Issues</p>
              <p className="text-2xl font-bold text-gray-900">{getComplianceIssues().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Matches</p>
              <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Candidate Matches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Candidate Matches</h2>
            <p className="text-sm text-gray-600">AI-powered candidate-job matching results</p>
          </div>
          <div className="p-6">
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => {
                  const candidate = candidates.find(c => c.id === match.candidateId);
                  const job = jobs.find(j => j.id === match.jobId);
                  
                  return (
                    <div key={`${match.candidateId}-${match.jobId}`} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{candidate?.name}</h3>
                          <p className="text-sm text-gray-600">{job?.title}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{match.score}%</div>
                          <p className="text-xs text-gray-500">Match Score</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{match.reasoning}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.slice(0, 2).map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
                          <Mail className="w-3 h-3 mr-1" />
                          Send Email
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No matches found. AI matching will appear here.</p>
            )}
          </div>
        </div>

        {/* Compliance Issues */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Compliance Issues</h2>
            <p className="text-sm text-gray-600">Candidates requiring attention</p>
          </div>
          <div className="p-6">
            {getComplianceIssues().length > 0 ? (
              <div className="space-y-4">
                {getComplianceIssues().map((candidate) => (
                  <div key={candidate.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                      <StatusBadge status={candidate.status} type="candidate" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">DBS:</span>
                        <StatusBadge status={candidate.compliance.dbs} type="compliance" />
                      </div>
                      <div>
                        <span className="text-gray-500">RTW:</span>
                        <StatusBadge status={candidate.compliance.rightToWork} type="compliance" />
                      </div>
                      <div>
                        <span className="text-gray-500">Reg:</span>
                        <StatusBadge status={candidate.compliance.registration} type="compliance" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No compliance issues found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Urgent Jobs */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Urgent Jobs</h2>
          <p className="text-sm text-gray-600">High priority positions needing immediate attention</p>
        </div>
        <div className="p-6">
          {getUrgentJobs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getUrgentJobs().map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <StatusBadge status={job.urgency} type="urgency" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{job.client} • {job.location}</p>
                  <p className="text-sm font-medium text-gray-900 mb-3">{job.salary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                    <button className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors">
                      <FileText className="w-3 h-3 mr-1" />
                      Find Matches
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No urgent jobs at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}