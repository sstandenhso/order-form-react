import React from 'react';


import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

const ItemSearchPanel = ({ priceList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showItemSelector, setShowItemSelector] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = priceList.filter(item =>
        item.itemNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 50);
      setFilteredItems(filtered);
    } else {
      setFilteredItems(priceList.slice(0, 100));
    }
  }, [searchTerm, priceList]);

  const toggleItemSelection = (itemNum) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemNum)) {
      newSelection.delete(itemNum);
    } else {
      newSelection.add(itemNum);
    }
    setSelectedItems(newSelection);
  };

  // Placeholder for addSingleItemToOrder
  const addSingleItemToOrder = (item) => {
    // This should be lifted to parent if needed
    // For now, just select the item
    toggleItemSelection(item.itemNum);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
        <div>
          <button
            onClick={() => setShowItemSelector(!showItemSelector)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Search size={20} />
            {showItemSelector ? 'Hide Item Search' : 'Add Items to Order'}
          </button>
        </div>
      </div>
      {showItemSelector && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Add Items to Order</h4>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by item number or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {filteredItems.length > 0 && (
              <div className="flex items-center justify-between mb-4 text-sm">
                <span className="text-gray-600">
                  {searchTerm.length >= 2
                    ? `Found ${filteredItems.length} items${filteredItems.length === 50 ? ' (showing first 50)' : ''} • ${selectedItems.size} added to order`
                    : `Showing ${filteredItems.length} items • ${selectedItems.size} added to order`
                  }
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      filteredItems.forEach(item => {
                        if (!selectedItems.has(item.itemNum)) {
                          addSingleItemToOrder(item);
                        }
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add All Visible
                  </button>
                  <button
                    onClick={() => setSelectedItems(new Set())}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Clear Selections
                  </button>
                </div>
              </div>
            )}
            <div className="max-h-96 overflow-y-auto space-y-1 border border-gray-200 rounded-md">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.itemNum} className="group border-b border-gray-100 last:border-b-0 p-4 hover:bg-blue-50/50 transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {item.itemNum}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${item.retail.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">
                            (${(item.retail / item.qtyPerPack).toFixed(2)}/item)
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{item.qtyPerPack}/pkg</span>
                          <span>Max Discount: {(item.maxDiscount * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => addSingleItemToOrder(item)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            selectedItems.has(item.itemNum)
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {selectedItems.has(item.itemNum) ? (
                            <span className="text-sm">✓</span>
                          ) : (
                            <Plus size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No items found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemSearchPanel;
