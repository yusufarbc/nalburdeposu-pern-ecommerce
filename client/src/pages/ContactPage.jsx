import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';

export function ContactPage() {
    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title="İletişim"
                description="Nalbur Deposu ile iletişime geçin. Telefon, e-posta ve WhatsApp üzerinden 7/24 destek."
                keywords="nalbur deposu iletişim, müşteri hizmetleri, destek"
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">İletişim</h1>
                    <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        Size nasıl yardımcı olabiliriz? Bize ulaşın, en kısa sürede yanıt verelim.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Contact Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* Phone */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                                    <Phone size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Telefon</h3>
                                    <a href="tel:+905421826855" className="text-gray-600 hover:text-brand-yellow transition-colors block text-lg font-medium">
                                        0542 182 68 55
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                                    <Mail size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">E-posta</h3>
                                    <a href="mailto:bilgi@nalburdeposu.com.tr" className="text-gray-600 hover:text-brand-yellow transition-colors block text-lg font-medium">
                                        bilgi@nalburdeposu.com.tr
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">24 saat içinde yanıt veriyoruz</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                                    <MapPin size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Adres</h3>
                                    <p className="text-gray-600 font-medium">Çarşamba, Samsun</p>
                                    <p className="text-sm text-gray-500 mt-1">Türkiye</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-yellow/20 transition-colors">
                                    <Clock size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Çalışma Saatleri</h3>
                                    <p className="text-gray-600 font-medium">Pzt - Cmt: 09:00 - 18:00</p>
                                    <p className="text-sm text-gray-500 mt-1 text-red-500">Pazar: Kapalı</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300">
                        <h2 className="text-2xl md:text-3xl font-black mb-4">Hızlı Destek mi Lazım?</h2>
                        <p className="text-green-50 mb-8 text-lg">
                            WhatsApp hattımız üzerinden müşteri temsilcilerimizle anında iletişime geçebilirsiniz.
                        </p>
                        <a
                            href="https://wa.me/905421826855?text=Merhaba, yardım almak istiyorum."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-white/20"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp'tan Yaz
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
