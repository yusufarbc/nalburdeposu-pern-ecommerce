import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Share2, Check, ChevronLeft, ChevronRight, Minus, Plus, Package, Truck, Shield } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema, combineSchemas } from '../utils/structuredData';
import { formatPrice, calculateDiscountPercentage } from '../utils/formatters';

function sanitizeDescription(input) {
    if (!input) return '';

    // Remove script-like blocks iteratively to avoid incomplete multi-character sanitization
    let previous;
    let sanitized = String(input);
    const scriptPattern = /<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi;
    do {
        previous = sanitized;
        sanitized = sanitized.replace(scriptPattern, '');
    } while (sanitized !== previous);

    // Remove any remaining angle brackets to avoid residual tag-like constructs
    sanitized = sanitized.replace(/[<>]/g, '');

    return sanitized;
}

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Use custom hooks for data fetching
    const { product, loading, error } = useProduct(id);
    const { products: relatedProducts } = useProducts(
        product?.kategoriId ? { kategoriId: product.kategoriId } : null
    );

    // UI state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // Reset state when product ID changes
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
    }, [id]);

    // Build image array (main + additional images)
    const getImages = () => {
        if (!product) return [];
        const images = [];
        if (product.resimUrl) images.push(product.resimUrl);
        if (product.resimler && product.resimler.length > 0) {
            product.resimler.forEach(r => {
                if (r.url && !images.includes(r.url)) images.push(r.url);
            });
        }
        return images.length > 0 ? images : [null];
    };

    const images = getImages();

    const handleAddToCart = () => {
        setIsAdding(true);
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.ad,
                    text: `${product.ad} - Nalbur Deposu`,
                    url: window.location.href
                });
            } catch {
                // Share cancelled by user
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link kopyalandı!');
        }
    };

    const inStock = true;
    const discountPercentage = product
        ? calculateDiscountPercentage(product.fiyat, product.indirimliFiyat)
        : 0;

    // Filter related products (exclude current product)
    const filteredRelated = relatedProducts.filter(p => p.id !== id).slice(0, 4);

    // SEO data
    const breadcrumbs = product ? [
        { name: 'Anasayfa', url: '/' },
        ...(product.kategori ? [{ name: product.kategori.ad, url: `/?search=${product.kategori.ad}` }] : []),
        { name: product.ad }
    ] : [];

    const structuredData = product ? combineSchemas(
        generateProductSchema(product),
        generateBreadcrumbSchema(breadcrumbs)
    ) : null;

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-32" />
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-14 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || 'Ürün bulunamadı'}</h2>
            <button
                onClick={() => navigate('/')}
                className="mt-4 text-action-red hover:underline flex items-center justify-center gap-2 mx-auto"
            >
                <ArrowLeft size={16} /> Ürünlere Geri Dön
            </button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO
                title={product.ad}
                description={sanitizeDescription(product.aciklama).substring(0, 160) || product.ad}
                keywords={`${product.ad}, ${product.kategori?.ad || ''}, ${product.marka?.ad || ''}, hırdavat, inşaat malzemeleri`}
                ogType="product"
                ogImage={product.resimUrl}
                canonical={`https://nalburdeposu.com.tr/product/${product.id}`}
                structuredData={structuredData}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-corporate-black transition-colors">Anasayfa</Link>
                    <ChevronRight size={14} />
                    {product.kategori && (
                        <>
                            <Link to={`/?search=${product.kategori.ad}`} className="hover:text-corporate-black transition-colors">
                                {product.kategori.ad}
                            </Link>
                            <ChevronRight size={14} />
                        </>
                    )}
                    <span className="text-corporate-black font-medium truncate max-w-[200px]">{product.ad}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden aspect-square group">
                            {images[selectedImageIndex] ? (
                                <img
                                    src={images[selectedImageIndex]}
                                    alt={product.ad}
                                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Package size={120} className="text-gray-300" />
                                </div>
                            )}

                            {/* Discount Badge */}
                            {discountPercentage > 0 && (
                                <div className="absolute top-4 left-4 bg-brand-yellow text-corporate-black px-4 py-2 rounded-sm shadow-xl flex flex-col items-center leading-none z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest">FIRSAT</span>
                                    <span className="text-lg font-black tracking-tighter">%{discountPercentage} İndirim</span>
                                </div>
                            )}

                            {/* Navigation Arrows (if multiple images) */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isWishlisted ? 'bg-action-red text-white' : 'bg-white text-gray-600 hover:bg-action-red hover:text-white'
                                        }`}
                                >
                                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-lg hover:bg-corporate-black hover:text-white transition-all"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-brand-yellow shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Package size={24} className="text-gray-300" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        {/* Brand */}
                        {product.marka && (
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                                {product.marka.ad}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-black text-corporate-black mb-4 leading-tight">
                            {product.ad}
                        </h1>



                        {/* Price */}
                        <div className="flex flex-col gap-1 mb-6">
                            {product.indirimliFiyat ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black text-corporate-black tracking-tighter">
                                            ₺{Number(product.indirimliFiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                        <div className="bg-action-red/10 text-action-red text-[10px] font-black px-2 py-1 rounded uppercase">
                                            Özel Fiyat
                                        </div>
                                    </div>
                                    <span className="text-lg text-gray-400 line-through opacity-70">
                                        ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                </>
                            ) : (
                                <span className="text-4xl font-black text-corporate-black tracking-tighter">
                                    ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>

                        {/* Stock Status (Simplified since management is off) */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                                <Check size={16} />
                                Stokta Mevcut
                            </span>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock || isAdding}
                                className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-xl font-black text-lg transition-all duration-500 shadow-2xl transform ${isAdding
                                    ? 'bg-green-600 text-white scale-95'
                                    : inStock
                                        ? 'bg-[#dc2a12] text-white hover:bg-black hover:text-brand-yellow shadow-xl hover:shadow-2xl active:scale-95'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isAdding ? (
                                    <>
                                        <Check size={24} />
                                        Sepete Eklendi!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={24} />
                                        Sepete Ekle
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-8">
                            <div className="flex flex-col items-center text-center">
                                <Truck size={24} className="text-brand-yellow mb-2" />
                                <span className="text-xs text-gray-600 font-medium">Hızlı Kargo</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Shield size={24} className="text-brand-yellow mb-2" />
                                <span className="text-xs text-gray-600 font-medium">Güvenli Ödeme</span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <Package size={24} className="text-brand-yellow mb-2" />
                                <span className="text-xs text-gray-600 font-medium">Kolay İade</span>
                            </div>
                        </div>

                        {/* Bulk Order Info */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                            <p className="text-blue-700 text-sm">
                                <strong>Toplu Sipariş?</strong> Projeleriniz ve toplu alımlarınız için{' '}
                                <a href="mailto:satis@nalburdeposu.com.tr" className="underline font-bold hover:text-blue-900">
                                    satis@nalburdeposu.com.tr
                                </a> adresinden iletişime geçip, özel fiyat teklifi alın.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`pb-4 font-bold transition-colors border-b-2 -mb-px ${activeTab === 'description'
                                    ? 'text-corporate-black border-brand-yellow'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                                    }`}
                            >
                                Açıklama
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`pb-4 font-bold transition-colors border-b-2 -mb-px ${activeTab === 'specs'
                                    ? 'text-corporate-black border-brand-yellow'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                                    }`}
                            >
                                Teknik Özellikler
                            </button>
                        </div>
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-lg max-w-none">
                                {product.aciklama ? (
                                    <div dangerouslySetInnerHTML={{ __html: product.aciklama }} />
                                ) : (
                                    <p className="text-gray-500">Bu ürün için açıklama bulunmuyor.</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Weight display hidden per user request */}
                                {product.kategori && (
                                    <div className="flex justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-500">Kategori</span>
                                        <span className="font-medium">{product.kategori.ad}</span>
                                    </div>
                                )}
                                {product.marka && (
                                    <div className="flex justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-500">Marka</span>
                                        <span className="font-medium">{product.marka.ad}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-black text-corporate-black mb-8">Benzer Ürünler</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <FeaturesSection />
        </div>
    );
}
