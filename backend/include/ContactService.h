#ifndef CONTACT_SERVICE_H
#define CONTACT_SERVICE_H

#include <vector>
#include <string>
#include <memory>
#include "Contact.h"
#include "FirestoreService.h"

/**
 * ============================================================================
 * DSA BUSINESS LOGIC LAYER: ContactService
 * ============================================================================
 * Handles all core Data Structures & Algorithms operations on Contacts:
 * 1. STL Container (std::vector<Contact>): In-memory data manipulation
 * 2. Searching: Case-insensitive linear search O(n) by Name & Phone
 * 3. Sorting: Custom comparator sort O(n log n) by Name using std::sort()
 * 4. Validation: Duplicate detection and format verification
 */
class ContactService {
private:
    std::shared_ptr<FirestoreService> firestoreService;

public:
    ContactService();
    explicit ContactService(std::shared_ptr<FirestoreService> fs);

    // CRUD operations interfacing with Firestore layer
    bool addContact(Contact contact, std::string& outError, Contact& createdContact);
    bool deleteContact(const std::string& id);
    bool updateContact(const std::string& id, Contact contact, std::string& outError);
    std::vector<Contact> getAllContacts();
    bool getContactById(const std::string& id, Contact& outContact);

    /**
     * DSA ALGORITHM: LINEAR SEARCH BY NAME
     * Traverses std::vector<Contact> and performs case-insensitive substring matching.
     * Time Complexity: O(n * m) where n = number of contacts, m = search string length.
     * Space Complexity: O(k) where k = matching contacts.
     */
    std::vector<Contact> searchByName(const std::string& name);

    /**
     * DSA ALGORITHM: LINEAR SEARCH BY PHONE
     * Traverses std::vector<Contact> and matches exact or partial phone substring.
     * Time Complexity: O(n * p) where n = number of contacts, p = phone digits length.
     */
    std::vector<Contact> searchByPhone(const std::string& phone);

    /**
     * DSA ALGORITHM: ALPHABETICAL SORTING
     * Uses C++ STL std::sort with custom lambda comparator.
     * Time Complexity: O(n log n) comparison-based sorting (Introsort).
     * Space Complexity: O(1) auxiliary space (in-place sort).
     */
    void sortContactsAlphabetically(std::vector<Contact>& contacts);

    /**
     * DUPLICATE DETECTION FUNCTION
     * Checks if a phone number already exists in the system (ignoring current ID during update).
     */
    bool phoneExists(const std::string& phone, const std::string& excludeId = "");

    /**
     * INPUT VALIDATION FUNCTION
     */
    bool validateContact(const Contact& contact, std::string& outError);
};

#endif // CONTACT_SERVICE_H
