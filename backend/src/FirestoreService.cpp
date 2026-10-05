#include "FirestoreService.h"
#include "Utils.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <algorithm>
#include <filesystem>

#ifdef HAS_LIBCURL
#include <curl/curl.h>

// Curl write callback to capture response string
static size_t CurlWriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    size_t totalSize = size * nmemb;
    std::string* str = static_cast<std::string*>(userp);
    str->append(static_cast<char*>(contents), totalSize);
    return totalSize;
}
#endif

FirestoreService::FirestoreService() {
    const char* envProjId = std::getenv("FIREBASE_PROJECT_ID");
    const char* envApiKey = std::getenv("FIREBASE_API_KEY");
    const char* envUrl = std::getenv("FIREBASE_DATABASE_URL");

    projectId = envProjId ? envProjId : "";
    apiKey = envApiKey ? envApiKey : "";
    
    if (envUrl && std::string(envUrl).length() > 0) {
        databaseUrl = envUrl;
    } else if (!projectId.empty()) {
        databaseUrl = "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/(default)/documents";
    } else {
        databaseUrl = "";
    }

    localStorageFilePath = "data/contacts_db.json";

    // Use local storage if Firestore project ID is empty or default placeholder
    if (projectId.empty() || projectId == "group11-contact-system") {
        useLocalStorageFallback = true;
    } else {
        useLocalStorageFallback = false;
    }
}

FirestoreService::FirestoreService(const std::string& projId, const std::string& key)
    : projectId(projId), apiKey(key) {
    databaseUrl = "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/(default)/documents";
    localStorageFilePath = "data/contacts_db.json";
    useLocalStorageFallback = projectId.empty();
}

std::string FirestoreService::httpGet(const std::string& url) {
#ifdef HAS_LIBCURL
    CURL* curl = curl_easy_init();
    if (!curl) return "";

    std::string readBuffer;
    std::string fullUrl = url;
    if (!apiKey.empty()) {
        fullUrl += (fullUrl.find('?') == std::string::npos ? "?" : "&") + std::string("key=") + apiKey;
    }

    curl_easy_setopt(curl, CURLOPT_URL, fullUrl.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, CurlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        std::cerr << "[FirestoreService] HTTP GET failed: " << curl_easy_strerror(res) << std::endl;
        return "";
    }
    return readBuffer;
#else
    return "";
#endif
}

std::string FirestoreService::httpPost(const std::string& url, const std::string& jsonBody) {
#ifdef HAS_LIBCURL
    CURL* curl = curl_easy_init();
    if (!curl) return "";

    std::string readBuffer;
    std::string fullUrl = url;
    if (!apiKey.empty()) {
        fullUrl += (fullUrl.find('?') == std::string::npos ? "?" : "&") + std::string("key=") + apiKey;
    }

    struct curl_slist* headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, fullUrl.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonBody.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, CurlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        std::cerr << "[FirestoreService] HTTP POST failed: " << curl_easy_strerror(res) << std::endl;
        return "";
    }
    return readBuffer;
#else
    return "";
#endif
}

std::string FirestoreService::httpPatch(const std::string& url, const std::string& jsonBody) {
#ifdef HAS_LIBCURL
    CURL* curl = curl_easy_init();
    if (!curl) return "";

    std::string readBuffer;
    std::string fullUrl = url;
    if (!apiKey.empty()) {
        fullUrl += (fullUrl.find('?') == std::string::npos ? "?" : "&") + std::string("key=") + apiKey;
    }

    struct curl_slist* headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, fullUrl.c_str());
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PATCH");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonBody.c_str());
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, CurlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

    CURLcode res = curl_easy_perform(curl);
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        std::cerr << "[FirestoreService] HTTP PATCH failed: " << curl_easy_strerror(res) << std::endl;
        return "";
    }
    return readBuffer;
#else
    return "";
#endif
}

