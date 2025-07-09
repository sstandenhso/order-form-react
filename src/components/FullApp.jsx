import React, { useState, useEffect } from 'react';
import PriceList from '../assets/pricelist.js';

import { Download, Plus, Trash2, Search } from 'lucide-react';

 

const HSO_ORDER_FORM = () => {

 // Full price list data from Excel Tab 2 (showing first 50 items - in production, load all 3,168 items)

 const [priceList, setPriceList] = useState(PriceList);

  //  useEffect(() => {
  //       const fetchData = async () => {
  //         try {
  //           const response = await fetch('/pricelist.json'); // Path relative to public folder
  //           if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //           }
  //           const data = await response.json();
  //           setPriceList(data);
  //         } catch (error) {
  //           setError(error);
  //           console.error("Error fetching JSON:", error);
  //         }
  //       };

  //       fetchData();
  //     }, []); // Empty dependency array means this runs once on mount

 // Search and selection state

 const [searchTerm, setSearchTerm] = useState('');

 const [filteredItems, setFilteredItems] = useState([]);

 const [selectedItems, setSelectedItems] = useState(new Set());

 const [showItemSelector, setShowItemSelector] = useState(false);

 

 // Autocomplete state for order items

 const [activeInput, setActiveInput] = useState(null);

 const [inputSuggestions, setInputSuggestions] = useState([]);

 

 // Customer information state

 const [customerInfo, setCustomerInfo] = useState({

   poNumber: '',

   customerNumber: '',

   billTo: {

     practice: '',

     street: '',

     city: '',

     state: '',

     zipCode: '',

     phone: ''

   },

   shipTo: {

     practice: '',

     street: '',

     city: '',

     state: '',

     zipCode: '',

     phone: ''

   }

 });

 

 // State for shipping address control

 const [shipToDifferent, setShipToDifferent] = useState(false);

 

 // Order lines state

 const [orderLines, setOrderLines] = useState([

   {

     id: 1,

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

   }

 ]);

 

 // Sync Ship To with Bill To when not different

 useEffect(() => {

   if (!shipToDifferent) {

     setCustomerInfo(prev => ({

       ...prev,

       shipTo: { ...prev.billTo }

     }));

   }

 }, [shipToDifferent, customerInfo.billTo]);

 

 // Search functionality

 useEffect(() => {

   if (searchTerm.length >= 2) {

     const filtered = priceList.filter(item =>

       item.itemNum.toLowerCase().includes(searchTerm.toLowerCase()) ||

       item.description.toLowerCase().includes(searchTerm.toLowerCase())

     ).slice(0, 50); // Limit to 50 results for performance

     setFilteredItems(filtered);

   } else {

     // Show all items when no search term (limited to first 100 for performance)

     setFilteredItems(priceList.slice(0, 100));

   }

 }, [searchTerm, priceList]);

 

 // Toggle item selection

 const toggleItemSelection = (itemNum) => {

   const newSelection = new Set(selectedItems);

   if (newSelection.has(itemNum)) {

     newSelection.delete(itemNum);

   } else {

     newSelection.add(itemNum);

   }

   setSelectedItems(newSelection);

 };

 

 // Handle item number input with autocomplete

 const handleItemNumberInput = (lineId, value) => {

   // Update the order line

   updateOrderLine(lineId, 'itemNum', value);

   

   // Show suggestions if input has 2+ characters

   if (value.length >= 2) {

     const suggestions = priceList.filter(item =>

       item.itemNum.toLowerCase().includes(value.toLowerCase()) ||

       item.description.toLowerCase().includes(value.toLowerCase())

     ).slice(0, 8); // Limit to 8 suggestions

     

     setInputSuggestions(suggestions);

     setActiveInput(lineId);

   } else {

     setInputSuggestions([]);

     setActiveInput(null);

   }

 };

 

 // Select suggestion and populate order line

 const selectSuggestion = (lineId, item) => {

   // Update the order line with selected item

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

   

   // Clear suggestions

   setInputSuggestions([]);

   setActiveInput(null);

 };

 

 // Add single item directly to order

 const addSingleItemToOrder = (item) => {

   const maxId = Math.max(...orderLines.map(line => line.id), 0);

   const newOrderLine = {

     id: maxId + 1,

     itemNum: item.itemNum,

     description: item.description,

     catDescrip: '',

     retail: item.retail,

     requestedDiscountPercent: '',

     requestedPriceDiscount: item.retail,

     qtyPerPack: item.qtyPerPack,

     pricePerItem: item.retail / item.qtyPerPack,

     qtyRequested: '1',

     totalRequested: item.retail,

     calculatedDiscountPercent: 0,

     maxDiscountAllowed: item.maxDiscount

   };

   

   // Remove the default empty line if it exists

   const filteredOrderLines = orderLines.filter(line =>

     line.itemNum !== '' || orderLines.length === 1

   );

   

   setOrderLines([...filteredOrderLines, newOrderLine]);

   

   // Add to selected items for visual feedback

   const newSelection = new Set(selectedItems);

   newSelection.add(item.itemNum);

   setSelectedItems(newSelection);

 };

 

 // Add selected items to order

 const addSelectedItemsToOrder = () => {

   const newOrderLines = [];

   let maxId = Math.max(...orderLines.map(line => line.id), 0);

   

   selectedItems.forEach(itemNum => {

     const priceItem = priceList.find(item => item.itemNum === itemNum);

     if (priceItem) {

       maxId++;

       newOrderLines.push({

         id: maxId,

         itemNum: priceItem.itemNum,

         description: priceItem.description,

         catDescrip: '',

         retail: priceItem.retail,

         requestedDiscountPercent: '',

         requestedPriceDiscount: priceItem.retail,

         qtyPerPack: priceItem.qtyPerPack,

         pricePerItem: priceItem.retail / priceItem.qtyPerPack,

         qtyRequested: '1',

         totalRequested: priceItem.retail,

         calculatedDiscountPercent: 0,

         maxDiscountAllowed: priceItem.maxDiscount

       });

     }

   });

   

   // Remove the default empty line if it exists

   const filteredOrderLines = orderLines.filter(line =>

     line.itemNum !== '' || orderLines.length === 1

   );

   

   setOrderLines([...filteredOrderLines, ...newOrderLines]);

   setSelectedItems(new Set());

   setShowItemSelector(false);

   setSearchTerm('');

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

       

       // Auto-populate from price list when item number is entered

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

       

       // Calculate totals when quantity or discount changes

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

 

 // Generate PDF (placeholder function)

 const generatePDF = () => {

   // Create a simple HTML structure for the PDF

   const orderData = {

     customerInfo,

     orderLines: orderLines.filter(line => line.itemNum),

     totalAmount: orderLines.reduce((sum, line) => sum + line.totalRequested, 0)

   };

   

   const htmlContent = `

     <html>

       <head>

         <title>HSO Order Form</title>

         <style>

           body { font-family: Arial, sans-serif; margin: 20px; }

           .header { text-align: center; margin-bottom: 30px; }

           .customer-info { display: flex; justify-content: space-between; margin-bottom: 30px; }

           .customer-section { width: 45%; }

           .customer-section h3 { margin-bottom: 10px; }

           .customer-section p { margin: 2px 0; }

           table { width: 100%; border-collapse: collapse; margin-top: 20px; }

           th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }

           th { background-color: #f5f5f5; }

           .total { text-align: right; margin-top: 20px; font-weight: bold; }

         </style>

       </head>

       <body>

         <div class="header">

           <h1>HSO ORDER FORM</h1>

           <p>PO#: ${orderData.customerInfo.poNumber}</p>

           <p>Customer#: ${orderData.customerInfo.customerNumber}</p>

         </div>

         

         <div class="customer-info">

           <div class="customer-section">

             <h3>Bill To:</h3>

             <p><strong>Practice:</strong> ${orderData.customerInfo.billTo.practice}</p>

             <p><strong>Street:</strong> ${orderData.customerInfo.billTo.street}</p>

             <p><strong>City, State:</strong> ${orderData.customerInfo.billTo.city}, ${orderData.customerInfo.billTo.state}</p>

             <p><strong>Zip Code:</strong> ${orderData.customerInfo.billTo.zipCode}</p>

             <p><strong>Phone:</strong> ${orderData.customerInfo.billTo.phone}</p>

           </div>

           <div class="customer-section">

             <h3>Ship To:</h3>

             <p><strong>Practice:</strong> ${orderData.customerInfo.shipTo.practice}</p>

             <p><strong>Street:</strong> ${orderData.customerInfo.shipTo.street}</p>

             <p><strong>City, State:</strong> ${orderData.customerInfo.shipTo.city}, ${orderData.customerInfo.shipTo.state}</p>

             <p><strong>Zip Code:</strong> ${orderData.customerInfo.shipTo.zipCode}</p>

             <p><strong>Phone:</strong> ${orderData.customerInfo.shipTo.phone}</p>

           </div>

         </div>

         

         <table>

           <thead>

             <tr>

               <th>Item #</th>

               <th>Description</th>

               <th>Retail $</th>

               <th>Discount %</th>

               <th>Discounted Price</th>

               <th>Qty</th>

               <th>Total</th>

             </tr>

           </thead>

           <tbody>

             ${orderData.orderLines.map(line => `

               <tr>

                 <td>${line.itemNum}</td>

                 <td>${line.description}</td>

                 <td>$${line.retail.toFixed(2)}</td>

                 <td>${line.requestedDiscountPercent}%</td>

                 <td>$${line.requestedPriceDiscount.toFixed(2)}</td>

                 <td>${line.qtyRequested}</td>

                 <td>$${line.totalRequested.toFixed(2)}</td>

               </tr>

             `).join('')}

           </tbody>

         </table>

         

         <div class="total">

           <h3>Total Amount: $${orderData.totalAmount.toFixed(2)}</h3>

         </div>

       </body>

     </html>

   `;

   

   // Create and download the HTML file

   const blob = new Blob([htmlContent], { type: 'text/html' });

   const url = URL.createObjectURL(blob);

   const a = document.createElement('a');

   a.href = url;

   a.download = `HSO_Order_${customerInfo.customerNumber || 'Form'}_${new Date().toISOString().split('T')[0]}.html`;

   document.body.appendChild(a);

   a.click();

   document.body.removeChild(a);

   URL.revokeObjectURL(url);

 };

 

 return (

   <div className="min-h-screen bg-gray-50 p-4 md:p-6">

     <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg">

       {/* Header */}

       <div className="bg-blue-600 text-white p-6 rounded-t-lg">

         <h1 className="text-2xl md:text-3xl font-bold text-center">HSO ORDER FORM</h1>

       </div>

       

       <div className="p-6 space-y-8">

         {/* Customer Information Section */}

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

                   onChange={(e) => setCustomerInfo({...customerInfo, poNumber: e.target.value})}

                 />

               </div>

               <div>

                 <label className="block text-sm font-medium text-gray-700 mb-1">Customer #</label>

                 <input

                   type="text"

                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                   value={customerInfo.customerNumber}

                   onChange={(e) => setCustomerInfo({...customerInfo, customerNumber: e.target.value})}

                 />

               </div>

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

                     billTo: {...customerInfo.billTo, practice: e.target.value}

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

                     billTo: {...customerInfo.billTo, street: e.target.value}

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

                         billTo: {...customerInfo.billTo, city: e.target.value}

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

                         billTo: {...customerInfo.billTo, state: e.target.value}

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

                       billTo: {...customerInfo.billTo, zipCode: e.target.value}

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

                       billTo: {...customerInfo.billTo, phone: e.target.value}

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

                   className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                     !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                   }`}

                   value={customerInfo.shipTo.practice}

                   onChange={(e) => setCustomerInfo({

                     ...customerInfo,

                     shipTo: {...customerInfo.shipTo, practice: e.target.value}

                   })}

                   disabled={!shipToDifferent}

                 />

               </div>

               <div>

                 <label className="block text-sm font-medium text-gray-700 mb-1">Street:</label>

                 <input

                   type="text"

                   className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                     !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                   }`}

                   value={customerInfo.shipTo.street}

                   onChange={(e) => setCustomerInfo({

                     ...customerInfo,

                     shipTo: {...customerInfo.shipTo, street: e.target.value}

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

                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                         !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                       }`}

                       placeholder="City"

                       value={customerInfo.shipTo.city}

                       onChange={(e) => setCustomerInfo({

                         ...customerInfo,

                         shipTo: {...customerInfo.shipTo, city: e.target.value}

                       })}

                       disabled={!shipToDifferent}

                     />

                   </div>

                   <div>

                     <input

                       type="text"

                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                         !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                       }`}

                       placeholder="State"

                       value={customerInfo.shipTo.state}

                       onChange={(e) => setCustomerInfo({

                         ...customerInfo,

                         shipTo: {...customerInfo.shipTo, state: e.target.value}

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

                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                       !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                     }`}

                     value={customerInfo.shipTo.zipCode}

                     onChange={(e) => setCustomerInfo({

                       ...customerInfo,

                       shipTo: {...customerInfo.shipTo, zipCode: e.target.value}

                     })}

                     disabled={!shipToDifferent}

                   />

                 </div>

                 <div>

                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>

                   <input

                     type="text"

                     className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${

                       !shipToDifferent ? 'bg-gray-100 text-gray-500' : ''

                     }`}

                     value={customerInfo.shipTo.phone}

                     onChange={(e) => setCustomerInfo({

                       ...customerInfo,

                       shipTo: {...customerInfo.shipTo, phone: e.target.value}

                     })}

                     disabled={!shipToDifferent}

                   />

                 </div>

               </div>

             </div>

           </div>

         </div>

 

         {/* Order Lines Section */}

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

 

           {/* Item Search and Selection Panel */}

           {showItemSelector && (

             <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">

               {/* Header */}

               <div className="px-6 py-4 border-b border-gray-200">

                 <h4 className="text-lg font-semibold text-gray-900">Add Items to Order</h4>

               </div>

               

               <div className="p-6">

                 {/* Search Input */}

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

 

                 {/* Selection Controls */}

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

 

                 {/* Items List */}

                 <div className="max-h-96 overflow-y-auto space-y-1 border border-gray-200 rounded-md">

                   {filteredItems.length > 0 ? (

                     filteredItems.map((item) => (

                       <div key={item.itemNum} className="group border-b border-gray-100 last:border-b-0 p-4 hover:bg-blue-50/50 transition-all duration-200">

                         <div className="flex items-start justify-between">

                           <div className="flex-1">

                             {/* Item number - most prominent */}

                             <div className="text-lg font-bold text-gray-900 mb-2">

                               {item.itemNum}

                             </div>

                             

                             {/* Price - smaller and black */}

                             <div className="flex items-baseline gap-2 mb-2">

                               <span className="text-sm font-medium text-gray-900">

                                 ${item.retail.toFixed(2)}

                               </span>

                               <span className="text-xs text-gray-500">

                                 (${(item.retail / item.qtyPerPack).toFixed(2)}/item)

                               </span>

                             </div>

                             

                             {/* Description */}

                             <div className="text-sm text-gray-600 mb-2 line-clamp-2">

                               {item.description}

                             </div>

                             

                             {/* Additional info */}

                             <div className="flex items-center gap-4 text-xs text-gray-500">

                               <span>{item.qtyPerPack}/pkg</span>

                               <span>Max Discount: {(item.maxDiscount * 100).toFixed(0)}%</span>

                             </div>

                           </div>

                           

                           {/* Add button */}

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

 

           {/* Add Blank Line Button */}

           <div className="flex justify-end mb-4">

             <button

               onClick={addOrderLine}

               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"

             >

               <Plus size={16} />

               Add Blank Line

             </button>

           </div>

 

           {/* Compact Order Form List */}

           <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

             <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">

               <h4 className="font-semibold text-gray-900">Order Items</h4>

             </div>

             

             {/* Compact Table */}

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

                             // Delay hiding suggestions to allow for clicks

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

             

             {/* Compact Footer */}

             <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-sm">

               <span className="text-gray-600">

                 {orderLines.filter(line => line.itemNum).length} items

               </span>

               <span className="font-semibold text-gray-900">

                 Total: ${orderLines.reduce((sum, line) => sum + line.totalRequested, 0).toFixed(2)}

               </span>

             </div>

           </div>

         </div>

 

         {/* Generate PDF Button */}

         <div className="flex justify-center pt-6">

           <button

             onClick={generatePDF}

             className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-3 text-lg font-semibold transition-colors shadow-lg"

           >

             <Download size={24} />

             Generate Order Form PDF

           </button>

         </div>

 

         {/* Instructions */}

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

       </div>

     </div>

   </div>

 );

};

 

export default HSO_ORDER_FORM;