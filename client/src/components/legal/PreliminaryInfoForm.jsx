import React from 'react';

export const PreliminaryInfoForm = () => {
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
};
