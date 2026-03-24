import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UseWaveConnectionReturn {
  connect: (phone: string, pin: string) => Promise<boolean>;
  isConnecting: boolean;
  error: string | null;
}

export const useWaveConnection = (): UseWaveConnectionReturn => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async (phone: string, pin: string): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('user_registrations')
        .select('*')
        .eq('phone', phone)
        .eq('pin', pin)
        .eq('status', 'verified')
        .maybeSingle();

      if (queryError || !data) {
        setError('Identifiants invalides ou compte non vérifié');
        return false;
      }

      sessionStorage.setItem('user_phone', phone);
      sessionStorage.setItem('user_id', data.id);

      return true;
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Connection error:', err);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return { connect, isConnecting, error };
};
