import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating() {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34600000000';
  const number = raw.replace(/\D/g, '');
  const message = encodeURIComponent(
    'Hola Cota, me gustaría hablar sobre mi proyecto de reforma.'
  );
  const href = `https://wa.me/${number}?text=${message}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp"
      className="fixed bottom-20 right-6 z-40 h-12 w-12 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(37,211,102,0.5)] hover:scale-105 hover:shadow-[0_6px_28px_-4px_rgba(37,211,102,0.6)] transition-all duration-300"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
