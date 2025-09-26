import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { CheckBadgeIcon } from '../../components/icons/CheckBadgeIcon';
import AvatarCropModal from '../../components/AvatarCropModal';

const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState((user as any)?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }


  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setSelectedFile(e.target.files[0]);
  };

  const handleCropped = async (blob: Blob) => {
    setUploading(true);
    const form = new FormData();
    form.append('file', new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
    const token = localStorage.getItem('africai-token');
    try {
        const res = await fetch(`/api/v1/profile/avatar`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
            body: form
        });

        if (res.ok) {
            const data = await res.json();
            updateUser({ avatarUrl: data.avatarUrl });
        } else {
            // Handle error response
            console.error("Failed to upload avatar");
        }
    } catch (error) {
        console.error("Error uploading avatar:", error);
    } finally {
        setUploading(false);
        setSelectedFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const token = localStorage.getItem('africai-token');
    try {
      const res = await fetch(`/api/v1/profile/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name, title, bio }),
      });
      if (res.ok) {
        const updated = await res.json();
        updateUser({ name: updated.name, bio: updated.bio, title: updated.title });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Profile</h1>
      <GlassCard className="p-8">
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="flex items-center space-x-6">
            <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
            <div className="flex items-center gap-3">
             <Button variant="secondary" type="button" onClick={openFilePicker} disabled={uploading}>{uploading ? 'Uploading...' : 'Change Avatar'}</Button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <input type="text" id="name" value={name} onChange={e=>setName(e.target.value)} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
              {user.verified && <CheckBadgeIcon className="absolute top-1/2 right-3 -translate-y-1/2 w-5 h-5 text-blue-400" />}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title / Occupation</label>
            <input type="text" id="title" value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" />
          </div>

          {user.role !== 'admin' && (
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Your Bio</label>
              <textarea id="bio" rows={4} className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-nebula-600 focus:outline-none" value={bio} onChange={e=>setBio(e.target.value)}></textarea>
            </div>
          )}
          <div className="pt-4">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </GlassCard>
      <AvatarCropModal isOpen={!!selectedFile} file={selectedFile} onClose={() => setSelectedFile(null)} onCropped={handleCropped} />

      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold mb-4">Account Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Email Address</label>
            <p className="text-base">{user.email}</p>
          </div>
          {user.role === 'tutor' && (
            <div>
              <label className="block text-sm font-medium text-gray-400">Tutor ID</label>
              <p className="text-base">{(user as any).tutorId || '—'}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-400">Join Date</label>
            <p className="text-base">{user.joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;