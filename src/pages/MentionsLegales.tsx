import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import EditableText from '../components/cms/EditableText';

export default function MentionsLegales() {
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
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Mentions Légales</h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">1. Présentation de la société</h2>
              <p className="text-slate-600">
                Le site <strong>oxhygieneagro.ci</strong> est édité par la société <strong>OX'HYGIÈNE Agro CI</strong>.
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mt-4">
                <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SARL)</li>
                <li><strong>Capital social :</strong> 5 000 000 FCFA</li>
                <li><strong>Siège social :</strong> Abidjan-Cocody Angré 8ème tranche</li>
                <li><strong>RCCM :</strong> <EditableText contentKey="footer_rccm" /></li>
                <li><strong>Téléphone :</strong> <EditableText contentKey="footer_phone" /></li>
                <li><strong>Email :</strong> <EditableText contentKey="footer_email" /></li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">2. Directeur de la publication</h2>
              <p className="text-slate-600">
                Le directeur de la publication est le Gérant de la société OX'HYGIÈNE Agro CI.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">3. Hébergement</h2>
              <p className="text-slate-600">
                Ce site est hébergé sur les serveurs de Google Cloud Platform (Cloud Run).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Propriété intellectuelle</h2>
              <p className="text-slate-600">
                L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">5. Activités réglementées</h2>
              <p className="text-slate-600">
                OX'HYGIÈNE Agro CI exerce des activités soumises à agréments ministériels :
              </p>
              <ul className="list-disc pl-5 text-slate-600 space-y-2 mt-4">
                <li>Agrément Importateur de produits phytosanitaires</li>
                <li>Agrément Applicateur de produits phytosanitaires</li>
                <li>Agréments Importateur et Distributeur d'engrais et semences</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
