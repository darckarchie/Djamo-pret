import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  initials: string;
  role: string;
  rating: number;
  title: string;
  text: string;
  color: string;
  avatar?: string;
  amount?: string;
  verified?: boolean;
}

const testimonials: Testimonial[] = [
  {
    name: "A'Salfo",
    initials: 'AS',
    role: 'Artiste & Entrepreneur, Abidjan',
    rating: 5,
    title: 'Un partenaire financier à la hauteur de mes ambitions',
    text: "Quand j'ai voulu lancer ma nouvelle structure de production musicale, j'avais besoin d'un financement rapide et sans contraintes bancaires classiques. Djamo m'a accordé un prêt de 7 millions FCFA en moins de 48h. Aucune banque traditionnelle n'aurait pu réagir aussi vite. C'est une révolution pour l'Afrique.",
    color: 'from-blue-600 to-blue-700',
    avatar: 'https://i.ibb.co/tPXf9jq3/652605501-1487403836077449-7597263598121994826-n.jpg',
    amount: '7 000 000 FCFA',
    verified: true,
  },
  {
    name: 'Didier Drogba',
    initials: 'DD',
    role: 'Footballeur & Investisseur',
    rating: 5,
    title: "L'avenir du financement africain est là",
    text: "J'investis dans l'écosystème entrepreneurial africain depuis des années. Djamo représente exactement ce dont nos jeunes entrepreneurs ont besoin : un accès au crédit simple, rapide et juste. Avec un prêt de 15 millions FCFA accordé pour mon projet social à Abidjan, j'ai pu concrétiser ce rêve en quelques jours seulement.",
    color: 'from-orange-500 to-orange-600',
    avatar: 'https://i.ibb.co/BVkB19qc/Didier-Drogba.jpg',
    amount: '15 000 000 FCFA',
    verified: true,
  },
  {
    name: 'Tidjane Thiam',
    initials: 'TT',
    role: 'Financier & Leader Africain',
    rating: 5,
    title: 'La fintech qui change les règles du jeu',
    text: "En tant que professionnel de la finance internationale, je reconnais la qualité et la solidité du modèle Djamo. Ils ont réussi à démocratiser l'accès au crédit pour des millions d'Africains. Mon propre projet d'investissement local a bénéficié d'un financement de 25 millions FCFA — un processus d'une fluidité remarquable.",
    color: 'from-slate-600 to-slate-700',
    avatar: 'https://i.ibb.co/WNqCSfpt/Tidjane-Thiam.jpg',
    amount: '25 000 000 FCFA',
    verified: true,
  },
  {
    name: 'Mah Konaté',
    initials: 'MK',
    role: 'Entrepreneur & Leader Ivoirien',
    rating: 5,
    title: 'Djamo a transformé ma façon de financer mes projets',
    text: "J'ai toujours cru que l'accès au crédit en Côte d'Ivoire était réservé à une élite. Djamo a prouvé le contraire. Avec un financement de 10 millions FCFA obtenu en 72h, j'ai pu lancer mon projet avec sérénité. Un outil indispensable pour tous les entrepreneurs africains ambitieux.",
    color: 'from-green-600 to-green-700',
    avatar: 'https://i.ibb.co/3y1f1NXh/Mah-Konate.jpg',
    amount: '10 000 000 FCFA',
    verified: true,
  },
  {
    name: 'Olivia Yacé',
    initials: 'OY',
    role: 'Personnalité & Entrepreneuse',
    rating: 5,
    title: 'Enfin une fintech qui nous ressemble',
    text: "En tant que femme entrepreneur, j'ai souvent fait face à des obstacles dans l'accès au financement. Djamo a changé la donne. Un prêt de 8 millions FCFA accordé sans discrimination, sans lourdeur administrative. Djamo croit en nos projets autant que nous-mêmes. Je suis fière de faire partie de cette aventure.",
    color: 'from-rose-500 to-rose-600',
    avatar: 'https://i.ibb.co/cckHVD3W/Olivia-Yace.jpg',
    amount: '8 000 000 FCFA',
    verified: true,
  },
  {
    name: 'Ibrahim Koné',
    initials: 'IK',
    role: 'Homme d\'affaires, Abidjan',
    rating: 5,
    title: 'Le crédit nouvelle génération',
    text: "Ce qui m'a convaincu avec Djamo, c'est la transparence totale. Pas de frais cachés, pas de surprise. J'ai obtenu 5 millions FCFA pour développer mon réseau commercial en Côte d'Ivoire et au Sénégal. Le suivi est impeccable. Une référence absolue dans la fintech africaine.",
    color: 'from-teal-600 to-teal-700',
    avatar: 'https://i.ibb.co/CKP1X7kh/363412747-6786689241362669-7276915869864003376-n.jpg',
    amount: '5 000 000 FCFA',
    verified: true,
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const Testimonials: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <section className="section bg-white overflow-hidden">
      <div className="container-djamo">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="badge-blue">Avis clients</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-balance">
            Ils nous font confiance
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Des milliers d'entrepreneurs ivoiriens ont déjà transformé leurs projets grâce à Djamo
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-djamo-blue">4.8</div>
              <div className="flex justify-center mt-1">
                <StarRating rating={5} />
              </div>
              <div className="text-sm text-text-muted mt-1">Note moyenne</div>
            </div>
            <div className="h-12 w-px bg-border-light" />
            <div className="text-center">
              <div className="text-3xl font-bold text-djamo-blue">+1.5M</div>
              <div className="text-sm text-text-muted mt-1">Téléchargements</div>
            </div>
            <div className="h-12 w-px bg-border-light" />
            <div className="text-center">
              <div className="text-3xl font-bold text-djamo-blue">98%</div>
              <div className="text-sm text-text-muted mt-1">Clients satisfaits</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <figure
              key={index}
              className="relative bg-white rounded-2xl p-6 shadow-md border border-border-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-gray-100" />

              <figcaption className="flex items-center gap-3 mb-4">
                <div className="relative flex-shrink-0">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover object-top border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.initials}
                    </div>
                  )}
                  {t.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.role}</div>
                </div>
              </figcaption>

              <div className="flex items-center justify-between mb-3">
                <StarRating rating={t.rating} />
                {t.amount && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                    {t.amount}
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-text-primary mb-2">{t.title}</h3>

              <blockquote>
                <p className="text-sm text-text-secondary leading-relaxed">
                  "{t.text}"
                </p>
              </blockquote>
            </figure>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-djamo-blue to-djamo-blue-dark p-8 md:p-12 text-white text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Prêt à rejoindre notre communauté ?
          </h3>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Déposez votre demande en 5 minutes et rejoignez des milliers d'entrepreneurs qui avancent avec Djamo.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-djamo-blue font-semibold hover:bg-gray-100 transition-all duration-200"
          >
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
