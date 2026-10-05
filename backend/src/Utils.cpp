#include "Utils.h"
#include <algorithm>
#include <cctype>
#include <chrono>
#include <iomanip>
#include <sstream>
#include <regex>
#include <random>

namespace Utils {

std::string toLowerCase(const std::string& text) {
    std::string result = text;
    std::transform(result.begin(), result.end(), result.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return result;
}

std::string trim(const std::string& str) {
    size_t first = str.find_first_not_of(" \t\n\r");
    if (std::string::npos == first) {
        return "";
    }
    size_t last = str.find_last_not_of(" \t\n\r");
    return str.substr(first, (last - first + 1));
}

bool isValidPhone(const std::string& phone) {
    std::string cleaned = trim(phone);
    if (cleaned.empty()) return false;

    // Minimum 7 digits, maximum 15 digits (allows optional + prefix, spaces, dashes)
    // Example valid: "9876543210", "+919876543210", "987-654-3210"
    static const std::regex phoneRegex(R"(^\+?[0-9\s\-]{7,16}$)");
    if (!std::regex_match(cleaned, phoneRegex)) return false;

    // Count actual numeric digits
    int digitCount = 0;
    for (char c : cleaned) {
        if (std::isdigit(static_cast<unsigned char>(c))) {
            digitCount++;
        }
    }
    return digitCount >= 7 && digitCount <= 15;
}

bool isValidEmail(const std::string& email) {
    std::string cleaned = trim(email);
    if (cleaned.empty()) return true; // Email is optional in some forms, but if provided must match
    static const std::regex emailRegex(R"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)");
    return std::regex_match(cleaned, emailRegex);
}

bool validateContact(const Contact& contact, std::string& outErrorMessage) {
    std::string trimmedName = trim(contact.name);
    std::string trimmedPhone = trim(contact.phone);

    if (trimmedName.empty()) {
        outErrorMessage = "Contact name cannot be empty";
        return false;
    }
    if (trimmedPhone.empty()) {
        outErrorMessage = "Phone number cannot be empty";
        return false;
    }
    if (!isValidPhone(trimmedPhone)) {
        outErrorMessage = "Invalid phone number format. Must contain 7-15 digits.";
        return false;
    }
    if (!contact.email.empty() && !isValidEmail(contact.email)) {
        outErrorMessage = "Invalid email address format";
        return false;
    }

    return true;
}

std::string getCurrentIsoTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto in_time_t = std::chrono::system_clock::to_time_t(now);
    std::stringstream ss;
    ss << std::put_time(std::gmtime(&in_time_t), "%Y-%m-%dT%H:%M:%SZ");
    return ss.str();
}

std::string generateUniqueId() {
    auto millis = std::chrono::duration_cast<std::chrono::milliseconds>(
                      std::chrono::system_clock::now().time_since_epoch())
                      .count();
    static std::mt19937 gen(std::random_device{}());
    std::uniform_int_distribution<int> dis(1000, 9999);
    return "contact_" + std::to_string(millis) + "_" + std::to_string(dis(gen));
}

} // namespace Utils
