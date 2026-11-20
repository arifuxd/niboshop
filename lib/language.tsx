'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'bn'
type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (text: string) => string
}

const translations: Record<string, string> = {
  'Account': 'অ্যাকাউন্ট',
  'Choose language': 'ভাষা নির্বাচন করুন',
  'Language': 'ভাষা',
  'View store': 'স্টোর দেখুন',
  'Dashboard': 'ড্যাশবোর্ড',
  'Admin': 'অ্যাডমিন',
  'Profile & security': 'প্রোফাইল ও নিরাপত্তা',
  'Overview': 'সংক্ষিপ্ত বিবরণ',
  'Products': 'পণ্য',
  'Orders': 'অর্ডার',
  'Customers': 'ক্রেতা',
  'Profile': 'প্রোফাইল',
  'Addresses': 'ঠিকানা',
  'Wishlist': 'পছন্দের তালিকা',
  'Details': 'বিস্তারিত',
  'Product description': 'পণ্যের বিবরণ',
  'Open menu': 'মেনু খুলুন',
  'Browse categories': 'ক্যাটাগরি দেখুন',
  'Hotline:': 'হটলাইন:',
  'Login': 'লগইন',
  'Sign in': 'সাইন ইন',
  'Create account': 'অ্যাকাউন্ট তৈরি করুন',
  'Create your account': 'আপনার অ্যাকাউন্ট তৈরি করুন',
  'Verify your account': 'আপনার অ্যাকাউন্ট যাচাই করুন',
  'Digit 1': 'সংখ্যা ১',
  'Digit 2': 'সংখ্যা ২',
  'Digit 3': 'সংখ্যা ৩',
  'Digit 4': 'সংখ্যা ৪',
  'Digit 5': 'সংখ্যা ৫',
  'Digit 6': 'সংখ্যা ৬',
  'Welcome back to Niboshop': 'Niboshop-এ আবার স্বাগতম',
  'Sign in to continue to your account.': 'আপনার অ্যাকাউন্টে যেতে সাইন ইন করুন।',
  'Full name': 'পুরো নাম',
  'Your name': 'আপনার নাম',
  'Email or phone number': 'ইমেইল অথবা ফোন নম্বর',
  'Enter email or phone number': 'ইমেইল অথবা ফোন নম্বর লিখুন',
  'Password': 'পাসওয়ার্ড',
  'Enter password': 'পাসওয়ার্ড লিখুন',
  'Confirm password': 'পাসওয়ার্ড নিশ্চিত করুন',
  'Re-enter password': 'আবার পাসওয়ার্ড লিখুন',
  'Remember me': 'আমাকে মনে রাখুন',
  'Forgot password?': 'পাসওয়ার্ড ভুলে গেছেন?',
  'Send reset instructions': 'রিসেট নির্দেশনা পাঠান',
  'Don’t have an account?': 'অ্যাকাউন্ট নেই?',
  'Already have an account?': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
  'Back to login': 'লগইনে ফিরে যান',
  'Enter the 6-digit code sent to your email or phone.': 'আপনার ইমেইল বা ফোনে পাঠানো ৬ সংখ্যার কোডটি লিখুন।',
  'Verify code': 'কোড যাচাই করুন',
  'Resend code': 'কোড আবার পাঠান',
  'Back': 'ফিরে যান',
  'Close': 'বন্ধ করুন',
  'Search products': 'পণ্য খুঁজুন',
  'Search for products...': 'পণ্য খুঁজুন...',
  'Clear search': 'সার্চ মুছুন',
  'Searching...': 'খোঁজা হচ্ছে...',
  'No products found for': 'কোনো পণ্য পাওয়া যায়নি:',
  'Search results': 'অনুসন্ধানের ফলাফল',
  'Enter at least 3 characters to search.': 'অনুসন্ধানের জন্য কমপক্ষে ৩টি অক্ষর লিখুন।',
  'Product search is temporarily unavailable.': 'পণ্য অনুসন্ধান সাময়িকভাবে বন্ধ আছে।',
  'View all results for': 'সব ফলাফল দেখুন',
  'Cart': 'কার্ট',
  'Open cart': 'কার্ট খুলুন',
  'items': 'টি পণ্য',
  'Shopping Cart': 'শপিং কার্ট',
  'Products you have added to your cart': 'আপনার কার্টে যোগ করা পণ্য',
  'Close cart': 'কার্ট বন্ধ করুন',
  'Your cart is empty': 'আপনার কার্ট খালি',
  'Add some products to get started.': 'শুরু করতে কিছু পণ্য যোগ করুন।',
  'Continue Shopping': 'কেনাকাটা চালিয়ে যান',
  'Order Summary': 'অর্ডারের সারাংশ',
  'Subtotal': 'উপমোট',
  'You save': 'আপনার সাশ্রয়',
  'Delivery': 'ডেলিভারি',
  'Free': 'বিনামূল্যে',
  'Total': 'মোট',
  'Proceed to Checkout': 'চেকআউটে যান',
  'Add more for free delivery': 'ফ্রি ডেলিভারির জন্য আরও যোগ করুন',
  'Remove': 'সরান',
  'New': 'নতুন',
  'Add to Cart': 'কার্টে যোগ করুন',
  'Buy Now': 'এখনই কিনুন',
  'Added to cart': 'কার্টে যোগ হয়েছে',
  'Shop by Category': 'ক্যাটাগরি অনুযায়ী কিনুন',
  'Featured Products': 'জনপ্রিয় পণ্য',
  'Hand-picked bestsellers from our stores': 'আমাদের জনপ্রিয় নির্বাচিত পণ্য',
  'New Arrivals': 'নতুন পণ্য',
  'Fresh in stock this week': 'এই সপ্তাহের নতুন স্টক',
  'View all': 'সব দেখুন',
  'Shop': 'শপ',
  'My Account': 'আমার অ্যাকাউন্ট',
  'Home': 'হোম',
  'My Orders': 'আমার অর্ডার',
  'Checkout': 'চেকআউট',
  'All rights reserved.': 'সর্বস্বত্ব সংরক্ষিত।',
  'Niboshop is your trusted store for smartphones, laptops, audio, smart gadgets and home appliances with fast delivery across Bangladesh.': 'বাংলাদেশজুড়ে দ্রুত ডেলিভারিসহ স্মার্টফোন, ল্যাপটপ, অডিও, স্মার্ট গ্যাজেট ও হোম অ্যাপ্লায়েন্সের বিশ্বস্ত স্টোর Niboshop।',
  'Fastest home delivery': 'দ্রুততম হোম ডেলিভারি',
  '100% genuine products': '১০০% আসল পণ্য',
  'Easy 7-day return': 'সহজ ৭ দিনের রিটার্ন',
  'Show password': 'পাসওয়ার্ড দেখান',
  'Hide password': 'পাসওয়ার্ড লুকান',
  'We’ll help you get back into your account.': 'আপনার অ্যাকাউন্টে প্রবেশের জন্য আমরা সাহায্য করব।',
  'Six-digit verification code': 'ছয় সংখ্যার যাচাইকরণ কোড',
  'Your passwords do not match. Please check and try again.': 'পাসওয়ার্ড মিলছে না। আবার চেষ্টা করুন।',
  'Enter all 6 digits to continue.': 'চালিয়ে যেতে ৬টি সংখ্যাই লিখুন।',
  'Code verification is not connected in this UI-only prototype.': 'এই ডেমোতে কোড যাচাই সংযুক্ত নেই।',
  'A new code cannot be sent until authentication is connected.': 'অথেনটিকেশন সংযুক্ত না হওয়া পর্যন্ত নতুন কোড পাঠানো যাবে না।',
  'Password reset is not connected in this UI-only prototype.': 'এই ডেমোতে পাসওয়ার্ড রিসেট সংযুক্ত নেই।',
  'Authentication is not connected in this UI-only prototype, so nothing was submitted or saved.': 'এই ডেমোতে অথেনটিকেশন সংযুক্ত নেই, তাই কিছু জমা বা সংরক্ষণ করা হয়নি।',
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, t: (text: string) => language === 'bn' ? translations[text] ?? text : text }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
