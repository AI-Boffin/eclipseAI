import type { Candidate, Job } from '../types';

export class CSVService {
  static exportCandidates(candidates: Candidate[]): string {
    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'Specialization', 'Experience', 
      'Location', 'Status', 'DBS', 'Right to Work', 'Registration', 'Last Active'
    ];

    const rows = candidates.map(candidate => [
      candidate.id,
      candidate.name,
      candidate.email,
      candidate.phone,
      candidate.specialization,
      candidate.experience.toString(),
      candidate.location,
      candidate.status,
      candidate.compliance.dbs ? 'Yes' : 'No',
      candidate.compliance.rightToWork ? 'Yes' : 'No',
      candidate.compliance.registration ? 'Yes' : 'No',
      candidate.lastActive
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  static exportJobs(jobs: Job[]): string {
    const headers = [
      'ID', 'Title', 'Client', 'Location', 'Type', 'Specialization', 
      'Salary', 'Status', 'Urgency', 'Posted Date'
    ];

    const rows = jobs.map(job => [
      job.id,
      job.title,
      job.client,
      job.location,
      job.type,
      job.specialization,
      job.salary,
      job.status,
      job.urgency,
      job.postedDate
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static parseCandidatesCSV(csvContent: string): Candidate[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).filter(line => line.trim()).map((line, index) => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      
      return {
        id: values[0] || `imported_${index + 1}`,
        name: values[1] || '',
        email: values[2] || '',
        phone: values[3] || '',
        specialization: values[4] || '',
        experience: parseInt(values[5]) || 0,
        location: values[6] || '',
        status: (values[7] as 'active' | 'inactive' | 'placed') || 'active',
        compliance: {
          dbs: values[8]?.toLowerCase() === 'yes',
          rightToWork: values[9]?.toLowerCase() === 'yes',
          registration: values[10]?.toLowerCase() === 'yes',
        },
        lastActive: values[11] || new Date().toISOString(),
      };
    });
  }
}