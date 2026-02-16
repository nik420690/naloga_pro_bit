import { useState, useEffect } from "react";
import { getCars, getBrands } from "../api/client";
import CarCard from "../components/CarCard";

const SORT_OPTIONS = [
  { value: "brand", label: "Brand" },
  { value: "year", label: "Year" },
  { value: "price", label: "Price" },
];

export default function Home() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("brand");
  const [order, setOrder] = useState("asc");
  const [filterBrand, setFilterBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const loadBrands = async () => {
    try {
      const b = await getBrands();
      setBrands(b);
    } catch {
      setBrands([]);
    }
  };

  const loadCars = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort, order };
      if (filterBrand) params.brand = filterBrand;
      if (minPrice !== "") params.min_price = minPrice;
      if (maxPrice !== "") params.max_price = maxPrice;
      const data = await getCars(params);
      setCars(data);
    } catch (e) {
      setError(e.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    loadCars();
  }, [sort, order, filterBrand, minPrice, maxPrice]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Car listings</h1>

      <section className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
          Sort & filter
        </h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sort by</label>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm min-w-[140px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Min price</label>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-28 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Max price</label>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-28 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading cars...</div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12 text-slate-500 rounded-xl bg-white border border-slate-200">
          No cars match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
