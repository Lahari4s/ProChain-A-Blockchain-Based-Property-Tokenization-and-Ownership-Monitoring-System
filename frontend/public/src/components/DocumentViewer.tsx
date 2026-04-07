import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType?: string;
  documentSize?: string;
}

const DocumentViewer = ({ 
  isOpen, 
  onClose, 
  documentTitle,
  documentType = "PDF",
  documentSize = "3.1 MB"
}: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    // In a real app, this would download the actual file
    alert("Document download would start here. In production, this would download the actual property survey document from IPFS or your storage.");
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{documentTitle}</DialogTitle>
              <DialogDescription className="mt-1">
                {documentType} • {documentSize}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6">
          <div 
            className="mx-auto bg-white shadow-lg"
            style={{ 
              width: `${zoom}%`,
              maxWidth: '800px',
              transition: 'width 0.2s'
            }}
          >
            {/* Property Survey Document Preview */}
            <div className="p-8 space-y-6">
              {/* Document Header */}
              <div className="text-center border-b-2 border-gray-800 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">PROPERTY SURVEY REPORT</h1>
                <p className="text-sm text-gray-600 mt-2">Official Land Survey Document</p>
              </div>

              {/* Survey Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Survey Date</p>
                    <p className="text-sm font-medium text-gray-900">October 15, 2024</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Survey ID</p>
                    <p className="text-sm font-medium text-gray-900">SRV-2024-10-15-001</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Surveyor</p>
                    <p className="text-sm font-medium text-gray-900">John Smith, Licensed Surveyor #12345</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Company</p>
                    <p className="text-sm font-medium text-gray-900">Precision Land Surveys Inc.</p>
                  </div>
                </div>

                {/* Property Information */}
                <div className="border-t pt-4 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Property Information</h2>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs font-semibold text-gray-500">Legal Description:</p>
                      <p className="text-sm text-gray-900 col-span-2">
                        Lot 15, Block 3, Springfield Subdivision, as recorded in Plat Book 42, Page 18
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs font-semibold text-gray-500">Property Address:</p>
                      <p className="text-sm text-gray-900 col-span-2">
                        456 Digital Street, Web3 District, WD 94102
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs font-semibold text-gray-500">Total Area:</p>
                      <p className="text-sm text-gray-900 col-span-2">12,000 square feet</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="text-xs font-semibold text-gray-500">Parcel ID:</p>
                      <p className="text-sm text-gray-900 col-span-2">123-456-789-00</p>
                    </div>
                  </div>
                </div>

                {/* Boundary Measurements */}
                <div className="border-t pt-4 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Boundary Measurements</h2>
                  <div className="bg-gray-50 p-4 rounded">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 text-gray-700">Boundary</th>
                          <th className="text-left py-2 text-gray-700">Direction</th>
                          <th className="text-right py-2 text-gray-700">Length (ft)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-900">North</td>
                          <td className="py-2 text-gray-900">N 89° 45' 30" E</td>
                          <td className="text-right py-2 text-gray-900">120.00</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-900">East</td>
                          <td className="py-2 text-gray-900">S 0° 15' 00" E</td>
                          <td className="text-right py-2 text-gray-900">100.00</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-900">South</td>
                          <td className="py-2 text-gray-900">S 89° 45' 30" W</td>
                          <td className="text-right py-2 text-gray-900">120.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-900">West</td>
                          <td className="py-2 text-gray-900">N 0° 15' 00" W</td>
                          <td className="text-right py-2 text-gray-900">100.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Survey Diagram */}
                <div className="border-t pt-4 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Survey Diagram</h2>
                  <div className="bg-gray-50 p-8 rounded border-2 border-gray-300">
                    {/* Simple property diagram */}
                    <div className="relative mx-auto" style={{ width: '300px', height: '250px' }}>
                      <div className="absolute inset-0 border-4 border-blue-600 bg-blue-50">
                        {/* North */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                          N 89° 45' 30" E<br/>120.00 ft
                        </div>
                        {/* East */}
                        <div className="absolute top-1/2 -right-16 transform -translate-y-1/2 text-xs font-semibold text-gray-700">
                          S 0° 15' 00" E<br/>100.00 ft
                        </div>
                        {/* South */}
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                          S 89° 45' 30" W<br/>120.00 ft
                        </div>
                        {/* West */}
                        <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 text-xs font-semibold text-gray-700">
                          N 0° 15' 00" W<br/>100.00 ft
                        </div>
                        {/* Building outline */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-24 border-2 border-gray-400 bg-white">
                          <p className="text-center mt-8 text-xs text-gray-600">Building</p>
                        </div>
                        {/* North arrow */}
                        <div className="absolute top-2 right-2">
                          <div className="text-xs font-bold text-gray-700">N ↑</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Surveyor Certification */}
                <div className="border-t pt-4 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Surveyor Certification</h2>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="text-sm text-gray-900 mb-2">
                      I hereby certify that this survey was performed in accordance with the standards 
                      set forth by the State Board of Registration for Professional Engineers and Land Surveyors.
                    </p>
                    <div className="mt-4 pt-4 border-t border-yellow-300">
                      <p className="text-sm font-semibold text-gray-900">John Smith, PLS #12345</p>
                      <p className="text-xs text-gray-600">Licensed Professional Land Surveyor</p>
                      <p className="text-xs text-gray-600 mt-1">Date: October 15, 2024</p>
                      <div className="mt-2">
                        <div className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                          DIGITALLY SIGNED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                <div className="border-t pt-4 mt-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Blockchain Verification</h2>
                  <div className="bg-green-50 border border-green-200 p-4 rounded">
                    <p className="text-xs font-semibold text-green-700 uppercase mb-2">
                      ✓ Document Verified on Blockchain
                    </p>
                    <div className="space-y-1 text-xs text-gray-700">
                      <p><span className="font-semibold">Hash:</span> 0x8f3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a</p>
                      <p><span className="font-semibold">Block:</span> 12,345,678</p>
                      <p><span className="font-semibold">Timestamp:</span> 2024-10-15 14:32:18 UTC</p>
                      <p><span className="font-semibold">Network:</span> Polygon Mumbai Testnet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 mt-6 text-center text-xs text-gray-500">
                <p>This is an official property survey document stored on IPFS and verified on blockchain.</p>
                <p className="mt-1">Page 1 of 1</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
