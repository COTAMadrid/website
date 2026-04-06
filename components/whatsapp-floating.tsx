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
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
