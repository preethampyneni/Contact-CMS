#include <cassert>
#define ASIO_STANDALONE
#define CROW_USE_BOOST 0

#include "crow.h"

#ifdef DELETE
#undef DELETE
#endif

#include "ContactService.h"
#include "FirestoreService.h"
#include "Utils.h"
#include <iostream>
#include <memory>
#include <cstdlib>

// Utility function to attach CORS headers to Crow responses
void addCorsHeaders(crow::response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

int main() {
    crow::SimpleApp app;

    // Initialize Services
    auto firestoreService = std::make_shared<FirestoreService>();
    ContactService contactService(firestoreService);

    int port = 8080;
    const char* envPort = std::getenv("PORT");
    if (envPort) {
        port = std::atoi(envPort);
    }

    std::cout << "==================================================" << std::endl;
    std::cout << "  CONTACT CMS C++ REST API                        " << std::endl;
    std::cout << "==================================================" << std::endl;
    std::cout << "Server starting on port: " << port << std::endl;

    // --------------------------------------------------
    // OPTIONS HANDLER (CORS Preflight)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/<path>").methods(crow::HTTPMethod::OPTIONS)
    ([](const crow::request& req, std::string path) {
        crow::response res;
        addCorsHeaders(res);
        res.code = 200;
        return res;
    });

    // --------------------------------------------------
    // 1. HEALTH CHECK ENDPOINT
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/health").methods(crow::HTTPMethod::GET)
    ([](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        nlohmann::json responseJson = {
            {"success", true},
            {"message", "Contact Management API is running"},
            {"timestamp", Utils::getCurrentIsoTimestamp()}
        };
        res.code = 200;
        res.set_header("Content-Type", "application/json");
        res.write(responseJson.dump(4));
        return res;
    });

    // --------------------------------------------------
    // 2. GET ALL CONTACTS ENDPOINT
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts").methods(crow::HTTPMethod::GET)
    ([&contactService](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");
        try {
            std::vector<Contact> contacts = contactService.getAllContacts();
            nlohmann::json contactArr = nlohmann::json::array();
            for (const auto& c : contacts) {
                contactArr.push_back(c.toJson());
            }

            nlohmann::json responseJson = {
                {"success", true},
                {"count", contacts.size()},
                {"contacts", contactArr}
            };
            res.code = 200;
            res.write(responseJson.dump(4));
        } catch (const std::exception& e) {
            res.code = 500;
            nlohmann::json errJson = {
                {"success", false},
                {"message", std::string("Internal server error: ") + e.what()}
            };
            res.write(errJson.dump());
        }
        return res;
    });

    // --------------------------------------------------
    // 3. SEARCH BY NAME ENDPOINT (GET /api/contacts/search/name?name=...)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/search/name").methods(crow::HTTPMethod::GET)
    ([&contactService](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");
        std::string query = req.url_params.get("name") ? req.url_params.get("name") : "";
        
        std::vector<Contact> matchingContacts = contactService.searchByName(query);
        nlohmann::json contactArr = nlohmann::json::array();
        for (const auto& c : matchingContacts) {
            contactArr.push_back(c.toJson());
        }

        nlohmann::json responseJson = {
            {"success", true},
            {"query", query},
            {"count", matchingContacts.size()},
            {"contacts", contactArr}
        };
        res.code = 200;
        res.write(responseJson.dump(4));
        return res;
    });

    // --------------------------------------------------
    // 4. SEARCH BY PHONE ENDPOINT (GET /api/contacts/search/phone?phone=...)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/search/phone").methods(crow::HTTPMethod::GET)
    ([&contactService](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");
        std::string query = req.url_params.get("phone") ? req.url_params.get("phone") : "";

        std::vector<Contact> matchingContacts = contactService.searchByPhone(query);
        nlohmann::json contactArr = nlohmann::json::array();
        for (const auto& c : matchingContacts) {
            contactArr.push_back(c.toJson());
        }

        nlohmann::json responseJson = {
            {"success", true},
            {"query", query},
            {"count", matchingContacts.size()},
            {"contacts", contactArr}
        };
        res.code = 200;
        res.write(responseJson.dump(4));
        return res;
    });

    // --------------------------------------------------
    // 5. SORT BY NAME ENDPOINT (GET /api/contacts/sort/name)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/sort/name").methods(crow::HTTPMethod::GET)
    ([&contactService](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");
        std::vector<Contact> contacts = contactService.getAllContacts();
        contactService.sortContactsAlphabetically(contacts);

        nlohmann::json contactArr = nlohmann::json::array();
        for (const auto& c : contacts) {
            contactArr.push_back(c.toJson());
        }

        nlohmann::json responseJson = {
            {"success", true},
            {"count", contacts.size()},
            {"contacts", contactArr}
        };
        res.code = 200;
        res.write(responseJson.dump(4));
        return res;
    });

    // --------------------------------------------------
    // 6. GET SINGLE CONTACT ENDPOINT (GET /api/contacts/:id)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/<string>").methods(crow::HTTPMethod::GET)
    ([&contactService](const crow::request& req, std::string id) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");
        Contact c;
        if (contactService.getContactById(id, c)) {
            nlohmann::json responseJson = {
                {"success", true},
                {"contact", c.toJson()}
            };
            res.code = 200;
            res.write(responseJson.dump(4));
        } else {
            res.code = 404;
            nlohmann::json errJson = {
                {"success", false},
                {"message", "Contact not found"}
            };
            res.write(errJson.dump(4));
        }
        return res;
    });

    // --------------------------------------------------
    // 7. ADD CONTACT ENDPOINT (POST /api/contacts)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts").methods(crow::HTTPMethod::POST)
    ([&contactService](const crow::request& req) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");

        nlohmann::json body;
        try {
            body = nlohmann::json::parse(req.body);
        } catch (...) {
            res.code = 400;
            nlohmann::json errJson = {
                {"success", false},
                {"message", "Malformed JSON payload"}
            };
            res.write(errJson.dump(4));
            return res;
        }

        Contact newContact = Contact::fromJson(body);
        std::string errorMessage;
        Contact createdContact;

        if (contactService.addContact(newContact, errorMessage, createdContact)) {
            res.code = 201; // Created
            nlohmann::json responseJson = {
                {"success", true},
                {"message", "Contact added successfully"},
                {"contact", createdContact.toJson()}
            };
            res.write(responseJson.dump(4));
        } else {
            if (errorMessage.find("already exists") != std::string::npos) {
                res.code = 409; // Conflict
            } else {
                res.code = 400; // Bad Request
            }
            nlohmann::json errJson = {
                {"success", false},
                {"message", errorMessage}
            };
            res.write(errJson.dump(4));
        }
        return res;
    });

    // --------------------------------------------------
    // 8. UPDATE CONTACT ENDPOINT (PUT /api/contacts/:id)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/<string>").methods(crow::HTTPMethod::PUT)
    ([&contactService](const crow::request& req, std::string id) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");

        nlohmann::json body;
        try {
            body = nlohmann::json::parse(req.body);
        } catch (...) {
            res.code = 400;
            nlohmann::json errJson = {
                {"success", false},
                {"message", "Malformed JSON payload"}
            };
            res.write(errJson.dump(4));
            return res;
        }

        Contact updatedInfo = Contact::fromJson(body);
        std::string errorMessage;

        if (contactService.updateContact(id, updatedInfo, errorMessage)) {
            Contact refreshedContact;
            contactService.getContactById(id, refreshedContact);
            res.code = 200;
            nlohmann::json responseJson = {
                {"success", true},
                {"message", "Contact updated successfully"},
                {"contact", refreshedContact.toJson()}
            };
            res.write(responseJson.dump(4));
        } else {
            if (errorMessage.find("not found") != std::string::npos) {
                res.code = 404;
            } else if (errorMessage.find("already exists") != std::string::npos) {
                res.code = 409;
            } else {
                res.code = 400;
            }
            nlohmann::json errJson = {
                {"success", false},
                {"message", errorMessage}
            };
            res.write(errJson.dump(4));
        }
        return res;
    });

    // --------------------------------------------------
    // 9. DELETE CONTACT ENDPOINT (DELETE /api/contacts/:id)
    // --------------------------------------------------
    CROW_ROUTE(app, "/api/contacts/<string>").methods(crow::HTTPMethod::DELETE)
    ([&contactService](const crow::request& req, std::string id) {
        crow::response res;
        addCorsHeaders(res);
        res.set_header("Content-Type", "application/json");

        if (contactService.deleteContact(id)) {
            res.code = 200;
            nlohmann::json responseJson = {
                {"success", true},
                {"message", "Contact deleted successfully"}
            };
            res.write(responseJson.dump(4));
        } else {
            res.code = 404;
            nlohmann::json errJson = {
                {"success", false},
                {"message", "Contact not found with ID: " + id}
            };
            res.write(errJson.dump(4));
        }
        return res;
    });

    app.port(port).multithreaded().run();
    return 0;
}
