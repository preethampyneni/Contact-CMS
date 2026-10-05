#ifndef CONTACT_H
#define CONTACT_H

#include <cassert>
#include <string>
#include <nlohmann/json.hpp>

/**
 * ============================================================================
 * DSA CONCEPT DEMONSTRATION: STRUCTURES (struct)
 * ============================================================================
 * WHY struct IS USED:
 * 1. Data Aggregation: A contact represents a real-world entity made up of
 *    multiple attributes (id, name, phone, email, address, category, timestamps).
 * 2. Public Accessibility: In C++, a struct defaults to public member access,
 *    making it an ideal Plain Old Data (POD) structure for DTOs (Data Transfer Objects).
 * 3. Memory Efficiency: Fields are laid out contiguously in memory for fast lookup.
 */
struct Contact {
    std::string id;         // Unique ID (e.g. contact_1728123456789)
    std::string name;       // Contact Full Name
    std::string phone;      // Stored as std::string to preserve leading zeroes & formatting
    std::string email;      // Email address
    std::string address;    // Physical location / City
    std::string category;   // Category (Personal, Friends, Family, Work, College, Other)
    std::string createdAt;  // ISO timestamp string
    std::string updatedAt;  // ISO timestamp string

    // Convert Contact struct to nlohmann::json object for API responses & DB storage
    nlohmann::json toJson() const {
        return nlohmann::json{
            {"id", id},
            {"name", name},
            {"phone", phone},
            {"email", email},
            {"address", address},
            {"category", category},
            {"createdAt", createdAt},
            {"updatedAt", updatedAt}
        };
    }

    // Populate Contact struct from nlohmann::json object
    static Contact fromJson(const nlohmann::json& j) {
        Contact c;
        if (j.contains("id") && j["id"].is_string()) c.id = j["id"].get<std::string>();
        if (j.contains("name") && j["name"].is_string()) c.name = j["name"].get<std::string>();
        if (j.contains("phone") && j["phone"].is_string()) c.phone = j["phone"].get<std::string>();
        if (j.contains("email") && j["email"].is_string()) c.email = j["email"].get<std::string>();
        if (j.contains("address") && j["address"].is_string()) c.address = j["address"].get<std::string>();
        if (j.contains("category") && j["category"].is_string()) c.category = j["category"].get<std::string>();
        if (j.contains("createdAt") && j["createdAt"].is_string()) c.createdAt = j["createdAt"].get<std::string>();
        if (j.contains("updatedAt") && j["updatedAt"].is_string()) c.updatedAt = j["updatedAt"].get<std::string>();
        return c;
    }
};

#endif // CONTACT_H
