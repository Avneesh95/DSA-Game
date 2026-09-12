#ifndef DSA_MICRO_JSON_HPP
#define DSA_MICRO_JSON_HPP

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <cctype>
#include <cstdlib>
#include <stdexcept>
#include <cmath>
#include <iomanip>

namespace nlohmann {

class json {
public:
    enum Type { TYPE_NULL, TYPE_BOOL, TYPE_NUMBER, TYPE_STRING, TYPE_ARRAY };
private:
    Type type_;
    bool bool_val_;
    double num_val_;
    std::string str_val_;
    std::vector<json> arr_val_;
public:
    json() : type_(TYPE_NULL), bool_val_(false), num_val_(0.0) {}
    json(std::nullptr_t) : type_(TYPE_NULL), bool_val_(false), num_val_(0.0) {}
    json(bool b) : type_(TYPE_BOOL), bool_val_(b), num_val_(0.0) {}
    json(int n) : type_(TYPE_NUMBER), bool_val_(false), num_val_(n) {}
    json(long long n) : type_(TYPE_NUMBER), bool_val_(false), num_val_(static_cast<double>(n)) {}
    json(double n) : type_(TYPE_NUMBER), bool_val_(false), num_val_(n) {}
    json(float n) : type_(TYPE_NUMBER), bool_val_(false), num_val_(n) {}
    json(char c) : type_(TYPE_STRING), bool_val_(false), num_val_(0.0), str_val_(1, c) {}
    json(const char* s) : type_(TYPE_STRING), bool_val_(false), num_val_(0.0), str_val_(s ? s : "") {}
    json(const std::string& s) : type_(TYPE_STRING), bool_val_(false), num_val_(0.0), str_val_(s) {}

    template <typename T>
    json(const std::vector<T>& vec) : type_(TYPE_ARRAY), bool_val_(false), num_val_(0.0) {
        for (const auto& item : vec) arr_val_.push_back(json(item));
    }

    static json array() {
        json j; j.type_ = TYPE_ARRAY; return j;
    }

    bool is_null() const { return type_ == TYPE_NULL; }
    bool is_boolean() const { return type_ == TYPE_BOOL; }
    bool is_number() const { return type_ == TYPE_NUMBER; }
    bool is_string() const { return type_ == TYPE_STRING; }
    bool is_array() const { return type_ == TYPE_ARRAY; }
    bool empty() const {
        if (type_ == TYPE_ARRAY) return arr_val_.empty();
        if (type_ == TYPE_STRING) return str_val_.empty();
        return type_ == TYPE_NULL;
    }
    size_t size() const { return type_ == TYPE_ARRAY ? arr_val_.size() : 0; }

    void push_back(const json& item) {
        if (type_ != TYPE_ARRAY) type_ = TYPE_ARRAY;
        arr_val_.push_back(item);
    }
    void erase(std::vector<json>::iterator it) {
        if (type_ == TYPE_ARRAY) arr_val_.erase(it);
    }
    const json& back() const {
        if (type_ == TYPE_ARRAY && !arr_val_.empty()) return arr_val_.back();
        static const json null_val;
        return null_val;
    }
    std::vector<json>::iterator end() { return arr_val_.end(); }
    std::vector<json>::const_iterator begin() const { return arr_val_.begin(); }
    std::vector<json>::const_iterator end() const { return arr_val_.end(); }

    const json& operator[](size_t idx) const {
        if (type_ == TYPE_ARRAY && idx < arr_val_.size()) return arr_val_[idx];
        static const json null_val;
        return null_val;
    }
    json& operator[](size_t idx) {
        if (type_ != TYPE_ARRAY) type_ = TYPE_ARRAY;
        if (idx >= arr_val_.size()) arr_val_.resize(idx + 1);
        return arr_val_[idx];
    }

    template <typename T>
    struct Converter {
        static T from(const json& j) { return T(); }
    };

    template <typename T>
    T get() const {
        return Converter<T>::from(*this);
    }

    std::string dump() const {
        switch (type_) {
            case TYPE_NULL: return "null";
            case TYPE_BOOL: return bool_val_ ? "true" : "false";
            case TYPE_NUMBER: {
                if (std::floor(num_val_) == num_val_ && std::abs(num_val_) < 1e15) {
                    return std::to_string(static_cast<long long>(num_val_));
                }
                std::ostringstream ss;
                ss << std::setprecision(10) << num_val_;
                return ss.str();
            }
            case TYPE_STRING: {
                std::string out = "\"";
                for (char c : str_val_) {
                    if (c == '"') out += "\\\"";
                    else if (c == '\\') out += "\\\\";
                    else if (c == '\n') out += "\\n";
                    else if (c == '\t') out += "\\t";
                    else if (c == '\r') out += "\\r";
                    else out += c;
                }
                out += "\"";
                return out;
            }
            case TYPE_ARRAY: {
                std::string out = "[";
                for (size_t i = 0; i < arr_val_.size(); i++) {
                    if (i > 0) out += ",";
                    out += arr_val_[i].dump();
                }
                out += "]";
                return out;
            }
        }
        return "null";
    }

