import { Shield, Lock, FileText, Server } from 'lucide-react';
import React from 'react';

/**
 * Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni
 */
export function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Shield className="text-brand-yellow" size={32} />
                Kişisel Verilerin İşlenmesine İlişkin Aydınlatma Metni
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">1. Veri Sorumlusu</h2>
                    <p>
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>AR-KAR Gıda Tarım Ürünleri ve Taşımacılık Ticaret Limited Şirketi</strong> tarafından aşağıda belirtilen kapsamda işlenmektedir.
                    </p>
                    <div className="mt-2 bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                        <p><strong>Adres:</strong> Aşağı Kavacık Mah. Merkez Sk. No: 46 Çarşamba / SAMSUN</p>
                        <p><strong>MERSİS No:</strong> 0071006548300015</p>
                        <p><strong>Vergi Dairesi / No:</strong> Çarşamba V.D. / 0710065483</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">2. Kişisel Verilerin İşlenme Amacı</h2>
                    <p>Şirketimiz, NACE kodu 475201 (Belirli bir mala tahsis edilmiş mağazalarda hırdavat, boya ve cam perakende ticareti) kapsamında faaliyet göstermektedir. Toplanan kişisel verileriniz;</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Elektronik ticaret sitemiz üzerinden alınan siparişlerin ifası,</li>
                        <li>Ürünlerin lojistik süreçlerinin yönetimi ve teslimatı,</li>
                        <li>Fatura düzenlenmesi ve yasal muhasebe kayıtlarının tutulması,</li>
                        <li>Tüketici mevzuatından kaynaklanan satış sonrası destek hizmetlerinin verilmesi</li>
                    </ul>
                    <p className="mt-2">amaçlarıyla, hukuka ve dürüstlük kurallarına uygun olarak işlenmektedir.</p>
                    <div className="mt-3 p-3 bg-blue-50 text-blue-900 rounded border border-blue-100 text-xs">
                        <strong>ÖNEMLİ NOT:</strong> Şirketimiz tarafından hiçbir surette reklam, pazarlama, kampanya bildirimi veya bülten gönderimi amacıyla veri işlenmemekte; kullanıcılara ticari elektronik ileti gönderilmemektedir.
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">3. Çerezler Hakkında Bilgilendirme</h2>
                    <p>Sitemizde yalnızca platformun teknik olarak çalışabilmesi ve sipariş süreçlerinin (sepet, ödeme adımları vb.) yönetilebilmesi için zorunlu olan <strong>oturum çerezleri</strong> ve teknik çerezler kullanılmaktadır.</p>
                    <p className="mt-2">
                        Kullanıcıların site içi davranışlarını izleyen, profilleme yapan veya hedefli reklam gösterimi sağlayan <u>üçüncü taraf çerezler kullanılmamaktadır.</u>
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">4. İşlenen Kişisel Verilerin Aktarılması</h2>
                    <p>Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda;</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Ürünün teslimi için anlaşmalı kargo şirketlerine,</li>
                        <li>Ödemenin tahsili için ilgili banka ve ödeme kuruluşlarına (Iyzico/Param),</li>
                        <li>Yasal yükümlülüklerimizin yerine getirilmesi için Gelir İdaresi Başkanlığı ve diğer yetkili kamu kurumlarına aktarılmaktadır.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">5. Veri Sahibinin Hakları</h2>
                    <p>KVKK’nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, verilerin düzeltilmesini veya silinmesini isteme haklarına sahiptir. Bu haklarınızı kullanmak için yukarıdaki adresimize yazılı olarak başvurabilirsiniz.</p>
                </section>

            </div>
        </div>
    );
}
