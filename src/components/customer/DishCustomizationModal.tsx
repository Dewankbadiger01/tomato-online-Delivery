import React, { useState } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../types';
import { useFoodDelivery } from '../../context/FoodDeliveryContext';

interface DishCustomizationModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const DishCustomizationModal: React.FC<DishCustomizationModalProps> = ({ item, onClose }) => {
  const { addToCart } = useFoodDelivery();

  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (item.customizationGroups) {
      item.customizationGroups.forEach(grp => {
        if (grp.required && grp.options.length > 0) {
          defaults[grp.name] = grp.options[0].name;
        }
      });
    }
    return defaults;
  });

  const handleOptionChange = (groupName: string, optionName: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: optionName
    }));
  };

  let extraCost = 0;
  if (item.customizationGroups) {
    item.customizationGroups.forEach(grp => {
      const choice = selectedOptions[grp.name];
      if (choice) {
        const opt = grp.options.find(o => o.name === choice);
        if (opt) extraCost += opt.price;
      }
    });
  }

  const finalUnitPrice = item.price + extraCost;
  const totalPrice = finalUnitPrice * quantity;

  const handleConfirm = () => {
    addToCart(item, quantity, selectedOptions, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums shrink-0">
                ₹{item.price}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Customization Groups */}
          {item.customizationGroups &&
            item.customizationGroups.map(group => (
              <div key={group.id} className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>{group.name}</span>
                  <span className="text-slate-400 font-normal">
                    {group.required ? 'Required · Pick 1' : 'Optional'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map(option => {
                    const isSelected = selectedOptions[group.name] === option.name;
                    return (
                      <button
                        type="button"
                        key={option.name}
                        onClick={() => handleOptionChange(group.name, option.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/50 text-slate-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-rose-600 bg-rose-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </span>
                          <span>{option.name}</span>
                        </div>
                        <span className="font-mono tabular-nums text-slate-500">
                          {option.price > 0 ? `+₹${option.price}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Special Instructions */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-900">
              Cooking & Packaging Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g. Make it extra spicy, send extra green chutney, less oil..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold font-mono tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-between"
          >
            <span>Add to Bag</span>
            <span className="font-mono tabular-nums">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
