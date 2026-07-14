"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">

      {/* Dawatnama Highlight - TOP */}
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-zinc-900 py-12 px-4 text-white dark:from-emerald-950 dark:via-emerald-950 dark:to-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-emerald-500/20 text-emerald-300 rounded-full tracking-wider uppercase border border-emerald-500/30 mb-4">
              ঐতিহাসিক পুনর্মিলনী ও মিলনমেলা ২০২৬
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-3">
              ইত্তেহাদে আবনায়ে মুমিনপুর
            </h1>
            <p className="text-emerald-100/80 max-w-xl mx-auto">
              স্মৃতির টানে, চেনা প্রাঙ্গণে... ১৯৬৩ সাল থেকে আজ পর্যন্ত সকল প্রাক্তনের মিলনমেলা
            </p>
          </div>

          <div className="mb-4 text-center">
            <Link
              href="/registration/reg"
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-sm shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            >
              রেজিস্ট্রেশন করুন
            </Link>
          </div>
          <div className="bg-white rounded-sm shadow-2xl overflow-hidden ring-1 ring-white/10">
            <Image
              src="/dawatnama.jpeg"
              alt="দাওয়াতনামা - ইত্তেহাদে আবনায়ে মুমিনপুর"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-emerald-100/80">
            <span className="flex items-center gap-1.5 bg-white/10 px-4 py-3 rounded-sm border border-white/10">
              ১৬ ডিসেম্বর, ২০২৬
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-4 py-3 rounded-sm border border-white/10">
              মাদরাসা প্রাঙ্গন
            </span>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="bg-white border-b border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">১৯৬৩</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">প্রতিষ্ঠা সাল</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">৬০+</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">বছরের ঐতিহ্য</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">১০০০+</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">প্রাক্তন শিক্ষার্থী</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">১</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">ঐতিহ্যবাহী মাদরাসা</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">মুমিনপুর মাদরাসা সম্পর্কে</h2>
          <div className="mt-2 w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed text-justify">
            <p>
              তিনদিক থেকে ডাকাতিয়া নদী বেষ্টিত দ্বীপসদৃশ মুমিনপুর গ্রামে অবস্থিত মুমিনপুর মাদরাসা একটি ঐতিহ্যবাহী কওমী শিক্ষা প্রতিষ্ঠান।
              হিফজুল কুরআনের কিংবদন্তি পুরুষ হাফেজ মুহসিন সাহেব রহ. ও তাঁর যোগ্য উত্তরসূরীদের দরদমাখা শাসন ও কঠোর তদারকিতে এই মাদরাসা পরিচালিত হয়ে আসছে।
            </p>
            <p>
              শৈশবের শিক্ষা জীবনের স্মৃতিগুলো মুমিনপুর মাদরাসার শিক্ষার্থীদের মন থেকে কখনো মুছে যায় না বলে আমাদের বিশ্বাস।
            </p>
          </div>
          <div className="bg-white rounded-sm border border-zinc-200 shadow-sm p-6 dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">মাদরাসার তথ্য</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">নাম</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">মুমিনপুর কওমী মাদরাসা</span>
              </li>
              <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">অবস্থান</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">মুমিনপুর, ডাকাতিয়া নদী</span>
              </li>
              <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">প্রতিষ্ঠাকাল</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">১৯৬৩</span>
              </li>
              <li className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="text-zinc-500 dark:text-zinc-400">ধরন</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">কওমী হিফজ মাদরাসা</span>
              </li>
              <li className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">মুহতামিম</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">হাফেজ মাওলানা মুহাম্মাদ রাশেদ মুহসিন</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="bg-white border-y border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">অনুষ্ঠানের বৈশিষ্ট্য</h2>
            <div className="mt-2 w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">কুরআন তিলাওয়াত</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">প্রাক্তন হাফেজদের দ্বারা কুরআন তিলাওয়াত ও মুখস্থকারীদের অংশগ্রহণ</p>
            </div>
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">সহপাঠী মিলন</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">প্রাক্তন সহপাঠীদের সাথে স্মৃতি তুলে ধরার সুযোগ</p>
            </div>
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">নসীহত সমবেশ</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">দেশ বরেণ্য উলামা-মাশায়েখদের নসীহত ও বক্তৃতা</p>
            </div>
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">স্মৃতি সংরক্ষণ</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">পুরোনো ছবি ও স্মৃতির ধারণা, সহপাঠী সমাবেশ</p>
            </div>
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">সাংস্কৃতিক অনুষ্ঠান</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">মাহফিলে নাশিদ ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন</p>
            </div>
            <div className="p-5 rounded-sm border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/50">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm flex items-center justify-center mb-3 dark:bg-emerald-900/40">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">সম্মাননা</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">প্রাক্তন শিক্ষক ও শিক্ষার্থীদের সম্মাননা প্রদান</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-sm p-8 md:p-12 text-center text-white dark:from-emerald-800 dark:to-emerald-950">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">এখনই রেজিস্ট্রেশন করুন</h2>
          <p className="text-emerald-100/80 mb-6 max-w-lg mx-auto">
            মিলনমেলায় অংশ নিতে এখনই আপনার রেজিস্ট্রেশন সম্পূর্ণ করুন। আপনার উপস্থিতি আমাদের জন্য অমূল্য।
          </p>
          <Link
            href="/registration/reg"
            className="inline-block bg-white text-emerald-700 font-semibold px-10 py-3 rounded-sm shadow hover:bg-emerald-50 transition duration-200"
          >
            এখনই রেজিস্ট্রেশন করুন
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">ইত্তেহাদে আবনায়ে মুমিনপুর</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                মুমিনপুর মাদরাসার প্রাক্তন শিক্ষার্থীদের যোগসূত্র ও মিলনমেলার আয়োজনী।
              </p>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">গুরুত্বপূর্ণ লিংক</h3>
              <ul className="space-y-1 text-sm">
                <li><Link href="/registration/reg" className="text-emerald-600 hover:underline dark:text-emerald-400">রেজিস্ট্রেশন</Link></li>
                <li><Link href="/login" className="text-emerald-600 hover:underline dark:text-emerald-400">লগইন</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">যোগাযোগ</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                মুমিনপুর, ডাকাতিয়া নদী<br />
                বাংলাদেশ
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-zinc-100 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            &copy; ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>

    </div>
  );
}
