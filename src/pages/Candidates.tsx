import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Upload, Brain, Mail, Eye, AlertTriangle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { CSVService } from '../services/csv';
import { DoctorCommunicationService } from '../services/doctor-communication';
import type { Candidate, Job } from '../types';

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const [sendingCompliance, setSendingCompliance] = useState<string | null>(null);
  const [complianceService] = useState(() => new DoctorCommunicationService('mock-sendgrid-key', 'mock-openai-key'));

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      const mockCandidates: Candidate[] = [
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
        },
        {
          id: '3',
          name: 'Dr. Emma Williams',
          email: 'emma.williams@email.com',
          phone: '+44 7700 900125',
          specialization: 'Pediatrics',
          experience: 6,
          location: 'Birmingham, UK',
          lastActive: '2024-01-13T09:15:00Z',
          status: 'placed',
          compliance: { dbs: true, rightToWork: true, registration: true }
        }
      ];
      
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(candidate =>
        candidate.specialization === selectedSpecialization
      );
    }

    setFilteredCandidates(filtered);
  }, [candidates, searchTerm, selectedSpecialization]);

  const specializations = [...new Set(candidates.map(c => c.specialization))];

  const handleExportCSV = () => {
    const csvContent = CSVService.exportCandidates(filteredCandidates);
    CSVService.downloadCSV(csvContent, 'candidates.csv');
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedCandidates = CSVService.parseCandidatesCSV(content);
          setCandidates(prev => [...prev, ...importedCandidates]);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSummarizeCV = async (candidateId: string) => {
    setSummarizing(candidateId);
    // Simulate AI CV summarization
    setTimeout(() => {
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? {
              ...candidate,
              cvSummary: `• ${candidate.specialization} specialist with ${candidate.experience} years of clinical experience
• Strong background in ${candidate.location} healthcare system
• Excellent patient care and communication skills`
            }
          : candidate
      ));
      setSummarizing(null);
    }, 2000);
  };

  const handleSendComplianceRequest = async (candidate: Candidate) => {
    setSendingCompliance(candidate.id);
    try {
      // Get missing compliance documents
      const mockJob: Job = {
        id: 'mock',
        title: 'General Position',
        client: 'NHS Trust',
        location: 'UK',
        type: 'contract',
        specialization: candidate.specialization,
        salary: 'Competitive',
        description: 'General position',
        requirements: ['GMC Registration', 'DBS Check', 'Right to Work'],
        postedDate: new Date().toISOString(),
        status: 'open',
        urgency: 'medium',
        source: 'manual'
      };

      const requiredDocs = complianceService.getRequiredComplianceDocuments(mockJob);
      const missingDocs = complianceService.getMissingComplianceDocuments(candidate, requiredDocs);
      
      if (missingDocs.length > 0) {
        const missingDocNames = missingDocs.map(doc => doc.name);
        const emailContent = await complianceService.generateComplianceRequestEmail(candidate, missingDocNames);
        
        // In a real app, this would create an email in the approval queue
        console.log('Compliance request email generated:', emailContent);
        
        // Simulate sending
        setTimeout(() => {
          setSendingCompliance(null);
          alert(`Compliance request sent to ${candidate.name} for: ${missingDocNames.join(', ')}`);
        }, 1000);
      } else {
        setSendingCompliance(null);
        alert(`${candidate.name} has all required compliance documents.`);
      }
    } catch (error) {
      console.error('Error sending compliance request:', error);
      setSendingCompliance(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
          <p className="mt-2 text-gray-600">Manage your medical professionals and AI-powered insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      <div className="text-sm text-gray-500">{candidate.email}</div>
                      <div className="text-sm text-gray-500">{candidate.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {candidate.experience} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={candidate.status} type="candidate" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <StatusBadge status={candidate.compliance.dbs.toString()} type="compliance" />
                      <StatusBadge status={candidate.compliance.rightToWork.toString()} type="compliance" />
                      <StatusBadge status={candidate.compliance.registration.toString()} type="compliance" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSummarizeCV(candidate.id)}
                        disabled={summarizing === candidate.id}
                        className="text-purple-600 hover:text-purple-900 transition-colors disabled:opacity-50"
                      >
                        {summarizing === candidate.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleSendComplianceRequest(candidate)}
                        disabled={sendingCompliance === candidate.id}
                        className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                        title="Send Compliance Request"
                      >
                        {sendingCompliance === candidate.id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedCandidate.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedCandidate.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <p className="text-sm text-gray-900">{selectedCandidate.specialization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-sm text-gray-900">{selectedCandidate.experience} years</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedCandidate.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <StatusBadge status={selectedCandidate.status} type="candidate" />
                </div>
              </div>

              {selectedCandidate.cvSummary && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI CV Summary</label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">{selectedCandidate.cvSummary}</pre>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Status</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">DBS Check</p>
                    <StatusBadge status={selectedCandidate.compliance.dbs.toString()} type="compliance" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Right to Work</p>
                    <StatusBadge status={selectedCandidate.compliance.rightToWork.toString()} type="compliance" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Registration</p>
                    <StatusBadge status={selectedCandidate.compliance.registration.toString()} type="compliance" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Generate Outreach Email
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
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