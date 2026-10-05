"use client";

export default function RegPage() {
  const startYear = 1963;
  const currentYear = 2026;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">

      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-emerald-800 to-zinc-900 py-24 px-4 text-center text-white dark:from-emerald-950 dark:to-black">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        <div className="relative max-w-3xl mx-auto space-y-5">
          <span className="inline-block px-3 py-1 text-lg font-semibold bg-emerald-500/20 text-emerald-300 rounded-full tracking-wider uppercase border border-emerald-500/30">
            ঐতিহাসিক পুনর্মিলনী ও মিলনমেলা ২০২৬
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-emerald-300 bg-clip-text text-transparent">
            ইত্তেহাদে আবনায়ে মুমিনপুর
          </h1>
          <p className="text-lg text-emerald-100/80 max-w-xl mx-auto font-medium">
            স্মৃতির টানে, চেনা প্রাঙ্গণে... ১৯৬৩ সাল থেকে আজ পর্যন্ত সকল প্রাক্তনের মিলনমেলা
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 text-lg font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-sm border border-white/10">
              📅 ১৬ ডিসেম্বর, ২০২৬
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-sm border border-white/10">
              📍 মাদরাসা প্রাঙ্গন
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">

        {/* দাওয়াতনামা কার্ড */}
        <section className="bg-white rounded-sm border border-zinc-200/80 shadow-sm p-6 md:p-12 space-y-6 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="text-center space-y-1 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <p className="text-lg text-zinc-500 font-medium dark:text-zinc-400">বিসমিল্লাহি তা'আলা</p>
            <p className="text-lg font-serif text-zinc-800 dark:text-zinc-200" dir="rtl">
              السلام عليكم ورحمة الله وبركاته
            </p>
          </div>

          <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed text-justify text-lg md:text-base">
            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">মুহতারাম!</p>

            <p>
              তিনদিক থেকে ডাকাতিয়া নদী বেষ্টিত দ্বীপসদৃশ মুমিনপুর গ্রামে অবস্থিত মুমিনপুর মাদরাসার মনোরম পরিবেশে
              হিফজুল কুরআনের কিংবদন্তি পুরুষ হাফেজ মুহসিন সাহেব রহ. ও তাঁর যোগ্য উত্তরসূরীদের দরদমাখা শাসন ও কঠোর
              তদারকিতে কাটানো শৈশবের শিক্ষা জীবনের স্মৃতিগুলো মুমিনপুর মাদরাসার শিক্ষার্থীদের মন থেকে কখনো মুছে যায় না
              বলে আমাদের বিশ্বাস।
            </p>

            <p>
              স্মৃতির টানে বার-বার আশা জাগে- সে শৈশব কাননকে দেখার ও সহপাঠীদের সাথে মিশে কিছু সময়ের জন্য সে শৈশবে
              ফিরে যাওয়ার। এ আশা নিয়ে ইতিমধ্যে অনেকেই ক্ষণস্থায়ী দুনিয়া থেকে বিদায়ও নিয়েছেন। আর জীবিতদের অনেকেই
              এ আশা পূরণের কোনো উপায় খুঁজে পাচ্ছেন না।
            </p>

            <p>
              আল্লাহর অশেষ মেহেরবাণী, যে কিছু উদ্যমী নওজোয়ান নবীন-প্রবীণ শিক্ষার্থীদের আশা পূরণের স্বপ্ন বাস্তবায়নের
              উপায় হিসাবে <span className="font-semibold text-emerald-600 dark:text-emerald-400">"ইত্তেহাদে আবনায়ে মুমিনপুর"</span> শিরোনামে একটি যোগসূত্র এর প্রস্তাব মুমিনপুরের বর্তমান
              কর্তৃপক্ষের সামনে পেশ করলে কর্তৃপক্ষ তার প্রতি সদয় সমর্থন প্রদান করেছেন।
            </p>

            <p>
              এ ইত্তেহাদের ব্যবস্থাপনায় আগামী <span className="font-semibold text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30">১৬ ডিসেম্বর ২০২৬ খ্রিঃ</span> তারিখে মাদরাসা প্রাঙ্গনে একটি পুনর্মিলনী অনুষ্ঠানের আয়োজনের উদ্যোগ
              গ্রহণ করা হয়েছে। এতে দেশ বরেণ্য উলামা-মাশায়েখ উপস্থিত থাকবেন ও নসীহত পেশ করবেন, ইনশাআল্লাহ।
            </p>

            <p className="font-medium text-center pt-2 text-zinc-900 dark:text-zinc-100 italic">
              বরকতময় এ অনুষ্ঠানে আপনার উপস্থিতি একান্তভাবে কামনা করছি।
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-right space-y-1 dark:border-zinc-800">
            <p className="text-lg text-zinc-500 font-medium dark:text-zinc-400">নিবেদক</p>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">হাফেজ মাওলানা মুহাম্মাদ রাশেদ মুহসিন</p>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">মুহতামিম, মুমিনপুর মাদরাসা</p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-lg text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p>© ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>

    </div>
  );
}
