import React from 'react';


const CustomerInfoForm = ({ customerInfo, setCustomerInfo, shipToDifferent, setShipToDifferent }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PO#</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.poNumber}
              onChange={(e) => setCustomerInfo({ ...customerInfo, poNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer #</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerInfo.customerNumber}
              onChange={(e) => setCustomerInfo({ ...customerInfo, customerNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Bill To / Ship To Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bill To */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill To:</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerInfo.billTo.practice}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  billTo: { ...customerInfo.billTo, practice: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerInfo.billTo.street}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  billTo: { ...customerInfo.billTo, street: e.target.value }
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City, State:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                    value={customerInfo.billTo.city}
                    onChange={(e) => setCustomerInfo({
                      ...customerInfo,
                      billTo: { ...customerInfo.billTo, city: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                    value={customerInfo.billTo.state}
                    onChange={(e) => setCustomerInfo({
                      ...customerInfo,
                      billTo: { ...customerInfo.billTo, state: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerInfo.billTo.zipCode}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo,
                    billTo: { ...customerInfo.billTo, zipCode: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={customerInfo.billTo.phone}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo,
                    billTo: { ...customerInfo.billTo, phone: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ship To */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Ship To:</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={shipToDifferent}
                onChange={(e) => setShipToDifferent(e.target.checked)}
              />
              <span className="text-gray-600">Different address</span>
            </label>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Practice:</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                value={customerInfo.shipTo.practice}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  shipTo: { ...customerInfo.shipTo, practice: e.target.value }
                })}
                disabled={!shipToDifferent}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street:</label>
              <input
                type="text"
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                value={customerInfo.shipTo.street}
                onChange={(e) => setCustomerInfo({
                  ...customerInfo,
                  shipTo: { ...customerInfo.shipTo, street: e.target.value }
                })}
                disabled={!shipToDifferent}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City, State:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                    placeholder="City"
                    value={customerInfo.shipTo.city}
                    onChange={(e) => setCustomerInfo({
                      ...customerInfo,
                      shipTo: { ...customerInfo.shipTo, city: e.target.value }
                    })}
                    disabled={!shipToDifferent}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                    placeholder="State"
                    value={customerInfo.shipTo.state}
                    onChange={(e) => setCustomerInfo({
                      ...customerInfo,
                      shipTo: { ...customerInfo.shipTo, state: e.target.value }
                    })}
                    disabled={!shipToDifferent}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code:</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                  value={customerInfo.shipTo.zipCode}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo,
                    shipTo: { ...customerInfo.shipTo, zipCode: e.target.value }
                  })}
                  disabled={!shipToDifferent}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${!shipToDifferent ? 'bg-gray-100 text-gray-500' : ''}`}
                  value={customerInfo.shipTo.phone}
                  onChange={(e) => setCustomerInfo({
                    ...customerInfo,
                    shipTo: { ...customerInfo.shipTo, phone: e.target.value }
                  })}
                  disabled={!shipToDifferent}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
