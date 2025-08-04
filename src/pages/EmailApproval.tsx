import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Edit, Send, Clock, AlertTriangle, Brain, RefreshCw } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { DoctorCommunicationService, type DoctorEmail } from '../services/doctor-communication';
import type { Candidate, Job, RecruitmentAgent } from '../types';

export default function EmailApproval() {
  const [pendingEmails, setPendingEmails] = useState<DoctorEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<DoctorEmail | null>(null);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<{ subject: string; body: string }>({ subject: '', body: '' });

  // Mock data - in real app, this would come from database
  const [candidates] = useState<Candidate[]>([
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
      compliance: { dbs: true, rightToWork: true, registration: true }
    }
  ]);

  const [jobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Consultant Cardiologist',
      client: 'Royal London Hospital',
      location: 'London, UK',
      type: 'permanent',
      specialization: 'Cardiology',
      salary: '£80,000 - £120,000',
      description: 'Consultant Cardiologist position',
      requirements: ['GMC Registration', 'CCT in Cardiology', '5+ years experience'],
      postedDate: '2024-01-15T10:30:00Z',
      status: 'open',
      urgency: 'high',
      grade: 'Consultant',
      source: 'email'
    }
  ]);

  const [agents] = useState<RecruitmentAgent[]>([
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@agency.com',
      specializations: ['Cardiology', 'General Medicine'],
      grades: ['Consultant', 'ST4-ST8'],
      locations: ['London', 'South East'],
      isActive: true,
      workload: 65,
      capacity: {
        maxActiveJobs: 15,
        maxCandidates: 50,
        hoursPerWeek: 40
      },
      metrics: {
        activeJobs: 12,
        candidatesManaged: 35,
        emailsProcessed: 45,
        placementsMade: 8,
        avgResponseTime: 4.5,
        lastActivity: new Date().toISOString(),
        weeklyHours: 38,
        monthlyTargets: {
          placements: 10,
          interviews: 25,
          newCandidates: 15
        },
        performance: {
          placementRate: 85,
          candidateResponseRate: 78,
          clientSatisfaction: 92
        }
      },
      preferences: {
        urgencyWeighting: 8,
        locationRadius: 50,
        autoAssignment: true
      }
    }
  ]);

  useEffect(() => {
    fetchPendingEmails();
  }, []);

  const fetchPendingEmails = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, fetch from database
      const mockPendingEmails: DoctorEmail[] = [
        {
          id: '1',
          candidateId: '1',
          jobId: '1',
          type: 'job_opportunity',
          subject: 'Exciting Cardiology Opportunity at Royal London Hospital',
          body: `Dear Dr. Sarah Johnson,

I hope this email finds you well. I'm reaching out because I believe you would be an excellent fit for a Cardiology position we have available.

Position: Consultant Cardiologist
Location: London, UK
Salary: £80,000 - £120,000
Type: Permanent

This role at Royal London Hospital offers an exciting opportunity to work in a dynamic healthcare environment. Given your 8 years of experience in Cardiology, I believe this position aligns perfectly with your expertise.

Key requirements include:
• GMC Registration
• CCT in Cardiology
• 5+ years experience

Would you be interested in learning more about this opportunity? I'd be happy to discuss the details and answer any questions you might have.

Best regards,
Sarah Mitchell
Recruitment Consultant`,
          status: 'pending_approval',
          aiGenerated: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          candidateId: '1',
          jobId: '1',
          type: 'compliance_request',
          subject: 'Compliance Documentation Required',
          body: `Dear Dr. Sarah Johnson,

Thank you for your interest in our opportunities. To proceed with your application, we need to collect some additional compliance documentation.

Missing documents:
• Updated CV
• Professional References

Please provide these documents at your earliest convenience. You can upload them through our secure portal or email them directly to me.

If you have any questions about the required documentation, please don't hesitate to reach out.

Best regards,
Your Recruitment Team`,
          status: 'pending_approval',
          aiGenerated: true,
          createdAt: new Date().toISOString()
        }
      ];

      setPendingEmails(mockPendingEmails);
    } catch (error) {
      console.error('Error fetching pending emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (emailId: string) => {
    setApproving(emailId);
    try {
      // In real app, update database and send email
      setPendingEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, status: 'approved' as const, agentApproved: true }
          : email
      ));
      
      // Simulate sending email
      setTimeout(() => {
        setPendingEmails(prev => prev.map(email => 
          email.id === emailId 
            ? { ...email, status: 'sent' as const, sentAt: new Date().toISOString() }
            : email
        ));
      }, 1000);
    } catch (error) {
      console.error('Error approving email:', error);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (emailId: string) => {
    setRejecting(emailId);
    try {
      setPendingEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, status: 'rejected' as const }
          : email
      ));
    } catch (error) {
      console.error('Error rejecting email:', error);
    } finally {
      setRejecting(null);
    }
  };

  const handleEdit = (email: DoctorEmail) => {
    setSelectedEmail(email);
    setEditedContent({ subject: email.subject, body: email.body });
    setEditing(email.id);
  };

  const handleSaveEdit = async () => {
    if (!selectedEmail) return;
    
    try {
      setPendingEmails(prev => prev.map(email => 
        email.id === selectedEmail.id 
          ? { 
              ...email, 
              subject: editedContent.subject, 
              body: editedContent.body,
              aiGenerated: false,
              agentNotes: 'Edited by agent'
            }
          : email
      ));
      setSelectedEmail(null);
      setEditing(null);
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate?.name || 'Unknown Candidate';
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || 'Unknown Job';
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.name || 'Unknown Agent';
  };

  const getEmailTypeIcon = (type: string) => {
    switch (type) {
      case 'job_opportunity':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'compliance_request':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'interview_invitation':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Mail className="w-4 h-4 text-gray-600" />;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Email Approval Queue</h1>
          <p className="mt-2 text-gray-600">Review and approve AI-generated emails before sending</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPendingEmails}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingEmails.filter(e => e.status === 'pending_approval').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingEmails.filter(e => e.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Send className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sent Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingEmails.filter(e => e.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Brain className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">AI Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingEmails.filter(e => e.aiGenerated).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Emails */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approval</h2>
        </div>
        <div className="p-6">
          {pendingEmails.filter(e => e.status === 'pending_approval').length > 0 ? (
            <div className="space-y-4">
              {pendingEmails
                .filter(email => email.status === 'pending_approval')
                .map((email) => (
                  <div key={email.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getEmailTypeIcon(email.type)}
                          <h3 className="font-medium text-gray-900">{email.subject}</h3>
                          {email.aiGenerated && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center">
                              <Brain className="w-3 h-3 mr-1" />
                              AI Generated
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>To: {getCandidateName(email.candidateId)}</p>
                          <p>Job: {getJobTitle(email.jobId)}</p>
                          <p>Type: {email.type.replace('_', ' ')}</p>
                          <p>Created: {new Date(email.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(email)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(email.id)}
                          disabled={approving === email.id}
                          className="p-2 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          {approving === email.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(email.id)}
                          disabled={rejecting === email.id}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          {rejecting === email.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-3">{email.body}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-gray-500">No emails pending approval</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Email</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject:</label>
                <input
                  type="text"
                  value={editedContent.subject}
                  onChange={(e) => setEditedContent(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Body:</label>
                <textarea
                  value={editedContent.body}
                  onChange={(e) => setEditedContent(prev => ({ ...prev, body: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 