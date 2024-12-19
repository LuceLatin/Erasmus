import {Container, Nav, Navbar} from "react-bootstrap";

export function Header() {
    return(
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">Skituljak</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/users">Korisnici</Nav.Link>
                        <Nav.Link href="/erasmus-competitions/add">Dodaj natjecaj</Nav.Link>
                        <Nav.Link href="#contact">prazno</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}