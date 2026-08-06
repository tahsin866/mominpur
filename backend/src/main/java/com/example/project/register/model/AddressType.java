package com.example.project.register.model;

/**
 * ঠিকানার ধরন। ডাটাবেজে addresses.address_type-এর CHECK constraint
 * ('PERMANENT', 'CURRENT') — নাম বদলালে সেখানেও বদলাতে হবে।
 */
public enum AddressType {
    PERMANENT,
    CURRENT
}
