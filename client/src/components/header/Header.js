import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import {useGetCurrentUser} from "../../hooks/useGetCurrentUser";

export function Header() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["access-token"]);
    const { user } = useGetCurrentUser();

    const handleLogout = async () => {
        await removeCookie("access-token", {path: "/"});
        navigate("/");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Skituljak</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        
                        {user && (
                            <>
                                <NavDropdown title="Korisnici" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/users">Svi korisnici</NavDropdown.Item>

                                    <NavDropdown.Item href="/users/add">Dodaj korisnika</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Natječaji" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/erasmus-competitions/">Dostupni natječaji</NavDropdown.Item>
                                    {user.role !== "koordinator" && <NavDropdown.Item href="/erasmus-competitions/add">Dodaj natječaj</NavDropdown.Item>}
                                    <NavDropdown.Item href="/erasmus-competitions/past">Prošli natječaji</NavDropdown.Item>
                                    
                                </NavDropdown>
                                <NavDropdown title="Prijave" id="basic-nav-dropdown">
                                    {user.role === 'koordinator' ? (
        <>
            <NavDropdown.Item href="/active-applications/">Aktivne prijave</NavDropdown.Item>
            <NavDropdown.Item href="/past-applications/">Prošle prijave</NavDropdown.Item>
        </>
    ) : (
                                        <NavDropdown.Item href="/past-applications/">Moje prošle prijave</NavDropdown.Item>
                                    )}
                                    {user.role !== "koordinator" && <NavDropdown.Item href="/my-applications">Moje aktivne prijave</NavDropdown.Item>
                                    }
                                </NavDropdown>
                                <NavDropdown title="Institucije" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/institutions/">Sve institucije</NavDropdown.Item>
                                    <NavDropdown.Item href="/institutions/add">Dodaj instituciju</NavDropdown.Item>
                                    <NavDropdown.Item href="/categories/">Sve kategorije</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                    <Nav className="ms-auto">
                        {user ? (
                                <NavDropdown title={`${user.firstName} ${user.lastName}`} id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/me" style={{ cursor: "pointer" }}>
                                        Moj profil
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout} style={{ cursor: "pointer" }}>
                                        Odjavi se
                                    </NavDropdown.Item>
                                </NavDropdown>
                        ) : (
                            <Nav.Link href="/login">Prijavi se</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
