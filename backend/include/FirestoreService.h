#ifndef FIRESTORE_SERVICE_H
#define FIRESTORE_SERVICE_H

#include <vector>
#include <string>
#include <memory>
#include "Contact.h"

/**
 * FirestoreService is responsible EXCLUSIVELY for interacting with the database layer.
 * Communicates with Google Cloud Firestore REST API over HTTP/HTTPS (via libcurl or native HTTP client).
 * Features an automated, persistent local JSON fallback mechanism when credentials are absent or during offline development.
 */
class FirestoreService {
private:
    std::string projectId;
    std::string apiKey;
    std::string databaseUrl;
    bool useLocalStorageFallback;
    std::string localStorageFilePath;

    // Helper methods for Firestore REST API interaction
    std::string httpGet(const std::string& url);
    std::string httpPost(const std::string& url, const std::string& jsonBody);
    std::string httpPatch(const std::string& url, const std::string& jsonBody);
    bool httpDelete(const std::string& url);

    // Helpers for local JSON file persistence fallback
    std::vector<Contact> loadFromLocalStorage();
    bool saveToLocalStorage(const std::vector<Contact>& contacts);

    // Helper to convert Firestore JSON document format to Contact struct
    Contact firestoreDocToContact(const nlohmann::json& doc);
    // Helper to convert Contact struct to Firestore JSON document format
    nlohmann::json contactToFirestoreFields(const Contact& contact);

public:
    FirestoreService();
    FirestoreService(const std::string& projId, const std::string& key);

    // Core Database Operations (CRUD)
    bool createContact(const Contact& contact);
    std::vector<Contact> getContacts();
    bool getContactById(const std::string& id, Contact& outContact);
    bool updateContact(const std::string& id, const Contact& contact);
    bool deleteContact(const std::string& id);
};

#endif // FIRESTORE_SERVICE_H
