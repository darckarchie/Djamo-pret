import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { adminAuth } from '../lib/adminAuth';

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await adminAuth.login(code);
    setLoading(false);
    if (ok) onSuccess();
    else setError('Code incorrect. Accès refusé.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-blue-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-1">Accès Admin</h1>
        <p className="text-gray-500 text-sm text-center mb-8">Djamo Prêt · Panneau de contrôle</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showCode ? 'text' : 'password'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code d'accès"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-blue-500/60 transition pr-11 text-sm"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowCode((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!code || loading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm disabled:opacity-40 transition"
          >
            {loading ? 'Vérification...' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
