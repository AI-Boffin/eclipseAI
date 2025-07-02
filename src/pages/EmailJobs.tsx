import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, Eye, UserCheck, AlertTriangle, CheckCircle, Clock, Brain } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { EmailIntegrationService } from '../services/email-integration';
import type { EmailJob, Job, RecruitmentAgent, CandidateMatch } from '../types';

export default function EmailJobs() {
  const [emailJobs, setEmailJobs] = useState<EmailJob[]>([]);
  const [processedJobs, setProcessedJobs] = useState<Job[]>([]);
  const [agents] = useState<RecruitmentAgent[]>([
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@agency.com',
      specializations: ['Cardiology', 'General Medicine'],
      grades: ['Consultant', 'ST4-ST8'],
      locations: ['London', 'South East'],
      isActive: true,
      workload: 65
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@agency.com',
      specializations: ['Emergency Medicine', 'Acute Care'],
      grades: ['ST1-ST8', 'SHO'],
      locations: ['Manchester', 'North West'],
      isActive: true,
      workload: 45
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma@agency.com',
      specializations: ['Pediatrics', 'General'],
      grades: ['Consultant', 'ST4-ST8'],
      locations: ['Birmingham', 'Midlands'],
      isActive: true,
      workload: 70
    }
  ]);
  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailJob | null>(null);
  const [notifications, setNotifications] = useState<Array<{ agentId: string; jobId: string; message: string; priority: string }>>([]);

  const emailService = new EmailIntegrationService('mock-openai-key', {
    host: 'imap.gmail.com',
    port: 993,
    user: 'jobs@agency.com',
    password: 'app-password',
    tls: true
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const emails = await emailService.fetchNewEmails();
      setEmailJobs(emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const processEmails = async () => {
    setProcessing(true);
    try {
      const mockCandidates = [
        {
          id: '1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          experience: 8,
          status: 'active',
          cvSummary: 'Experienced Cardiologist with interventional expertise'
        },
        {
          id: '2',
          name: 'Dr. Michael Chen',
          specialization: 'Emergency Medicine',
          experience: 12,
          status: 'active',
          cvSummary: 'Senior Emergency Medicine physician with trauma experience'
        }
      ];

      const result = await emailService.processEmailJobs(emailJobs, agents, mockCandidates);
      
      setProcessedJobs(result.jobs);
      setMatches(result.matches);
      setNotifications(result.notifications);
      
      // Mark emails as processed
      setEmailJobs(prev => prev.map(email => ({ ...email, processed: true })));
    } catch (error) {
      console.error('Error processing emails:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unassigned';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Job Integration</h1>
          <p className="mt-2 text-gray-600">Automatically process NHS job emails and assign to recruitment agents</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Fetch Emails
          </button>
          <button
            onClick={processEmails}
            disabled={processing || emailJobs.length === 0}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {processing ? <LoadingSpinner size="sm" className="mr-2" /> : <Brain className="w-4 h-4 mr-2" />}
            Process with AI
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Agent Notifications</h3>
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <div key={index} className={`p-3 rounded-lg ${getPriorityColor(notification.priority)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{getAgentName(notification.agentId)}</span>
                  <StatusBadge status={notification.priority} type="urgency" />
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Incoming Emails */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Incoming NHS Job Emails ({emailJobs.length})
            </h2>
          </div>
          <div className="p-6">
            {emailJobs.length > 0 ? (
              <div className="space-y-4">
                {emailJobs.map((email) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{email.subject}</h3>
                        <p className="text-sm text-gray-600">From: {email.from}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(email.receivedDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {email.processed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                        <button
                          onClick={() => setSelectedEmail(email)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {email.body.substring(0, 150)}...
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No new job emails found</p>
                <button
                  onClick={fetchEmails}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Refresh to check for new emails
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Processed Jobs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Processed Jobs & Agent Assignments ({processedJobs.length})
            </h2>
          </div>
          <div className="p-6">
            {processedJobs.length > 0 ? (
              <div className="space-y-4">
                {processedJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.client} • {job.location}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <StatusBadge status={job.urgency} type="urgency" />
                          {job.grade && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {job.grade}
                            </span>
                          )}
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {job.specialization}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {job.assignedAgent && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              Assigned to: {getAgentName(job.assignedAgent)}
                            </p>
                            <p className="text-xs text-green-700">
                              {job.matchedCandidates?.length || 0} candidate matches found
                            </p>
                          </div>
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    )}

                    {job.matchedCandidates && job.matchedCandidates.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">Top Matches:</p>
                        <div className="space-y-1">
                          {job.matchedCandidates.slice(0, 2).map((match) => (
                            <div key={match.candidateId} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Candidate {match.candidateId}</span>
                              <div className="flex items-center space-x-2">
                                <StatusBadge status={match.priority} type="urgency" />
                                <span className="font-medium text-gray-900">{match.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No processed jobs yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Process emails with AI to see job assignments
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Workload Overview */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Agent Workload & Specializations</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{agent.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Workload</span>
                    <span className="font-medium">{agent.workload}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        agent.workload >= 80 ? 'bg-red-500' : 
                        agent.workload >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${agent.workload}%` }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specializations.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Locations:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.locations.map((loc) => (
                      <span key={loc} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Email Details</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Subject:</h3>
                <p className="text-gray-700">{selectedEmail.subject}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">From:</h3>
                <p className="text-gray-700">{selectedEmail.from}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Received:</h3>
                <p className="text-gray-700">{new Date(selectedEmail.receivedDate).toLocaleString()}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Content:</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEmail.body}</pre>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedEmail(null)}
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