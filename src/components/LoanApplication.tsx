import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle2, AlertCircle, Award, Clock, TrendingUp } from 'lucide-react';
import { recordVisit } from '../lib/visitors';
import { toast } from '../lib/toast';
import DjamoLogo from './DjamoLogo';

export interface LoanData {
  fullName: string;
  phone: string;
  address: string;
  amount: number;
  duration: number;
  interestRate: number;
  projectType: string;
}

interface LoanApplicationProps {
  onComplete: (data: LoanData) => void;
  onCancel: () => void;
}

interface FormData {
  projectType: string;
  amount: number;
  duration: number;
  interestRate: number;
  fullName: string;
  phone: string;
  address: string;
  commitment: boolean;
}

const INTEREST_RATE = 1;

const LoanApplication: React.FC<LoanApplicationProps> = ({ onComplete, onCancel }) => {
  const steps = [
    'welcome',
    'project-type',
    'amount',
    'duration',
    'eligibility',
    'commitment',
    'personal',
    'activating',
    'success',
  ];

  const projectTypes = [
    { id: 'commerce', title: 'Commerce & Petit Business', description: 'Développer votre commerce ou petit business', icon: '🏪' },
    { id: 'personal', title: 'Besoin Personnel', description: 'Pour vos besoins personnels ou familiaux', icon: '👤' },
    { id: 'other', title: 'Autre projet', description: 'Pour un autre type de projet', icon: '⭐' },
  ];

  const durations = [
    { months: 2 },
    { months: 3 },
    { months: 4 },
  ];

  const [currentStep, setCurrentStep] = useState('welcome');
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    amount: 100000,
    duration: 0,
    interestRate: INTEREST_RATE,
    fullName: '',
    phone: '',
    address: '',
    commitment: false,
  });
  const [activationProgress, setActivationProgress] = useState(0);
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [commitmentAccepted, setCommitmentAccepted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    recordVisit('loan-application');
  }, []);

  useEffect(() => {
    if (currentStep === 'activating') {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      const interval = setInterval(() => {
        setActivationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep('success');
              setTimeout(() => setSuccessVisible(true), 100);
            }, 500);
            return 100;
          }
          return prev + (100 / 15);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 'success') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handlePersonalSubmit = () => {
    if (!formData.fullName || !formData.phone) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }
    setCurrentStep('activating');
  };

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const totalInterest = (formData.amount * INTEREST_RATE * formData.duration) / 100;
  const totalRepay = formData.amount + totalInterest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-secondary to-white">
      <div className="bg-white border-b border-border-light sticky top-0 z-30">
        <div className="container-djamo py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <DjamoLogo className="h-10 text-black" />
          </a>
          <button onClick={onCancel} className="text-text-secondary hover:text-text-primary transition text-xl font-light">
            ✕
          </button>
        </div>
        <div className="h-1 bg-border-light">
          <div className="h-full bg-djamo-blue transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="container-djamo py-8 min-h-[calc(100vh-120px)]">

        {/* Welcome */}
        {currentStep === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-8">
              <Clock className="w-4 h-4 text-djamo-orange" />
              <span className="text-sm font-semibold text-djamo-orange">Offre spéciale — expire dans 30 jours</span>
            </div>
            <h1 className="text-5xl font-bold text-black mb-4">
              Obtenez votre prêt <br />
              <span className="text-djamo-blue">en quelques minutes</span>
            </h1>
            <p className="text-xl text-text-secondary mb-4">
              Taux exceptionnel de <span className="font-bold text-djamo-orange">1% seulement</span> — limité dans le temps
            </p>
            <p className="text-base text-text-tertiary mb-10">
              Minimum 100 000 F CFA • 100% en ligne • Fonds sous 7 jours
            </p>
            <button onClick={nextStep} className="btn-primary text-lg">
              Commencer ma demande →
            </button>
          </div>
        )}

        {/* Project Type */}
        {currentStep === 'project-type' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Quel est votre projet?</h1>
            <p className="text-lg text-text-secondary mb-8">Sélectionnez la catégorie qui vous correspond</p>
            <div className="space-y-4">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setFormData((p) => ({ ...p, projectType: type.id })); nextStep(); }}
                  className="w-full bg-white rounded-xl p-6 text-left border-2 border-border-light hover:border-djamo-blue hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{type.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-black">{type.title}</h3>
                      <p className="text-text-secondary text-sm">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amount */}
        {currentStep === 'amount' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Quel montant?</h1>
            <p className="text-lg text-text-secondary mb-8">Minimum 100 000 F CFA</p>

            <div className="bg-white rounded-xl p-8 border border-border-light mb-6">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-djamo-blue">
                  {formData.amount.toLocaleString()}
                </div>
                <div className="text-lg text-text-secondary mt-1">F CFA</div>
              </div>

              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: Number(e.target.value) }))}
                className="w-full h-2 bg-border-default rounded-lg appearance-none cursor-pointer accent-djamo-blue mb-2"
              />
              <div className="flex justify-between text-sm text-text-tertiary mb-6">
                <span>100K</span>
                <span>5M</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[200000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setFormData((p) => ({ ...p, amount: amt }))}
                    className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition ${formData.amount === amt ? 'border-djamo-blue bg-djamo-blue-light text-djamo-blue' : 'border-border-default text-text-secondary hover:border-djamo-blue'}`}
                  >
                    {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-djamo-orange mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-black text-sm">Taux exceptionnel 1%/mois</p>
                <p className="text-xs text-text-secondary">Offre valide 30 jours seulement — après retour à 5-10%</p>
              </div>
            </div>

            <button onClick={nextStep} className="btn-primary w-full">
              Choisir ma durée →
            </button>
          </div>
        )}

        {/* Duration */}
        {currentStep === 'duration' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Quelle durée?</h1>
            <p className="text-lg text-text-secondary mb-2">Remboursement à <span className="font-bold text-djamo-orange">1% par mois</span></p>
            <p className="text-sm text-text-tertiary mb-8">Tous les plans au même taux exceptionnel</p>

            <div className="space-y-4 mb-6">
              {durations.map((dur) => {
                const interest = (formData.amount * INTEREST_RATE * dur.months) / 100;
                const total = formData.amount + interest;
                return (
                  <button
                    key={dur.months}
                    onClick={() => { setFormData((p) => ({ ...p, duration: dur.months, interestRate: INTEREST_RATE })); nextStep(); }}
                    className="w-full bg-white rounded-xl p-6 text-left border-2 border-border-light hover:border-djamo-blue hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-black group-hover:text-djamo-blue transition">{dur.months} mois</h3>
                        <p className="text-sm text-text-secondary mt-1">Taux: <span className="font-semibold text-djamo-orange">1%/mois</span></p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-tertiary">Total à rembourser</div>
                        <div className="text-xl font-bold text-black">{total.toLocaleString()} F</div>
                        <div className="text-xs text-text-tertiary">dont {interest.toLocaleString()} F d'intérêts</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Eligibility */}
        {currentStep === 'eligibility' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Vérification d'éligibilité</h1>
            <p className="text-lg text-text-secondary mb-8">Conditions requises pour votre prêt Djamo</p>

            <div className="bg-white rounded-xl border border-border-light mb-6 divide-y divide-border-light overflow-hidden">
              <div className="flex items-start gap-4 p-5">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Résidence en Côte d'Ivoire</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Djamo est disponible uniquement en Côte d'Ivoire</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Compte Djamo validé (KYC)</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Être un utilisateur Djamo authentifié avec KYC complété</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Utiliser son compte Djamo couramment</h3>
                  <p className="text-sm text-text-secondary mt-0.5">Avoir un compte bancaire actif et l'utiliser régulièrement</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-black">Transaction minimum de 10 000 F dans les 7 derniers jours</h3>
                  <p className="text-sm text-orange-600 mt-0.5 flex items-start gap-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    Sinon votre demande pourrait être refusée et vos fonds non versés
                  </p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-8 cursor-pointer bg-white rounded-xl border border-border-light p-4">
              <input
                type="checkbox"
                checked={eligibilityChecked}
                onChange={(e) => setEligibilityChecked(e.target.checked)}
                className="mt-1 w-4 h-4 accent-djamo-blue"
              />
              <span className="text-text-secondary text-sm">
                Je confirme remplir toutes les conditions d'éligibilité ci-dessus
              </span>
            </label>

            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-ghost flex-1">← Retour</button>
              <button onClick={nextStep} disabled={!eligibilityChecked} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* Commitment */}
        {currentStep === 'commitment' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Votre engagement</h1>
            <p className="text-lg text-text-secondary mb-8">Avant de continuer, veuillez confirmer votre engagement</p>

            <div className="bg-blue-50 border border-djamo-blue-light rounded-xl p-6 mb-8">
              <p className="text-text-secondary leading-relaxed">
                Suite au traitement de votre demande, vous recevrez les fonds <span className="font-semibold text-black">sous 5 jours ouvrés</span> après vérification de votre profil.
              </p>
              <p className="text-text-secondary leading-relaxed mt-3">
                En soumettant cette demande, <span className="font-semibold text-black">vous vous engagez à recevoir les fonds et à rembourser dans les délais impartis</span> selon les conditions choisies.
              </p>
            </div>

            <p className="text-base font-semibold text-black mb-4">Confirmez-vous cet engagement?</p>

            <div className="space-y-3 mb-8">
              <button
                onClick={() => setCommitmentAccepted(true)}
                className={`w-full rounded-xl p-5 text-left border-2 transition-all duration-200 ${commitmentAccepted ? 'border-djamo-blue bg-djamo-blue-light' : 'border-border-light bg-white hover:border-djamo-blue'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${commitmentAccepted ? 'border-djamo-blue bg-djamo-blue' : 'border-border-default'}`}>
                    {commitmentAccepted && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-black">Oui, je m'engage</p>
                    <p className="text-sm text-text-secondary">Je recevrai les fonds et rembourserai dans les délais</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setCommitmentAccepted(false)}
                className={`w-full rounded-xl p-5 text-left border-2 transition-all duration-200 ${!commitmentAccepted ? 'border-red-300 bg-red-50' : 'border-border-light bg-white hover:border-red-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${!commitmentAccepted ? 'border-red-400 bg-red-400' : 'border-border-default'}`}>
                    {!commitmentAccepted && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-black">Non, annuler</p>
                    <p className="text-sm text-text-secondary">Je ne souhaite pas continuer</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-ghost flex-1">← Retour</button>
              <button onClick={() => { if (!commitmentAccepted) { onCancel(); return; } nextStep(); }} className="btn-primary flex-1">
                {commitmentAccepted ? 'Continuer →' : 'Annuler'}
              </button>
            </div>
          </div>
        )}

        {/* Personal Info */}
        {currentStep === 'personal' && (
          <div className="max-w-2xl mx-auto py-8">
            <button onClick={prevStep} className="flex items-center gap-2 text-text-tertiary hover:text-text-primary mb-6 transition">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <h1 className="text-4xl font-bold text-black mb-2">Vos informations</h1>
            <p className="text-lg text-text-secondary mb-8">Dernière étape avant activation</p>

            <div className="bg-white rounded-xl border border-border-light p-8 mb-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">Nom complet <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Kouassi Jean-Baptiste"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">Téléphone <span className="text-red-500">*</span></label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-border-default bg-surface-tertiary text-text-secondary text-sm font-medium">
                    +225
                  </span>
                  <input
                    type="tel"
                    placeholder="07 XX XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="input-field rounded-l-none border-l-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Adresse <span className="text-text-muted font-normal">(facultatif)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cocody Zone 4, Abidjan"
                  value={formData.address}
                  onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="btn-ghost flex-1">← Retour</button>
              <button onClick={handlePersonalSubmit} className="btn-primary flex-1">
                Activer ma demande →
              </button>
            </div>
          </div>
        )}

        {/* Activating */}
        {currentStep === 'activating' && (
          <div className="max-w-2xl mx-auto py-16 text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Activation en cours...</h1>
            <p className="text-lg text-text-secondary mb-12">
              Veuillez patienter pendant qu'on prépare votre dossier
            </p>

            <div className="flex justify-center mb-10">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="62" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <circle
                    cx="72" cy="72" r="62"
                    stroke="#3B82F6"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(activationProgress / 100) * 389} 389`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-3xl font-bold text-djamo-blue">{Math.round(activationProgress)}%</div>
                    <div className="text-xs text-text-tertiary">Complété</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-w-sm mx-auto text-left">
              {['Vérification du compte Djamo...', 'Analyse de votre profil...', 'Génération du certificat...'].map((msg, i) => (
                <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${activationProgress > i * 33 ? 'opacity-100' : 'opacity-30'}`}>
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${activationProgress > i * 33 ? 'text-green-500' : 'text-border-default'}`} />
                  <span className="text-sm text-text-secondary">{msg}</span>
                </div>
              ))}
            </div>

            <audio ref={audioRef} src="/audio/activation.mp3" />
          </div>
        )}

        {/* Success */}
        {currentStep === 'success' && (
          <div className={`max-w-2xl mx-auto py-10 transition-all duration-700 ${successVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-black">Demande activée avec succès!</h1>
              <p className="text-text-secondary mt-2">Voici votre certificat de demande de prêt</p>
            </div>

            {/* Certificate */}
            <div className="bg-white rounded-2xl border-2 border-djamo-blue shadow-lg overflow-hidden mb-6">
              <div className="bg-djamo-blue px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-white" />
                  <span className="text-white font-bold text-lg">Certificat de Prêt Djamo</span>
                </div>
                <DjamoLogo className="h-7 text-white" />
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Bénéficiaire</div>
                    <div className="font-bold text-black text-lg">{formData.fullName || 'Non renseigné'}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Téléphone</div>
                    <div className="font-bold text-black text-lg">+225 {formData.phone || '—'}</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Montant accordé</div>
                    <div className="font-bold text-djamo-blue text-xl">{formData.amount.toLocaleString()} F CFA</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Durée</div>
                    <div className="font-bold text-black text-lg">{formData.duration} mois</div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="text-xs text-djamo-orange uppercase tracking-wide mb-1 font-semibold">Taux d'intérêt</div>
                    <div className="font-bold text-djamo-orange text-xl">{INTEREST_RATE}% / mois</div>
                    <div className="text-xs text-text-tertiary mt-1">Offre 30 jours</div>
                  </div>
                  <div className="bg-surface-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wide mb-1">Total à rembourser</div>
                    <div className="font-bold text-black text-lg">{(formData.amount + (formData.amount * INTEREST_RATE * formData.duration) / 100).toLocaleString()} F</div>
                  </div>
                </div>

                <div className="border-t border-border-light pt-4">
                  <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                    <Clock className="w-5 h-5 text-djamo-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-black text-sm">Il ne reste plus qu'à valider votre demande</p>
                      <p className="text-sm text-text-secondary mt-0.5">
                        Validation obligatoire pour continuer — recevez vos fonds <strong>sous 7 jours</strong> après confirmation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-secondary px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-text-tertiary">Réf: DJM-{Date.now().toString().slice(-6)}</span>
                <span className="text-xs text-text-tertiary">{new Date().toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-djamo-orange flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-black text-sm">Taux de 1% valide encore {countdown > 0 ? `${countdown} secondes` : 'aujourd\'hui'}</p>
                <p className="text-xs text-text-secondary mt-0.5">Après 30 jours, le taux reviendra à 5-10% selon la durée</p>
              </div>
            </div>

            <button
              onClick={() => onComplete({
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                amount: formData.amount,
                duration: formData.duration,
                interestRate: formData.interestRate,
                projectType: formData.projectType,
              })}
              className="btn-primary w-full text-lg"
            >
              Valider ma demande → Recevoir les fonds
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoanApplication;
