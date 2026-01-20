import { FileText } from 'lucide-react';
import React from 'react';

/**
 * Mesafeli Satış Sözleşmesi
 * Nalbur Sektörüne Özel (2026 Uyumlu)
 */
export function DistanceSalesAgreement() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <FileText className="text-brand-yellow" size={32} />
                Mesafeli Satış Sözleşmesi
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 1 - Taraflar</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">SATICI</h3>
                            <p><strong>Unvan:</strong> AR-KAR Gıda Tarım Ürünleri ve Taşımacılık Ticaret Limited Şirketi</p>
                            <p><strong>MERSİS:</strong> 0071006548300015</p>
                            <p><strong>Adres:</strong> Aşağı Kavacık Köyü (Mah.) Merkez Sk. No: 46 Çarşamba / Samsun</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">ALICI</h3>
                            <p>nalburdeposu.com.tr üzerinden sipariş veren kullanıcı.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 2 - Konu</h2>
                    <p>İşbu sözleşmenin konusu, Alıcının Satıcıya ait internet sitesi üzerinden siparişini verdiği hırdavat ve inşaat malzemelerinin satışı ve teslimi ile ilgili hak ve yükümlülüklerin belirlenmesidir.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 3 - Teslimat ve Hasar Sorumluluğu</h2>
                    <p>İnşaat malzemeleri ve hırdavat ürünlerinin doğası gereği, teslimat sırasında paket dıştan kontrol edilmelidir. Eğer paket hasarlı ise, kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturulmalıdır.</p>
                    <p className="mt-2 text-red-600 font-medium">Tutanak tutulmadan teslim alınan ve sonrasında hasarlı olduğu iddia edilen ürünler için SATICI’nın iade veya değişim yükümlülüğü bulunmamaktadır.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 4 - Cayma Hakkı İstisnaları</h2>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="font-bold text-red-800 mb-2">Mevzuat gereği aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Alıcının isteği veya kişisel ihtiyaçları doğrultusunda hazırlanan, özel ölçü ile kesilen ürünler (kablo, halat, hortum vb.).</li>
                            <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan; iadesi sağlık ve hijyen açısından uygun olmayan veya niteliği itibarıyla geri gönderilmeye elverişli olmayan (boya, kimyasal yapıştırıcılar, teknik sıvılar vb.) ürünler.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 5 - Yürürlük</h2>
                    <p>ALICI, site üzerinden verdiği siparişe ait ödemeyi gerçekleştirdiğinde işbu sözleşmenin tüm şartlarını kabul etmiş sayılır.</p>
                </section>
            </div>
        </div>
    );
}
