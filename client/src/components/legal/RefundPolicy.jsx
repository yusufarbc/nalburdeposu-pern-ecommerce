import { RefreshCw } from 'lucide-react';
import React from 'react';

/**
 * İade ve Değişim Politikası
 * Nalbur sektörü özel kuralları vurgulu.
 */
export function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <RefreshCw className="text-brand-yellow" size={32} />
                İade ve Değişim Koşulları
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed">

                <section>
                    <h2 className="text-xl font-bold text-corporate-black mb-3">1. Genel İade Şartları</h2>
                    <p>
                        Web sitemizden satın aldığınız ürünleri, teslim tarihinden itibaren <strong>14 gün</strong> içerisinde; ambalajı bozulmamış, kullanılmamış ve yeniden satılabilirliği kaybolmamış olması şartıyla iade edebilirsiniz.
                    </p>
                </section>

                <section className="bg-red-50 p-5 rounded-xl border border-red-100">
                    <h2 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                        ⚠️ Önemli Uyarı: İade Alınamayacak Ürünler
                    </h2>
                    <p className="mb-2">Nalbur ve teknik hırdavat sektörünün doğası gereği, aşağıdaki durumlarda iade kabul edilmemektedir:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Kimyasal Ürünler:</strong> Kapağı veya güvenlik bandı açılmış boya, tiner, vernik, köpük, silikon, yapıştırıcı vb. ürünler (Hava ile temas ettiğinde yapıları bozulduğu için).</li>
                        <li><strong>Özel Kesim Ürünler:</strong> Müşterinin talebi doğrultusunda özel ölçülerde kesilmiş zincir, halat, hortum, kablo vb. makaradan bölünen ürünler.</li>
                        <li><strong>Sarf Malzemeleri:</strong> Paketi açılmış veya kullanılmış matkap uçları, zımparalar, kesme diskleri.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-corporate-black mb-3">2. Kargo Hasarları (Hasar Tespit Tutanağı)</h2>
                    <p>
                        Kargoyu teslim alırken paketi kargo görevlisinin yanında kontrol etmeniz <strong>zorunludur.</strong>
                    </p>
                    <ul className="list-decimal pl-5 mt-3 space-y-2">
                        <li>Pakette ezilme, yırtılma, akma veya ıslanma varsa teslim almayınız.</li>
                        <li>Kargo görevlisine mutlaka <strong>"Hasar Tespit Tutanağı"</strong> tutturunuz.</li>
                        <li>Tutanak tutulmayan hasarlı ürünler için firmamız sorumluluk kabul edememekte ve iade işlemi yapılamamaktadır.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-corporate-black mb-3">3. İade Süreci</h2>
                    <p>İade etmek istediğiniz ürün için izlemeniz gereken adımlar:</p>
                    <ol className="list-decimal pl-5 mt-3 space-y-2">
                        <li>Sitemizdeki "İletişim" bölümünden veya WhatsApp hattımızdan bize ulaşarak iade talebi oluşturun.</li>
                        <li>Ürünü, faturası ve tüm aksesuarlarıyla birlikte hasar görmeyecek şekilde paketleyin.</li>
                        <li>Size vereceğimiz <strong>Anlaşmalı Kargo Kodu</strong> ile ürünü karşı ödemeli olarak gönderin.</li>
                        <li>İadeniz depomuza ulaşıp kontrolleri yapıldıktan sonra (ortalama 3 gün içinde) ücret iadeniz bankanıza talimat olarak iletilir.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-corporate-black mb-3">4. İletişim</h2>
                    <p><strong>AR-KAR Gıda Tarım Ürünleri ve Taşımacılık Ticaret Ltd. Şti.</strong></p>
                    <p>Sorularınız için: bilgi@nalburdeposu.com.tr</p>
                </section>

            </div>
        </div>
    );
}
