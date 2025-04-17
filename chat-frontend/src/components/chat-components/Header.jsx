// components/layout/Header.js
import React from "react";
import { Navbar, Container } from "react-bootstrap";
import './Header.css'

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-3 shadow-sm">
            <Container fluid>
                <Navbar.Brand>💬 ChatApp</Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default Header;
