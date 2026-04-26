import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import EditableText from '../components/cms/EditableText';

export default function PolitiqueConfidentialite() {
  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-accent/10 p-3 rounded-2xl text-accent">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Politique de Confidentialité</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">1. Collecte des données</h2>
              <p className="text-slate-600">
                OX'HYGIÈNE Agro CI collecte des données personnelles via le formulaire de contact et l'inscription à la newsletter. Les données collectées incluent :
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mt-4">
                <li>Nom complet</li>
                <li>Entreprise</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Contenu du message</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">2. Utilisation des données</h2>
              <p className="text-slate-600">
                Vos données sont utilisées exclusivement pour :
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mt-4">
                <li>Répondre à vos demandes de devis ou d'informations.</li>
                <li>Vous envoyer notre newsletter si vous y êtes abonné.</li>
                <li>Améliorer nos services et votre expérience utilisateur.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">3. Conservation des données</h2>
              <p className="text-slate-600">
                Nous conservons vos données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, conformément aux réglementations en vigueur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Partage des données</h2>
              <p className="text-slate-600">
                OX'HYGIÈNE Agro CI s'engage à ne jamais vendre, louer ou céder vos données personnelles à des tiers sans votre consentement préalable, sauf obligation légale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">5. Vos droits</h2>
              <p className="text-slate-600">
                Conformément à la loi sur la protection des données à caractère personnel, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données. Pour exercer ces droits, contactez-nous à : <EditableText contentKey="footer_email" />.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">6. Cookies</h2>
              <p className="text-slate-600">
                Notre site utilise des cookies techniques nécessaires à son bon fonctionnement et des cookies d'analyse d'audience anonymes. Vous pouvez configurer votre navigateur pour refuser les cookies.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
