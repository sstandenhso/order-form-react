import React from 'react';


import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const OrderItemsPanel = ({ orderLines, setOrderLines, priceList }) => {
  // Autocomplete state
  const [activeInput, setActiveInput] = useState(null);
  const [inputSuggestions, setInputSuggestions] = useState([]);

  // Handle item number input with autocomplete
  const handleItemNumberInput = (lineId, value) => {
    updateOrderLine(lineId, 'itemNum', value);
    if (value.length >= 2) {
      const suggestions = priceList.filter(item =>
        item.itemNum.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setInputSuggestions(suggestions);
      setActiveInput(lineId);
    } else {
      setInputSuggestions([]);
      setActiveInput(null);
    }
  };

  // Select suggestion and populate order line
  const selectSuggestion = (lineId, item) => {
    setOrderLines(orderLines.map(line => {
      if (line.id === lineId) {
        return {
          ...line,
          itemNum: item.itemNum,
          description: item.description,
          retail: item.retail,
          qtyPerPack: item.qtyPerPack,
          maxDiscountAllowed: item.maxDiscount,
          pricePerItem: item.retail / item.qtyPerPack,
          requestedPriceDiscount: item.retail,
          qtyRequested: line.qtyRequested || '1',
          totalRequested: item.retail * (parseInt(line.qtyRequested) || 1)
        };
      }
      return line;
    }));
    setInputSuggestions([]);
    setActiveInput(null);
  };

  // Add new order line
  const addOrderLine = () => {
    const newId = Math.max(...orderLines.map(line => line.id)) + 1;
    setOrderLines([...orderLines, {
      id: newId,
      itemNum: '',
      description: '',
      catDescrip: '',
      retail: 0,
      requestedDiscountPercent: '',
      requestedPriceDiscount: 0,
      qtyPerPack: 0,
      pricePerItem: 0,
      qtyRequested: '',
      totalRequested: 0,
      calculatedDiscountPercent: 0,
      maxDiscountAllowed: 0
    }]);
  };

  // Remove order line
  const removeOrderLine = (id) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter(line => line.id !== id));
    }
  };

  // Update order line
  const updateOrderLine = (id, field, value) => {
    setOrderLines(orderLines.map(line => {
      if (line.id === id) {
        const updatedLine = { ...line, [field]: value };
        if (field === 'itemNum') {
          const priceItem = priceList.find(item => item.itemNum.toLowerCase() === value.toLowerCase());
          if (priceItem) {
            updatedLine.description = priceItem.description;
            updatedLine.retail = priceItem.retail;
            updatedLine.qtyPerPack = priceItem.qtyPerPack;
            updatedLine.maxDiscountAllowed = priceItem.maxDiscount;
            updatedLine.pricePerItem = priceItem.retail / priceItem.qtyPerPack;
          }
        }
        if (field === 'qtyRequested' || field === 'requestedDiscountPercent') {
          const qty = field === 'qtyRequested' ? parseInt(value) || 0 : parseInt(updatedLine.qtyRequested) || 0;
          const discountPercent = field === 'requestedDiscountPercent' ? parseFloat(value) || 0 : parseFloat(updatedLine.requestedDiscountPercent) || 0;
          if (qty > 0 && updatedLine.retail > 0) {
            const discountedPrice = updatedLine.retail * (1 - discountPercent / 100);
            updatedLine.requestedPriceDiscount = discountedPrice;
            updatedLine.totalRequested = discountedPrice * qty;
            updatedLine.calculatedDiscountPercent = discountPercent;
          }
        }
        return updatedLine;
      }
      return line;
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900">Order Items</h4>
      </div>
      <div className="flex justify-end mb-4 p-2">
        <button
          onClick={addOrderLine}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
        >
          <Plus size={16} />
          Add Blank Line
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item #</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Max Disc %</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Disc %</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orderLines.map((line, index) => (
              <tr key={line.id} className="hover:bg-gray-50">
                {/* Item Number */}
                <td className="px-3 py-2 relative">
                  <input
                    type="text"
                    className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.itemNum}
                    onChange={(e) => handleItemNumberInput(line.id, e.target.value)}
                    onBlur={() => {
                      setTimeout(() => {
                        setActiveInput(null);
                        setInputSuggestions([]);
                      }, 200);
                    }}
                    placeholder="Item #"
                  />
                  {/* Autocomplete Suggestions */}
                  {activeInput === line.id && inputSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 z-50 w-80 bg-white border border-gray-200 rounded-md shadow-xl max-h-64 overflow-y-auto">
                      {inputSuggestions.map((item) => (
                        <div
                          key={item.itemNum}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => selectSuggestion(line.id, item)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {item.itemNum}
                              </div>
                              <div className="text-xs text-gray-600 line-clamp-2">
                                {item.description}
                              </div>
                            </div>
                            <div className="ml-3 text-right flex-shrink-0">
                              <div className="text-sm font-semibold text-green-600">
                                ${item.retail.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Max: {(item.maxDiscount * 100).toFixed(0)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                {/* Description */}
                <td className="px-3 py-2 max-w-xs">
                  <div className="text-xs text-gray-700 truncate" title={line.description}>
                    {line.description || 'Enter item number'}
                  </div>
                </td>
                {/* Price */}
                <td className="px-3 py-2 text-center">
                  <span className="text-xs font-medium text-green-600">
                    ${line.retail.toFixed(2)}
                  </span>
                </td>
                {/* Max Discount */}
                <td className="px-3 py-2 text-center">
                  <span className="text-xs font-medium text-orange-600">
                    {line.maxDiscountAllowed > 0 ? `${(line.maxDiscountAllowed * 100).toFixed(0)}%` : '-'}
                  </span>
                </td>
                {/* Discount */}
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.requestedDiscountPercent}
                    onChange={(e) => updateOrderLine(line.id, 'requestedDiscountPercent', e.target.value)}
                    max={(line.maxDiscountAllowed * 100).toFixed(1)}
                    placeholder="0"
                  />
                </td>
                {/* Quantity */}
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={line.qtyRequested}
                    onChange={(e) => updateOrderLine(line.id, 'qtyRequested', e.target.value)}
                    placeholder="1"
                  />
                </td>
                {/* Total */}
                <td className="px-3 py-2 text-center">
                  <span className="text-xs font-semibold text-gray-900">
                    ${line.totalRequested.toFixed(2)}
                  </span>
                </td>
                {/* Action */}
                <td className="px-3 py-2 text-center">
                  {orderLines.length > 1 && (
                    <button
                      onClick={() => removeOrderLine(line.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsPanel;
