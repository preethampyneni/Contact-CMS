#pragma once

#include <unordered_map>
#include <string>
#include <cctype>
#include <functional>

namespace crow
{
    /// Case-insensitive hash function using standard C++17
    struct ci_hash
    {
        size_t operator()(const std::string& key) const
        {
            size_t hash = 0;
            for (char c : key)
            {
                hash = hash * 31 + std::tolower(static_cast<unsigned char>(c));
            }
            return hash;
        }
    };

    /// Case-insensitive equality comparator
    struct ci_key_eq
    {
        bool operator()(const std::string& l, const std::string& r) const
        {
            if (l.length() != r.length()) return false;
            for (size_t i = 0; i < l.length(); ++i)
            {
                if (std::tolower(static_cast<unsigned char>(l[i])) != std::tolower(static_cast<unsigned char>(r[i])))
                    return false;
            }
            return true;
        }
    };

    using ci_map = std::unordered_multimap<std::string, std::string, ci_hash, ci_key_eq>;
} // namespace crow
