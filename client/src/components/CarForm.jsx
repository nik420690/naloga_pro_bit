import { useState, useEffect } from "react";

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "LPG", "CNG"];

const emptyCar = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  fuel_type: "Petrol",
  doors: 4,
  description: "",
};

export default function CarForm({ car = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(car ? { ...car } : { ...emptyCar });

  useEffect(() => {
    if (car) setForm({ ...car });
    else setForm({ ...emptyCar });
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "doors"
          ? parseInt(value, 10) || 0
          : name === "price"
          ? parseFloat(value) || ""
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      price: Number(form.price),
      fuel_type: form.fuel_type.trim(),
      doors: Number(form.doors),
      description: (form.description || "").trim(),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Brand *
          </label>
          <input
            name="brand"
            required
            value={form.brand}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Model *
          </label>
          <input
            name="model"
            required
            value={form.model}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Year *
          </label>
          <input
            name="year"
            type="number"
            min="1900"
            max="2030"
            required
            value={form.year}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Price (€) *
          </label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Doors *
          </label>
          <input
            name="doors"
            type="number"
            min="2"
            max="5"
            required
            value={form.doors}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Fuel type *
        </label>
        <select
          name="fuel_type"
          required
          value={form.fuel_type}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          {FUEL_TYPES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium hover:bg-amber-400 transition"
        >
          {car ? "Update car" : "Add car"}
        </button>
      </div>
    </form>
  );
}
