/**
 * Données de l'admin Digilago.
 * Deux modes, même code :
 *  - Démo : tout est gardé dans le navigateur (localStorage), avec des données réalistes pour tester.
 *  - Production : les données vivent dans Supabase (table `records`, voir supabase/schema.sql),
 *    synchronisées en temps réel. Activé dès que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis.
 * Contient aussi « l'intelligence » : score des demandes, alertes, prévisions, moteur d'automatisations.
 */
import { useSyncExternalStore } from 'react';
import { DEFAULT_CATALOG, CatItem } from './quote';

/* ------------------------------ Types ------------------------------ */
export type LeadStatus = 'nouveau' | 'contacte' | 'version' | 'devis' | 'gagne' | 'perdu';
export type Note = { at: string; text: string };
export type Lead = { id: string; created_at: string; name: string; company?: string; email?: string; phone?: string; city?: string; sector?: string; message?: string; source: string; lang?: string; status: LeadStatus; notes: Note[]; client_id?: string; next_at?: string; value?: number };
export type Client = { id: string; created_at: string; name: string; company?: string; email?: string; phone?: string; city?: string; sector?: string; ice?: string; address?: string; notes?: string };
export type Stage = 'cadrage' | 'version' | 'affinage' | 'dev' | 'lancement' | 'maintenance' | 'termine';
export type Task = { id: string; title: string; done: boolean; due?: string };
export type Project = { id: string; created_at: string; client_id: string; name: string; type: string; stage: Stage; budget: number; start: string; due: string; tasks: Task[]; url?: string; monthly?: number };
export type Item = { desc: string; qty: number; price: number };
export type Payment = { date: string; amount: number; method: string };
export type InvStatus = 'brouillon' | 'envoyee' | 'payee' | 'partielle' | 'annulee' | 'acceptee' | 'refusee';
export type Invoice = { id: string; number: string; kind: 'facture' | 'devis'; client_id: string; project_id?: string; issue: string; due: string; items: Item[]; tva: number; status: InvStatus; payments: Payment[]; notes?: string };
export type Expense = { id: string; date: string; label: string; category: string; amount: number };
export type Subscriber = { id: string; created_at: string; email: string; name?: string; lang: string; source: string; status: 'actif' | 'desinscrit'; city?: string };
export type Campaign = { id: string; created_at: string; subject: string; body: string; segment: string; status: 'brouillon' | 'envoyee' | 'programmee'; sent_at?: string; recipients?: number; opens?: number; clicks?: number };
export type WaMsg = { id: string; dir: 'in' | 'out'; text: string; at: string; status?: 'envoye' | 'livre' | 'lu' | 'echec'; auto?: boolean };
export type Conversation = { id: string; number_id: string; name: string; phone: string; lead_id?: string; client_id?: string; unread: number; tags: string[]; messages: WaMsg[] };
export type WaNumber = { id: string; label: string; phone: string; role: string; phone_number_id?: string; connected: boolean; color: string; away?: string; hours?: boolean };
export type Template = { id: string; channel: 'whatsapp' | 'email'; name: string; lang: string; subject?: string; body: string; category: string };
export type EmailLog = { id: string; at: string; to: string; subject: string; status: 'envoye' | 'ouvert' | 'echec'; ref?: string };
export type Action = { type: 'whatsapp' | 'email' | 'task' | 'notify' | 'status'; number_id?: string; template_id?: string; delay_h?: number; text?: string; status?: LeadStatus };
export type Automation = { id: string; name: string; enabled: boolean; trigger: 'lead.created' | 'lead.status' | 'invoice.overdue' | 'project.stage' | 'subscriber.created' | 'wa.keyword'; condition?: string; actions: Action[]; runs: number; last_run?: string };
export type Activity = { id: string; at: string; kind: string; text: string; ref?: string; read?: boolean };
export type Settings = { company: string; legal: string; address: string; ice: string; rc: string; if_: string; rib: string; email_from: string; invoice_prefix: string; quote_prefix: string; tva: number; goal_month: number };

export type DB = { catalog: CatItem[]; leads: Lead[]; clients: Client[]; projects: Project[]; invoices: Invoice[]; expenses: Expense[]; subscribers: Subscriber[]; campaigns: Campaign[]; conversations: Conversation[]; numbers: WaNumber[]; templates: Template[]; emails: EmailLog[]; automations: Automation[]; activity: Activity[]; settings: Settings };
export type Coll = Exclude<keyof DB, 'settings'>;

/* ------------------------------ Outils ------------------------------ */
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const now = () => new Date().toISOString();
const day = 864e5;
export const ago = (d: number, h = 0) => new Date(Date.now() - d * day - h * 36e5).toISOString();
export const inDays = (d: number) => new Date(Date.now() + d * day).toISOString().slice(0, 10);
export const mad = (n: number) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' MAD';
export const fdate = (s?: string) => (s ? new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
export const rel = (s: string) => { const m = Math.round((Date.now() - new Date(s).getTime()) / 6e4); if (m < 1) return 'à l’instant'; if (m < 60) return `il y a ${m} min`; const h = Math.round(m / 60); if (h < 24) return `il y a ${h} h`; const d = Math.round(h / 24); return d < 30 ? `il y a ${d} j` : fdate(s); };
export const fill = (tpl: string, v: Record<string, string | undefined>) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] || '');

