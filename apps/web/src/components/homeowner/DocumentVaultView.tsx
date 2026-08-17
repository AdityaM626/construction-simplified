import React, { useState } from 'react';
import { DocumentRecord } from '../../types';
import { Modal } from '../common/Modal';
import { FileText, Download, Upload, ShieldCheck, FileCheck, Eye } from 'lucide-react';

export const DocumentVaultView: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([
    {
      id: 'doc-501',
      projectId: 'prj-101',
      title: 'Approved Structural Drawings & Column Layout Plan.pdf',
      category: 'DRAWING',
      fileUrl: '#',
      uploadedBy: 'Apex Infrastructure & Builders',
      uploadedByRole: 'BUILDER',
      sizeBytes: 4850000,
      uploadedAt: '2026-02-04T16:45:00.000Z'
    },
    {
      id: 'doc-502',
      projectId: 'prj-101',
      title: 'BBMP Municipal Building Sanction Permit.pdf',
      category: 'PERMIT',
      fileUrl: '#',
      uploadedBy: 'Rajesh Kumar',
      uploadedByRole: 'HOMEOWNER',
      sizeBytes: 2100000,
      uploadedAt: '2026-02-01T12:30:00.000Z'
    },
    {
      id: 'doc-503',
      projectId: 'prj-101',
      title: 'UltraTech Cement Batch Quality Certificate.pdf',
      category: 'INVOICE',
      fileUrl: '#',
      uploadedBy: 'UltraTech Cement Depot',
      uploadedByRole: 'DEALER',
      sizeBytes: 1150000,
      uploadedAt: '2026-02-10T11:25:00.000Z'
    }
  ]);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'DRAWING' | 'INVOICE' | 'PERMIT' | 'CONTRACT' | 'OTHER'>('DRAWING');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      projectId: 'prj-101',
      title: newTitle || 'Project Document.pdf',
      category: newCategory,
      fileUrl: '#',
      uploadedBy: 'Rajesh Kumar',
      uploadedByRole: 'HOMEOWNER',
      sizeBytes: 1500000,
      uploadedAt: new Date().toISOString()
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Secure Document Vault</h1>
          <p className="text-xs text-slate-500 mt-1">Private file storage for drawings, permits, contracts & batch test certs</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Project Files Ledger</h3>
          <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Role Permission Protected</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Document Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Uploaded By</th>
                <th className="px-6 py-3">Size & Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-900">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{doc.uploadedBy}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{doc.uploadedByRole}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => alert(`Downloading private file: ${doc.title}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] inline-flex items-center space-x-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document to Vault">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Electrical Layout Diagram v1.pdf"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            >
              <option value="DRAWING">Architectural / Structural Drawing</option>
              <option value="PERMIT">Sanction Permit / Govt License</option>
              <option value="INVOICE">Tax Invoice / Receipt</option>
              <option value="CONTRACT">Legal Contract / Agreement</option>
              <option value="OTHER">Other Project Document</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 p-6 text-center rounded-2xl bg-slate-50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Click or drag PDF / Image / CAD file here</p>
            <span className="text-[10px] text-slate-400 block mt-1">Maximum file size: 25 MB</span>
          </div>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Upload to Private Vault
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
