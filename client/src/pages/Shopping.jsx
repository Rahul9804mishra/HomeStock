import { useEffect, useState } from 'react';
import { api, msg } from '../services/api';
import {
  Trash2,
  Plus,
  Sparkles,
  Check,
  ShoppingCart,
} from 'lucide-react';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { units, fmt } from '../utils/constants';

export default function Shopping() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: '',
    quantity: 1,
    unit: 'piece',
    estimatedPrice: 0,
    priority: 'MEDIUM',
  });

  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Load shopping list
  const load = async () => {
    try {
      const response = await api.get('/shopping-list');
      setItems(response.data);
    } catch (error) {
      setToast(msg(error));
    }
  };

  // Load data when page opens
  useEffect(() => {
    load();
  }, []);

  // Add shopping item
  const add = async (e) => {
    e.preventDefault();

    try {
      await api.post('/shopping-list', form);

      setOpen(false);

      setForm({
        ...form,
        name: '',
      });

      await load();
    } catch (error) {
      setToast(msg(error));
    }
  };

  // Mark item as purchased/unpurchased
  const toggle = async (item) => {
    try {
      await api.put(`/shopping-list/${item._id}`, {
        purchased: !item.purchased,
      });

      await load();
    } catch (error) {
      setToast(msg(error));
    }
  };

  // Delete item
  const del = async (id) => {
    try {
      await api.delete(`/shopping-list/${id}`);

      await load();
    } catch (error) {
      setToast(msg(error));
    }
  };

  // Generate low-stock suggestions
  const suggest = async () => {
    try {
      const response = await api.get('/shopping-list/suggestions');

      for (const item of response.data) {
        await api.post('/shopping-list', item);
      }

      setToast(
        `${response.data.length} low-stock suggestions added`
      );

      await load();
    } catch (error) {
      setToast(msg(error));
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">

      {/* Header */}
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            Shopping List
          </p>

          <h1 className="text-3xl font-black">
            Next grocery run
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={suggest}
          >
            <Sparkles size={17} />
            Suggest low stock
          </button>

          <button
            className="btn-primary"
            onClick={() => setOpen(true)}
          >
            <Plus size={17} />
            Add item
          </button>
        </div>
      </div>

      {/* Shopping List */}
      <div className="card overflow-hidden">

        {items.length ? (
          items.map((item) => (
            <div
              key={item._id}
              className={`
                flex items-center gap-4
                border-b border-slate-100
                p-4 last:border-0
                dark:border-slate-800
                ${item.purchased ? 'opacity-50' : ''}
              `}
            >

              {/* Purchased Button */}
              <button
                onClick={() => toggle(item)}
                className={`
                  grid h-9 w-9 shrink-0 place-items-center
                  rounded-full border
                  ${
                    item.purchased
                      ? 'bg-emerald-600 text-white'
                      : 'border-slate-300'
                  }
                `}
              >
                <Check size={17} />
              </button>

              {/* Item Details */}
              <div className="min-w-0 flex-1">
                <p
                  className={`
                    font-semibold
                    ${item.purchased ? 'line-through' : ''}
                  `}
                >
                  {item.name}
                </p>

                <p className="text-xs text-slate-500">
                  {item.quantity} {item.unit} · est.{' '}
                  {fmt(item.estimatedPrice)} ·{' '}

                  <span
                    className={
                      item.priority === 'HIGH'
                        ? 'text-red-600'
                        : ''
                    }
                  >
                    {item.priority}
                  </span>
                </p>
              </div>

              {/* Delete Button */}
              <button
                className="btn-secondary !p-2 text-red-600"
                onClick={() => del(item._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="p-14 text-center">
            <ShoppingCart
              className="mx-auto text-slate-300"
              size={42}
            />

            <p className="mt-3 font-semibold">
              Your list is empty
            </p>

            <p className="text-sm text-slate-500">
              Add items or generate suggestions from low stock.
            </p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add shopping item"
      >
        <form
          onSubmit={add}
          className="space-y-4"
        >

          {/* Item Name */}
          <label className="block text-sm font-medium">
            Item name

            <input
              className="input mt-1"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              required
            />
          </label>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">

            <label className="text-sm font-medium">
              Quantity

              <input
                className="input mt-1"
                type="number"
                min="0.01"
                step="0.01"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </label>

            <label className="text-sm font-medium">
              Unit

              <select
                className="input mt-1"
                value={form.unit}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unit: e.target.value,
                  })
                }
              >
                {units.map((unit) => (
                  <option key={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </label>

          </div>

          {/* Price + Priority */}
          <div className="grid grid-cols-2 gap-3">

            <label className="text-sm font-medium">
              Estimated price

              <input
                className="input mt-1"
                type="number"
                min="0"
                value={form.estimatedPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    estimatedPrice: Number(
                      e.target.value
                    ),
                  })
                }
              />
            </label>

            <label className="text-sm font-medium">
              Priority

              <select
                className="input mt-1"
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value,
                  })
                }
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </label>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Add to list
          </button>

        </form>
      </Modal>

      {/* Toast */}
      <Toast
        message={toast}
        onClose={() => setToast('')}
      />

    </div>
  );
}