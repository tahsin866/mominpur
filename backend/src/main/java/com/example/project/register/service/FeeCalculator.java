package com.example.project.register.service;

/**
 * রেজিস্ট্রেশন ও অতিথি ফি-র হিসাব। টাকার অঙ্ক সবসময় সার্ভারেই বের করা হয়,
 * ক্লায়েন্ট থেকে পাঠানো কোনো অঙ্ক বিশ্বাস করা হয় না।
 */
public final class FeeCalculator {

    /** নিজের রেজিস্ট্রেশন ফি। */
    public static final int REGISTRATION_FEE = 1020;

    /** প্রতি অতিথির ফি। */
    public static final int GUEST_FEE = 510;

    /** একজন সর্বোচ্চ যতজন অতিথি আনতে পারবেন। */
    public static final int MAX_GUESTS = 2;

    private FeeCalculator() {}

    /** null-কে ০ ধরে নেয়; সীমার বাইরে হলে জানিয়ে দেয়। */
    public static int normalizeGuestCount(Integer guestCount) {
        int guests = guestCount == null ? 0 : guestCount;
        if (guests < 0 || guests > MAX_GUESTS) {
            throw new RuntimeException(
                    "অতিথি সংখ্যা ০ থেকে " + MAX_GUESTS + " জনের মধ্যে হতে হবে।");
        }
        return guests;
    }

    /** মোট দেয় টাকা = রেজিস্ট্রেশন ফি + (অতিথি × অতিথি ফি)। */
    public static int totalAmount(Integer guestCount) {
        return REGISTRATION_FEE + (normalizeGuestCount(guestCount) * GUEST_FEE);
    }
}
