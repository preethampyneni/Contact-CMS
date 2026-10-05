#include "ContactService.h"
#include "Utils.h"
#include <algorithm>
#include <iostream>

ContactService::ContactService() {
    firestoreService = std::make_shared<FirestoreService>();
}

ContactService::ContactService(std::shared_ptr<FirestoreService> fs)
    : firestoreService(fs) {}

std::vector<Contact> ContactService::getAllContacts() {
    return firestoreService->getContacts();
}

bool ContactService::getContactById(const std::string& id, Contact& outContact) {
    return firestoreService->getContactById(id, outContact);
}

bool ContactService::phoneExists(const std::string& phone, const std::string& excludeId) {
    std::string targetPhone = Utils::trim(phone);
    if (targetPhone.empty()) return false;

    // Fetch vector of all contacts from database layer
    std::vector<Contact> allContacts = firestoreService->getContacts();

    // Perform O(n) linear search to detect duplicate phone numbers
    for (const auto& contact : allContacts) {
        if (!excludeId.empty() && contact.id == excludeId) {
            continue; // Ignore self during update operations
        }
        if (Utils::trim(contact.phone) == targetPhone) {
            return true; // Duplicate found
        }
    }
    return false;
}

bool ContactService::validateContact(const Contact& contact, std::string& outError) {
    return Utils::validateContact(contact, outError);
}

bool ContactService::addContact(Contact contact, std::string& outError, Contact& createdContact) {
    // Step 1: Input Field Validation
    if (!validateContact(contact, outError)) {
        return false;
    }

    // Step 2: Unique Phone Number Check (HTTP 409 Conflict Prevention)
    if (phoneExists(contact.phone)) {
        outError = "A contact with this phone number already exists";
        return false;
    }

    // Step 3: Auto-generate ID and Timestamps
    if (contact.id.empty()) {
        contact.id = Utils::generateUniqueId();
    }
    std::string now = Utils::getCurrentIsoTimestamp();
    contact.createdAt = now;
    contact.updatedAt = now;

    if (contact.category.empty()) {
        contact.category = "Personal";
    }

    // Step 4: Persist to Firestore Database Layer
    bool success = firestoreService->createContact(contact);
    if (success) {
        createdContact = contact;
    } else {
        outError = "Failed to save contact to Firestore database";
    }
    return success;
}

bool ContactService::updateContact(const std::string& id, Contact contact, std::string& outError) {
    // Step 1: Verify contact exists
    Contact existingContact;
    if (!firestoreService->getContactById(id, existingContact)) {
        outError = "Contact not found with ID: " + id;
        return false;
    }

    // Step 2: Input Field Validation
    if (!validateContact(contact, outError)) {
        return false;
    }

    // Step 3: Unique Phone Number Check (excluding self)
    if (phoneExists(contact.phone, id)) {
        outError = "A contact with this phone number already exists";
        return false;
    }

    // Preserve ID & original createdAt timestamp, update updatedAt timestamp
    contact.id = id;
    contact.createdAt = existingContact.createdAt;
    contact.updatedAt = Utils::getCurrentIsoTimestamp();

    if (contact.category.empty()) {
        contact.category = existingContact.category;
    }

    bool success = firestoreService->updateContact(id, contact);
    if (!success) {
        outError = "Failed to update contact in Firestore database";
    }
    return success;
}

bool ContactService::deleteContact(const std::string& id) {
    if (id.empty()) return false;
    return firestoreService->deleteContact(id);
}

/**
 * ============================================================================
 * DSA ALGORITHM: LINEAR SEARCH BY NAME O(n)
 * ============================================================================
 * Retrieves contacts into std::vector<Contact> and iterates sequentially.
 * Converts both target query and contact names to lowercase for case-insensitivity.
 */
std::vector<Contact> ContactService::searchByName(const std::string& nameQuery) {
    std::string queryLower = Utils::toLowerCase(Utils::trim(nameQuery));
    std::vector<Contact> allContacts = firestoreService->getContacts();
    std::vector<Contact> matchingContacts;

    if (queryLower.empty()) {
        return allContacts;
    }

    // Traversal of std::vector<Contact>
    for (const auto& contact : allContacts) {
        std::string contactNameLower = Utils::toLowerCase(contact.name);
        // Substring search logic
        if (contactNameLower.find(queryLower) != std::string::npos) {
            matchingContacts.push_back(contact);
        }
    }

    return matchingContacts;
}

/**
 * ============================================================================
 * DSA ALGORITHM: LINEAR SEARCH BY PHONE O(n)
 * ============================================================================
 * Traverses std::vector<Contact> to match exact or partial phone digits.
 */
std::vector<Contact> ContactService::searchByPhone(const std::string& phoneQuery) {
    std::string queryClean = Utils::trim(phoneQuery);
    std::vector<Contact> allContacts = firestoreService->getContacts();
    std::vector<Contact> matchingContacts;

    if (queryClean.empty()) {
        return allContacts;
    }

    for (const auto& contact : allContacts) {
        if (contact.phone.find(queryClean) != std::string::npos) {
            matchingContacts.push_back(contact);
        }
    }

    return matchingContacts;
}

/**
 * ============================================================================
 * DSA ALGORITHM: ALPHABETICAL SORTING O(n log n)
 * ============================================================================
 * Sorts std::vector<Contact> in-place using std::sort with a custom lambda.
 * Performs case-insensitive lexicographical string comparisons.
 */
void ContactService::sortContactsAlphabetically(std::vector<Contact>& contacts) {
    std::sort(contacts.begin(), contacts.end(), [](const Contact& a, const Contact& b) {
        return Utils::toLowerCase(a.name) < Utils::toLowerCase(b.name);
    });
}
