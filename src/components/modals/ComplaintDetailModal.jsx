import React, { useState, useEffect } from 'react';
import { X, User, Calendar, MessageSquare, AlertTriangle, Clock, Mail, Star, Edit3, Save, XCircle, ZoomIn, ZoomOut, Maximize, Phone, Send, Building } from 'lucide-react';
import { complaintAPI } from '../../services/api';
import complaintForwardingService from '../../services/complaintForwardingService';
import { constructImageUrl } from '../../utils/urlHelper';

const ComplaintDetailModal = ({ complaint, isOpen, onClose, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('Baru');
  const [responAdmin, setResponAdmin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showForwardingModal, setShowForwardingModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [forwardingMessage, setForwardingMessage] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);

  // Department options for forwarding
  const [departments, setDepartments] = useState([]);

  // Load departments on component mount
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
    }
  }, [isOpen]);

  const loadDepartments = async () => {
    try {
      const depts = await complaintForwardingService.getDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  // Reset form when complaint changes
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'Baru');
      setResponAdmin(complaint.respon_admin || '');
      setIsEditing(false);
    }
  }, [complaint]);

  // Debug log
  useEffect(() => {
    console.log('Modal props:', { complaint, isOpen });
  }, [complaint, isOpen]);

  // Reset image zoom when modal opens
  useEffect(() => {
    if (showImageModal) {
      setImageZoom(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [showImageModal]);

  // Zoom functions
  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleFitImage = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Drag functions
  const handleMouseDown = (event) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({ 
        x: event.clientX - imagePosition.x, 
        y: event.clientY - imagePosition.y 
      });
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showImageModal) {
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleFitImage();
        } else if (e.key === 'Escape') {
          setShowImageModal(false);
        }
      }
    };

    const handleWheel = (e) => {
      if (showImageModal && e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [showImageModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;

    try {
      setIsSubmitting(true);
      const response = await complaintAPI.updateStatus(complaint.id, status, responAdmin);
      console.log('Update response:', response);
      
      // Call the callback to refresh data
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      
      setIsEditing(false);
      
      // Show success message
      alert('Status pengaduan berhasil diperbarui!');
      
      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert(`Gagal memperbarui status pengaduan: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForwardComplaint = async (method) => {
    if (!selectedDepartment) {
      alert('Silakan pilih dinas tujuan terlebih dahulu');
      return;
    }

    try {
      setIsForwarding(true);
      
      const options = {
        departmentId: selectedDepartment,
        customMessage: forwardingMessage,
        forceEmail: method === 'email',
        forceWhatsapp: method === 'whatsapp'
      };
      
      const result = await complaintForwardingService.forwardComplaint(complaint, options);
      
      if (result.success) {
        alert(`✅ ${result.message}\n\nDetail:\n${result.results.map(r => `• ${r.type}: ${r.message}`).join('\n')}`);
        
        // Notify admin if high priority
        if (complaint.prioritas === 'Tinggi') {
          await complaintForwardingService.notifyAdmin(complaint, 'high');
        }
        
        setShowForwardingModal(false);
        setForwardingMessage('');
        setSelectedDepartment('');
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('Error forwarding complaint:', error);
      alert(`Gagal meneruskan pengaduan: ${error.message || error}`);
    } finally {
      setIsForwarding(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'Baru': { 
        bg: 'bg-red-100', 
        text: 'text-red-800', 
        label: 'Baru', 
        icon: AlertTriangle 
      },
      'Diproses': { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        label: 'Diproses', 
        icon: MessageSquare 
      },
      'Selesai': { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        label: 'Selesai', 
        icon: Clock 
      },
      'Ditutup': { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800', 
        label: 'Ditutup', 
        icon: XCircle 
      }
    };
    return configs[status] || configs['Baru'];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      'Urgent': { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' },
      'Tinggi': { bg: 'bg-red-100', text: 'text-red-800', label: 'Tinggi' },
      'Sedang': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Sedang' },
      'Rendah': { bg: 'bg-green-100', text: 'text-green-800', label: 'Rendah' }
    };
    return configs[priority] || configs['Sedang'];
  };

  if (!isOpen || !complaint) {
    console.log('Modal not rendering:', { isOpen, hasComplaint: !!complaint });
    return null;
  }

  const statusConfig = getStatusConfig(complaint.status);
  const priorityConfig = getPriorityConfig(complaint.prioritas);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Detail Pengaduan</h3>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Main Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h4 className="text-xl font-semibold text-slate-900">{complaint.judul}</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="font-medium">Tiket: {complaint.no_tiket}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                    {priorityConfig.label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="text-sm font-medium text-slate-900 mb-2">Deskripsi</h5>
                <p className="text-slate-700 text-sm leading-relaxed">{complaint.deskripsi}</p>
              </div>

              {/* Image */}
              {complaint.image_path && (
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Foto Pengaduan</h5>
                  <div className="border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <img
                      src={constructImageUrl(`/storage/${complaint.image_path}`)}
                      alt="Complaint"
                      className="w-full h-auto max-h-64 object-cover hover:opacity-90 transition-opacity"
                      onClick={() => setShowImageModal(true)}
                      onError={(event) => {
                        console.log('Image failed to load:', constructImageUrl(`/storage/${complaint.image_path}`));
                        event.target.parentNode.innerHTML = '<div class="p-4 text-center text-slate-500">Gambar tidak dapat dimuat</div>';
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 text-center">Klik gambar untuk melihat ukuran penuh</p>
                </div>
              )}

              {/* User Info */}
              <div>
                <h5 className="text-sm font-medium text-slate-900 mb-3">Informasi Pelapor</h5>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-slate-500 mr-2" />
                    <span className="text-sm text-slate-700">{complaint.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-slate-500 mr-2" />
                    <span className="text-sm text-slate-700">{complaint.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-slate-500 mr-2" />
                    <span className="text-sm text-slate-700">{complaint.user?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                    <span className="text-sm text-slate-700">
                      Dibuat: {new Date(complaint.created_at).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <h5 className="text-sm font-medium text-slate-900 mb-2">Kategori</h5>
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-slate-500 mr-2" />
                  <span className="text-sm text-slate-700">{complaint.kategori}</span>
                </div>
              </div>

              {/* Rating & Feedback */}
              {complaint.rating && (
                <div>
                  <h5 className="text-sm font-medium text-slate-900 mb-2">Rating & Feedback</h5>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-slate-900">{complaint.rating}/5</span>
                    </div>
                    {complaint.feedback && (
                      <p className="text-sm text-slate-700">{complaint.feedback}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Status & Response */}
            <div className="space-y-6">
              {/* Status Update Form */}
              <div className="bg-slate-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-slate-900">Status & Respon</h5>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="Baru">Baru</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Ditutup">Ditutup</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Respon Admin
                      </label>
                      <textarea
                        value={responAdmin}
                        onChange={(e) => setResponAdmin(e.target.value)}
                        rows="4"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Tambahkan respon untuk pengaduan ini..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setStatus(complaint.status);
                          setResponAdmin(complaint.respon_admin || '');
                        }}
                        className="inline-flex items-center px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status Saat Ini
                      </label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <StatusIcon className="w-4 h-4 mr-1" />
                        {statusConfig.label}
                      </span>
                    </div>

                    {complaint.respon_admin && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Respon Admin
                        </label>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-700">{complaint.respon_admin}</p>
                        </div>
                      </div>
                    )}

                    {complaint.tanggal_respon && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Tanggal Respon
                        </label>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-slate-500 mr-2" />
                          <span className="text-sm text-slate-700">
                            {new Date(complaint.tanggal_respon).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Forwarding Section */}
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-orange-900">Forward Pengaduan</h5>
                  <Building className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  Teruskan pengaduan ini ke dinas terkait untuk penanganan lebih lanjut.
                </p>
                <button
                  onClick={() => setShowForwardingModal(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Forward ke Dinas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forwarding Modal */}
      {showForwardingModal && (
        <div className="fixed inset-0 z-60 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75" onClick={() => setShowForwardingModal(false)}></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Forward Pengaduan</h3>
                <button
                  onClick={() => setShowForwardingModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pilih Dinas Tujuan
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">-- Pilih Dinas --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                {selectedDepartment && (
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <div className="text-sm text-slate-700">
                      <p><strong>Dinas:</strong> {departments.find(d => d.id === selectedDepartment)?.name}</p>
                      <p><strong>Email:</strong> {departments.find(d => d.id === selectedDepartment)?.email}</p>
                      <p><strong>WhatsApp:</strong> {departments.find(d => d.id === selectedDepartment)?.whatsapp}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pesan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={forwardingMessage}
                    onChange={(e) => setForwardingMessage(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tambahkan pesan untuk dinas tujuan..."
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleForwardComplaint('email')}
                    disabled={!selectedDepartment || isForwarding}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isForwarding ? 'Mengirim...' : 'Kirim Email'}
                  </button>
                  <button
                    onClick={() => handleForwardComplaint('whatsapp')}
                    disabled={!selectedDepartment || isForwarding}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {isForwarding ? 'Mengirim...' : 'Kirim WhatsApp'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Fullscreen Modal */}
      {showImageModal && complaint.image_path && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-95" 
          onClick={() => setShowImageModal(false)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setShowImageModal(false);
              }}
              className="absolute top-4 right-4 z-10 p-3 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white transition-colors border border-white border-opacity-30"
              title="Tutup (Esc)"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              <button
                onClick={() => {
                  handleZoomIn();
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white transition-colors border border-white border-opacity-30"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="text-sm font-medium">+</span>
              </button>
              <button
                onClick={() => {
                  handleZoomOut();
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white transition-colors border border-white border-opacity-30"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="text-sm font-medium">-</span>
              </button>
              <button
                onClick={() => {
                  handleFitImage();
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full text-white transition-colors border border-white border-opacity-30"
                title="Fit to Screen (0)"
              >
                <Maximize className="w-4 h-4" />
                <span className="text-xs font-medium">FIT</span>
              </button>
              <div className="px-3 py-2 bg-black bg-opacity-70 rounded-full text-white text-sm font-medium border border-white border-opacity-30 text-center">
                {Math.round(imageZoom * 100)}%
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded border border-white border-opacity-30">
              <div className="text-center">
                <div>🔍 Zoom: +/- keys atau Ctrl + Mouse Wheel</div>
                <div>📏 Fit: 0 key atau tombol maximize</div>
                <div>🖱️ Pan: Drag gambar saat zoom &gt; 100%</div>
              </div>
            </div>

            {/* Image */}
            <img
              src={constructImageUrl(`/storage/${complaint.image_path}`)}
              alt="Complaint Full Size"
              className={`max-w-none rounded-lg transition-transform ${imageZoom > 1 ? 'cursor-move' : 'cursor-default'}`}
              onError={() => {
                console.log('Fullscreen image failed to load:', constructImageUrl(`/storage/${complaint.image_path}`));
              }}
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageZoom})`,
                transformOrigin: 'center center'
              }}
              onMouseDown={handleMouseDown}
              onClick={() => {} }
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetailModal;