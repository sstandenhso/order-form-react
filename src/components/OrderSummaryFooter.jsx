import React from 'react';


const OrderSummaryFooter = ({ orderLines }) => {
  const itemCount = orderLines.filter(line => line.itemNum).length;
  const total = orderLines.reduce((sum, line) => sum + line.totalRequested, 0);
  return (
    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm">
      <span className="text-gray-600">
        {itemCount} items
      </span>
      <span className="font-semibold text-gray-900">
        Total: ${total.toFixed(2)}
      </span>
    </div>
  );
};

export default OrderSummaryFooter;
