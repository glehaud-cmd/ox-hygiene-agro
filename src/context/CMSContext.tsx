import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { doc, onSnapshot, setDoc, collection, deleteDoc, updateDoc, deleteField, getDocFromServer } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';

const ADMIN_EMAILS = ["glehaudbongnenetcesar@gmail.com"];
const CMS_VERSION = "20260331_v6";

const defaultContent: Record<string, string> = {
  cms_version: CMS_VERSION,
  logo_text: "OX'HYGIÈNE Agro CI",
  logo_img: "https://www.oxhygieneagro.ci/assets/images/logo-03.png-381x102.png", // Empty by default, uses icon if empty
  
  hero_title: "OX'HYGIÈNE Agro CI",
  hero_subtitle: "Structure spécialisée dans la distribution, la vente de produits phytosanitaires, matériel d'applications, engrais et semences végétales.",
  hero_status: "Société Agro-pharmaceutique créée en 2025 | Capital : 5 000 000 FCFA",
  hero_contact: "Contact rapide : 05 85 54 54 54",
  hero_slide_1_img: "https://www.oxhygieneagro.ci/assets/images/banniere1.jpg-3-1800x877.jpg", // Cacao placeholder
  hero_slide_2_img: "https://www.oxhygieneagro.ci/assets/images/banniere2.jpg-2-1800x877.jpg", // Riz placeholder
  hero_slide_3_img: "https://www.oxhygieneagro.ci/assets/images/banniere3.jpg-2-1800x877.jpg", // Maraichers placeholder
  hero_slide_4_img: "https://www.oxhygieneagro.ci/assets/images/banniere4.jpg-1-1800x877.jpg", // Hévéa placeholder
  hero_slide_5_img: "https://www.oxhygieneagro.ci/assets/images/banniere5.jpg-1800x877.jpg", // Palmier placeholder
  hero_slide_6_img: "https://www.oxhygieneagro.ci/assets/images/nniere3.png-6-1800x877.png", // Raticide placeholder
  
  about_title: "L'expert en hygiène et agriculture à Abidjan",
  about_subtitle: "L'expert en hygiène industrielle à Abidjan",
  about_text1: "OX'HYGIENE Agro CI est une société Agro pharmaceutique créée en 2025 avec un capital social de 5 000 000 de FCFA.",
  about_text2: "C'est une structure spécialisée dans la distribution, la vente des produits phytosanitaires, du matériel d'applications et la vente de tout type d'engrais et semence végétale. Son siège est situé à Angré 8eme tranche.",
  about_bg: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
  about_img: "https://www.oxhygieneagro.ci/assets/images/img-20250415.jpg-607x624.jpg",
  about_badge_value: "5+",
  about_badge_label: "Années d'expertise",
  about_list_1: "Conformité stricte aux normes sanitaires",
  about_list_2: "Équipements de pointe et produits certifiés",
  about_list_3: "Équipes formées et qualifiées",
  about_list_4: "Interventions discrètes et efficaces",
  
  services_title: "Départements et Produits",
  services_hook_bold: "Notre équipe est composée d'experts et de techniciens expérimentés et qualifiés dans la lutte",
  services_hook_small: "contre les nuisibles et la préservation de la qualité de votre cadre de vie.",
  services_bg: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
  service_1_title: "Département Agro",
  service_1_desc: "Vente de produits phytosanitaires, engrais et semences végétales de haute qualité pour vos cultures.",
  service_1_img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop", // African farm
  service_2_title: "Département Biotech",
  service_2_desc: "Solutions biologiques innovantes pour la protection des cultures et le respect de l'environnement.",
  service_2_img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop", // African lab/nature
  service_3_title: "Dératisation & Désinsectisation",
  service_3_desc: "Élimination efficace des rongeurs et insectes nuisibles dans vos locaux professionnels et habitations.",
  service_3_img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop", // Professional cleaning/pest control
  service_4_title: "Désherbage & Déserpentisation",
  service_4_desc: "Désherbage chimique des espaces verts et solutions de déserpentisation pour votre sécurité.",
  service_4_img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop", // Field/Nature
  service_5_title: "Matériel d'Application",
  service_5_desc: "Vente de matériel d'application performant : pulvérisateurs, atomiseurs et équipements de protection.",
  service_5_img: "https://images.unsplash.com/photo-1605296830714-7c02e14957ac?q=80&w=2070&auto=format&fit=crop", // Products/Equipment
  
  products_title: "Solutions Agricoles",
  products_subtitle: "Découvrez nos produits, engrais et recommandations de dosages.",
  prod_1_title: "Produit Fruit",
  prod_1_name: "Oxhy-Fox 15-09-20",
  prod_1_dosage: "100-150 Kg/ha",
  prod_1_details: "Apport 2-3 jours après repiquage",
  prod_2_title: "Produit Riz",
  prod_2_name: "Urex 46",
  prod_2_dosage: "100 Kg/ha",
  prod_2_details: "50kg à J+15/20 et 50kg à J+25/40",
  prod_3_title: "Produit Maïs",
  prod_3_name: "Urex 46",
  prod_3_dosage: "150 Kg/ha",
  prod_3_details: "100kg à J+15/20 et 50kg à J+25/40",
  prod_other_title: "Notre Catalogue de Produits",
  prod_other_1: "TOUMOUX 25 EC, CAOVITEX 30 SC, BOREX 50 EC, BUTERAX 60 EC",
  prod_other_1_desc: "Insecticides & Fongicides",
  prod_other_2: "METRINEX 50 EC, GRADEX 360 SL, RIVITEX 432 EC, VILATEX 5% PA, RATICIDEX",
  prod_other_2_desc: "Herbicides & Solutions Spécialisées",

  // Product Catalog
  product_toumoux_name: "TOUMOUX 25 EC",
  product_toumoux_nature: "Insecticide",
  product_toumoux_formulation: "30g/l Acétamipride + 30g/l Lambdacyalotrine",
  product_toumoux_utilisation: "Cacao",
  product_toumoux_dose: "1 l/ha",
  product_toumoux_img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop",

  product_caovitex_name: "CAOVITEX 30 SC",
  product_caovitex_nature: "Insecticide",
  product_caovitex_formulation: "20g/l Imidachlopride",
  product_caovitex_utilisation: "Cacao",
  product_caovitex_dose: "1 l/ha",
  product_caovitex_img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop",

  product_borex_name: "BOREX 50 EC",
  product_borex_nature: "Insecticide",
  product_borex_formulation: "30g/l Imidachlopride + 20g/l Bifenthrine",
  product_borex_utilisation: "Cacao",
  product_borex_dose: "0,5 l/ha",
  product_borex_img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",

  product_buterax_name: "BUTERAX 60 EC",
  product_buterax_nature: "Insecticide",
  product_buterax_formulation: "30g/l Acétamipride + 30g/l Lambdacyalotrine",
  product_buterax_utilisation: "Cacao, maraichage et vivriers",
  product_buterax_dose: "0,33 l/ha",
  product_buterax_img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",

  product_metrinex_name: "METRINEX 50 EC",
  product_metrinex_nature: "Insecticide",
  product_metrinex_formulation: "50g/l Cyperméthrine",
  product_metrinex_utilisation: "Maraichage",
  product_metrinex_dose: "1 l/ha",
  product_metrinex_img: "https://images.unsplash.com/photo-1605296830714-7c02e14957ac?q=80&w=2070&auto=format&fit=crop",

  product_gradex_name: "GRADEX 360 SL",
  product_gradex_nature: "Herbicide",
  product_gradex_formulation: "360g/l Glyphosate",
  product_gradex_utilisation: "Herbicide total",
  product_gradex_dose: "4 l/ha",
  product_gradex_img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",

  product_rivitex_name: "RIVITEX 432 EC",
  product_rivitex_nature: "Herbicide",
  product_rivitex_formulation: "72g/l Triclopyre + 360g/l Propanil",
  product_rivitex_utilisation: "Riz",
  product_rivitex_dose: "3 à 4 l/ha",
  product_rivitex_img: "https://images.unsplash.com/photo-1536633310979-b864bad0f287?q=80&w=2070&auto=format&fit=crop",

  product_vilatex_name: "VILATEX 5% PA",
  product_vilatex_nature: "Stimulant",
  product_vilatex_formulation: "50g/l Etephon",
  product_vilatex_utilisation: "Stimulant hévéa",
  product_vilatex_dose: "1 à 2 g/ha",
  product_vilatex_img: "https://images.unsplash.com/photo-1584820927498-cafe4c158958?q=80&w=2070&auto=format&fit=crop",

  product_raticidex_name: "RATICIDEX",
  product_raticidex_nature: "Raticide",
  product_raticidex_formulation: "0,05g/l Brodifacoum",
  product_raticidex_utilisation: "Rats et Souris",
  product_raticidex_dose: "15 à 50 g par poste",
  product_raticidex_img: "https://www.oxhygieneagro.ci/assets/images/nniere3.png-6-1800x877.png",

  catalogue_full_title: "Catalogue Complet des Produits Phytosanitaires",
  catalogue_full_content: `| Nom commercial | Nature | Formulation | Utilisation | Dose d’Application |
| :--- | :--- | :--- | :--- | :--- |
| **TOUMOUX 25 EC** | Insecticide | 30g/l Acétamipride + 30g/l Lambdacyalotrine | Cacao | 1 l/ha |
| **CAOVITEX 30 SC** | Insecticide | 20g/l Imidachlopride | Cacao | 1 l/ha |
| **BOREX 50 EC** | Insecticide | 30g/l Imidachlopride + 20g/l Bifenthrine | Cacao | 0,5 l/ha |
| **BUTERAX 60 EC** | Insecticide | 30g/l Acétamipride + 30g/l Lambdacyalotrine | Cacao, maraichage et vivriers | 0,33 l/ha |
| **METRINEX 50 EC** | Insecticide | 50g/l Cyperméthrine | Maraichage | 1 l/ha |
| **GRADEX 360 SL** | Herbicide | 360g/l Glyphosate | Herbicide total | 4 l/ha |
| **RIVITEX 432 EC** | Herbicide | 72g/l Triclopyre + 360g/l Propanil | Riz | 3 à 4 l/ha |
| **VILATEX 5% PA** | Stimulant | 50g/l Etephon | Stimulant hévéa | 1 à 2 g/ha |
| **RATICIDEX** | Raticide | 0,05g/l Brodifacoum | Rats et Souris | 15 à 50 g par poste |`,
  
  news_title: "Actualités & Conseils",
  news_subtitle: "Restez informés",
  news_1_title: "Rencontre avec les Directeurs d'une société espagnole d'engrais",
  news_1_desc: "Participation du DG à la rencontre B/B à Alicante. En Espagne.",
  news_1_img: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-07-06-at-18.53.20.jpeg-768x1024.jpeg",
  news_2_title: "Séance de formation de l'Association des Applicateurs",
  news_2_desc: "Thème: \"normes et règlementations dans le domaine de l'application du phytosanitaire\"",
  news_2_img: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-19.01.38.jpeg-3-720x1280.jpeg",

  // Why Us Default Content
  why_us_title: "Pourquoi Nous Choisir",
  why_us_subtitle: "L'exigence au service de votre sécurité",
  why_us_desc: "Faire appel à OX HYGIÈNE AGRO, c'est choisir un partenaire de confiance engagé pour la réussite et la sécurité de vos opérations. Nous mettons tout en œuvre pour vous offrir des résultats impeccables.",
  why_us_img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2058&auto=format&fit=crop",
  why_us_1_title: "Expertise professionnelle",
  why_us_1_desc: "Un savoir-faire reconnu dans le domaine de l'hygiène.",
  why_us_2_title: "Intervention rapide",
  why_us_2_desc: "Réactivité maximale pour vos urgences sanitaires.",
  why_us_3_title: "Produits de qualité",
  why_us_3_desc: "Utilisation de solutions certifiées et respectueuses.",
  why_us_4_title: "Respect des normes",
  why_us_4_desc: "Conformité totale avec les réglementations en vigueur.",
  why_us_5_title: "Équipe qualifiée",
  why_us_5_desc: "Des techniciens formés aux dernières méthodes.",

  // Stats Default Content
  stats_bg: "https://images.unsplash.com/photo-1584820927498-cafe4c158958?q=80&w=2070&auto=format&fit=crop",
  stats_1_value: "100",
  stats_1_suffix: "%",
  stats_1_label: "Engagement & Intégrité",
  stats_2_value: "20",
  stats_2_suffix: "+",
  stats_2_label: "Années d'expertise DG",
  stats_3_value: "9",
  stats_3_suffix: "",
  stats_3_label: "Homologations Pesticides",

  // Testimonials Default Content
  testimonials_title: "Ce que disent nos clients",
  testimonials_1_text: "L'équipe d'OX HYGIÈNE AGRO a transformé nos locaux de production. Leur professionnalisme et leur rigueur sur les normes sanitaires sont remarquables.",
  testimonials_1_author: "Kouamé Jean",
  testimonials_1_role: "Directeur de Production, Agro-CI",
  testimonials_2_text: "Une intervention rapide et efficace suite à un besoin urgent de désinfection. Je recommande vivement leurs services pour toute entreprise exigeante.",
  testimonials_2_author: "Awa Sylla",
  testimonials_2_role: "Gérante, Restaurant Le Flamboyant",
  testimonials_3_text: "Depuis que nous avons confié notre nettoyage industriel à OX, nous n'avons plus aucun souci lors des audits sanitaires. Un partenaire fiable.",
  testimonials_3_author: "Marc Dubois",
  testimonials_3_role: "Responsable Qualité, Industrie FoodTech",

  // Contact Default Content
  contact_title: "Contactez-Nous",
  contact_subtitle: "Demandez votre devis gratuit",
  contact_info_title: "Informations",
  whatsapp_tooltip: "Discutons sur WhatsApp",

  // Footer Default Content
  footer_desc: "Structure spécialisée dans la distribution, la vente de produits phytosanitaires, matériel d'applications, engrais et semences végétales.",
  footer_address: "Siège social Abidjan-Cocody Angré 8ème tranche, 2705 BP 184 Abidjan 2705",
  footer_phone: "(225) 25 22 01 62 62",
  footer_mobile: "07 08 00 00 11",
  footer_whatsapp: "(+225) 05 85 54 54 54",
  footer_email: "info@oxhygieneagroci.com",
  footer_hours: "8:00 à 17:00",
  footer_rccm: "RCCM : CI-ABJ-03-2025-B13-05858",
  footer_newsletter_title: "Newsletter",
  footer_newsletter_desc: "Abonnez-vous pour recevoir nos conseils en hygiène et agriculture.",

  // Social Media
  social_facebook: "https://facebook.com/oxhygieneagroci",
  social_linkedin: "https://linkedin.com/company/oxhygieneagroci",
  social_instagram: "https://instagram.com/oxhygieneagroci",
  social_twitter: "https://twitter.com/oxhygieneagroci",

  // Maps
  google_maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.316830714!2d-3.975658224151!3d5.409416694570025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMjQnMzMuOSJOIDPCsDU4JzIzLjEiVw!5e0!3m2!1sfr!2sci!4v1711886400000!5m2!1sfr!2sci",

  // New Pages Default Content
  partenaires_hero_img: "https://www.oxhygieneagro.ci/assets/images/logo.png.jpg-1171x779.jpg",
  partenaires_title: "Partenaires & Personnel",
  partenaires_content: `Partenaires
La structure dispose de partenaires commerciaux de divers horizons : Sud-africains, Chinois, Indiens, Européens, Américains et des partenaires nationaux.

Personnel Ox'Hygiène Agro CI
OX’HYGIÈNE Agro CI est composée de personnes dynamiques dont des agronomes qui, en plus de leurs formations académiques, ont suivi la formation de CROPLIFE (zone Côte d’Ivoire) pour des diplômes prescripteurs et applicateurs. 

C’est une équipe qualifiée avec à sa tête un Directeur Général qui exerce dans le domaine depuis plus de 20 ans, et dont les atouts sont reconnus de toutes les sociétés sur le plan national et des partenaires internationaux qui exercent dans le domaine agro-pharmaceutique en Côte d’Ivoire. 

OX’HYGIÈNE Agro CI se veut être un modèle de structure en Côte d’Ivoire, ainsi elle se distingue par son intégrité et le respect de ses engagements vis-à-vis de ses partenaires. D’où, la structure idéale pour un partenariat idéal.`,

  agro_hero_img: "https://www.oxhygieneagro.ci/assets/images/logo-agro.jpg-2021x1429.jpeg",
  agro_title: "Département Agro",
  agro_content: `OX’HYGIÈNE Agro CI dispose d’un agrément distributeur obtenu du ministère de l’agriculture. Elle dispose de neuf (09) homologations de pesticides qui lui permettent d'intervenir efficacement dans la protection des cultures.

### Notre Catalogue de Produits Phytosanitaires

| Nom commercial | Nature | Formulation | Utilisation | Dose d’Application |
| :--- | :--- | :--- | :--- | :--- |
| **TOUMOUX 25 EC** | Insecticide | 30g/l Acétamipride + 30g/l Lambdacyalotrine | Cacao | 1 l/ha |
| **CAOVITEX 30 SC** | Insecticide | 20g/l Imidachlopride | Cacao | 1 l/ha |
| **BOREX 50 EC** | Insecticide | 30g/l Imidachlopride + 20g/l Bifenthrine | Cacao | 0,5 l/ha |
| **BUTERAX 60 EC** | Insecticide | 30g/l Acétamipride + 30g/l Lambdacyalotrine | Cacao, maraichage et vivriers | 0,33 l/ha |
| **METRINEX 50 EC** | Insecticide | 50g/l Cyperméthrine | Maraichage | 1 l/ha |
| **GRADEX 360 SL** | Herbicide | 360g/l Glyphosate | Herbicide total | 4 l/ha |
| **RIVITEX 432 EC** | Herbicide | 72g/l Triclopyre + 360g/l Propanil | Riz | 3 à 4 l/ha |
| **VILATEX 5% PA** | Stimulant | 50g/l Etephon | Stimulant hévéa | 1 à 2 g/ha |
| **RATICIDEX** | Raticide | 0,05g/l Brodifacoum | Rats et Souris | 15 à 50 g par poste |
| **OXHY-FOX 15-09-20** | Engrais | NPK | Fruit | 100-150 Kg/ha |
| **UREX 46** | Engrais | Urée | Riz, Maïs | 100-150 Kg/ha |

Notre équipe d'agronomes qualifiés assure un suivi technique rigoureux pour garantir l'efficacité de ces solutions sur vos parcelles.`,

  biotech_hero_img: "https://www.oxhygieneagro.ci/assets/images/logo-num-biotech-2.png-2021x1429.png",
  biotech_img_1: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-07-06-at-18.53.20.jpeg-768x1024.jpeg",
  biotech_img_2: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-19.01.38.jpeg-3-720x1280.jpeg",
  biotech_title: "Département Biotech",
  biotech_content: `C’est le troisième département de la structure. Il se divise en deux services à savoir :

### A- L'engrais
Ce service s’occupe particulièrement de l’importation, la distribution et la vente des engrais de tous genres à savoir les biostimulants, les engrais granulés, les engrais foliaires…. 

| Type d'Engrais | État | Objectifs |
| :--- | :--- | :--- |
| **Biostimulants** | Homologué | Résistance et croissance |
| **Engrais Granulés** | Homologué | Nutrition du sol |
| **Engrais Foliaires** | Homologué | Absorption rapide |

### B- Les semences
La société dispose de plusieurs variétés de semences hybrides des cultures maraichères et vivrières. La marque de nos semences est **Srouamblé Semence**.

| Culture | Variété | Caractéristiques |
| :--- | :--- | :--- |
| **Maraichères** | Hybrides | Haut rendement |
| **Vivrières** | Sélectionnées | Adaptabilité locale |`,

  applicateur_hero_img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
  applicateur_title: "Département Applicateur",
  applicateur_content: `
### Solutions d'Hygiène Professionnelles

OX’HYGIÈNE dispose d’un **Agrément Applicateur** qui lui permet d’intervenir dans le domaine de l’hygiène publique en proposant des solutions innovantes et sécurisées.

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
    <img src="https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=2070&auto=format&fit=crop" alt="Désinsectisation" class="w-full h-48 object-cover rounded-xl mb-6 opacity-80 hover:opacity-100 transition-opacity" />
    <h4 class="text-accent text-xl font-bold mb-4">La Désinsectisation</h4>
    <p class="text-slate-300">Traitement curatif et préventif contre les insectes nuisibles : cafards, fourmis, punaises de lit, moustiques, et plus encore. Nous utilisons des produits homologués respectueux de l'environnement.</p>
  </div>
  
  <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
    <img src="https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=2070&auto=format&fit=crop" alt="Dératisation" class="w-full h-48 object-cover rounded-xl mb-6 opacity-80 hover:opacity-100 transition-opacity" />
    <h4 class="text-accent text-xl font-bold mb-4">La Dératisation</h4>
    <p class="text-slate-300">Élimination efficace des rongeurs (rats, souris) qui infestent vos locaux. Nos méthodes garantissent une protection durable de vos stocks et de vos infrastructures.</p>
  </div>

  <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
    <img src="https://images.unsplash.com/photo-1531386151447-fd76ad50012f?q=80&w=2070&auto=format&fit=crop" alt="Déserpentisation" class="w-full h-48 object-cover rounded-xl mb-6 opacity-80 hover:opacity-100 transition-opacity" />
    <h4 class="text-accent text-xl font-bold mb-4">La Déserpentisation</h4>
    <p class="text-slate-300">Intervention rapide et sécurisée pour l’éloignement ou la capture des serpents. Une expertise cruciale pour la sécurité des zones résidentielles et industrielles.</p>
  </div>

  <div class="bg-slate-900 text-white p-8 rounded-2xl shadow-xl border border-slate-800">
    <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop" alt="Décontamination" class="w-full h-48 object-cover rounded-xl mb-6 opacity-80 hover:opacity-100 transition-opacity" />
    <h4 class="text-accent text-xl font-bold mb-4">La Décontamination</h4>
    <p class="text-slate-300">Réduction drastique des agents pathogènes. Essentiel pour les milieux hospitaliers, les bureaux et les espaces publics afin de garantir un environnement sain.</p>
  </div>
</div>

### Autres Services Spécialisés

*   **Démoustication :** Lutte ciblée contre les vecteurs de maladies.
*   **Désherbage Chimique :** Entretien des espaces verts et zones industrielles.
*   **Vide Sanitaire :** Nettoyage et désinfection complète des fermes d'élevage.

> Notre équipe est composée d'experts et de techniciens expérimentés, qualifiés pour répondre aux défis les plus complexes de l'hygiène publique.
`,

  agrements_hero_img: "https://www.oxhygieneagro.ci/assets/images/logo-03.png-662x178.png",
  agrements_title: "Nos Agréments",
  agrements_content: `OX HYGIENE Agro CI dispose des agréments suivants :

DEPARTEMENT AGRO
• Un Agrément Importateur de produits phytosanitaires

DEPARTEMENT APPLICATEUR
• Un Agrément Applicateur de produits phytosanitaires

DEPARTEMENT BIOTECH

SERVICE ENGRAIS
La structure dispose de trois Agréments dans le domaine des engrais à savoir :
• Un agrément Importateur d'engrais
• Un agrément Distributeur Grossiste d'engrais
• Un Agrément Distributeur détaillant d'engrais

SERVICE SEMENCES
La structure dispose de trois Agréments dans le domaine des semences à savoir :
• Un Agrément importateur
• Un Agrément Distributeur-Grossiste
• Un Agrément Distributeur-détaillant de Semences`,

  // Dynamic News Data
  news_page_title: "Actualités & Événements",
  news_page_subtitle: "Découvrez nos dernières publications, articles, galeries photos et vidéos.",
  news_page_bg: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
  
  // Initialize dynamic gallery lists
  "partenaires-personnel_gallery_list": JSON.stringify(["part_img_1", "part_img_2", "part_img_3"]),
  "part_img_1": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop",
  "part_img_2": "https://images.unsplash.com/photo-1522071823990-b997879e0783?q=80&w=2070&auto=format&fit=crop",
  "part_img_3": "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop",

  news_items: JSON.stringify([
    {
      id: "1",
      type: "article",
      title: "Rencontre avec les Directeurs d'une société espagnole d'engrais",
      date: "2026-03-15",
      summary: "Participation du DG à la rencontre B/B à Alicante. En Espagne.",
      content: "Rencontre avec les Directeurs d'une société espagnole d'engrais.\nRencontre avec monsieur Martin salin, Responsable de la société salin.\nParticipation du DG à la rencontre B/B à Alicante. En Espagne.",
      coverImage: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-07-06-at-18.53.20.jpeg-768x1024.jpeg",
      featured: true
    },
    {
      id: "2",
      type: "gallery",
      title: "Séance de formation de l'Association des Applicateurs",
      date: "2026-02-02",
      summary: "Thème: \"normes et règlementations dans le domaine de l'application du phytosanitaire\"",
      galleryImages: [
        "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-19.01.38.jpeg-3-720x1280.jpeg",
        "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-11.52.37.jpeg-770x433.jpeg",
        "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-19.01.36.jpeg-1-768x1024.jpeg",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1605296830714-7c02e14957ac?q=80&w=2070&auto=format&fit=crop"
      ],
      coverImage: "https://www.oxhygieneagro.ci/assets/images/whatsapp-image-2025-04-16-at-19.01.38.jpeg-3-720x1280.jpeg",
      featured: true
    },
    {
      id: "3",
      type: "gallery",
      title: "Galerie Photos - Activités de Terrain (17 Photos)",
      date: "2026-03-20",
      summary: "Découvrez nos interventions et nos équipes à l'œuvre sur le terrain. Cette galerie contient 17 photos.",
      galleryImages: Array.from({ length: 17 }, (_, i) => `https://picsum.photos/seed/oxhygiene${i}/800/800`),
      coverImage: "https://picsum.photos/seed/oxhygiene0/800/800",
      featured: false
    }
  ])
};

