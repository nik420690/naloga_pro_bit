import { useState, useEffect } from "react";
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
} from "../api/client";
import CarForm from "../components/CarForm";

export default function Admin() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadCars = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCars();
      setCars(data);
    } catch (e) {
      setError(e.message || "Failed to load cars");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleAdd = async (payload) => {
    setFormError("");
    try {
      await createCar(payload);
      setShowForm(false);
      loadCars();
    } catch (e) {
      setFormError(e.message || "Failed to add car");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setFormError("");
    try {
      await updateCar(editing.id, payload);
      setEditing(null);
      loadCars();
    } catch (e) {
      setFormError(e.message || "Failed to update car");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this car?")) return;
    setDeletingId(id);
    try {
      await deleteCar(id);
      loadCars();
    } catch (e) {
      setError(e.message || "Failed to delete car");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin – Manage cars</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
            setFormError("");
          }}
          className="rounded-lg bg-amber-500 text-slate-900 font-medium px-4 py-2 hover:bg-amber-400 transition shrink-0"
        >
          Add car
        </button>
      </div>

      {showForm && !editing && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">New car</h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {formError}
            </div>
          )}
          <CarForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Edit: {editing.brand} {editing.model}
          </h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {formError}
            </div>
          )}
          <CarForm
            car={editing}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditing(null);
              setFormError("");
            }}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Model
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Year
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 hidden sm:table-cell">
                    Fuel
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 w-28">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr
                    key={car.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {car.brand}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{car.model}</td>
                    <td className="px-4 py-3 text-slate-700">{car.year}</td>
                    <td className="px-4 py-3 text-slate-700">
                      €{Number(car.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                      {car.fuel_type}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowForm(false);
                            setEditing(car);
                            setFormError("");
                          }}
                          className="text-sm text-amber-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          disabled={deletingId === car.id}
                          className="text-sm text-red-600 hover:underline disabled:opacity-50"
                        >
                          {deletingId === car.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cars.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-500">
              No cars yet. Add one above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
