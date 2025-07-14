import React from 'react';


const InstructionsPanel = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <h4 className="font-semibold text-yellow-800 mb-2">Instructions:</h4>
    <ul className="text-sm text-yellow-700 space-y-1">
      <li>• Click "Add Items to Order" to browse the full catalog or search for specific items</li>
      <li>• Click the "+" button to instantly add items to your order</li>
      <li>• Use the search box to filter items by number or description</li>
      <li>• Use "Add All Visible" to quickly add multiple items at once</li>
      <li>• Use "Add Blank Line" to manually enter item numbers with autocomplete</li>
      <li>• Discount percentage cannot exceed the maximum allowed for each item</li>
      <li>• Complete all customer information before generating PDF</li>
    </ul>
  </div>
);

export default InstructionsPanel;
