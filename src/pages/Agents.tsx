import React, { useState } from 'react';
import { Users, Plus, Edit, MapPin, Award, Briefcase, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { WorkloadCalculatorService } from '../services/workload-calculator';
import type { RecruitmentAgent, Job, Candidate } from '../types';

export default function Agents() {
  const [agents, setAgents] = useState<RecruitmentAgent[]>([
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
        lastActivity: '2024-01-15T14:30:00Z',
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
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@agency.com',
      specializations: ['Emergency Medicine', 'Acute Care'],
      grades: ['ST1-ST8', 'SHO'],
      locations: ['Manchester', 'North West'],
      isActive: true,
      workload: 45,
      capacity: {
        maxActiveJobs: 12,
        maxCandidates: 40,
        hoursPerWeek: 40
      },
      metrics: {
        activeJobs: 8,
        candidatesManaged: 22,
        emailsProcessed: 32,
        placementsMade: 6,
        avgResponseTime: 3.2,
        lastActivity: '2024-01-15T16:45:00Z',
        weeklyHours: 35,
        monthlyTargets: {
          placements: 8,
          interviews: 20,
          newCandidates: 12
        },
        performance: {
          placementRate: 90,
          candidateResponseRate: 82,
          clientSatisfaction: 88
        }
      },
      preferences: {
        urgencyWeighting: 9,
        locationRadius: 75,
        autoAssignment: true
      }
    },
    {
      id: '3',
      name: 'Emma Thompson',
      email: 'emma@agency.com',
      specializations: ['Pediatrics', 'General'],
      grades: ['Consultant', 'ST4-ST8'],
      locations: ['Birmingham', 'Midlands'],
      isActive: true,
      workload: 70,
      capacity: {
        maxActiveJobs: 10,
        maxCandidates: 35,
        hoursPerWeek: 35
      },
      metrics: {
        activeJobs: 9,
        candidatesManaged: 28,
        emailsProcessed: 38,
        placementsMade: 7,
        avgResponseTime: 6.1,
        lastActivity: '2024-01-15T12:15:00Z',
        weeklyHours: 34,
        monthlyTargets: {
          placements: 9,
          interviews: 22,
          newCandidates: 10
        },
        performance: {
          placementRate: 82,
          candidateResponseRate: 75,
          clientSatisfaction: 95
        }
      },
      preferences: {
        urgencyWeighting: 7,
        locationRadius: 40,
        autoAssignment: false
      }
    },
    {
      id: '4',
      name: 'David Chen',
      email: 'david@agency.com',
      specializations: ['Radiology', 'Imaging'],
      grades: ['Consultant', 'ST3-ST8'],
      locations: ['Edinburgh', 'Scotland'],
      isActive: false,
      workload: 0,
      capacity: {
        maxActiveJobs: 8,
        maxCandidates: 25,
        hoursPerWeek: 30
      },
      metrics: {
        activeJobs: 0,
        candidatesManaged: 0,
        emailsProcessed: 0,
        placementsMade: 0,
        avgResponseTime: 0,
        lastActivity: '2024-01-10T09:00:00Z',
        weeklyHours: 0,
        monthlyTargets: {
          placements: 0,
          interviews: 0,
          newCandidates: 0
        },
        performance: {
          placementRate: 0,
          candidateResponseRate: 0,
          clientSatisfaction: 0
        }
      },
      preferences: {
        urgencyWeighting: 5,
        locationRadius: 30,
        autoAssignment: false
      }
    }
  ]);

  // Mock jobs and candidates for workload calculation
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Consultant Cardiologist',
      client: 'Royal London Hospital',
      location: 'London, UK',
      type: 'permanent',
      specialization: 'Cardiology',
      salary: '£80,000 - £120,000',
      description: 'Experienced Cardiologist needed',
      requirements: ['GMC Registration'],
      postedDate: '2024-01-10T09:00:00Z',
      status: 'open',
      urgency: 'high',
      assignedAgent: '1'
    }
  ];

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
      assignedAgent: '1'
    }
  ];

  const [selectedAgent, setSelectedAgent] = useState<RecruitmentAgent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'bg-red-500';
    if (workload >= 70) return 'bg-yellow-500';
    if (workload >= 40) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getWorkloadStatus = (workload: number) => {
    if (workload >= 90) return 'Overloaded';
    if (workload >= 70) return 'Busy';
    if (workload >= 40) return 'Moderate';
    return 'Available';
  };

  const getDetailedWorkload = (agent: RecruitmentAgent) => {
    const agentJobs = mockJobs.filter(j => j.assignedAgent === agent.id);
    const agentCandidates = mockCandidates.filter(c => c.assignedAgent === agent.id);
    return WorkloadCalculatorService.calculateWorkload(agent, agentJobs, agentCandidates);
  };

  const { distribution, teamStats } = WorkloadCalculatorService.getTeamWorkloadDistribution(
    agents.filter(a => a.isActive),
    mockJobs,
    mockCandidates
  );

  const suggestions = WorkloadCalculatorService.suggestRebalancing(agents, mockJobs, mockCandidates);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Agents</h1>
          <p className="mt-2 text-gray-600">Manage your recruitment team and monitor workload distribution</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </button>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.availableAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overloaded</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.overloadedAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.totalActiveJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Workload</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.averageWorkload}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Rebalancing Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Workload Rebalancing Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {suggestion.type === 'redistribute_job' ? '📋' : '👤'} {suggestion.item}
                    </p>
                    <p className="text-sm text-gray-600">
                      Move from <strong>{suggestion.from}</strong> to <strong>{suggestion.to}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{suggestion.reason}</p>
                  </div>
                  <button className="px-3 py-1 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const detailedWorkload = getDetailedWorkload(agent);
          
          return (
            <div key={agent.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                      <div className={`ml-2 w-3 h-3 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedAgent(agent);
                      setIsEditing(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                {/* Detailed Workload Breakdown */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Workload</span>
                    <span className="font-medium">{detailedWorkload.status} ({detailedWorkload.totalScore}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getWorkloadColor(detailedWorkload.totalScore)}`}
                      style={{ width: `${detailedWorkload.totalScore}%` }}
                    />
                  </div>
                  
                  {/* Workload Breakdown */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Jobs:</span>
                      <span className="font-medium">{detailedWorkload.breakdown.activeJobs}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Candidates:</span>
                      <span className="font-medium">{detailedWorkload.breakdown.candidatesManaged}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Urgent Tasks:</span>
                      <span className="font-medium">{detailedWorkload.breakdown.urgentTasks}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Response Time:</span>
                      <span className="font-medium">{detailedWorkload.breakdown.responseTime}%</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">This Month</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{agent.metrics.placementsMade}</p>
                      <p className="text-gray-500">Placements</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{agent.metrics.candidatesManaged}</p>
                      <p className="text-gray-500">Candidates</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">{agent.metrics.avgResponseTime}h</p>
                      <p className="text-gray-500">Avg Response</p>
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Specializations
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specializations.map((spec) => (
                      <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Locations
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.locations.map((location) => (
                      <span key={location} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {location}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <StatusBadge 
                    status={agent.isActive ? 'active' : 'inactive'} 
                    type="candidate" 
                  />
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedAgent.name} - Detailed Analytics</h2>
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Detailed workload analysis would go here */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Workload Analysis</h3>
                  <div className="space-y-3">
                    {Object.entries(getDetailedWorkload(selectedAgent).breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Placement Rate</span>
                      <span className="font-medium">{selectedAgent.metrics.performance.placementRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium">{selectedAgent.metrics.performance.candidateResponseRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client Satisfaction</span>
                      <span className="font-medium">{selectedAgent.metrics.performance.clientSatisfaction}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Agent
                </button>
                <button
                  onClick={() => {
                    setSelectedAgent(null);
                    setIsEditing(false);
                  }}
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