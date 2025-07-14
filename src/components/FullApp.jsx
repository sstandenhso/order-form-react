
import React, { useState, useEffect } from 'react';
import PriceList from '../assets/pricelist.js';
import CustomerInfoForm from './CustomerInfoForm.jsx';
import OrderItemsPanel from './OrderItemsPanel.jsx';
import ItemSearchPanel from './ItemSearchPanel.jsx';
import OrderSummaryFooter from './OrderSummaryFooter.jsx';
import InstructionsPanel from './InstructionsPanel.jsx';
import PDFButton from './PDFButton.jsx';



const HSOOrderForm = () => {
  // Top-level state
  const [priceList, setPriceList] = useState(PriceList);
  const [customerInfo, setCustomerInfo] = useState({
    poNumber: '',
    customerNumber: '',
    billTo: {
      practice: '', street: '', city: '', state: '', zipCode: '', phone: ''
    },
    shipTo: {
      practice: '', street: '', city: '', state: '', zipCode: '', phone: ''
    }
  });
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [orderLines, setOrderLines] = useState([
    {
      id: 1, itemNum: '', description: '', catDescrip: '', retail: 0,
      requestedDiscountPercent: '', requestedPriceDiscount: 0, qtyPerPack: 0,
      pricePerItem: 0, qtyRequested: '', totalRequested: 0,
      calculatedDiscountPercent: 0, maxDiscountAllowed: 0
    }
  ]);

  useEffect(() => {
    if (!shipToDifferent) {
      setCustomerInfo(prev => ({
        ...prev,
        shipTo: { ...prev.billTo }
      }));
    }
  }, [shipToDifferent, customerInfo.billTo]);

  const generatePDF = () => {
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
          <CustomerInfoForm
            customerInfo={customerInfo}
            setCustomerInfo={setCustomerInfo}
            shipToDifferent={shipToDifferent}
            setShipToDifferent={setShipToDifferent}
          />
          {/* Item Search and Selection Panel */}
          <ItemSearchPanel priceList={priceList} />
          {/* Order Lines Section */}
          <OrderItemsPanel
            orderLines={orderLines}
            setOrderLines={setOrderLines}
            priceList={priceList}
          />
          {/* Order Summary Footer */}
          <OrderSummaryFooter orderLines={orderLines} />
          {/* Generate PDF Button */}
          <div className="flex justify-center pt-6">
            <PDFButton generatePDF={generatePDF} />
          </div>
          {/* Instructions */}
          <InstructionsPanel />
        </div>
      </div>
    </div>
  );
}

export default HSOOrderForm;