
import { Download } from 'lucide-react';

const PDFButton = ({ generatePDF }) => (
  <button
    onClick={generatePDF}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-3 text-lg font-semibold transition-colors shadow-lg"
  >
    <Download size={24} />
    Generate Order Form PDF
  </button>
);

export default PDFButton;