export const invTotals = (inv: Invoice) => { const ht = inv.items.reduce((s, i) => s + i.qty * i.price, 0); const tva = ht * inv.tva / 100; const ttc = ht + tva; const paid = inv.payments.reduce((s, p) => s + p.amount, 0); return { ht, tva, ttc, paid, due: Math.max(0, ttc - paid) }; };
export const isOverdue = (inv: Invoice) => inv.kind === 'facture' && ['envoyee', 'partielle'].includes(inv.status) && new Date(inv.due) < new Date(new Date().toDateString());

/* Score d'une demande (0-100) : plus il est haut, plus la demande mérite une réponse immédiate */
const HOT = ['cliniques', 'clinique', 'immobilier', 'e-commerce', 'hôtels', 'hotels', 'juridique', 'écoles', 'ecoles', 'btp', 'sur-mesure'];
export const scoreLead = (l: Lead) => {
  let s = 20;
  if (l.phone) s += 15; if (l.email) s += 10; if (l.company) s += 10;
  if (l.sector && HOT.includes(l.sector.toLowerCase())) s += 15;
  if (l.message && l.message.length > 60) s += 10;
  if (/(boutique|e-?commerce|application|appli|réservation|plateforme|urgent|rapidement|budget)/i.test(l.message || '')) s += 10;
  if (l.source === 'formulaire') s += 5; if (l.source === 'whatsapp') s += 5;
  if (['Casablanca', 'Rabat', 'Marrakech', 'Tanger'].includes(l.city || '')) s += 5;
  return Math.min(100, s);
};
export const heat = (n: number) => (n >= 70 ? { label: 'Chaud', tone: 'hot' } : n >= 45 ? { label: 'Tiède', tone: 'warm' } : { label: 'Froid', tone: 'cold' });
export const STAGE_P: Record<LeadStatus, number> = { nouveau: 0.1, contacte: 0.25, version: 0.5, devis: 0.65, gagne: 1, perdu: 0 };

