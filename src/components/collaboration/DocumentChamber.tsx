// src/components/collaboration/DocumentChamber.tsx

import { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import SignatureCanvas from "react-signature-canvas";
import {
  FileText, Upload, Eye, PenLine,
  Trash2, X, CheckCircle, Clock, FileEdit,
} from "lucide-react";

type DocStatus = "Draft" | "In Review" | "Signed";

interface Document {
  id: number;
  name: string;
  status: DocStatus;
  url?: string;
  size?: string;
  uploadedAt: string;
  signature?: string;
}

const STATUS_CONFIG: Record<DocStatus, {
  textClass: string;
  bg: string;
  border: string;
  badgeText: string;
  icon: React.ReactNode;
}> = {
  Draft: {
    textClass: "text-amber-600",
    bg:        "#fef3c7",
    border:    "#fcd34d",
    badgeText: "#92400e",
    icon:      <FileEdit size={12} />,
  },
  "In Review": {
    textClass: "text-blue-600",
    bg:        "#dbeafe",
    border:    "#93c5fd",
    badgeText: "#1e40af",
    icon:      <Clock size={12} />,
  },
  Signed: {
    textClass: "text-green-600",
    bg:        "#dcfce7",
    border:    "#86efac",
    badgeText: "#166534",
    icon:      <CheckCircle size={12} />,
  },
};

const STATUS_CYCLE: DocStatus[] = ["Draft", "In Review", "Signed"];

const DocumentChamber = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "Investment_Deal_v1.pdf", status: "Draft",     size: "2.4 MB", uploadedAt: "Mar 10, 2026" },
    { id: 2, name: "NDA_Agreement.pdf",      status: "In Review", size: "1.1 MB", uploadedAt: "Mar 11, 2026" },
    { id: 3, name: "Term_Sheet_Final.pdf",   status: "Signed",    size: "3.2 MB", uploadedAt: "Mar 12, 2026" },
  ]);

  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [signDoc,    setSignDoc]    = useState<Document | null>(null);
  const [activeTab,  setActiveTab]  = useState<"all" | DocStatus>("all");
  const sigRef = useRef<SignatureCanvas>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (files) => {
      const newDocs: Document[] = files.map((f, i) => ({
        id:         Date.now() + i,
        name:       f.name,
        status:     "Draft" as DocStatus,
        url:        URL.createObjectURL(f),
        size:       (f.size / (1024 * 1024)).toFixed(1) + " MB",
        uploadedAt: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
    },
  });

  const cycleStatus = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== id) return doc;
        const next = (STATUS_CYCLE.indexOf(doc.status) + 1) % STATUS_CYCLE.length;
        return { ...doc, status: STATUS_CYCLE[next] };
      })
    );
  };

  const deleteDoc = (id: number) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

  const saveSignature = () => {
    if (!signDoc || !sigRef.current || sigRef.current.isEmpty()) {
      alert("Please draw your signature first.");
      return;
    }
    const sigData = sigRef.current.toDataURL();
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === signDoc.id ? { ...d, status: "Signed", signature: sigData } : d
      )
    );
    setSignDoc(null);
  };

  const filtered =
    activeTab === "all"
      ? documents
      : documents.filter((d) => d.status === activeTab);

  const counts = {
    all:         documents.length,
    Draft:       documents.filter((d) => d.status === "Draft").length,
    "In Review": documents.filter((d) => d.status === "In Review").length,
    Signed:      documents.filter((d) => d.status === "Signed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold">Document Chamber</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">
          Upload, review, and sign your deals &amp; contracts
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["Draft", "In Review", "Signed"] as DocStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div
              key={s}
              className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-200 shadow-sm"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <span className={cfg.textClass}>{cfg.icon}</span>
              </div>
              <div>
                <p className="text-gray-900 text-xl font-bold">{counts[s]}</p>
                <p className={`text-xs font-semibold ${cfg.textClass}`}>{s}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Drop Zone ── */}
      <div
        {...getRootProps()}
        className="rounded-2xl p-8 text-center cursor-pointer mb-6 transition-all border-2 border-dashed"
        style={{
          background: isDragActive ? "#eef2ff" : "#ffffff",
          border:     isDragActive
            ? "2px dashed #6366f1"
            : "2px dashed #e5e7eb",
        }}
      >
        <input {...getInputProps()} />
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-indigo-50 border border-indigo-100">
          <Upload size={24} className="text-indigo-500" />
        </div>
        <p className="text-gray-800 font-semibold mb-1">
          {isDragActive ? "Drop files here!" : "Drag & drop PDF files here"}
        </p>
        <p className="text-gray-400 text-sm">
          or{" "}
          <span className="text-indigo-500 font-medium cursor-pointer hover:underline">
            click to browse
          </span>
          {" "}— PDF only
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 mb-4 p-1 rounded-xl w-fit bg-gray-100 border border-gray-200">
        {(["all", "Draft", "In Review", "Signed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? "#ffffff"        : "transparent",
              color:      activeTab === tab ? "#111827"        : "#6b7280",
              boxShadow:  activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {tab === "all" ? "All" : tab} ({counts[tab as keyof typeof counts]})
          </button>
        ))}
      </div>

      {/* ── Documents List ── */}
      <div className="space-y-3 mb-8">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-200">
            <FileText size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No documents found</p>
          </div>
        ) : (
          filtered.map((doc) => {
            const cfg = STATUS_CONFIG[doc.status];
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between gap-4 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.005]"
              >
                {/* Left — icon + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-indigo-50 border border-indigo-100">
                    <FileText size={18} className="text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 text-sm font-semibold truncate">
                      {doc.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {doc.size && `${doc.size} · `}{doc.uploadedAt}
                    </p>
                  </div>
                </div>

                {/* ── STATUS BADGE ── */}
                <button
                  onClick={() => doc.status !== "Signed" && cycleStatus(doc.id)}
                  title={doc.status !== "Signed" ? "Click to change status" : ""}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all"
                  style={{
                    background: cfg.bg,
                    border:     `1px solid ${cfg.border}`,
                    color:      cfg.badgeText,
                    cursor:     doc.status === "Signed" ? "default" : "pointer",
                    minWidth:   "96px",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: cfg.badgeText }}>{cfg.icon}</span>
                  <span>{doc.status}</span>
                </button>

                {/* ── Action Buttons ── */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.url && (
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all border border-gray-200"
                      title="Preview"
                    >
                      <Eye size={15} />
                    </button>
                  )}
                  {doc.status !== "Signed" && (
                    <button
                      onClick={() => setSignDoc(doc)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-indigo-100"
                      title="Sign document"
                    >
                      <PenLine size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteDoc(doc.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-200"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── E-Signature Section ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <PenLine size={16} className="text-indigo-500" />
          <h3 className="text-gray-900 text-sm font-semibold">E-Signature Pad</h3>
        </div>
        <p className="text-gray-400 text-xs mb-4">
          Draw your signature below, then click "Save & Mark Signed"
        </p>
        <div className="rounded-xl overflow-hidden mb-4 border-2 border-dashed border-indigo-200 bg-gray-50">
          <SignatureCanvas
            ref={sigRef}
            penColor="#4f46e5"
            canvasProps={{
              width:  600,
              height: 150,
              style:  { width: "100%", height: "150px", display: "block" },
            }}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => sigRef.current?.clear()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200"
          >
            Clear
          </button>
          <button
            onClick={saveSignature}
            className="flex-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
          >
            Save &amp; Mark Signed
          </button>
        </div>
      </div>

      {/* ══ Modal — PDF Preview ══ */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden flex flex-col border border-gray-200 shadow-2xl" style={{ maxHeight: "85vh" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" />
                <span className="text-gray-800 text-sm font-semibold">{previewDoc.name}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>
            <iframe
              src={previewDoc.url}
              className="flex-1 w-full"
              style={{ minHeight: "500px", border: "none" }}
              title="PDF Preview"
            />
          </div>
        </div>
      )}

      {/* ══ Modal — E-Signature ══ */}
      {signDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PenLine size={16} className="text-indigo-500" />
                <span className="text-gray-800 text-sm font-semibold">
                  Sign: {signDoc.name}
                </span>
              </div>
              <button
                onClick={() => setSignDoc(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-500 text-xs mb-3">
                Draw your signature in the box below:
              </p>
              <div className="rounded-xl overflow-hidden mb-4 border-2 border-dashed border-indigo-200 bg-gray-50">
                <SignatureCanvas
                  ref={sigRef}
                  penColor="#4f46e5"
                  canvasProps={{
                    width:  460,
                    height: 160,
                    style:  { width: "100%", height: "160px", display: "block" },
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => sigRef.current?.clear()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200"
                >
                  Clear
                </button>
                <button
                  onClick={saveSignature}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                >
                  Save &amp; Mark Signed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentChamber;