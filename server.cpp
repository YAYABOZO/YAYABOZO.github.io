#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <iostream>
#include <string>
#include <unordered_map>

namespace beast = boost::beast;   
namespace http = beast::http;      
namespace net = boost::asio;        
using tcp = boost::asio::ip::tcp;  

std::unordered_map<std::string, std::string> users;

void handle_request(http::request<http::string_body>& req, tcp::socket& socket) {
    // Simulate account handling
    if (req.method() == http::verb::post) {
        std::string username = req["username"].to_string();
        std::string password = req["password"].to_string();
        users[username] = password;  // Basic storing, no real auth
        http::response<http::string_body> res{ http::status::ok, req.version() };
        res.body() = "User registered";
        res.prepare_payload();
        http::write(socket, res);
    }
}

void do_session(tcp::socket socket) {
    try {
        for(;;) {
            beast::flat_buffer buffer;
            http::request<http::string_body> req;
            http::read(socket, buffer, req);
            handle_request(req, socket);
        }
    } catch(std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}

int main() {
    net::io_context ioc;
    tcp::acceptor acceptor{ioc, {tcp::v4(), 8080}};
    for (;;) {
        tcp::socket socket = acceptor.accept();
        std::thread(do_session, std::move(socket)).detach();
    }
}
