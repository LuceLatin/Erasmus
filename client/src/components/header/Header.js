import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

export function Header() {
    const [cookies] = useCookies(["access-token"]);
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            const response = await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            navigate("/");

        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Skituljak</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        
                        {cookies["access-token"] && (
                            <>
                                <Nav.Link href="/users">Korisnici</Nav.Link>
                                <Nav.Link href="/erasmus-competitions/add">Dodaj natječaj</Nav.Link>
                                
                                <NavDropdown title="Natječaji" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/erasmus-competitions/list">Svi natječaji</NavDropdown.Item>
                                    
                                    <NavDropdown.Item href="/erasmus-competitions/past">Prošli natječaji</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {cookies["access-token"] ? (
                            <Nav.Link onClick={handleLogout} style={{ cursor: "pointer" }}>
                                Odjavi se
                            </Nav.Link>
                        ) : (
                            <Nav.Link href="/login">Prijavi se</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
