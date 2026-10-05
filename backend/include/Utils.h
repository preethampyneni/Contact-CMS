#ifndef UTILS_H
#define UTILS_H

#include <string>
#include "Contact.h"

namespace Utils {
    /**
     * DSA CONCEPT: STRING MANIPULATION & SEARCH UTILITY
     * Converts a string to lowercase for case-insensitive linear search comparisons.
     * Time Complexity: O(k) where k is string length.
     */
    std::string toLowerCase(const std::string& text);

    // Trims leading and trailing whitespace
    std::string trim(const std::string& str);

    // Validation functions
    bool isValidPhone(const std::string& phone);
    bool isValidEmail(const std::string& email);

    /**
     * Validates a Contact object according to business rules.
     * Checks for non-empty name, non-empty phone, phone format, email format.
     */
    bool validateContact(const Contact& contact, std::string& outErrorMessage);

    // Timestamp & ID utilities
    std::string getCurrentIsoTimestamp();
    std::string generateUniqueId();
}

#endif // UTILS_H
