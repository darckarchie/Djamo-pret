import { useEffect, useState } from 'react';
import {
  ArrowRight, Zap, Shield, CheckCircle2,
  Smartphone, CreditCard, TrendingUp, Users,
  BadgeCheck, Banknote, Building2, User,
  RefreshCw, Lock, Globe, HeartHandshake,
  ChevronRight, Star
} from 'lucide-react';
import { recordVisit } from '../lib/visitors';
import DjamoLogo from './DjamoLogo';
import Testimonials from './Testimonials';
import pretImage1 from '../assets/pret_obtenu_inspiration_1_v3.png';
import pretImage2 from '../assets/pret_obtenu_inspiration_2_v3.png';

interface LandingPageProps {
  onGetStarted: () => void;
}

const whyFeatures = [
  { icon: Zap, title: '24h', color: 'text-djamo-blue', bg: 'bg-djamo-blue-light' },
  { icon: Banknote, title: 'Sans garantie', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: RefreshCw, title: 'Remboursement flexible', color: 'text-orange-500', bg: 'bg-orange-50' },
];

const particularFeatures = [
  { icon: CreditCard, label: 'Prêt instantané' },
  { icon: BadgeCheck, label: 'Zéro frais cachés' },
  { icon: TrendingUp, label: 'Taux compétitif' },
];