    static json parse(const std::string& s) {
        size_t pos = 0;
        return parseValue(s, pos);
    }
private:
    static void skipWhitespace(const std::string& s, size_t& pos) {
        while (pos < s.size() && (s[pos] == ' ' || s[pos] == '\t' || s[pos] == '\n' || s[pos] == '\r')) pos++;
    }
    static json parseValue(const std::string& s, size_t& pos) {
        skipWhitespace(s, pos);
        if (pos >= s.size()) return json();
        char c = s[pos];
        if (c == 'n' && s.compare(pos, 4, "null") == 0) { pos += 4; return json(); }
        if (c == 't' && s.compare(pos, 4, "true") == 0) { pos += 4; return json(true); }
        if (c == 'f' && s.compare(pos, 5, "false") == 0) { pos += 5; return json(false); }
        if (c == '"' || c == '\'') return json(parseString(s, pos));
        if (c == '[') return parseArray(s, pos);
        if (c == '{') return parseObject(s, pos);
        if (c == '-' || std::isdigit(c)) return parseNumber(s, pos);
        pos++; return json();
    }
    static std::string parseString(const std::string& s, size_t& pos) {
        char quote = s[pos++];
        std::string res;
        while (pos < s.size()) {
            char c = s[pos++];
            if (c == quote) break;
            if (c == '\\' && pos < s.size()) {
                char esc = s[pos++];
                if (esc == 'n') res += '\n';
                else if (esc == 't') res += '\t';
                else if (esc == 'r') res += '\r';
                else if (esc == '\\') res += '\\';
                else if (esc == '"') res += '"';
                else if (esc == '\'') res += '\'';
                else res += esc;
            } else res += c;
        }
        return res;
    }
    static json parseNumber(const std::string& s, size_t& pos) {
        size_t start = pos;
        if (s[pos] == '-') pos++;
        while (pos < s.size() && (std::isdigit(s[pos]) || s[pos] == '.' || s[pos] == 'e' || s[pos] == 'E' || s[pos] == '+')) pos++;
        double val = std::strtod(s.substr(start, pos - start).c_str(), nullptr);
        return json(val);
    }
    static json parseArray(const std::string& s, size_t& pos) {
        pos++;
        json res = json::array();
        while (pos < s.size()) {
            skipWhitespace(s, pos);
            if (pos >= s.size() || s[pos] == ']') { if (pos < s.size()) pos++; break; }
            res.push_back(parseValue(s, pos));
            skipWhitespace(s, pos);
            if (pos < s.size() && s[pos] == ',') pos++;
        }
        return res;
    }
    static json parseObject(const std::string& s, size_t& pos) {
        pos++;
        json res = json::array();
        while (pos < s.size()) {
            skipWhitespace(s, pos);
            if (pos >= s.size() || s[pos] == '}') { if (pos < s.size()) pos++; break; }
            std::string key = parseString(s, pos);
            skipWhitespace(s, pos);
            if (pos < s.size() && s[pos] == ':') pos++;
            json val = parseValue(s, pos);
            res.push_back(val);
            skipWhitespace(s, pos);
            if (pos < s.size() && s[pos] == ',') pos++;
        }
        return res;
    }
};

template <> struct json::Converter<int> { static int from(const json& j) { return static_cast<int>(j.num_val_); } };
template <> struct json::Converter<long long> { static long long from(const json& j) { return static_cast<long long>(j.num_val_); } };
template <> struct json::Converter<double> { static double from(const json& j) { return j.num_val_; } };
template <> struct json::Converter<float> { static float from(const json& j) { return static_cast<float>(j.num_val_); } };
template <> struct json::Converter<bool> { static bool from(const json& j) { return j.bool_val_ || j.num_val_ != 0.0; } };
template <> struct json::Converter<char> { static char from(const json& j) { return j.str_val_.empty() ? '\0' : j.str_val_[0]; } };
template <> struct json::Converter<std::string> { static std::string from(const json& j) { return j.str_val_; } };

template <typename T>
struct json::Converter<std::vector<T>> {
    static std::vector<T> from(const json& j) {
        std::vector<T> out;
        if (j.is_array()) {
            for (const auto& item : j.arr_val_) {
                out.push_back(item.get<T>());
            }
        }
        return out;
    }
};

template <typename T>
struct json::Converter<std::vector<std::vector<T>>> {
    static std::vector<std::vector<T>> from(const json& j) {
        std::vector<std::vector<T>> out;
        if (j.is_array()) {
            for (const auto& item : j.arr_val_) {
                out.push_back(item.get<std::vector<T>>());
            }
        }
        return out;
    }
};

} // namespace nlohmann

#endif
