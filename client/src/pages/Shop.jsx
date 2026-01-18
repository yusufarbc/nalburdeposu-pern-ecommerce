import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { useProducts, useProductFilter } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { fetchBrands } from '../services/apiService';
import SEO from '../components/SEO';
import { generateWebsiteSchema, generateProductListSchema, combineSchemas } from '../utils/structuredData';
import { Hammer, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { ProductFilters } from '../components/home/ProductFilters';

export function Shop() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // URL Params
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const filterType = searchParams.get('filter'); // 'deals', 'bestsellers', 'new', 'featured'
    const kategoriSlug = searchParams.get('kategori'); // URL-friendly slug
    const kategoriId = searchParams.get('kategoriId'); // Fallback for backward compatibility
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const markaIdParam = searchParams.get('markaId');
    const sortParam = searchParams.get('sort') || 'newest';

    // Local State
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [selectedMarkaId, setSelectedMarkaId] = useState(markaIdParam || '');
    const [sortBy, setSortBy] = useState(sortParam);
    const [showFilters, setShowFilters] = useState(false);
    const [brands, setBrands] = useState([]);

    // Fetch brands
    useEffect(() => {
        fetchBrands().then(setBrands).catch(console.error);
    }, []);

    // Sync state with URL params when they change
    useEffect(() => {
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setSelectedMarkaId(markaIdParam || '');
        setSortBy(sortParam || 'newest');
    }, [searchParams]);

    // Build filters based on URL params
    const buildFilters = () => {
        const filters = { markaId: selectedMarkaId || null };

        if (kategoriSlug) filters.kategoriSlug = kategoriSlug;
        if (kategoriId) filters.kategoriId = kategoriId;
        if (filterType === 'deals') filters.firsatUrunu = true;
        if (filterType === 'bestsellers') filters.cokSatanlar = true;
        if (filterType === 'new') filters.yeniUrun = true;
        if (filterType === 'featured') filters.oneCikan = true;

        // Initial load sync
        if (markaIdParam && !selectedMarkaId) filters.markaId = markaIdParam;

        return filters;
    };

    // Data Fetching
    const { categories } = useCategories();
    const { products, loading } = useProducts(buildFilters());
    const { filteredProducts, activeCategory } = useProductFilter(products, searchQuery, categories);

    // Helpers
    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams);
        if (minPrice) params.set('minPrice', minPrice); else params.delete('minPrice');
        if (maxPrice) params.set('maxPrice', maxPrice); else params.delete('maxPrice');
        navigate(`/magaza?${params.toString()}`);
    };

    const clearPriceFilter = () => {
        setMinPrice('');
        setMaxPrice('');
        const params = new URLSearchParams(searchParams);
        params.delete('minPrice');
        params.delete('maxPrice');
        navigate(`/magaza?${params.toString()}`);
    };

    const applyBrandFilter = (markaId) => {
        setSelectedMarkaId(markaId);
        const params = new URLSearchParams(searchParams);
        if (markaId) params.set('markaId', markaId); else params.delete('markaId');
        navigate(`/magaza?${params.toString()}`);
    };

    const applySorting = (sort) => {
        setSortBy(sort);
        const params = new URLSearchParams(searchParams);
        if (sort && sort !== 'newest') params.set('sort', sort); else params.delete('sort');
        navigate(`/magaza?${params.toString()}`);
    };

    // Client-side filtering (price) & sorting
    let displayProducts = filteredProducts.filter(product => {
        const price = product.fiyat;
        const min = minPriceParam ? parseFloat(minPriceParam) : 0;
        const max = maxPriceParam ? parseFloat(maxPriceParam) : Infinity;
        return price >= min && price <= max;
    });

    displayProducts = [...displayProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-asc': return a.fiyat - b.fiyat;
            case 'price-desc': return b.fiyat - a.fiyat;
            case 'name-asc': return a.ad.localeCompare(b.ad, 'tr');
            case 'name-desc': return b.ad.localeCompare(a.ad, 'tr');
            case 'newest': default: return new Date(b.olusturulmaTarihi) - new Date(a.olusturulmaTarihi);
        }
    });

    // SEO Titles
    const getFilterTitle = () => {
        if (filterType === 'deals') return 'Fırsat Ürünleri';
        if (filterType === 'bestsellers') return 'Çok Satanlar';
        if (filterType === 'new') return 'Yeni Ürünler';
        if (filterType === 'featured') return 'Öne Çıkan Ürünler';
        return null;
    };

    const pageTitle = activeCategory
        ? `${activeCategory.ad} - Ürünler`
        : searchQuery
            ? `"${searchQuery}" Arama Sonuçları`
            : getFilterTitle() || 'Mağaza';

    const seoDescription = activeCategory
        ? `${activeCategory.ad} kategorisindeki tüm ürünleri keşfedin. En kaliteli hırdavat ürünleri ve yapı malzemeleri.`
        : 'Nalbur Deposu - İnşaat ve tadilat malzemeleri, hırdavat ürünleri, boya ve yapı kimyasalları en uygun fiyatlarla.';

    const structuredData = combineSchemas(
        generateWebsiteSchema(),
        generateProductListSchema(
            displayProducts.slice(0, 10),
            activeCategory ? `${activeCategory.ad} Ürünler` : getFilterTitle() || `"${searchQuery}" Arama Sonuçları`
        )
    );

    return (
        <div className="bg-white min-h-screen">
            <SEO
                title={pageTitle}
                description={seoDescription}
                keywords={activeCategory ? `${activeCategory.ad}, hırdavat, inşaat malzemeleri` : undefined}
                structuredData={structuredData}
                canonical={activeCategory ? `https://nalburdeposu.com.tr/magaza?kategori=${activeCategory.slug || activeCategory.id}` : 'https://nalburdeposu.com.tr/magaza'}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb / Header */}
                <div className="flex flex-col gap-4 mb-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="cursor-pointer hover:text-brand-yellow" onClick={() => navigate('/')}>Anasayfa</span>
                        <ChevronRight size={16} />
                        <span className="cursor-pointer hover:text-brand-yellow" onClick={() => navigate('/magaza')}>Mağaza</span>

                        {activeCategory && (
                            <>
                                <ChevronRight size={16} />
                                <span className="font-bold text-brand-yellow">{activeCategory.ad}</span>
                            </>
                        )}
                    </nav>

                    <div className="flex items-end justify-between border-b border-gray-200 pb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-corporate-black mb-2 flex items-center gap-2">
                                {activeCategory ? `${activeCategory.ad}` : pageTitle}
                            </h1>
                            {!loading && (
                                <p className="text-gray-500 text-sm">{displayProducts.length} ürün bulundu</p>
                            )}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <SlidersHorizontal size={18} />
                            <span className="text-sm font-bold">Filtrele</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filter Sidebar */}
                    <ProductFilters
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        applyPriceFilter={applyPriceFilter}
                        clearPriceFilter={clearPriceFilter}
                        minPriceParam={minPriceParam}
                        maxPriceParam={maxPriceParam}
                        brands={brands}
                        selectedMarkaId={selectedMarkaId}
                        applyBrandFilter={applyBrandFilter}
                        sortBy={sortBy}
                        applySorting={applySorting}
                    />

                    {/* Products Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {displayProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                                {displayProducts.length === 0 && (
                                    <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        <Hammer size={64} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">Ürün Bulunamadı</h3>
                                        <p className="text-gray-500 mb-6">Arama kriterlerinize uygun ürün bulunamadı.</p>
                                        <button
                                            onClick={() => {
                                                navigate('/magaza');
                                                // Clear all filters
                                            }}
                                            className="bg-brand-yellow text-corporate-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                                        >
                                            Filtreleri Temizle
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
