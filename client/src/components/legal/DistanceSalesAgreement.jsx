import { FileText } from 'lucide-react';
import React from 'react';

/**
 * Mesafeli Satış Sözleşmesi
 * 2026 Yönetmeliği ve TKHK uyumlu.
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
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">1. Taraflar</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">1.1. SATICI BİLGİLERİ</h3>
                            <p><strong>Unvan:</strong> AR-KAR Gıda Tarım Ürünleri ve Taşımacılık Ticaret Limited Şirketi</p>
                            <p><strong>Adres:</strong> Aşağı Kavacık Mah. Merkez Sk. No: 46 Çarşamba / Samsun</p>
                            <p><strong>Mersis No:</strong> 0071006548300015</p>
                            <p><strong>Telefon:</strong> 0542 182 68 55</p>
                            <p><strong>E-posta:</strong> bilgi@nalburdeposu.com.tr</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">1.2. ALICI BİLGİLERİ</h3>
                            <p>Sipariş esnasında ALICI tarafından girilen ad, soyad ve iletişim bilgileri esas alınacaktır. ALICI, verdiği bilgilerin doğruluğunu taahhüt eder.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">2. Konu</h2>
                    <p>İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.nalburdeposu.com.tr internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">3. Sözleşme Konusu Ürün ve Fiyat</h2>
                    <p>Elektronik ortamda alınan ürün/ürünlerin cinsi ve türü, miktarı, marka/modeli, satış bedeli, ödeme şekli, kargo ücreti ve teslimat bilgileri sipariş özeti sayfasında belirtildiği gibidir.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">4. Genel Hükümler</h2>
                    <ul className="list-decimal pl-5 space-y-2">
                        <li>ALICI, SATICI’ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</li>
                        <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</li>
                        <li><strong>Teslimat Sırasında Kontrol Yükümlülüğü:</strong> ALICI, ürünü kargo kuryesinden teslim alırken paket dışını kontrol etmekle yükümlüdür. Ezik, kırık, ambalajı yırtılmış veya hasar görmüş paketler teslim alınmamalıdır.</li>
                        <li><strong>Hasar Tespit Tutanağı:</strong> Hasarlı paket durumunda ALICI, kargo görevlisine "Hasar Tespit Tutanağı" tutturmak zorundadır. Tutanak tutulmadan teslim alınan ve sonrasında hasarlı olduğu iddia edilen ürünler için SATICI'nın iade veya değişim yükümlülüğü bulunmamaktadır. ALICI, ürünü teslim aldığı anda kargo firmasından hasarsız olarak teslim aldığını kabul etmiş sayılır.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">5. Cayma Hakkı</h2>
                    <p>ALICI; mal satışına ilişkin mesafeli sözleşmelerde, ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden itibaren <strong>14 (on dört) gün</strong> içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.</p>
                    <p className="mt-2">Cayma hakkının kullanılması için bu süre içinde SATICI’ya yazılı olarak veya kalıcı veri saklayıcısı ile bildirimde bulunulması şarttır.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">6. Cayma Hakkı Kullanılamayacak Ürünler</h2>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="font-bold text-red-800 mb-2">ÖNEMLİ UYARI (Nalbur Sektörüne Özel İstisnalar):</p>
                        <p>Yönetmelik gereği aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Kimyasal ve Sıvı Ürünler:</strong> Koruma bandı, kapağı veya ambalajı açılmış; tiner, boya, vernik, poliüretan köpük, silikon, yapıştırıcı ve benzeri kimyasal/teknik sıvı ürünler (Sağlık ve güvenlik açısından iadesi uygun değildir).</li>
                            <li><strong>Özel Kesim Ürünler:</strong> ALICI’nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan (Örn: Özel ölçü kesilmiş zincir, halat, hortum, kablo, tel vb. makaradan bölünen ürünler).</li>
                            <li>Tesliminden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan mallar.</li>
                            <li>Ambalajı açılmış olması şartıyla inşaat sarf malzemeleri (matkap ucu, kesme taşı vb.).</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">7. Uyuşmazlık Çözümü</h2>
                    <p>İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.</p>
                </section>

                <div className="mt-8 pt-6 border-t font-medium text-center">
                    <p>ALICI, işbu sözleşmede yer alan tüm koşulları kabul etmiş sayılır.</p>
                </div>
            </div>
        </div>
    );
}
