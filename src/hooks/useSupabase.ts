import { useState, useEffect } from 'react';
import { supabaseHelpers } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    supabaseHelpers.getCurrentUser().then(user => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useRealtimeData<T>(
  tableName: string,
  initialFetch: () => Promise<{ data: T[] | null; error: any }>
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        const { data: initialData, error } = await initialFetch();
        if (error) throw error;
        setData(initialData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const subscription = supabaseHelpers.subscribeToTable(tableName, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      setData(currentData => {
        switch (eventType) {
          case 'INSERT':
            return [...currentData, newRecord as T];
          case 'UPDATE':
            return currentData.map(item => 
              (item as any).id === newRecord.id ? newRecord as T : item
            );
          case 'DELETE':
            return currentData.filter(item => (item as any).id !== oldRecord.id);
          default:
            return currentData;
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [tableName]);

  return { data, loading, error, setData };
}

export function useCandidates() {
  return useRealtimeData('candidates', supabaseHelpers.getCandidates);
}

export function useJobs() {
  return useRealtimeData('jobs', supabaseHelpers.getJobs);
}

export function useAgents() {
  return useRealtimeData('recruitment_agents', supabaseHelpers.getAgents);
}

export function useCandidateMatches() {
  return useRealtimeData('candidate_matches', supabaseHelpers.getCandidateMatches);
}