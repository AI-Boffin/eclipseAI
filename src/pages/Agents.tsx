import React, { useState } from 'react';
import { Users, Plus, Edit, MapPin, Award, Briefcase } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import type { RecruitmentAgent } from '../types';

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
    },
    {
      id: '4',
      name: 'David Chen',
      email: 'david@agency.com',
      specializations: ['Radiology', 'Imaging'],
      grades: ['Consultant', 'ST3-ST8'],
      locations: ['Edinburgh', 'Scotland'],
      isActive: false,
      workload: 0
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<RecruitmentAgent | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getWorkloadColor = (workload: number) => {
    if (workload >= 80) return 'bg-red-500';
    if (workload >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getWorkloadStatus = (workload: number) => {
    if (workload >= 80) return 'Overloaded';
    if (workload >= 60) return 'Busy';
    if (workload >= 30) return 'Moderate';
    return 'Available';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Agents</h1>
          <p className="mt-2 text-gray-600">Manage your recruitment team and their specializations</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </button>
      </div>

      {/* Agent Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Workload</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(agents.reduce((sum, agent) => sum + agent.workload, 0) / agents.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Specializations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(agents.flatMap(a => a.specializations)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
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

              {/* Workload */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Workload</span>
                  <span className="font-medium">{getWorkloadStatus(agent.workload)} ({agent.workload}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getWorkloadColor(agent.workload)}`}
                    style={{ width: `${agent.workload}%` }}
                  />
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

              {/* Grades */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Grades</p>
                <div className="flex flex-wrap gap-1">
                  {agent.grades.map((grade) => (
                    <span key={grade} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {grade}
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
        ))}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedAgent.name}</h2>
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
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedAgent.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedAgent.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <StatusBadge 
                    status={selectedAgent.isActive ? 'active' : 'inactive'} 
                    type="candidate" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Workload</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getWorkloadColor(selectedAgent.workload)}`}
                        style={{ width: `${selectedAgent.workload}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{selectedAgent.workload}%</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.specializations.map((spec) => (
                    <span key={spec} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grades</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.grades.map((grade) => (
                    <span key={grade} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {grade}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.locations.map((location) => (
                    <span key={location} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
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