bool FirestoreService::httpDelete(const std::string& url) {
#ifdef HAS_LIBCURL
    CURL* curl = curl_easy_init();
    if (!curl) return false;

    std::string readBuffer;
    std::string fullUrl = url;
    if (!apiKey.empty()) {
        fullUrl += (fullUrl.find('?') == std::string::npos ? "?" : "&") + std::string("key=") + apiKey;
    }

    curl_easy_setopt(curl, CURLOPT_URL, fullUrl.c_str());
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, CurlWriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);
    curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

    CURLcode res = curl_easy_perform(curl);
    long response_code = 0;
    curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &response_code);
    curl_easy_cleanup(curl);

    return (res == CURLE_OK && (response_code == 200 || response_code == 204));
#else
    return false;
#endif
}

Contact FirestoreService::firestoreDocToContact(const nlohmann::json& doc) {
    Contact c;
    if (doc.contains("name") && doc["name"].is_string()) {
        std::string fullPath = doc["name"].get<std::string>();
        size_t pos = fullPath.find_last_of('/');
        if (pos != std::string::npos) {
            c.id = fullPath.substr(pos + 1);
        }
    }

    if (doc.contains("fields") && doc["fields"].is_object()) {
        auto fields = doc["fields"];
        if (fields.contains("id") && fields["id"].contains("stringValue")) c.id = fields["id"]["stringValue"].get<std::string>();
        if (fields.contains("name") && fields["name"].contains("stringValue")) c.name = fields["name"]["stringValue"].get<std::string>();
        if (fields.contains("phone") && fields["phone"].contains("stringValue")) c.phone = fields["phone"]["stringValue"].get<std::string>();
        if (fields.contains("email") && fields["email"].contains("stringValue")) c.email = fields["email"]["stringValue"].get<std::string>();
        if (fields.contains("address") && fields["address"].contains("stringValue")) c.address = fields["address"]["stringValue"].get<std::string>();
        if (fields.contains("category") && fields["category"].contains("stringValue")) c.category = fields["category"]["stringValue"].get<std::string>();
        if (fields.contains("createdAt") && fields["createdAt"].contains("stringValue")) c.createdAt = fields["createdAt"]["stringValue"].get<std::string>();
        if (fields.contains("updatedAt") && fields["updatedAt"].contains("stringValue")) c.updatedAt = fields["updatedAt"]["stringValue"].get<std::string>();
    }
    return c;
}

nlohmann::json FirestoreService::contactToFirestoreFields(const Contact& contact) {
    return nlohmann::json{
        {"fields", {
            {"id", {{"stringValue", contact.id}}},
            {"name", {{"stringValue", contact.name}}},
            {"phone", {{"stringValue", contact.phone}}},
            {"email", {{"stringValue", contact.email}}},
            {"address", {{"stringValue", contact.address}}},
            {"category", {{"stringValue", contact.category}}},
            {"createdAt", {{"stringValue", contact.createdAt}}},
            {"updatedAt", {{"stringValue", contact.updatedAt}}}
        }}
    };
}

std::vector<Contact> FirestoreService::loadFromLocalStorage() {
    std::vector<Contact> contacts;
    std::ifstream infile(localStorageFilePath);
    if (!infile.is_open()) {
        // Return default seed contacts if file does not exist yet
        contacts = {
            {"contact_001", "Rahul Sharma", "9876543210", "rahul@example.com", "Hyderabad", "Friends", "2026-10-01T10:00:00Z", "2026-10-01T10:00:00Z"},
            {"contact_002", "Preetham Reddy", "9876543211", "preetham@example.com", "Bangalore", "Personal", "2026-10-02T11:30:00Z", "2026-10-02T11:30:00Z"},
            {"contact_003", "Ananya Verma", "9876543212", "ananya@example.com", "Delhi", "College", "2026-10-03T14:15:00Z", "2026-10-03T14:15:00Z"},
            {"contact_004", "Ravi Teja", "9876543213", "ravi@example.com", "Chennai", "Work", "2026-10-04T09:00:00Z", "2026-10-04T09:00:00Z"},
            {"contact_005", "Zoya Khan", "9876543214", "zoya@example.com", "Mumbai", "Family", "2026-10-05T16:45:00Z", "2026-10-05T16:45:00Z"}
        };
        saveToLocalStorage(contacts);
        return contacts;
    }

    try {
        nlohmann::json j;
        infile >> j;
        infile.close();
        if (j.is_array()) {
            for (const auto& item : j) {
                contacts.push_back(Contact::fromJson(item));
            }
        }
    } catch (...) {
        std::cerr << "[FirestoreService] Failed to parse local JSON storage file" << std::endl;
    }
    return contacts;
}

