"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, Shield, CreditCard, Phone, Mail, MapPin, Bell, Lock, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CAMEROON_CITIES, formatPhone, isMTNNumber, isOrangeNumber, isValidCameroonPhone } from "@/lib/cameroon";
import { TextInput } from "@/components/ui/FormFields";
import type { UserProfile, SingleResult } from "@/types/database";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    profile_photo: "",
    city: "",
    quartier: "",
    address: "",
    email_notifications: true,
    sms_notifications: true,
    cni_number: "",
    cni_front: "",
    cni_back: "",
    cni_verified: false,
    permis_number: "",
    permis_expiry: "",
    permis_front: "",
    permis_back: "",
    permis_verified: false,
    emergency_contact_name: "",
    emergency_contact_phone: "",
    mtn_momo_number: "",
    orange_money_number: "",
    nationality: "",
    country_of_residence: "",
    phone_country_code: "",
    id_type: "",
    id_number: "",
    arrival_date: "",
    local_cameroon_address: "",
    identity_document_url: "",
    profile_completed: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single() as SingleResult<UserProfile>;

      if (profileData) {
        const profile = profileData as UserProfile;
        setProfile({
          full_name: profile.full_name || "",
          email: user.email || "",
          phone: profile.phone || "",
          date_of_birth: profile.date_of_birth || "",
          profile_photo: profile.profile_photo || "",
          city: profile.city || "",
          quartier: profile.quartier || "",
          address: profile.address || "",
          email_notifications: profile.email_notifications ?? true,
          sms_notifications: profile.sms_notifications ?? true,
          cni_number: profile.cni_number || "",
          cni_front: profile.cni_front || "",
          cni_back: profile.cni_back || "",
          cni_verified: profile.cni_verified || false,
          permis_number: profile.permis_number || "",
          permis_expiry: profile.permis_expiry || "",
          permis_front: profile.permis_front || "",
          permis_back: profile.permis_back || "",
          permis_verified: profile.permis_verified || false,
          emergency_contact_name: profile.emergency_contact_name || "",
          emergency_contact_phone: profile.emergency_contact_phone || "",
          mtn_momo_number: profile.mtn_momo_number || "",
          orange_money_number: profile.orange_money_number || "",
          nationality: profile.nationality || "",
          country_of_residence: profile.country_of_residence || "",
          phone_country_code: profile.phone_country_code || "",
          id_type: profile.id_type || "",
          id_number: profile.id_number || "",
          arrival_date: profile.arrival_date || "",
          local_cameroon_address: profile.local_cameroon_address || "",
          identity_document_url: profile.identity_document_url || "",
          profile_completed: profile.profile_completed || false,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSavePersonalInfo = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          date_of_birth: profile.date_of_birth,
          city: profile.city,
          quartier: profile.quartier,
          address: profile.address,
        })
        .eq('id', user.id);

      if (error) throw error;
      showToast('success', 'Personal information updated');
    } catch (error) {
      showToast('error', 'Error updating information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          email_notifications: profile.email_notifications,
          sms_notifications: profile.sms_notifications,
        })
        .eq('id', user.id);

      if (error) throw error;
      showToast('success', 'Notification preferences updated');
    } catch (error) {
      showToast('error', 'Error updating information');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          mtn_momo_number: profile.mtn_momo_number,
          orange_money_number: profile.orange_money_number,
          emergency_contact_name: profile.emergency_contact_name,
          emergency_contact_phone: profile.emergency_contact_phone,
        })
        .eq('id', user.id);

      if (error) throw error;
      showToast('success', 'Payment information updated');
    } catch (error) {
      showToast('error', 'Error updating information');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({ profile_photo: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, profile_photo: publicUrl });
      showToast('success', 'Profile photo updated');
    } catch (error) {
      showToast('error', 'Error uploading photo');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      const user = data.user;
      if (!user) {
        showToast('error', 'User not authenticated');
        return;
      }

      // Password change not implemented yet with custom auth
      showToast('error', 'Password change not available yet');
    } catch (error) {
      showToast('error', 'Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      showToast('error', 'Error deleting account');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Completion Banner */}
        {!profile.profile_completed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">Complete Your Profile</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Please complete your profile and upload your identity document to book vehicles.
              </p>
              <button
                onClick={() => document.getElementById('identity-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-yellow-800 font-medium hover:underline"
              >
                Complete Profile Now
              </button>
            </div>
          </div>
        )}

        {!profile.identity_document_url && profile.profile_completed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">Upload Identity Document</h3>
              <p className="text-sm text-yellow-700 mb-2">
                Please upload your identity document to book vehicles.
              </p>
              <button
                onClick={() => document.getElementById('identity-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-yellow-800 font-medium hover:underline"
              >
                Upload Document Now
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center gap-2`}>
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {toast.message}
          </div>
        )}

        {/* Profile Photo Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.profile_photo ? (
                  <img src={profile.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-gray-400">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{profile.full_name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <TextInput
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <TextInput
                value={profile.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">+237</span>
                <input
                  type="tel"
                  value={profile.phone.replace('+237', '').replace(/\s/g, '')}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={9}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={profile.date_of_birth}
                onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <select
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une ville</option>
                {CAMEROON_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
              <TextInput
                value={profile.quartier}
                onChange={(e) => setProfile({ ...profile, quartier: e.target.value })}
                placeholder="Votre quartier"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse complète</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Votre adresse complète"
              />
            </div>
          </div>
          <button
            onClick={handleSavePersonalInfo}
            disabled={saving}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

        {/* Identity Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Pièce d'identité</h3>
            {profile.cni_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro CNI</label>
              <TextInput
                value={profile.cni_number}
                onChange={(e) => setProfile({ ...profile, cni_number: e.target.value })}
                placeholder="1234567890123"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos CNI</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {profile.cni_front ? (
                    <img src={profile.cni_front} alt="CNI Recto" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <p className="text-gray-400 text-sm">CNI Recto</p>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {profile.cni_back ? (
                    <img src={profile.cni_back} alt="CNI Verso" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <p className="text-gray-400 text-sm">CNI Verso</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permis Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Permis de conduire</h3>
            {profile.permis_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de permis</label>
              <TextInput
                value={profile.permis_number}
                onChange={(e) => setProfile({ ...profile, permis_number: e.target.value })}
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
              <input
                type="date"
                value={profile.permis_expiry}
                onChange={(e) => setProfile({ ...profile, permis_expiry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos du permis</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {profile.permis_front ? (
                    <img src={profile.permis_front} alt="Permis Recto" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <p className="text-gray-400 text-sm">Permis Recto</p>
                  )}
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {profile.permis_back ? (
                    <img src={profile.permis_back} alt="Permis Verso" className="w-full h-32 object-cover rounded" />
                  ) : (
                    <p className="text-gray-400 text-sm">Permis Verso</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Moyens de paiement</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                MTN MoMo
              </label>
              <input
                type="tel"
                value={profile.mtn_momo_number.replace('+237', '').replace(/\s/g, '')}
                onChange={(e) => setProfile({ ...profile, mtn_momo_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="670 000 000"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                Orange Money
              </label>
              <input
                type="tel"
                value={profile.orange_money_number.replace('+237', '').replace(/\s/g, '')}
                onChange={(e) => setProfile({ ...profile, orange_money_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="690 000 000"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence (Nom)</label>
              <TextInput
                value={profile.emergency_contact_name}
                onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                placeholder="Nom du contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact d'urgence (Téléphone)</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 font-medium">+237</span>
                <input
                  type="tel"
                  value={profile.emergency_contact_phone.replace('+237', '').replace(/\s/g, '')}
                  onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="670 000 000"
                  maxLength={9}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSavePayment}
            disabled={saving}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Notifications par email</span>
              <input
                type="checkbox"
                checked={profile.email_notifications}
                onChange={(e) => setProfile({ ...profile, email_notifications: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Notifications SMS</span>
              <input
                type="checkbox"
                checked={profile.sms_notifications}
                onChange={(e) => setProfile({ ...profile, sms_notifications: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
          <button
            onClick={handleSaveNotifications}
            disabled={saving}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Changer le mot de passe</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min 8 caractères, 1 majuscule, 1 chiffre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>
          <button
            onClick={handlePasswordChange}
            disabled={saving || !passwordData.newPassword}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-600">Supprimer le compte</h3>
          </div>
          <p className="text-gray-600 mb-4">Cette action est irréversible. Toutes vos données seront supprimées.</p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Supprimer mon compte
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
