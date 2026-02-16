export default function CarCard({ car }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-slate-800 text-lg">
            {car.brand} {car.model}
          </h3>
          <span className="text-amber-600 font-semibold whitespace-nowrap">
            €{Number(car.price).toLocaleString()}
          </span>
        </div>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>Year: {car.year}</li>
          <li>Fuel: {car.fuel_type}</li>
          <li>Doors: {car.doors}</li>
        </ul>
        {car.description && (
          <p className="mt-3 text-sm text-slate-500 line-clamp-2">
            {car.description}
          </p>
        )}
      </div>
    </article>
  );
}