bool FirestoreService::saveToLocalStorage(const std::vector<Contact>& contacts) {
    nlohmann::json arr = nlohmann::json::array();
    for (const auto& c : contacts) {
        arr.push_back(c.toJson());
    }

    // Ensure directory exists using std::filesystem
    try {
        std::filesystem::create_directories("data");
    } catch (...) {}

    std::ofstream outfile(localStorageFilePath);
    if (!outfile.is_open()) return false;

    outfile << arr.dump(4);
    outfile.close();
    return true;
}

bool FirestoreService::createContact(const Contact& contact) {
    if (useLocalStorageFallback) {
        auto contacts = loadFromLocalStorage();
        contacts.push_back(contact);
        return saveToLocalStorage(contacts);
    }

    std::string url = databaseUrl + "/contacts?documentId=" + contact.id;
    nlohmann::json body = contactToFirestoreFields(contact);
    std::string response = httpPost(url, body.dump());
    return !response.empty();
}

std::vector<Contact> FirestoreService::getContacts() {
    if (useLocalStorageFallback) {
        return loadFromLocalStorage();
    }

    std::string url = databaseUrl + "/contacts";
    std::string responseStr = httpGet(url);
    std::vector<Contact> contacts;

    if (responseStr.empty()) {
        // Fallback to local storage if network or API key fails
        return loadFromLocalStorage();
    }

    try {
        nlohmann::json resJson = nlohmann::json::parse(responseStr);
        if (resJson.contains("documents") && resJson["documents"].is_array()) {
            for (const auto& doc : resJson["documents"]) {
                contacts.push_back(firestoreDocToContact(doc));
            }
        }
    } catch (const std::exception& e) {
        std::cerr << "[FirestoreService] JSON parse error: " << e.what() << std::endl;
        return loadFromLocalStorage();
    }

    return contacts;
}

bool FirestoreService::getContactById(const std::string& id, Contact& outContact) {
    if (useLocalStorageFallback) {
        auto contacts = loadFromLocalStorage();
        for (const auto& c : contacts) {
            if (c.id == id) {
                outContact = c;
                return true;
            }
        }
        return false;
    }

    std::string url = databaseUrl + "/contacts/" + id;
    std::string responseStr = httpGet(url);
    if (responseStr.empty()) return false;

    try {
        nlohmann::json doc = nlohmann::json::parse(responseStr);
        if (doc.contains("fields")) {
            outContact = firestoreDocToContact(doc);
            return true;
        }
    } catch (...) {}
    return false;
}

bool FirestoreService::updateContact(const std::string& id, const Contact& contact) {
    if (useLocalStorageFallback) {
        auto contacts = loadFromLocalStorage();
        bool found = false;
        for (auto& c : contacts) {
            if (c.id == id) {
                c = contact;
                c.id = id; // Preserve ID
                found = true;
                break;
            }
        }
        if (found) {
            return saveToLocalStorage(contacts);
        }
        return false;
    }

    std::string url = databaseUrl + "/contacts/" + id;
    nlohmann::json body = contactToFirestoreFields(contact);
    std::string responseStr = httpPatch(url, body.dump());
    return !responseStr.empty();
}

bool FirestoreService::deleteContact(const std::string& id) {
    if (id.empty()) return true;

    if (!useLocalStorageFallback && !databaseUrl.empty()) {
        std::string url = databaseUrl + "/contacts/" + id;
        httpDelete(url);
    }

    // Always clean up local storage file if present
    auto contacts = loadFromLocalStorage();
    auto it = std::remove_if(contacts.begin(), contacts.end(),
                             [&id](const Contact& c) { return c.id == id; });
    if (it != contacts.end()) {
        contacts.erase(it, contacts.end());
        saveToLocalStorage(contacts);
    }

    return true; // Always return true for idempotent delete
}
