import { MapPin, Phone, Mail, MessageCircle, Facebook, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contactez-nous | High Tech Sport',
};

export default function ContactPage() {
  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: '0 auto', padding: '40px 16px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>
        Contactez-nous
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 40, fontSize: '0.9rem' }}>
        Nous sommes disponibles pour répondre à toutes vos questions
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20,
      }}>
        {[
          {
            icon: MessageCircle,
            title: 'WhatsApp',
            desc: 'Réponse rapide sous 30 minutes',
            action: 'Envoyer un message',
            href: 'https://wa.me/213550000000?text=Bonjour%20!%20Je%20souhaite%20avoir%20plus%20d%27informations.',
            color: '#25D366',
          },
          {
            icon: Phone,
            title: 'Téléphone',
            desc: 'Du samedi au jeudi, 9h-18h',
            action: 'Appelez-nous',
            href: 'tel:+213550000000',
            color: 'var(--brand)',
          },
          {
            icon: Facebook,
            title: 'Facebook',
            desc: '@Garmin.pro.dz — +9 000 abonnés',
            action: 'Visitez notre page',
            href: 'https://www.facebook.com/Garmin.pro.dz',
            color: '#1877F2',
          },
          {
            icon: Mail,
            title: 'Email',
            desc: 'contact@hightechsport.dz',
            action: 'Envoyer un email',
            href: 'mailto:contact@hightechsport.dz',
            color: 'var(--accent)',
          },
        ].map((item) => (
          <a
            key={item.title}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)', padding: 24,
              textDecoration: 'none', color: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', gap: 12, transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 'var(--radius-lg)',
              background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.color,
            }}>
              <item.icon size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem' }}>
              {item.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</p>
            <span style={{ color: item.color, fontWeight: 600, fontSize: '0.85rem' }}>
              {item.action} →
            </span>
          </a>
        ))}
      </div>

      <div style={{
        marginTop: 40, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: 32, textAlign: 'center',
      }}>
        <MapPin size={28} style={{ color: 'var(--brand)', margin: '0 auto 12px' }} />
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: 8 }}>
          Notre adresse
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Khemis Miliana, Wilaya d&apos;Aïn Defla, Algérie
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <Clock size={14} />
          Samedi au jeudi, 9h00 - 18h00
        </div>
      </div>
    </div>
  );
}
