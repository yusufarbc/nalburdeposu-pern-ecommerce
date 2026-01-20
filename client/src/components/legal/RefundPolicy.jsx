import React from 'react';

export const RefundPolicy = () => {
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
};