const businessFeatures = [
  { icon: Building2, label: 'Jusqu\'à 25M FCFA' },
  { icon: TrendingUp, label: 'Crédit renouvelable' },
  { icon: BadgeCheck, label: 'Zéro frais cachés' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState<'particulier' | 'entreprise'>('particulier');

  useEffect(() => {
    recordVisit('landing');
  }, []);

  const currentFeatures = activeTab === 'particulier' ? particularFeatures : businessFeatures;

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border-light">
        <div className="container-djamo py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <DjamoLogo className="h-10 text-black" />
          </a>
          <button onClick={onGetStarted} className="btn-primary">
            Ouvrir un compte gratuit
          </button>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="section py-24 md:py-32 bg-gradient-to-br from-surface-secondary to-white">
          <div className="container-djamo">
            <div className="max-w-2xl">
              <div className="inline-block mb-6">
                <span className="badge-blue">Financement simple et rapide</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 text-balance leading-tight">
                Financez votre <span className="gradient-text-orange">business</span> en quelques minutes
              </h1>
              <p className="text-xl text-text-secondary mb-8 text-balance">
                Djamo vous permet d'obtenir un prêt sans paperasse, sans collateral, directement sur votre compte bancaire. Simple, rapide, et sécurisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onGetStarted} className="btn-primary">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="btn-secondary">En savoir plus</button>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 md:gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-djamo-blue mb-2">100K</div>
                  <p className="text-sm text-text-secondary">Montant minimum</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-djamo-blue mb-2">5 min</div>
                  <p className="text-sm text-text-secondary">Demande en ligne</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-djamo-blue mb-2">24h</div>
                  <p className="text-sm text-text-secondary">Approbation rapide</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FONDATEUR — vision */}
        <section className="section bg-white overflow-hidden">
          <div className="container-djamo">
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
              {/* Texture de fond */}
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 40%)' }} />

              <div className="relative grid lg:grid-cols-2 gap-0 items-stretch">
                {/* Photo fondateur */}
                <div className="relative flex items-end justify-center lg:justify-start pt-10 lg:pt-0 px-8 lg:px-0">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-djamo-blue opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                  <img
                    src="https://i.ibb.co/cKgF4GPv/Re-gis-Bamba.webp"
                    alt="Régis Bamba — Fondateur Djamo"
                    className="relative w-56 md:w-72 lg:w-80 object-contain object-bottom drop-shadow-2xl select-none"
                    draggable={false}
                  />
                </div>

                {/* Citation + infos */}
                <div className="flex flex-col justify-center px-8 py-12 lg:py-16 lg:pr-14">
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-djamo-blue bg-djamo-blue/10 border border-djamo-blue/20 rounded-full px-3 py-1">
                      Vision du fondateur
                    </span>
                  </div>

                  {/* Guillemets déco */}
                  <div className="text-djamo-blue/30 text-7xl font-serif leading-none mb-2 -ml-1 select-none">"</div>

                  <blockquote className="text-white text-lg md:text-xl font-medium leading-relaxed mb-8 -mt-4">
                    En Afrique de l'Ouest, des millions de personnes ont des projets solides mais pas accès au crédit. Djamo change ça — un prêt simple, rapide, directement dans votre poche.
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-white font-bold text-base">Régis Bamba</p>
                      <p className="text-slate-400 text-sm">Co-fondateur & CEO, Djamo</p>
                    </div>
                    <div className="ml-auto">
                      <a
                        href="https://ci.linkedin.com/in/regisbamba"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 bg-white/10 hover:bg-djamo-blue border border-white/10 hover:border-djamo-blue text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-djamo-blue/30 hover:-translate-y-0.5"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Voir son profil
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POURQUOI CHOISIR DJAMO — image 1 en premier plan */}
        <section className="section bg-surface-secondary">
          <div className="container-djamo">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Image 1 en premier plan */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-djamo-blue-light to-transparent rounded-3xl scale-105 -z-10" />
                  <img
                    src={pretImage1}
                    alt="Pret obtenu sur l'application Djamo"
                    className="w-64 md:w-80 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              {/* Titre + intro */}
              <div>
                <span className="badge-blue mb-4 inline-block">Nos avantages</span>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance">
                  Pourquoi choisir Djamo?
                </h2>
                <p className="text-lg text-text-secondary">
                  Une solution de financement pensée pour les entrepreneurs et petits commerces d'Afrique de l'Ouest. Votre prêt, directement dans l'application.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-4 justify-center items-end">
              <div className="group flex items-center gap-3 bg-white border border-border-light rounded-2xl px-6 py-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-djamo-blue-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-5 w-5 text-djamo-blue" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xl font-black text-djamo-blue leading-none">24h</p>
                  <p className="text-xs text-text-secondary font-medium">Déblocage</p>
                </div>
              </div>

              <div className="group flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Banknote className="h-5 w-5 text-emerald-600" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-emerald-800">Sans garantie</p>
              </div>

              <div className="group flex items-center gap-3 bg-white border border-border-light rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="h-4 w-4 text-orange-500" strokeWidth={2} />
                </div>
                <p className="text-sm font-semibold text-text-primary">Remboursement flexible</p>
              </div>
            </div>
          </div>
        </section>

        {/* PARTICULIERS & ENTREPRISES — image 2 en premier plan */}
        <section className="section">
          <div className="container-djamo">
            <div className="text-center mb-12">
              <span className="badge-blue mb-4 inline-block">Solutions adaptées</span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance">
                Pour particuliers et entreprises
              </h2>
              <p className="text-lg text-text-secondary max-w-xl mx-auto">
                Que vous soyez indépendant, commerçant ou dirigeant de PME, Djamo a une solution taillée pour vous.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex bg-surface-secondary rounded-full p-1 border border-border-light">
                <button
                  onClick={() => setActiveTab('particulier')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'particulier' ? 'bg-djamo-blue text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Particulier
                </button>
                <button
                  onClick={() => setActiveTab('entreprise')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'entreprise' ? 'bg-djamo-blue text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Entreprise
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Features list + CTA */}
              <div>
                <div className="flex flex-wrap gap-3 mb-6 items-start">
                  {currentFeatures.map((item, index) => {
                    const Icon = item.icon;
                    const isFirst = index === 0;
                    return (
                      <div
                        key={`${activeTab}-${index}`}
                        style={{ animationDelay: `${index * 60}ms` }}
                        className={`group flex items-center gap-2.5 rounded-2xl border cursor-default
                          transition-all duration-300 hover:-translate-y-1
                          ${isFirst
                            ? 'bg-djamo-blue border-djamo-blue px-5 py-3.5 shadow-md hover:shadow-lg'
                            : 'bg-white border-border-light px-4 py-3 shadow-sm hover:border-djamo-blue hover:shadow-md'
                          }`}
                      >
                        <div className={`flex items-center justify-center flex-shrink-0 rounded-xl transition-transform duration-300 group-hover:scale-110
                          ${isFirst ? 'w-9 h-9 bg-white/20' : 'w-8 h-8 bg-djamo-blue-light group-hover:bg-djamo-blue'}`}
                        >
                          <Icon className={`h-4 w-4 transition-colors duration-200
                            ${isFirst ? 'text-white' : 'text-djamo-blue group-hover:text-white'}`}
                            strokeWidth={2.2}
                          />
                        </div>
                        <p className={`font-semibold text-sm ${isFirst ? 'text-white' : 'text-text-primary'}`}>
                          {item.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <button onClick={onGetStarted} className="btn-primary w-full">
                  {activeTab === 'particulier' ? 'Demander mon prêt personnel' : 'Financer mon entreprise'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              {/* Image 2 en premier plan */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-djamo-blue-light rounded-3xl scale-105 -z-10" />
                  <img
                    src={pretImage2}
                    alt="Gestion du pret dans l'application Djamo"
                    className="w-64 md:w-80 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-border-light whitespace-nowrap">
                    <CheckCircle2 className="h-4 w-4 text-semantic-success flex-shrink-0" />
                    <span className="text-xs font-semibold text-text-primary">Fonds disponibles instantanément</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials onGetStarted={onGetStarted} />

        {/* CTA */}
        <section className="section bg-surface-secondary">
          <div className="container-djamo text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance">
              Prêt à financer votre rêve?
            </h2>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'entrepreneurs qui ont transformé leurs ambitions en réalité grâce à Djamo.
            </p>
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              Commencer ma demande
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-text-primary text-white py-12">
        <div className="container-djamo">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <DjamoLogo className="h-10 text-white" />
              </div>
              <p className="text-white/60">Financez votre business en Afrique de l'Ouest</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produits</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-djamo-blue transition">Prêts personnels</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Prêts business</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Tarifs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Société</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-djamo-blue transition">À propos</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Blog</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-djamo-blue transition">CGU</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-djamo-blue transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8">
            <p className="text-center text-white/40 text-sm">© 2024 Djamo Inc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
