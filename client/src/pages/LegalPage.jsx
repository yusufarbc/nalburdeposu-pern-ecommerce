import React from 'react';
import SEO from '../components/SEO';

export function LegalPage({ title, contentKey }) {
    const getContent = () => {
        switch (contentKey) {
            case 'iade-degisim':
                return (
                    <div className="space-y-4 text-gray-700">
                        <p className="mb-4"><strong>Son Güncelleme:</strong> 11 Ocak 2026</p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">1. Cayma Hakkı</h2>
                        <p className="mb-4">
                            6502 sayılı Tüketicinin Korunması Hakkında Kanun gereğince, tüketici olarak ürünü teslim aldığınız tarihten itibaren <span className="bg-brand-yellow/30 px-1 rounded">14 gün</span> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahipsiniz.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                            <strong>📍 İade Adresi:</strong> Ürünleri Samsun'daki merkez depomuza göndermeniz gerekmektedir. İade kodu için lütfen bizimle iletişime geçiniz.
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">2. Cayma Hakkının Kullanılması</h2>
                        <p className="mb-2">Cayma hakkınızı kullanmak için:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li><a href="/siparis-takip" className="text-brand-yellow font-bold underline">Sipariş Takip</a> sayfasına gidin</li>
                            <li>Sipariş numaranız ve e-posta adresiniz ile giriş yapın</li>
                            <li>İlgili siparişin yanındaki <strong>"İade Talebi Oluştur"</strong> butonuna tıklayın</li>
                            <li>İade nedeninizi seçip işlemi tamamlayın</li>
                        </ul>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">3. İade Koşulları</h2>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Ürün kullanılmamış olmalıdır</li>
                            <li>Orijinal ambalajı bozulmamış olmalıdır</li>
                            <li>Ürün etiketi çıkarılmamış olmalıdır</li>
                            <li>Fatura ve garanti belgesi ile birlikte iade edilmelidir</li>
                        </ul>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r">
                            <strong>⚠️ Kargo Ücretleri Hakkında:</strong>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Keyfi İadeler (Cayma Hakkı):</strong> Üründe bir kusur yoksa, cayma hakkı kapsamında yapılan iadelerde kargo masrafı yasal mevzuat gereği Tüketiciye (Alıcıya) aittir.</li>
                                <li><strong>Kusurlu/Ayıplı Ürünler:</strong> Ürün hasarlı, eksik veya yanlış geldiyse tüm kargo masrafları Firmamıza (Satıcıya) aittir.</li>
                            </ul>
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">4. Cayma Hakkının İstisnaları</h2>
                        <p className="mb-2">Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Tüketicinin istekleri doğrultusunda özel olarak hazırlanan ürünler</li>
                            <li>Çabuk bozulabilir veya son kullanma tarihi geçebilecek ürünler</li>
                            <li>Tesliminden sonra ambalaj, bant, mühür gibi koruyucu unsurları açılmış ürünler</li>
                        </ul>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">5. İade İşlem Süreci</h2>
                        <ol className="list-decimal pl-5 mb-4 space-y-1">
                            <li><a href="/siparis-takip" className="text-brand-yellow font-bold underline">Sipariş Takip</a> üzerinden talebinizi oluşturun</li>
                            <li>Talebiniz onaylandıktan sonra iade kargo kodu alın</li>
                            <li>Ürünü belirtilen adrese kargolayın</li>
                            <li>Ürün tarafımıza ulaştıktan sonra <strong>10 iş günü</strong> içinde ödemeniz iade edilir</li>
                        </ol>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">6. Para İadesi</h2>
                        <p className="mb-2">Para iadesi, ödeme yaptığınız yöntem ile yapılır:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li><strong>Kredi Kartı:</strong> Kartınıza iade yapılır (bankanıza göre 2-7 iş günü)</li>
                            <li><strong>Banka Kartı:</strong> Hesabınıza iade yapılır (1-3 iş günü)</li>
                        </ul>
                    </div>
                );
            case 'kargo-bilgileri':
                return (
                    <div className="space-y-4 text-gray-700">
                        <p className="mb-4"><strong>Son Güncelleme:</strong> 11 Ocak 2026</p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">1. Kargo Kapsamı</h2>
                        <p className="mb-4">
                            Nalbur Deposu olarak <span className="bg-brand-yellow/30 px-1 rounded">Türkiye genelinde</span> tüm illere kargo ile teslimat yapıyoruz.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
                            <strong>📍 Not:</strong> Yurtdışına teslimat hizmetimiz bulunmamaktadır.
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">2. Kargo Ücretleri</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse mb-4">
                                <thead>
                                    <tr className="bg-corporate-black text-white">
                                        <th className="p-3 text-left border border-gray-300">Sipariş Tutarı</th>
                                        <th className="p-3 text-left border border-gray-300">Kargo Ücreti</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white">
                                        <td className="p-3 border border-gray-300">10.000 TL ve üzeri</td>
                                        <td className="p-3 border border-gray-300 font-bold text-green-600">ÜCRETSİZ</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-3 border border-gray-300">10.000 TL altı</td>
                                        <td className="p-3 border border-gray-300">Ağırlık bazlı (kg) hesaplanır</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mb-4">
                            <strong>Ağırlık Hesaplama:</strong> Kargo ücreti, ürünlerin toplam ağırlığına (kg) göre hesaplanır. Sepet sayfasında hesaplanan kargo ücreti görüntülenir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">3. Teslimat Süresi</h2>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li><strong>Büyükşehirler:</strong> 1-3 iş günü</li>
                            <li><strong>Diğer İller:</strong> 2-5 iş günü</li>
                            <li><strong>Aynı Gün Kargo:</strong> Saat 14:00'e kadar verilen siparişler aynı gün kargoya verilir</li>
                        </ul>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
                            <strong>⏰ Önemli:</strong> Resmi tatil günlerinde ve hafta sonlarında kargo çıkışı yapılmamaktadır. Bu günlerde verilen siparişler takip eden ilk iş gününde kargoya verilir.
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">4. Kargo Firmaları</h2>
                        <p className="mb-2">Siparişleriniz aşağıdaki anlaşmalı kargo firmalarından biriyle gönderilir:</p>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Aras Kargo</li>
                            <li>Yurtiçi Kargo</li>
                            <li>MNG Kargo</li>
                        </ul>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">5. Kargo Takip</h2>
                        <p className="mb-4">
                            Siparişiniz kargoya verildiğinde, kayıtlı e-posta adresinize kargo takip numarası gönderilir. Ayrıca sipariş takip sayfamızdan da kargo durumunuzu takip edebilirsiniz.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">6. Teslimat Koşulları</h2>
                        <ul className="list-disc pl-5 mb-4 space-y-1">
                            <li>Teslimat, sipariş sırasında belirtilen adrese yapılır</li>
                            <li>Teslimat sırasında kimlik gösterilmesi istenebilir</li>
                            <li>Paket teslim alınırken hasar kontrolü yapılmalıdır</li>
                            <li>Hasarlı paketler kargo görevlisinin tutanak tutması şartıyla teslim alınabilir</li>
                        </ul>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">7. Hasarlı Teslimat</h2>
                        <p className="mb-2">Kargo tesliminde ürününüz hasarlı ise:</p>
                        <ol className="list-decimal pl-5 mb-4 space-y-1">
                            <li>Kargo görevlisine <strong>tutanak</strong> tutturun</li>
                            <li>Hasarlı ürünün fotoğrafını çekin</li>
                            <li>24 saat içinde <strong>bilgi@nalburdeposu.com.tr</strong> adresine bildirimde bulunun</li>
                        </ol>
                    </div>
                );
            case 'mesafeli-satis-sozlesmesi':
                return (
                    <div className="space-y-4 text-gray-700">
                        <p className="text-sm text-gray-400">Son Güncelleme: 11 Ocak 2026</p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 1 - TARAFLAR</h2>
                        <p className="mb-4">
                            <strong>1.1. SATICI:</strong><br />
                            Unvan: <strong>AR-KAR GIDA TARIM ÜRÜNLERİ VE TAŞIMACILIK TİCARET LİMİTED ŞİRKETİ</strong><br />
                            (İşbu sözleşmede "Nalbur Deposu" olarak anılacaktır)<br />
                            Adres: Samsun, Türkiye<br />
                            E-Posta: bilgi@nalburdeposu.com.tr<br />
                            Telefon: +90 542 182 68 55
                        </p>
                        <p className="mb-4">
                            <strong>1.2. ALICI:</strong><br />
                            Sipariş formunda adı soyadı ve adres bilgileri yer alan kişidir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 2 - KONU</h2>
                        <p className="mb-4">
                            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait <strong>nalburdeposu.com.tr</strong> internet sitesinden elektronik ortamda siparişini yaptığı ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                        </p>

                        <div className="bg-gray-50 border-l-4 border-gray-500 p-4 my-4 rounded-r text-sm">
                            <strong>Bilgilendirme:</strong> İşbu sözleşme, nalburdeposu.com.tr üzerinden satış yapan <strong>AR-KAR GIDA TARIM ÜRÜNLERİ VE TAŞIMACILIK TİCARET LİMİTED ŞİRKETİ</strong> ile alıcı arasındadır.
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 3 - SÖZLEŞME KONUSU ÜRÜN VE BEDELİ</h2>
                        <p className="mb-4">
                            Ürünün cinsi, miktarı, marka/modeli, rengi ve tüm vergiler dâhil satış bedeli web sitesindeki ürün tanıtım sayfasında ve sipariş özetinde belirtildiği gibidir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 4 - GENEL HÜKÜMLER</h2>
                        <p className="mb-4">
                            4.1. ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
                        </p>
                        <p className="mb-4">
                            4.2. Sözleşme konusu ürün, ALICI'nın yerleşim yerinin uzaklığına bağlı olarak yasal 30 günlük süreyi aşmamak koşulu ile ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 5 - CAYMA HAKKI</h2>
                        <p className="mb-4">
                            ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 gün içinde cayma hakkına sahiptir. İade edilecek ürünlerin kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">MADDE 6 - YETKİLİ MAHKEME</h2>
                        <p className="mb-4">
                            İşbu sözleşmenin uygulanmasında, Tüketici Hakem Heyetleri ile ALICI'nın veya SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
                        </p>
                    </div>
                );
            case 'on-bilgilendirme':
                return (
                    <div className="space-y-4 text-gray-700">
                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">1. SATICI BİLGİLERİ</h2>
                        <p className="mb-4">
                            <strong>Unvan:</strong> AR-KAR GIDA TARIM ÜRÜNLERİ VE TAŞIMACILIK TİCARET LİMİTED ŞİRKETİ<br />
                            <strong>Marka:</strong> Nalbur Deposu<br />
                            <strong>Adres:</strong> Samsun, Türkiye<br />
                            <strong>Telefon:</strong> +90 542 182 68 55<br />
                            <strong>E-posta:</strong> bilgi@nalburdeposu.com.tr
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">2. KONU</h2>
                        <p className="mb-4">
                            İşbu formun konusu, ALICI'nın elektronik ortamda sipariş verdiği, aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince bilgilendirilmesidir.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">3. ÜRÜN VE FİYAT BİLGİLERİ</h2>
                        <p className="mb-4">
                            Satın alınan ürünlerin cinsi, miktarı, marka/modeli, rengi, adedi, satış bedeli ve ödeme şekli, siparişin sonlandığı andaki bilgilerden oluşmaktadır.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">4. CAYMA HAKKI</h2>
                        <p className="mb-4">
                            ALICI, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI'ya e-posta ile bildirimde bulunulması şarttır.
                        </p>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">5. VERİ GÜVENLİĞİ VE GİZLİLİK</h2>
                        <p className="mb-4">
                            Alıcının kişisel verileri, <a href="/gizlilik-ve-kvkk" className="text-brand-yellow font-bold hover:underline">Gizlilik Politikası ve KVKK Aydınlatma Metni</a> kapsamında korunmakta ve işlenmektedir.
                        </p>
                    </div>
                );
            case 'gizlilik-ve-kvkk':
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
            case 'banka-hesaplari':
                return (
                    <div className="space-y-4 text-gray-700">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
                            <strong>ℹ️ Bilgilendirme:</strong> Havale/EFT ile yapacağınız ödemelerde açıklama kısmına <strong>Sipariş Numaranızı</strong> yazmayı unutmayınız.
                        </div>

                        <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">Banka Hesap Bilgilerimiz</h2>
                        <p className="mb-6">
                            Ödemelerinizi aşağıdaki banka hesaplarımıza Havale veya EFT yoluyla yapabilirsiniz. Hesap alıcı adı tüm bankalar için ortaktır.
                        </p>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                            <h3 className="font-bold text-corporate-black mb-1">Alıcı Adı (Tüm Bankalar İçin)</h3>
                            <p className="text-lg text-gray-800">AR-KAR GIDA TARIM ÜRÜNLERİ VE TAŞIMACILIK TİCARET LİMİTED ŞİRKETİ</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Garanti BBVA */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-green-600 text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">G</span>
                                    Garanti BBVA
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">IBAN:</span>
                                        <span className="font-mono font-bold text-gray-800">TR12 0006 2000 0001 2345 6789 01</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Şube:</span>
                                        <span className="text-gray-800">Samsun Çarşamba Şubesi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ziraat Bankası */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-red-600 text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">Z</span>
                                    Ziraat Bankası
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">IBAN:</span>
                                        <span className="font-mono font-bold text-gray-800">TR45 0001 0002 0003 4567 8901 23</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Şube:</span>
                                        <span className="text-gray-800">Samsun Merkez Şubesi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Akbank */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <h3 className="font-bold text-red-700 text-lg mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">A</span>
                                    Akbank
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">IBAN:</span>
                                        <span className="font-mono font-bold text-gray-800">TR78 0004 6000 0005 6789 0123 45</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Şube:</span>
                                        <span className="text-gray-800">Samsun Bulvar Şubesi</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 rounded-r">
                            <strong>⚠️ Önemli:</strong> Ödemeniz onaylandıktan sonra siparişiniz işleme alınacaktır. Havale/EFT işlemlerinde dekont göndermenize gerek yoktur, sistem otomatik eşleşme yapmaktadır.
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-500">İçerik güncelleniyor...</p>
                        <button onClick={() => window.location.href = '/iletisim'} className="mt-4 text-action-red hover:underline">
                            Bizimle İletişime Geçin
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title={`${title} - Nalbur Deposu`}
                description={`${title} hakkında bilgi.`}
            />
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">{title}</h1>
                    <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-in fade-in duration-500">
                    <div className="prose prose-lg max-w-none prose-headings:text-corporate-black prose-a:text-brand-yellow hover:prose-a:text-yellow-600 transition-colors">
                        {getContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LegalPage;
