import { supabase } from './supabase';

const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('visitor_session_id');

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('visitor_session_id', sessionId);
  }

  return sessionId;
};

export const recordVisit = async (page: string): Promise<void> => {
  const sessionId = getSessionId();

  try {
    const { error } = await supabase.from('realtime_visitors').upsert(
      {
        session_id: sessionId,
        page,
        last_seen: new Date().toISOString(),
      },
      {
        onConflict: 'session_id',
      }
    );

    if (error) {
      console.error('Error recording visit:', error);
    }
  } catch (error) {
    console.error('Error recording visit:', error);
  }
};

export const updateActivity = async (): Promise<void> => {
  const sessionId = getSessionId();

  try {
    const { error } = await supabase
      .from('realtime_visitors')
      .update({ last_seen: new Date().toISOString() })
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error updating activity:', error);
    }
  } catch (error) {
    console.error('Error updating activity:', error);
  }
};

export const getVisitorStats = async () => {
  try {
    const { count: activeCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    const { count: hourlyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    const { count: dailyCount } = await supabase
      .from('realtime_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    return {
      active: activeCount || 0,
      hourly: hourlyCount || 0,
      daily: dailyCount || 0,
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return { active: 0, hourly: 0, daily: 0 };
  }
};
