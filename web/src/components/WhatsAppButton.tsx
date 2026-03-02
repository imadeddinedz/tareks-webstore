'use client';

import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
    const whatsappNumber = '213550000000'; // À remplacer par le vrai numéro
    const message = encodeURIComponent(
        'Bonjour ! Je suis intéressé(e) par vos produits sur High Tech Sport. Pouvez-vous me donner plus d\'informations ?'
    );
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pulse hidden md:flex"
            style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-full)',
                background: '#25D366',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 90,
                boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                textDecoration: 'none',
                transition: 'transform 0.2s',
            }}
            aria-label="Contactez-nous sur WhatsApp"
        >
            <MessageCircle size={26} fill="white" />
        </a>
    );
}