/* ------------------------------ Données de démonstration ------------------------------ */
const seed = (): DB => {
  const clients: Client[] = [
    { id: 'c1', created_at: ago(320), name: 'Académie Georges Claude', company: 'Académie Georges Claude', email: 'direction@georgesclaude.ma', phone: '+212 6 12 34 56 78', city: 'El Jadida', sector: 'Écoles', ice: '001234567000089', address: 'Sidi Bouzid, El Jadida' },
    { id: 'c2', created_at: ago(260), name: 'Groupe Scolaire Ange Bleu', company: 'Ange Bleu', email: 'contact@angebleu.ma', phone: '+212 6 23 45 67 89', city: 'El Jadida', sector: 'Écoles' },
    { id: 'c3', created_at: ago(200), name: 'Les Marronniers', company: 'Les Marronniers', email: 'info@lesmarronniers.ma', phone: '+212 6 34 56 78 90', city: 'El Jadida', sector: 'Écoles' },
    { id: 'c4', created_at: ago(70), name: 'Dr Salma Bennani', company: 'Clinique Atlas', email: 's.bennani@cliniqueatlas.ma', phone: '+212 6 61 22 33 44', city: 'Marrakech', sector: 'Cliniques' },
    { id: 'c5', created_at: ago(40), name: 'Youssef Amrani', company: 'Padel Club Anfa', email: 'youssef@padelanfa.ma', phone: '+212 6 70 11 22 33', city: 'Casablanca', sector: 'Padel' },
    { id: 'c6', created_at: ago(18), name: 'Nadia El Idrissi', company: 'Riad Sabah', email: 'nadia@riadsabah.ma', phone: '+212 6 55 44 33 22', city: 'Fès', sector: 'Hôtels' },
  ];
  const T = (t: string, done = false, due?: string): Task => ({ id: uid(), title: t, done, due });
  const projects: Project[] = [
    { id: 'p1', created_at: ago(300), client_id: 'c1', name: 'Site Académie Georges Claude', type: 'Site vitrine', stage: 'maintenance', budget: 18000, start: ago(300).slice(0, 10), due: ago(260).slice(0, 10), tasks: [T('Mise en ligne', true), T('Formation équipe', true)], url: 'https://georgesclaude.ma', monthly: 450 },
    { id: 'p2', created_at: ago(250), client_id: 'c2', name: 'Site Ange Bleu', type: 'Site vitrine', stage: 'maintenance', budget: 15000, start: ago(250).slice(0, 10), due: ago(215).slice(0, 10), tasks: [T('Pré-inscriptions en ligne', true)], monthly: 400 },
    { id: 'p3', created_at: ago(190), client_id: 'c3', name: 'Site Les Marronniers', type: 'Site vitrine', stage: 'maintenance', budget: 14000, start: ago(190).slice(0, 10), due: ago(160).slice(0, 10), tasks: [T('Deux campus', true)], monthly: 400 },
    { id: 'p4', created_at: ago(60), client_id: 'c4', name: 'Clinique Atlas : site + rendez-vous', type: 'Site + réservation', stage: 'dev', budget: 32000, start: ago(55).slice(0, 10), due: inDays(9), tasks: [T('Maquettes validées', true), T('Agenda des spécialités', true), T('Rappels WhatsApp', false, inDays(3)), T('Fiche Google', false, inDays(7)), T('Tests mobile', false, inDays(8))] },
    { id: 'p5', created_at: ago(35), client_id: 'c5', name: 'Padel Anfa : réservation de terrains', type: 'Application web', stage: 'affinage', budget: 45000, start: ago(30).slice(0, 10), due: inDays(24), tasks: [T('Première version', true), T('Paiement CMI', false, inDays(10)), T('Abonnements', false, inDays(16))] },
    { id: 'p6', created_at: ago(15), client_id: 'c6', name: 'Riad Sabah : réservation directe', type: 'Site + réservation', stage: 'version', budget: 22000, start: ago(12).slice(0, 10), due: inDays(2), tasks: [T('Photos chambres', true), T('Version anglaise', false, inDays(1)), T('Moteur de réservation', false, inDays(2))] },
  ];
  const inv = (n: number, kind: 'facture' | 'devis', client_id: string, project_id: string | undefined, issueAgo: number, dueIn: number, items: Item[], status: InvStatus, payments: Payment[] = []): Invoice => ({ id: uid(), number: `${kind === 'facture' ? 'F' : 'D'}-2026-${String(n).padStart(3, '0')}`, kind, client_id, project_id, issue: ago(issueAgo).slice(0, 10), due: new Date(Date.now() - issueAgo * day + dueIn * day).toISOString().slice(0, 10), items, tva: 20, status, payments });
  const invoices: Invoice[] = [
    inv(1, 'facture', 'c1', 'p1', 290, 30, [{ desc: 'Site vitrine bilingue sur-mesure', qty: 1, price: 15000 }, { desc: 'Espace administration', qty: 1, price: 3000 }], 'payee', [{ date: ago(275).slice(0, 10), amount: 21600, method: 'Virement' }]),
    inv(2, 'facture', 'c2', 'p2', 230, 30, [{ desc: 'Site vitrine et pré-inscriptions', qty: 1, price: 15000 }], 'payee', [{ date: ago(210).slice(0, 10), amount: 18000, method: 'Virement' }]),
    inv(3, 'facture', 'c3', 'p3', 170, 30, [{ desc: 'Site deux campus', qty: 1, price: 14000 }], 'payee', [{ date: ago(150).slice(0, 10), amount: 16800, method: 'Chèque' }]),
    ...[4, 5, 6, 7, 8].map((n, k) => inv(n, 'facture', ['c1', 'c2', 'c3'][k % 3], undefined, 150 - k * 30, 15, [{ desc: 'Maintenance et hébergement (trimestre)', qty: 3, price: 420 }], 'payee', [{ date: ago(140 - k * 30).slice(0, 10), amount: 1512, method: 'Virement' }])),
    inv(9, 'facture', 'c4', 'p4', 50, 15, [{ desc: 'Acompte 40 % : site et prise de rendez-vous', qty: 1, price: 12800 }], 'payee', [{ date: ago(44).slice(0, 10), amount: 15360, method: 'Virement' }]),
    inv(10, 'facture', 'c5', 'p5', 28, 15, [{ desc: 'Acompte 30 % : application de réservation', qty: 1, price: 13500 }], 'partielle', [{ date: ago(20).slice(0, 10), amount: 8000, method: 'Espèces' }]),
    inv(11, 'facture', 'c4', 'p4', 25, 10, [{ desc: 'Fiche Google Business et SEO local', qty: 1, price: 3500 }], 'envoyee'),
    inv(12, 'devis', 'c6', 'p6', 14, 30, [{ desc: 'Site et moteur de réservation directe', qty: 1, price: 18000 }, { desc: 'Version anglaise', qty: 1, price: 4000 }], 'acceptee'),
    inv(13, 'facture', 'c6', 'p6', 5, 15, [{ desc: 'Acompte 40 % : site Riad Sabah', qty: 1, price: 8800 }], 'envoyee'),
  ];
  const L = (d: number, h: number, name: string, company: string, city: string, sector: string, source: string, status: LeadStatus, msg: string, phone = '+212 6 00 00 00 00', email?: string, value?: number): Lead => ({ id: uid(), created_at: ago(d, h), name, company, city, sector, source, status, message: msg, phone, email, notes: [], value });
  const leads: Lead[] = [
    L(0, 1, 'Karim Tazi', 'Immo Prestige', 'Casablanca', 'Immobilier', 'formulaire', 'nouveau', 'Nous voulons un site avec nos annonces filtrables et une alerte nouveaux biens. Assez urgent, lancement du programme en novembre.', '+212 6 61 45 78 12', 'k.tazi@immoprestige.ma', 35000),
    L(0, 5, 'Hajar', 'Dar Tajine', 'El Jadida', 'Restaurants', 'simulateur', 'nouveau', 'Vu la démo, je veux apparaître comme ça sur Google.', '+212 6 77 88 99 00'),
    L(1, 3, 'Omar Chraibi', 'Cabinet Chraibi', 'Rabat', 'Juridique', 'formulaire', 'contacte', 'Site de cabinet d’avocats, bilingue, avec prise de rendez-vous en ligne.', '+212 6 62 00 11 22', 'contact@cabinet-chraibi.ma', 20000),
    L(2, 0, 'Sara', 'Argan Beauty', 'Agadir', 'E-commerce', 'chat', 'version', 'Boutique en ligne de cosmétiques à l’argan, paiement à la livraison.', '+212 6 45 12 36 98', 'sara@arganbeauty.ma', 28000),
    L(3, 0, 'Mehdi Alaoui', 'Garage Expert', 'Meknès', 'Auto', 'formulaire rapide', 'devis', '', '+212 6 99 88 77 66', undefined, 12000),
    L(5, 0, 'Imane', 'Crèche Les Petits Pas', 'Kénitra', 'Écoles', 'whatsapp', 'contacte', 'Bonjour, combien pour un site pour une crèche ?', '+212 6 31 41 59 26'),
    L(8, 0, 'Rachid', 'BâtiNord', 'Tanger', 'BTP', 'formulaire', 'perdu', 'Devis site vitrine.', '+212 6 12 12 12 12'),
    L(12, 0, 'Nadia El Idrissi', 'Riad Sabah', 'Fès', 'Hôtels', 'formulaire', 'gagne', 'Réservation directe sans commission.', '+212 6 55 44 33 22', 'nadia@riadsabah.ma', 22000),
    L(20, 0, 'Youssef Amrani', 'Padel Club Anfa', 'Casablanca', 'Padel', 'chat', 'gagne', 'Réservation de terrains et abonnements.', '+212 6 70 11 22 33', 'youssef@padelanfa.ma', 45000),
    ...Array.from({ length: 14 }, (_, k) => L(25 + k * 6, 0, ['Amine', 'Khadija', 'Hicham', 'Laila', 'Anas', 'Zineb', 'Soufiane'][k % 7], ['Café Central', 'Pharmacie Atlas', 'Auto-école Route', 'Studio Yoga', 'Clinique Dentaire Nour', 'Boutique Caftan Fès', 'Labo Analyses'][k % 7], ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Agadir', 'Tanger', 'Oujda'][k % 7], ['Restaurants', 'Cliniques', 'Auto', 'Beauté', 'Cliniques', 'E-commerce', 'Médecins'][k % 7], ['formulaire', 'chat', 'formulaire rapide', 'simulateur', 'whatsapp'][k % 5], (['perdu', 'gagne', 'perdu', 'contacte', 'perdu', 'gagne', 'perdu'] as LeadStatus[])[k % 7], 'Demande de site.', '+212 6 00 00 00 ' + String(10 + k))),
  ];
  const numbers: WaNumber[] = [
    { id: 'n1', label: 'Commercial', phone: '+212 6 49 95 38 13', role: 'Nouvelles demandes, devis, relances', connected: false, color: '#F4B53F', hours: true, away: 'Merci pour votre message 🙏 Nous sommes fermés pour le moment (lun–sam, 9 h–19 h). Nous vous répondons dès l’ouverture.' },
    { id: 'n2', label: 'Support clients', phone: '+212 6 00 00 00 00', role: 'Clients existants : modifications, maintenance', connected: false, color: '#2DD4E6', hours: true, away: 'Bonjour, votre demande est bien enregistrée. L’équipe support vous répond le jour même.' },
  ];
  const M = (dir: 'in' | 'out', text: string, d: number, h: number, auto = false): WaMsg => ({ id: uid(), dir, text, at: ago(d, h), status: dir === 'out' ? 'lu' : undefined, auto });
  const conversations: Conversation[] = [
    { id: 'w1', number_id: 'n1', name: 'Karim Tazi · Immo Prestige', phone: '+212 6 61 45 78 12', unread: 1, tags: ['Chaud'], messages: [M('out', 'Bonjour Karim 👋 Merci pour votre demande sur digilago.ma. Nous préparons votre première version, vous la recevez sous 72 h.', 0, 1, true), M('in', 'Super, merci ! Vous pouvez intégrer nos 40 annonces actuelles ?', 0, 0)] },
    { id: 'w2', number_id: 'n1', name: 'Imane · Crèche Les Petits Pas', phone: '+212 6 31 41 59 26', unread: 0, tags: [], messages: [M('in', 'Bonjour, combien pour un site pour une crèche ?', 5, 2), M('out', 'Bonjour Imane ! Le prix dépend de vos besoins (pré-inscriptions, galerie, planning). Nous vous proposons une première version en 72 h : vous ne payez que si elle vous plaît.', 5, 1), M('in', 'D’accord, je vous envoie les photos demain', 4, 0)] },
    { id: 'w3', number_id: 'n2', name: 'Académie Georges Claude', phone: '+212 6 12 34 56 78', unread: 2, tags: ['Client'], messages: [M('in', 'Bonjour, pouvez-vous ajouter le calendrier des examens sur le site ?', 0, 3), M('out', 'Bonjour ! Votre demande est bien enregistrée. L’équipe support vous répond le jour même.', 0, 3, true), M('in', 'Merci, c’est assez urgent pour les parents', 0, 2)] },
    { id: 'w4', number_id: 'n2', name: 'Dr Salma Bennani · Clinique Atlas', phone: '+212 6 61 22 33 44', unread: 0, tags: ['Client', 'Projet en cours'], messages: [M('out', 'Bonjour Dr Bennani, l’agenda des spécialités est en ligne sur la version de test 🎉', 2, 4), M('in', 'Parfait, c’est très clair. On valide !', 2, 1)] },
  ];
  const templates: Template[] = [
    { id: 't1', channel: 'whatsapp', name: 'Accusé de réception', lang: 'fr', category: 'Demandes', body: 'Bonjour {{prenom}} 👋 Merci pour votre demande sur digilago.ma. Nous préparons votre première version, vous la recevez sous 72 h. L’équipe Digilago' },
    { id: 't2', channel: 'whatsapp', name: 'Accusé de réception (AR)', lang: 'ar', category: 'Demandes', body: 'مرحبًا {{prenom}} 👋 شكرًا على طلبك عبر digilago.ma. نحن نُعدّ النسخة الأولى من موقعك، وستصلك خلال 72 ساعة. فريق ديجيلاغو' },
    { id: 't3', channel: 'whatsapp', name: 'Première version prête', lang: 'fr', category: 'Projets', body: 'Bonjour {{prenom}} ! Votre première version est prête 🎉 Découvrez-la ici : {{lien}}. Dites-nous ce que vous en pensez.' },
    { id: 't4', channel: 'whatsapp', name: 'Relance facture', lang: 'fr', category: 'Factures', body: 'Bonjour {{prenom}}, petit rappel : la facture {{facture}} de {{montant}} est arrivée à échéance. Merci d’avance pour votre règlement 🙏' },
    { id: 't5', channel: 'email', name: 'Réponse à une demande', lang: 'fr', category: 'Demandes', subject: 'Votre projet {{entreprise}} avec Digilago', body: 'Bonjour {{prenom}},\n\nMerci pour votre demande. Nous préparons une première version de votre site pour {{entreprise}} à {{ville}}. Vous la recevrez sous 72 heures, et vous ne payez que si elle vous plaît.\n\nÀ très vite,\nL’équipe Digilago' },
    { id: 't6', channel: 'email', name: 'Bienvenue newsletter', lang: 'fr', category: 'Newsletter', subject: 'Bienvenue chez Digilago', body: 'Bonjour,\n\nMerci pour votre inscription ! Chaque mois, un conseil concret pour être trouvé sur Google et dans les IA au Maroc.\n\nL’équipe Digilago' },
    { id: 't7', channel: 'email', name: 'Envoi de facture', lang: 'fr', category: 'Factures', subject: 'Facture {{facture}} · Digilago', body: 'Bonjour {{prenom}},\n\nVeuillez trouver ci-joint la facture {{facture}} d’un montant de {{montant}}, à régler avant le {{echeance}}.\n\nMerci pour votre confiance,\nL’équipe Digilago' },
  ];
  const automations: Automation[] = [
    { id: 'a1', name: 'Accusé de réception WhatsApp à chaque nouvelle demande', enabled: true, trigger: 'lead.created', condition: 'téléphone renseigné', actions: [{ type: 'whatsapp', number_id: 'n1', template_id: 't1' }, { type: 'notify', text: 'Nouvelle demande' }], runs: 128, last_run: ago(0, 1) },
    { id: 'a2', name: 'E-mail de réponse si l’adresse est connue', enabled: true, trigger: 'lead.created', condition: 'e-mail renseigné', actions: [{ type: 'email', template_id: 't5' }], runs: 64, last_run: ago(0, 1) },
    { id: 'a3', name: 'Tâche de rappel si la demande n’est pas traitée en 24 h', enabled: true, trigger: 'lead.created', actions: [{ type: 'task', delay_h: 24, text: 'Rappeler la demande' }], runs: 128 },
    { id: 'a4', name: 'Relance WhatsApp des factures en retard (J+3, puis J+10)', enabled: true, trigger: 'invoice.overdue', actions: [{ type: 'whatsapp', number_id: 'n1', template_id: 't4' }], runs: 9, last_run: ago(3) },
    { id: 'a5', name: 'Bienvenue aux nouveaux inscrits à la newsletter', enabled: true, trigger: 'subscriber.created', actions: [{ type: 'email', template_id: 't6' }], runs: 41 },
    { id: 'a6', name: 'Mot-clé « prix » : réponse automatique sur le numéro commercial', enabled: false, trigger: 'wa.keyword', condition: 'prix, tarif, combien', actions: [{ type: 'whatsapp', number_id: 'n1', text: 'Le prix dépend de vos besoins, et il est annoncé par écrit avant de commencer. Vous découvrez d’abord une première version en 72 h : vous ne payez que si elle vous plaît.' }], runs: 0 },
  ];
  const subscribers: Subscriber[] = Array.from({ length: 46 }, (_, k) => ({ id: uid(), created_at: ago(k * 4 + (k % 3)), email: `contact${k + 1}@${['gmail.com', 'outlook.fr', 'yahoo.fr', 'entreprise.ma'][k % 4]}`, lang: ['fr', 'fr', 'ar', 'en'][k % 4], source: ['pied de page', 'guide prix', 'guide GEO', 'formulaire'][k % 4], status: k % 13 === 0 ? 'desinscrit' : 'actif', city: ['Casablanca', 'Rabat', 'El Jadida', 'Marrakech', 'Tanger'][k % 5] }));
  const campaigns: Campaign[] = [
    { id: 'm1', created_at: ago(40), subject: 'Apparaître dans ChatGPT : 4 actions simples', body: '…', segment: 'Tous (FR)', status: 'envoyee', sent_at: ago(38), recipients: 31, opens: 19, clicks: 7 },
    { id: 'm2', created_at: ago(10), subject: 'Combien coûte vraiment un site au Maroc ?', body: '…', segment: 'Tous', status: 'envoyee', sent_at: ago(9), recipients: 42, opens: 27, clicks: 12 },
  ];
  const expenses: Expense[] = [
    ...Array.from({ length: 10 }, (_, k) => ({ id: uid(), date: ago(k * 30).slice(0, 10), label: 'Hébergement et services cloud', category: 'Infrastructure', amount: 900 })),
    ...Array.from({ length: 10 }, (_, k) => ({ id: uid(), date: ago(k * 30 + 5).slice(0, 10), label: 'Abonnements logiciels (design, IA)', category: 'Logiciels', amount: 1400 })),
    { id: uid(), date: ago(12).slice(0, 10), label: 'Publicité Meta', category: 'Marketing', amount: 2500 },
    { id: uid(), date: ago(45).slice(0, 10), label: 'Matériel photo', category: 'Équipement', amount: 6500 },
  ];
  const activity: Activity[] = [
    { id: uid(), at: ago(0, 1), kind: 'lead', text: 'Nouvelle demande : Immo Prestige (Casablanca)', ref: '/admin/demandes' },
    { id: uid(), at: ago(0, 1), kind: 'auto', text: 'Automatisation : accusé de réception WhatsApp envoyé à Karim Tazi' },
    { id: uid(), at: ago(0, 3), kind: 'wa', text: 'Message WhatsApp (Support) : Académie Georges Claude', ref: '/admin/whatsapp' },
    { id: uid(), at: ago(2, 1), kind: 'project', text: 'Clinique Atlas a validé l’agenda des spécialités', ref: '/admin/projets' },
  ];
  const settings: Settings = { company: 'Digilago', legal: '[Forme juridique] au capital de [capital] MAD', address: '[Adresse], El Jadida, Maroc', ice: '[ICE]', rc: '[RC]', if_: '[IF]', rib: '[RIB bancaire]', email_from: 'contact@digilago.ma', invoice_prefix: 'F-2026-', quote_prefix: 'D-2026-', tva: 20, goal_month: 60000 };
  const out: DB = { catalog: DEFAULT_CATALOG, leads, clients, projects, invoices, expenses, subscribers, campaigns, conversations, numbers, templates, emails: [], automations, activity, settings };
  out.leads.forEach((l) => { if (!l.email && l.source !== 'whatsapp') l.email = undefined; });
  return out;
};

/* ------------------------------ Magasin (store) ------------------------------ */
const KEY = 'dg-admin-db-v1';
const env = (import.meta as any).env || {};
export const SUPA_URL: string = env.VITE_SUPABASE_URL || '';
export const SUPA_KEY: string = env.VITE_SUPABASE_ANON_KEY || '';
export const MODE: 'demo' | 'live' = SUPA_URL && SUPA_KEY ? 'live' : 'demo';

let state: DB = (() => { try { const s = localStorage.getItem(KEY); if (s) { const d = JSON.parse(s) as DB; if (!d.catalog) d.catalog = DEFAULT_CATALOG; return d; } } catch { /* */ } return seed(); })();
const subs = new Set<() => void>();
const emit = () => { try { if (MODE === 'demo') localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* */ } subs.forEach((f) => f()); };
export const useDB = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => state);
export const getDB = () => state;

/* Supabase (mode production) : lecture initiale + écriture de chaque modification + temps réel */
let token = '';
const rest = async (path: string, init: RequestInit = {}) => fetch(`${SUPA_URL}/rest/v1/${path}`, { ...init, headers: { apikey: SUPA_KEY, Authorization: `Bearer ${token || SUPA_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal', ...(init.headers || {}) } });
export const fn = async (name: string, body: unknown) => { if (MODE !== 'live') return null; const r = await fetch(`${SUPA_URL}/functions/v1/${name}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, apikey: SUPA_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); return r.ok ? r.json() : Promise.reject(await r.text()); };
const push = (coll: string, id: string, data: unknown, del = false) => { if (MODE !== 'live') return; if (del) rest(`records?id=eq.${id}`, { method: 'DELETE' }); else rest('records', { method: 'POST', body: JSON.stringify({ id, collection: coll, data }) }); };
export const auth = {
  async signIn(email: string, password: string) {
    const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: SUPA_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!r.ok) throw new Error('Identifiants incorrects'); const j = await r.json(); token = j.access_token; sessionStorage.setItem('dg-admin-token', token); await load(); return true;
  },
  restore() { token = sessionStorage.getItem('dg-admin-token') || ''; return !!token; },
  signOut() { token = ''; sessionStorage.removeItem('dg-admin-token'); },
};
export const load = async () => {
  if (MODE !== 'live') return;
  const r = await rest('records?select=id,collection,data&limit=10000'); if (!r.ok) throw new Error('Session expirée');
  const rows: { id: string; collection: string; data: any }[] = await r.json();
  const next: any = { ...seedEmpty() };
  const seen = new Set(rows.map((x) => x.collection));
  rows.forEach((x) => { if (x.collection === 'settings') next.settings = { ...next.settings, ...x.data }; else if (next[x.collection] && !(['numbers', 'templates', 'automations', 'catalog'].includes(x.collection) && !x.data)) { if (!next['_' + x.collection]) { next['_' + x.collection] = true; if (['numbers', 'templates', 'automations', 'catalog'].includes(x.collection)) next[x.collection] = []; } next[x.collection].push({ ...x.data, id: x.id }); } });
  Object.keys(next).filter((k) => k.startsWith('_')).forEach((k) => delete next[k]);
  /* Premier démarrage en production : on enregistre les numéros, modèles, automatisations et réglages par défaut,
     dont les fonctions serveur ont besoin */
  (['numbers', 'templates', 'automations', 'catalog'] as const).forEach((c) => { if (!seen.has(c)) (next[c] as any[]).forEach((it: any) => push(c, it.id, it)); });
  if (!seen.has('settings')) push('settings', 'settings', next.settings);
  state = next; emit();
};
const seedEmpty = (): DB => { const s = seed(); return { catalog: DEFAULT_CATALOG, leads: [], clients: [], projects: [], invoices: [], expenses: [], subscribers: [], campaigns: [], conversations: [], numbers: s.numbers, templates: s.templates, emails: [], automations: s.automations, activity: [], settings: s.settings }; };

export const db = {
  insert<C extends Coll>(c: C, item: DB[C][number]) { state = { ...state, [c]: [item, ...(state[c] as any[])] }; push(c, (item as any).id, item); emit(); return item; },
  update<C extends Coll>(c: C, id: string, patch: Partial<DB[C][number]>) { let saved: any; state = { ...state, [c]: (state[c] as any[]).map((x) => (x.id === id ? (saved = { ...x, ...patch }) : x)) }; if (saved) push(c, id, saved); emit(); },
  remove<C extends Coll>(c: C, id: string) { state = { ...state, [c]: (state[c] as any[]).filter((x) => x.id !== id) }; push(c, id, null, true); emit(); },
  settings(patch: Partial<Settings>) { state = { ...state, settings: { ...state.settings, ...patch } }; push('settings', 'settings', state.settings); emit(); },
  log(kind: string, text: string, ref?: string) { this.insert('activity', { id: uid(), at: now(), kind, text, ref }); },
  reset() { state = seed(); emit(); },
};

/* ------------------------------ Moteur d'automatisations ------------------------------ */
/* En production, ces règles tournent côté serveur (supabase/functions). En démo, elles s'exécutent ici. */
export const runAutomations = (trigger: Automation['trigger'], ctx: { lead?: Lead; invoice?: Invoice; subscriber?: Subscriber }) => {
  const s = getDB(); const done: string[] = [];
  s.automations.filter((a) => a.enabled && a.trigger === trigger).forEach((a) => {
    const l = ctx.lead;
    if (a.condition?.includes('téléphone') && !l?.phone) return;
    if (a.condition?.includes('e-mail') && !(l?.email || ctx.subscriber?.email)) return;
    a.actions.forEach((act) => {
      const tpl = s.templates.find((t) => t.id === act.template_id);
      const client = ctx.invoice && s.clients.find((c) => c.id === ctx.invoice!.client_id);
      const vars = { prenom: (l?.name || client?.name || '').split(' ')[0], entreprise: l?.company || client?.company, ville: l?.city, facture: ctx.invoice?.number, montant: ctx.invoice ? mad(invTotals(ctx.invoice).due) : undefined, echeance: fdate(ctx.invoice?.due), lien: 'https://digilago.ma/demo' };
      if (act.type === 'whatsapp') {
        const phone = l?.phone || client?.phone; if (!phone) return;
        const text = act.text || fill(tpl?.body || '', vars);
        const conv = s.conversations.find((c) => c.phone === phone && c.number_id === act.number_id);
        const msg: WaMsg = { id: uid(), dir: 'out', text, at: now(), status: 'envoye', auto: true };
        if (conv) db.update('conversations', conv.id, { messages: [...conv.messages, msg] });
        else db.insert('conversations', { id: uid(), number_id: act.number_id || 'n1', name: [l?.name, l?.company].filter(Boolean).join(' · ') || client?.name || phone, phone, lead_id: l?.id, unread: 0, tags: [], messages: [msg] });
        done.push(`WhatsApp « ${tpl?.name || 'message'} » envoyé`);
      }
      if (act.type === 'email') {
        const to = l?.email || ctx.subscriber?.email || client?.email; if (!to) return;
        db.insert('emails', { id: uid(), at: now(), to, subject: fill(tpl?.subject || 'Digilago', vars), status: 'envoye', ref: tpl?.name });
        done.push(`E-mail « ${tpl?.name} » envoyé à ${to}`);
      }
      if (act.type === 'task' && l) { db.update('leads', l.id, { next_at: new Date(Date.now() + (act.delay_h || 24) * 36e5).toISOString() }); done.push('Rappel programmé'); }
      if (act.type === 'notify') done.push('Notification');
    });
    db.update('automations', a.id, { runs: a.runs + 1, last_run: now() });
  });
  done.forEach((d) => db.log('auto', `Automatisation : ${d}`));
  return done;
};

/* ------------------------------ Intelligence : alertes et chiffres ------------------------------ */
export const analytics = (s: DB) => {
  const t0 = new Date(); const monthKey = (d: string) => d.slice(0, 7);
  const thisM = t0.toISOString().slice(0, 7);
  const factures = s.invoices.filter((i) => i.kind === 'facture' && i.status !== 'annulee');
  const paidBy: Record<string, number> = {}; const billedBy: Record<string, number> = {}; const expBy: Record<string, number> = {};
  factures.forEach((i) => { billedBy[monthKey(i.issue)] = (billedBy[monthKey(i.issue)] || 0) + invTotals(i).ht; i.payments.forEach((p) => { paidBy[monthKey(p.date)] = (paidBy[monthKey(p.date)] || 0) + p.amount / (1 + i.tva / 100); }); });
  s.expenses.forEach((e) => { expBy[monthKey(e.date)] = (expBy[monthKey(e.date)] || 0) + e.amount; });
  const months = Array.from({ length: 12 }, (_, k) => { const d = new Date(t0.getFullYear(), t0.getMonth() - 11 + k, 1); return d.toISOString().slice(0, 7); });
  const outstanding = factures.reduce((sum, i) => sum + invTotals(i).due, 0);
  const overdue = factures.filter(isOverdue);
  const mrr = s.projects.reduce((sum, p) => sum + (p.monthly || 0), 0);
  const open = s.leads.filter((l) => !['gagne', 'perdu'].includes(l.status));
  const pipeline = open.reduce((sum, l) => sum + (l.value || 15000) * STAGE_P[l.status], 0);
  const won = s.leads.filter((l) => l.status === 'gagne').length, lost = s.leads.filter((l) => l.status === 'perdu').length;
  const conv = won + lost ? won / (won + lost) : 0;
  const leads30 = s.leads.filter((l) => Date.now() - +new Date(l.created_at) < 30 * day).length;
  const leadsPrev = s.leads.filter((l) => { const a = Date.now() - +new Date(l.created_at); return a >= 30 * day && a < 60 * day; }).length;
  const bySource: Record<string, number> = {}; const byCity: Record<string, number> = {}; const bySector: Record<string, number> = {};
  s.leads.forEach((l) => { bySource[l.source] = (bySource[l.source] || 0) + 1; if (l.city) byCity[l.city] = (byCity[l.city] || 0) + 1; if (l.sector) bySector[l.sector] = (bySector[l.sector] || 0) + 1; });
  const revenueByClient = s.clients.map((c) => ({ c, v: factures.filter((i) => i.client_id === c.id).reduce((sum, i) => sum + invTotals(i).paid / (1 + i.tva / 100), 0) })).sort((a, b) => b.v - a.v);
  const forecast = mrr + pipeline * 0.35 + s.invoices.filter((i) => i.kind === 'facture' && ['envoyee', 'partielle'].includes(i.status)).reduce((sum, i) => sum + invTotals(i).due / 1.2, 0) * 0.7;
  return { months, paidBy, billedBy, expBy, thisMonthPaid: paidBy[thisM] || 0, thisMonthBilled: billedBy[thisM] || 0, thisMonthExp: expBy[thisM] || 0, outstanding, overdue, mrr, pipeline, conv, leads30, leadsPrev, bySource, byCity, bySector, revenueByClient, forecast, open };
};

export type Insight = { tone: 'hot' | 'warn' | 'info' | 'good'; title: string; text: string; to: string; cta: string };
export const insights = (s: DB): Insight[] => {
  const out: Insight[] = []; const a = analytics(s);
  const fresh = s.leads.filter((l) => l.status === 'nouveau');
  const stale = fresh.filter((l) => Date.now() - +new Date(l.created_at) > 12 * 36e5);
  if (fresh.length) out.push({ tone: 'hot', title: `${fresh.length} nouvelle${fresh.length > 1 ? 's' : ''} demande${fresh.length > 1 ? 's' : ''} à traiter`, text: stale.length ? `${stale.length} attend${stale.length > 1 ? 'ent' : ''} depuis plus de 12 h : une réponse rapide multiplie les chances de signer.` : 'Répondez dans l’heure : c’est là que les taux de signature sont les meilleurs.', to: '/admin/demandes', cta: 'Traiter' });
  a.overdue.forEach((i) => { const c = s.clients.find((x) => x.id === i.client_id); const d = Math.round((Date.now() - +new Date(i.due)) / day); out.push({ tone: 'warn', title: `Facture ${i.number} en retard de ${d} j`, text: `${c?.company || c?.name} doit encore ${mad(invTotals(i).due)}. Une relance WhatsApp est prête.`, to: '/admin/factures', cta: 'Relancer' }); });
  s.projects.filter((p) => !['maintenance', 'termine'].includes(p.stage)).forEach((p) => { const d = Math.round((+new Date(p.due) - Date.now()) / day); const left = p.tasks.filter((t) => !t.done).length; if (d <= 3 && left) out.push({ tone: 'warn', title: `« ${p.name} » : échéance dans ${Math.max(d, 0)} j`, text: `${left} tâche${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}. Priorisez-le aujourd’hui.`, to: '/admin/projets', cta: 'Voir' }); });
  const unread = s.conversations.reduce((n, c) => n + c.unread, 0);
  if (unread) out.push({ tone: 'info', title: `${unread} message${unread > 1 ? 's' : ''} WhatsApp non lu${unread > 1 ? 's' : ''}`, text: 'Sur vos deux numéros. Les clients attendent une réponse le jour même.', to: '/admin/whatsapp', cta: 'Répondre' });
  const best = Object.entries(a.bySector).sort((x, y) => y[1] - x[1])[0];
  if (best) out.push({ tone: 'good', title: `Votre secteur le plus demandé : ${best[0]}`, text: `${best[1]} demandes. Un guide ou une page dédiée à ce secteur attirerait encore plus de clients.`, to: '/admin/analytics', cta: 'Analyser' });
  if (a.thisMonthPaid < s.settings.goal_month) out.push({ tone: 'info', title: `Objectif du mois : ${Math.round((a.thisMonthPaid / s.settings.goal_month) * 100)} %`, text: `${mad(a.thisMonthPaid)} encaissés sur ${mad(s.settings.goal_month)}. Pipeline pondéré : ${mad(a.pipeline)}.`, to: '/admin/finances', cta: 'Détails' });
  return out;
};
