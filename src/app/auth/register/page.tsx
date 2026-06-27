"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { useRef } from "react";
import { Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react";
import { isOldEnoughToRent } from "@/lib/cameroon";
import { COUNTRIES, COUNTRY_CODES } from "@/lib/countries";
import { supabase } from "@/lib/supabase";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || searchParams.get('redirect') || '/';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Refs for date input fields
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  
  // Step 1 fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+237");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [nationality, setNationality] = useState("");
  const [countryOfResidence, setCountryOfResidence] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  
  // Step 2 fields
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [identityDocument, setIdentityDocument] = useState<File | null>(null);
  const [identityDocumentName, setIdentityDocumentName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [localCameroonAddress, setLocalCameroonAddress] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-advance logic for date inputs
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setBirthDay(value);
    if (value.length === 2) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setBirthMonth(value);
    if (value.length === 2) {
      yearRef.current?.focus();
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setBirthYear(value);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!phone.trim()) newErrors.phone = "Phone number required";
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = "Password must be at least 8 characters with 1 uppercase and 1 number";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    // Validate separate date fields
    if (!birthDay || !birthMonth || !birthYear) {
      newErrors.dateOfBirth = "Date of birth required";
    } else {
      const day = parseInt(birthDay);
      const month = parseInt(birthMonth);
      const year = parseInt(birthYear);
      
      if (day < 1 || day > 31) {
        newErrors.dateOfBirth = "Invalid day (1-31)";
      } else if (month < 1 || month > 12) {
        newErrors.dateOfBirth = "Invalid month (1-12)";
      } else if (year < 1900 || year > new Date().getFullYear()) {
        newErrors.dateOfBirth = "Invalid year";
      } else {
        const parsedDate = new Date(year, month - 1, day);
        if (isNaN(parsedDate.getTime()) || parsedDate.getDate() !== day || parsedDate.getMonth() + 1 !== month || parsedDate.getFullYear() !== year) {
          newErrors.dateOfBirth = "Invalid date";
        } else if (!isOldEnoughToRent(parsedDate)) {
          newErrors.dateOfBirth = "You must be at least 23 years old to rent";
        }
      }
    }
    
    if (!nationality) newErrors.nationality = "Nationality required";
    if (!countryOfResidence) newErrors.countryOfResidence = "Country of residence required";
    
    if (!acceptTerms) newErrors.acceptTerms = "You must accept the terms";
    if (!acceptPrivacy) newErrors.acceptPrivacy = "You must accept the privacy policy";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!idType) newErrors.idType = "ID type required";
    if (!idNumber.trim()) newErrors.idNumber = "ID number required";
    if (!arrivalDate) newErrors.arrivalDate = "Arrival date required";
    if (!localCameroonAddress.trim()) newErrors.localCameroonAddress = "Local address required";
    if (!identityDocument) newErrors.identityDocument = "Identity document required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    // Small delay to allow any pending animations to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    setLoading(false);
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // prevent double submit
    if (!validateStep2()) return;

    setLoading(true);
    try {
      // Combine separate date fields into ISO format for Supabase
      const formattedDateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone: `${phoneCountryCode}${phone}`,
          date_of_birth: formattedDateOfBirth,
          nationality,
          country_of_residence: countryOfResidence,
          phone_country_code: phoneCountryCode,
          id_type: idType,
          id_number: idNumber,
          arrival_date: arrivalDate,
          local_cameroon_address: localCameroonAddress,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Upload identity document if provided
      if (identityDocument && data.user) {
        const fileExt = identityDocument.name.split('.').pop();
        const fileName = `${data.user.id}_id_document.${fileExt}`;

        console.log('Uploading identity document:', fileName);
        
        // Use server-side API route for upload to bypass RLS
        const formData = new FormData();
        formData.append('file', identityDocument);
        formData.append('fileName', fileName);
        formData.append('userId', data.user.id);

        const uploadRes = await fetch('/api/upload/document', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          console.error('File upload error:', uploadData.error);
          throw new Error(`File upload error: ${uploadData.error || 'Upload failed'}`);
        }

        const uploadData = await uploadRes.json();
        const publicUrl = uploadData.publicUrl;

        console.log('Updating profile with document URL:', publicUrl);
        const updateRes = await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity_document_url: publicUrl })
        });

        if (!updateRes.ok) {
          const updateData = await updateRes.json();
          console.error('Profile update error:', updateData.error);
          throw new Error(`Profile update error: ${updateData.error || 'Update failed'}`);
        }
      }

      // Redirect to the redirect URL from API or default to returnTo
      router.push(data.redirect || returnTo);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || "Error during registration" });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    // Small delay to allow animations to complete before navigation
    await new Promise(resolve => setTimeout(resolve, 200));
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-medium">Welcome! This platform is for car rentals and purchases in Cameroon. All visitors are welcome to create an account.</p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            {step === 1 ? 'Step 1/2 - Basic Information' : 'Step 2/2 - Identity & Documents'}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleStep1Submit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex w-full min-w-0">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="flex-shrink-0 w-[110px] max-w-[110px] bg-white border border-r-0 border-gray-300 rounded-l-lg px-1 py-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-blue-600 outline-none appearance-none overflow-hidden"
                  >
                    {COUNTRY_CODES.map((cc, index) => (
                      <option key={`${cc.country}-${cc.code}-${index}`} value={cc.code}>
                        {cc.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="6XX XXX XXX"
                    className="flex-1 min-w-0 bg-white border border-gray-300 rounded-r-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min 8 characters, 1 uppercase, 1 number"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="flex gap-2">
                  <input
                    ref={dayRef}
                    type="text"
                    value={birthDay}
                    onChange={handleDayChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    placeholder="DD"
                    maxLength={2}
                  />
                  <input
                    ref={monthRef}
                    type="text"
                    value={birthMonth}
                    onChange={handleMonthChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    placeholder="MM"
                    maxLength={2}
                  />
                  <input
                    ref={yearRef}
                    type="text"
                    value={birthYear}
                    onChange={handleYearChange}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                    placeholder="YYYY"
                    maxLength={4}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your nationality</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                <select
                  value={countryOfResidence}
                  onChange={(e) => setCountryOfResidence(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your country of residence</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.countryOfResidence && <p className="text-red-500 text-xs mt-1">{errors.countryOfResidence}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I accept the terms of service</span>
                </label>
                {errors.acceptTerms && <p className="text-red-500 text-xs ml-6">{errors.acceptTerms}</p>}

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={acceptPrivacy}
                    onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">I accept the privacy policy</span>
                </label>
                {errors.acceptPrivacy && <p className="text-red-500 text-xs ml-6">{errors.acceptPrivacy}</p>}
              </div>

              {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>

              <p className="text-center text-sm text-gray-600">
                Already have an account? <a href="/auth/login?returnTo=%2Fauth%2Fregister" className="text-blue-600 hover:underline">Sign in</a>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleStep2Submit}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium">Complete your profile to start renting</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select ID type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID</option>
                  <option value="driver_license">Driver's License</option>
                  <option value="residence_permit">Residence Permit</option>
                </select>
                {errors.idType && <p className="text-red-500 text-xs mt-1">{errors.idType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ID number"
                />
                {errors.idNumber && <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date to Cameroon *</label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.arrivalDate && <p className="text-red-500 text-xs mt-1">{errors.arrivalDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Local Address in Cameroon *</label>
                <textarea
                  value={localCameroonAddress}
                  onChange={(e) => setLocalCameroonAddress(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Hotel name or address in Cameroon"
                />
                {errors.localCameroonAddress && <p className="text-red-500 text-xs mt-1">{errors.localCameroonAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identity Document *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIdentityDocument(file);
                        setIdentityDocumentName(file.name);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                  {identityDocumentName && (
                    <span className="text-sm text-gray-600 truncate max-w-xs">{identityDocumentName}</span>
                  )}
                </div>
                {errors.identityDocument && <p className="text-red-500 text-xs mt-1">{errors.identityDocument}</p>}
                <p className="text-xs text-gray-500 mt-1">Required for verification before booking</p>
              </div>

              {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                ) : (
                  "Complete Registration"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-600 py-2 flex items-center justify-center gap-2 hover:text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
