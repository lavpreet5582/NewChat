// components/layout/Footer.js
import React from "react";
import { Container } from "react-bootstrap";
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-2 bg-light border-top shadow-sm">
            <Container className="text-center">
                <small className="text-muted">© {new Date().getFullYear()} ChatApp. All rights reserved.</small>
            </Container>
        </footer>
    );
};

export default Footer;
