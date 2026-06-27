"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Save, Plus, Trash2, MessageCircle, Share2, Globe, Mail, Phone, MapPin, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TextInput } from "@/components/ui/FormFields";

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [heroContent, setHeroContent] = useState({
    slides: [
      { image: "", title: "", subtitle: "", ctaText: "", ctaLink: "" },
    ],
  });
  const [footerContent, setFooterContent] = useState({
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      whatsapp: "",
    },
    companyInfo: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
    quickLinks: [
      { label: "", href: "" },
    ],
    legalLinks: [
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
    copyright: "",
    businessHours: "",
  });
  const [settingsContent, setSettingsContent] = useState({
    siteName: "",
    tagline: "",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    businessHours: "",
  });

  useEffect(() => {
    loadContent(activeTab);
  }, [activeTab]);

  const loadContent = async (section: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/${section}`);
      const data = await response.json();
      
      if (data.content) {
        switch (section) {
          case "hero":
            setHeroContent(data.content);
            break;
          case "footer":
            setFooterContent(data.content);
            break;
          case "settings":
            setSettingsContent(data.content);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get JWT token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (!token) {
        alert('Please log in to save changes');
        return;
      }

      let content;
      switch (activeTab) {
        case "hero":
          content = heroContent;
          break;
        case "footer":
          content = footerContent;
          break;
        case "settings":
          content = settingsContent;
          break;
      }

      const response = await fetch(`/api/content/${activeTab}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        alert('Content saved successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get JWT token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (!token) {
        alert('Please log in to upload');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/hero', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        const newSlides = [...heroContent.slides];
        newSlides[slideIndex].image = data.url;
        setHeroContent({ ...heroContent, slides: newSlides });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const addSlide = () => {
    setHeroContent({
      ...heroContent,
      slides: [...heroContent.slides, { image: "", title: "", subtitle: "", ctaText: "", ctaLink: "" }],
    });
  };

  const removeSlide = (index: number) => {
    if (heroContent.slides.length <= 1) {
      alert('You must have at least one slide');
      return;
    }
    const newSlides = heroContent.slides.filter((_, i) => i !== index);
    setHeroContent({ ...heroContent, slides: newSlides });
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...heroContent.slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setHeroContent({ ...heroContent, slides: newSlides });
  };

  const addQuickLink = () => {
    setFooterContent({
      ...footerContent,
      quickLinks: [...footerContent.quickLinks, { label: "", href: "" }],
    });
  };

  const removeQuickLink = (index: number) => {
    const newLinks = footerContent.quickLinks.filter((_, i) => i !== index);
    setFooterContent({ ...footerContent, quickLinks: newLinks });
  };

  const updateQuickLink = (index: number, field: string, value: string) => {
    const newLinks = [...footerContent.quickLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooterContent({ ...footerContent, quickLinks: newLinks });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      // Get JWT token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];

      if (!token) {
        alert('Please log in to upload');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Upload error:', data);
        alert(data.error || 'Failed to upload logo');
        return;
      }

      if (data.url) {
        setSettingsContent({ ...settingsContent, logo: data.url });
        console.log('Logo uploaded successfully:', data.url);
      } else {
        alert('No URL returned from upload');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "footer", label: "Footer" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      {/* Header */}
      <div className="bg-blue-600 rounded-xl shadow-sm p-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-blue-100">Manage your website content</p>
        </div>
      </div>

      {/* Save Button at Top */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 bg-white rounded-t-xl px-6 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-blue-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Hero Section Tab */}
              {activeTab === "hero" && (
                <div className="space-y-6">
                  {heroContent.slides.map((slide, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Slide {index + 1}</h3>
                        {heroContent.slides.length > 1 && (
                          <button
                            onClick={() => removeSlide(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>

                      {/* Image Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Hero Image
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {slide.image && (
                            <img
                              src={slide.image}
                              alt="Preview"
                              className="w-full sm:w-48 h-32 sm:h-auto object-cover rounded-lg max-w-xs"
                            />
                          )}
                          <div className="w-full sm:w-auto">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                              className="hidden"
                              id={`image-upload-${index}`}
                            />
                            <label
                              htmlFor={`image-upload-${index}`}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer w-full sm:w-auto"
                            >
                              <Upload className="h-4 w-4" />
                              Upload Image
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Title
                          </label>
                          <TextInput
                            value={slide.title}
                            onChange={(e) => updateSlide(index, "title", e.target.value)}
                            placeholder="Slide title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Subtitle
                          </label>
                          <TextInput
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(index, "subtitle", e.target.value)}
                            placeholder="Slide subtitle"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            CTA Button Text
                          </label>
                          <TextInput
                            value={slide.ctaText}
                            onChange={(e) => updateSlide(index, "ctaText", e.target.value)}
                            placeholder="Browse Cars"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            CTA Link
                          </label>
                          <TextInput
                            value={slide.ctaLink}
                            onChange={(e) => updateSlide(index, "ctaLink", e.target.value)}
                            placeholder="/rent-cars"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addSlide}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slide
                  </button>
                </div>
              )}

              {/* Footer Tab */}
              {activeTab === "footer" && (
                <div className="space-y-6">
                  {/* Social Media Links */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        <TextInput
                          value={footerContent.socialMedia.facebook}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, facebook: e.target.value }
                          })}
                          placeholder="Facebook URL"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-blue-400" />
                        <TextInput
                          value={footerContent.socialMedia.twitter}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, twitter: e.target.value }
                          })}
                          placeholder="Twitter/X URL"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-pink-600" />
                        <TextInput
                          value={footerContent.socialMedia.instagram}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, instagram: e.target.value }
                          })}
                          placeholder="Instagram URL"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-blue-700" />
                        <TextInput
                          value={footerContent.socialMedia.linkedin}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, linkedin: e.target.value }
                          })}
                          placeholder="LinkedIn URL"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-red-600" />
                        <TextInput
                          value={footerContent.socialMedia.youtube}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, youtube: e.target.value }
                          })}
                          placeholder="YouTube URL"
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        <TextInput
                          value={footerContent.socialMedia.whatsapp}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            socialMedia: { ...footerContent.socialMedia, whatsapp: e.target.value }
                          })}
                          placeholder="WhatsApp number"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Company Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Name
                        </label>
                        <TextInput
                          value={footerContent.companyInfo.name}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            companyInfo: { ...footerContent.companyInfo, name: e.target.value }
                          })}
                          placeholder="AUTOHub"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone
                        </label>
                        <TextInput
                          value={footerContent.companyInfo.phone}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            companyInfo: { ...footerContent.companyInfo, phone: e.target.value }
                          })}
                          placeholder="+237 123 456 789"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Address
                        </label>
                        <TextInput
                          value={footerContent.companyInfo.address}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            companyInfo: { ...footerContent.companyInfo, address: e.target.value }
                          })}
                          placeholder="123 Street, City, Country"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email
                        </label>
                        <TextInput
                          value={footerContent.companyInfo.email}
                          onChange={(e) => setFooterContent({
                            ...footerContent,
                            companyInfo: { ...footerContent.companyInfo, email: e.target.value }
                          })}
                          placeholder="contact@autohub.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                      <button
                        onClick={addQuickLink}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Add Link
                      </button>
                    </div>
                    <div className="space-y-3">
                      {footerContent.quickLinks.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <TextInput
                            value={link.label}
                            onChange={(e) => updateQuickLink(index, "label", e.target.value)}
                            placeholder="Link label"
                            className="flex-1"
                          />
                          <TextInput
                            value={link.href}
                            onChange={(e) => updateQuickLink(index, "href", e.target.value)}
                            placeholder="/path"
                            className="flex-1"
                          />
                          {footerContent.quickLinks.length > 1 && (
                            <button
                              onClick={() => removeQuickLink(index)}
                              className="text-red-600 hover:text-red-700 px-2"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legal Links */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Legal Links</h3>
                    <div className="space-y-3">
                      {(footerContent.legalLinks || []).map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <TextInput
                            value={link.label}
                            onChange={(e) => {
                              const newLinks = [...footerContent.legalLinks];
                              newLinks[index] = { ...newLinks[index], label: e.target.value };
                              setFooterContent({ ...footerContent, legalLinks: newLinks });
                            }}
                            placeholder="Link label"
                            className="flex-1"
                          />
                          <TextInput
                            value={link.href}
                            onChange={(e) => {
                              const newLinks = [...footerContent.legalLinks];
                              newLinks[index] = { ...newLinks[index], href: e.target.value };
                              setFooterContent({ ...footerContent, legalLinks: newLinks });
                            }}
                            placeholder="/path"
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Copyright & Business Hours */}
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Footer Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Copyright Text
                        </label>
                        <TextInput
                          value={footerContent.copyright}
                          onChange={(e) => setFooterContent({ ...footerContent, copyright: e.target.value })}
                          placeholder="© 2024 AUTOHub. All rights reserved."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Hours
                        </label>
                        <TextInput
                          value={footerContent.businessHours}
                          onChange={(e) => setFooterContent({ ...footerContent, businessHours: e.target.value })}
                          placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Site Name
                        </label>
                        <TextInput
                          value={settingsContent.siteName}
                          onChange={(e) => setSettingsContent({ ...settingsContent, siteName: e.target.value })}
                          placeholder="AUTOHub"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Tagline
                        </label>
                        <TextInput
                          value={settingsContent.tagline}
                          onChange={(e) => setSettingsContent({ ...settingsContent, tagline: e.target.value })}
                          placeholder="Your Trusted Car Rental Partner"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Logo
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {settingsContent.logo && (
                            <img
                              src={settingsContent.logo}
                              alt="Logo Preview"
                              className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                            />
                          )}
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                              id="logo-upload"
                              disabled={uploadingLogo}
                            />
                            <label
                              htmlFor="logo-upload"
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm ${
                                uploadingLogo
                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {uploadingLogo ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4" />
                                  Upload Logo
                                </>
                              )}
                            </label>
                            {!settingsContent.logo && !uploadingLogo && (
                              <p className="text-xs text-gray-500 mt-2">No logo uploaded yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Contact Email
                        </label>
                        <TextInput
                          value={settingsContent.contactEmail}
                          onChange={(e) => setSettingsContent({ ...settingsContent, contactEmail: e.target.value })}
                          placeholder="contact@autohub.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Contact Phone
                        </label>
                        <TextInput
                          value={settingsContent.contactPhone}
                          onChange={(e) => setSettingsContent({ ...settingsContent, contactPhone: e.target.value })}
                          placeholder="+237 123 456 789"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Address
                        </label>
                        <TextInput
                          value={settingsContent.address}
                          onChange={(e) => setSettingsContent({ ...settingsContent, address: e.target.value })}
                          placeholder="123 Street, City, Country"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Business Hours
                        </label>
                        <TextInput
                          value={settingsContent.businessHours}
                          onChange={(e) => setSettingsContent({ ...settingsContent, businessHours: e.target.value })}
                          placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
