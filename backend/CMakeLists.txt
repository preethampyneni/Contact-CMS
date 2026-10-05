cmake_minimum_required(VERSION 3.14)
project(ContactManagementBackend CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Compile flags for standalone ASIO and Boost-free Crow
add_compile_definitions(ASIO_STANDALONE=1 CROW_USE_BOOST=0)

# Include local headers directory
include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# Backend source files
set(SOURCES
    src/main.cpp
    src/ContactService.cpp
    src/FirestoreService.cpp
    src/Utils.cpp
)

add_executable(contact_backend ${SOURCES})

# Windows socket and network libraries for Crow HTTP server
if(WIN32)
    target_link_libraries(contact_backend PRIVATE ws2_32 wsock32 crypt32 normaliz winhttp)
endif()

set_target_properties(contact_backend PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)
