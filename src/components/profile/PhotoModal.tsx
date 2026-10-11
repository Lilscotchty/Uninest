import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { uploadProfilePhoto, saveProfilePhotos } from '../../lib/storage';
import { toast } from 'sonner';

export interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: 'avatar' | 'cover';
  currentUrl: string;
  onSuccess: (newUrl: string) => void;
}

const COVER_PRESETS = [
  {
    label: 'UG Legon Great Hall',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'KNUST Academic Hall',
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Campus Quad & Greenery',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Modern Skyline & Architecture',
    url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'University Library',
    url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Sunset Campus',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
  },
];

const AVATAR_PRESETS = [
  {
    label: 'Student 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Student 2',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Student 3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Student 4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Manager 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Manager 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
];

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  userId,
  type,
  currentUrl,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isAvatar = type === 'avatar';
  const presets = isAvatar ? AVATAR_PRESETS : COVER_PRESETS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP, GIF)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size cannot exceed 15MB');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setSelectedFile(null);
    setPreviewUrl(presetUrl);
  };

  const handleUrlApply = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    setSelectedFile(null);
    setPreviewUrl(urlInput.trim());
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error('User not logged in');
      return;
    }

    setIsLoading(true);
    try {
      let finalPhotoUrl = previewUrl;

      // 1. If a local file was selected, upload it
      if (selectedFile) {
        toast.info(`Uploading ${isAvatar ? 'profile photo' : 'cover photo'}...`);
        finalPhotoUrl = await uploadProfilePhoto(userId, type, selectedFile);
      }

      // 2. Persist to auth user metadata and public.profiles
      await saveProfilePhotos(userId, {
        [isAvatar ? 'avatarUrl' : 'coverUrl']: finalPhotoUrl,
      });

      toast.success(`${isAvatar ? 'Profile' : 'Cover'} photo updated successfully!`);
      onSuccess(finalPhotoUrl);
      onClose();
    } catch (err: any) {
      console.error('Error saving photo:', err);
      toast.error(err.message || 'Failed to update photo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-card-bg w-full max-w-lg rounded-2xl shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-button)]"></span>
            <h3 className="font-bold text-[1.1rem] text-text-primary">
              {isAvatar ? 'Update Profile Photo' : 'Update Cover Photo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-app-bg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Live Preview Section */}
          <div className="flex flex-col items-center">
            <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-2 self-start">
              Preview
            </span>
            <div className="w-full bg-app-bg rounded-xl p-3 flex justify-center items-center border border-border-subtle">
              {isAvatar ? (
                <div className="relative w-28 h-28 rounded-full border-4 border-card-bg shadow-md overflow-hidden bg-[var(--color-button)]/10">
                  <img
                    src={previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-full h-36 rounded-lg overflow-hidden border border-border-subtle bg-slate-200 shadow-inner">
                  <img
                    src={previewUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-3 text-xs font-semibold text-white/90 drop-shadow">
                    Campus Banner
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-app-bg p-1 rounded-xl border border-border-subtle">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-card-bg text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Upload size={14} /> Upload Device
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'presets'
                  ? 'bg-card-bg text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Sparkles size={14} /> Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'url'
                  ? 'bg-card-bg text-text-primary shadow-sm border border-border-subtle'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <LinkIcon size={14} /> Web URL
            </button>
          </div>

          {/* Tab 1: Upload from Device */}
          {activeTab === 'upload' && (
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  dragActive
                    ? 'border-[var(--color-button)] bg-[var(--color-button)]/10 scale-[1.01]'
                    : 'border-border-subtle hover:border-[var(--color-button)]/50 hover:bg-app-bg'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-button)]/10 text-[var(--color-button)] flex items-center justify-center">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Click to browse or drag & drop image
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Supports JPG, PNG, WebP up to 15MB
                  </p>
                </div>
                {selectedFile && (
                  <div className="mt-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Curated Presets */}
          {activeTab === 'presets' && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-text-muted">
                Choose one of our curated high-resolution {isAvatar ? 'avatars' : 'campus banners'}:
              </span>
              <div className={`grid ${isAvatar ? 'grid-cols-3' : 'grid-cols-2'} gap-2.5 max-h-56 overflow-y-auto pr-1`}>
                {presets.map((preset, index) => {
                  const isSelected = previewUrl === preset.url;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetSelect(preset.url)}
                      className={`group relative rounded-xl overflow-hidden border-2 transition-all text-left flex flex-col ${
                        isSelected
                          ? 'border-[var(--color-button)] ring-2 ring-[var(--color-button)]/20 scale-[0.98]'
                          : 'border-border-subtle hover:border-[var(--color-button)]/40 hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`w-full ${isAvatar ? 'h-24' : 'h-18'} overflow-hidden bg-slate-100 relative`}>
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[var(--color-button)]/20 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full bg-[var(--color-button)] text-white flex items-center justify-center shadow">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-1.5 bg-card-bg">
                        <span className="text-[0.7rem] font-bold text-text-primary truncate block">
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Image URL */}
          {activeTab === 'url' && (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-text-muted">
                Paste any direct image link from Unsplash, Google Drive, or your own hosting:
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-app-bg border border-border-subtle rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[var(--color-button)] font-medium text-text-primary"
                />
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="px-4 py-2.5 bg-app-bg border border-border-subtle hover:border-[var(--color-button)] text-text-primary font-bold text-xs rounded-xl transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border-subtle bg-app-bg/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-border-subtle font-semibold text-sm text-text-secondary hover:bg-card-bg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[var(--color-button)] hover:bg-[var(--color-button-hover)] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={16} strokeWidth={2.5} />
                Save {isAvatar ? 'Profile Photo' : 'Cover Photo'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
