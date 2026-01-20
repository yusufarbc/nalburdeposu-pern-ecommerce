import React from 'react';

export const PrivacyPolicy = () => {
    return (
        <div className="space-y-8 text-gray-700">
            {/* Bölüm 1: Gizlilik ve KVKK */}
            <div>
                <h2 className="text-2xl font-black text-corporate-black mb-6 border-b pb-2">BÖLÜM 1: GİZLİLİK POLİTİKASI VE KVKK AYDINLATMA METNİ</h2>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">Veri Sorumlusu</h3>
                <p className="mb-4">
                    <strong>Unvan:</strong> AR-KAR GIDA TARIM ÜRÜNLERİ VE TAŞIMACILIK TİCARET LİMİTED ŞİRKETİ (Nalbur Deposu)<br />
                    <strong>Adres:</strong> Samsun, Türkiye<br />
                    <strong>E-posta:</strong> bilgi@nalburdeposu.com.tr
                </p>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">1. Kişisel Verilerin İşlenme Amacı</h3>
                <p className="mb-4">
                    Tarafınıza ait ad, soyad, adres, <strong>telefon</strong> ve e-posta bilgileri; üyelik işlemlerinin gerçekleştirilmesi, siparişinizin alınması, ödemenin tahsil edilmesi (Param aracılığıyla), ürünün kargo firmasına teslim edilmesi, e-faturanızın gönderilmesi ve iletişim süreçlerinin yürütülmesi amacıyla işlenmektedir.
                </p>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">2. Hukuki Sebepler</h3>
                <p className="mb-4">
                    Kişisel verileriniz, 6698 sayılı KVKK’nın 5. maddesinde belirtilen <strong>"Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması"</strong> hukuki sebebine dayalı olarak işlenmektedir.
                </p>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">3. Verilerin Aktarımı</h3>
                <p className="mb-4">
                    Kişisel verileriniz; ödemenin alınabilmesi için <strong>Param (Turk Elektronik Para A.Ş.)</strong> ile, siparişin teslimi için anlaşmalı <strong>Kargo Firmaları</strong> ile ve yasal yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurum ve kuruluşları ile paylaşılmaktadır.
                </p>
                <p className="mb-4">
                    Web sitemizin güvenliği ve performansı için <strong>Cloudflare</strong> altyapısı kullanılmaktadır. Bu kapsamda IP adresi ve log kayıtları gibi teknik veriler, hizmetin doğası gereği siber güvenlik ve erişilebilirlik amacıyla Cloudflare'in yurtdışındaki sunucuları üzerinden işlenebilmektedir.
                </p>
                <p className="mb-4">
                    Haricinde üçüncü kişilerle paylaşılmaz, satılmaz veya devredilmez.
                </p>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">4. Haklarınız</h3>
                <p className="mb-4">
                    Silinmesini, düzeltilmesini veya işlenip işlenmediğini öğrenmeyi talep etme hakkınız saklıdır.
                </p>

                <h3 className="text-xl font-bold text-corporate-black mt-6 mb-3">5. İletişim İzinleri ve Pazarlama</h3>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r">
                    <strong>🚫 Spam Yok Politikası:</strong>
                    <p className="mt-2">
                        Nalbur Deposu olarak kişisel verilerinizi <strong>asla reklam, pazarlama veya tanıtım amacıyla kullanmıyoruz.</strong>
                        Size "kampanya başladı", "indirim var" gibi ticari elektronik iletiler (SMS/E-posta) <strong>göndermiyoruz.</strong>
                    </p>
                    <p className="mt-2">
                        İletişim bilgileriniz sadece şu zorunlu hallerde kullanılır:
                        <ul className="list-disc pl-5 mt-1">
                            <li>Sipariş ve fatura bildirimleri</li>
                            <li>Kargo takip bilgileri</li>
                            <li>İade/Değişim süreçleri</li>
                        </ul>
                    </p>
                </div>

                <p className="mb-4">
                    Dijital pazarlama faaliyetlerimiz (Google Workspace ve Meta/Facebook/Instagram) yalnızca marka bilinirliği ve müşteri hizmetleri (WhatsApp hattı vb.) kapsamındadır. Kişisel verileriniz hedefli reklamcılık (re-marketing) amacıyla üçüncü taraflara satılmaz veya paylaşılmaz.
                </p>
            </div>
        </div>
    );
};
