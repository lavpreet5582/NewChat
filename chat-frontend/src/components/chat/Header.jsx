// components/layout/Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import './Header.css';

const Header = ({ isLoggedIn, username }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('access');
        const refresh_token = localStorage.getItem('refresh')

        try {
            // Optional: Call backend logout endpoint
            const response = await fetch('http://localhost:8000/accounts/api/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refresh_token }),
            });

            if (response.ok) {
                console.log("Logout successful");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }

        // Clear localStorage and redirect
        localStorage.removeItem('access');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/');
    };
    return (
        <Navbar bg="dark" variant="dark" className="mb-3 shadow-sm py-2">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <Navbar.Brand className="fw-bold fs-4">ChatApp</Navbar.Brand>

                {isLoggedIn && (
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            id="dropdown-avatar"
                            className="p-0 border-0 text-white d-flex align-items-center"
                            style={{ textDecoration: "none" }}
                        >
                            <FaUserCircle size={30} className="me-2" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Header>
                                👋 Hello, <strong>{username || "User"}</strong>
                            </Dropdown.Header>
                            <Dropdown.Item href="#">Profile</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Container>
        </Navbar>
    );
};

export default Header;