type CMSContextType = {
  content: Record<string, string>;
  isEditing: boolean;
  toggleEditMode: () => void;
  updateContent: (key: string, value: string) => void;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [globalData, setGlobalData] = useState<Record<string, string>>({});
  const [imagesData, setImagesData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const content = useMemo(() => ({
    ...defaultContent,
    ...globalData,
    ...imagesData
  }), [globalData, imagesData]);

  // Connection Test
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firestore connection successful");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();
  }, []);

  // Handle Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email || "")) {
        setIsEditing(false); // Turn off edit mode if logged out or not admin
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle Firestore Data Sync
  useEffect(() => {
    if (!isAuthReady) return;

    const contentRef = doc(db, 'content', 'global');
    const unsubscribeContent = onSnapshot(contentRef, (docSnap) => {
      if (docSnap.exists()) {
        let data = docSnap.data() as Record<string, string>;
        
        // Auto-update stale content or old versions
        let needsUpdate = false;
        const updatedData = { ...data };
        
        const currentVersion = data.cms_version || "0";
        const isOldVersion = currentVersion !== CMS_VERSION;

        if (isOldVersion) {
          Object.keys(defaultContent).forEach(key => {
            if (data[key] === undefined) {
              updatedData[key] = defaultContent[key];
              needsUpdate = true;
            }
          });
          updatedData.cms_version = CMS_VERSION;
          needsUpdate = true;
        }

        if (needsUpdate && user && ADMIN_EMAILS.includes(user.email || "")) {
          setDoc(contentRef, updatedData, { merge: true }).catch(console.error);
        }

        setGlobalData(updatedData);
      } else {
        // If document doesn't exist yet, initialize it with default content ONLY if admin
        if (user && ADMIN_EMAILS.includes(user.email || "")) {
          setDoc(contentRef, defaultContent).catch(console.error);
        }
        setGlobalData({});
      }
    }, (error) => {
      console.error("Firestore Error: ", error);
      // Fallback to local storage if offline or permission denied
      try {
        const saved = localStorage.getItem('ox_hygiene_content');
        if (saved) {
          setGlobalData(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Local storage read error:", e);
      }
    });

    // Listen to content_images collection for large base64 images
    const unsubscribeImages = onSnapshot(collection(db, 'content_images'), (snapshot) => {
      const newImagesData: Record<string, string> = {};
      snapshot.forEach(doc => {
        newImagesData[doc.id] = doc.data().value;
      });
      setImagesData(newImagesData);
    }, (error) => {
      console.error("Firestore Images Error: ", error);
    });

    return () => {
      unsubscribeContent();
      unsubscribeImages();
    };
  }, [isAuthReady, user]);

  const updateContent = async (key: string, value: string) => {
    if (value.startsWith('data:image/')) {
      setImagesData(prev => ({ ...prev, [key]: value }));
    } else {
      setGlobalData(prev => ({ ...prev, [key]: value }));
    }
    
    // Save to local storage as backup
    try {
      localStorage.setItem('ox_hygiene_content', JSON.stringify({ ...globalData, ...imagesData, [key]: value }));
    } catch (e) {
      console.error("Local storage save error:", e);
    }

    // Save to Firestore
    if (user && ADMIN_EMAILS.includes(user.email || "")) {
      try {
        if (value.startsWith('data:image/')) {
          await setDoc(doc(db, 'content_images', key), { value }, { merge: true });
          try {
            await updateDoc(doc(db, 'content', 'global'), { [key]: deleteField() });
          } catch (e) {
            // Ignore if document doesn't exist or field doesn't exist
          }
        } else {
          await setDoc(doc(db, 'content', 'global'), { [key]: value }, { merge: true });
          try {
            await deleteDoc(doc(db, 'content_images', key));
          } catch (e) {
            // Ignore if document doesn't exist
          }
        }
      } catch (error) {
        console.error("Error updating Firestore:", error);
        alert("Erreur lors de la sauvegarde sur le serveur.");
      }
    }
  };

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login error:", error);
      // Ignore cancelled popup errors
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        alert("Erreur lors de la connexion.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsEditing(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleEditMode = () => {
    if (user && ADMIN_EMAILS.includes(user.email || "")) {
      setIsEditing(!isEditing);
    } else {
      setIsEditing(false);
      if (user) {
        alert("Accès refusé. Seul l'administrateur peut modifier le site.");
      }
    }
  };

  return (
    <CMSContext.Provider value={{ content, isEditing, toggleEditMode, updateContent, user, login, logout }}>
      {children}
    </CMSContext.Provider>
  );
}

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) throw new Error("useCMS must be used within CMSProvider");
  return context;
};
