import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import React Router components

// Import your components
import UserList from './Users/UserList'; // Adjust the path if necessary
import Homepage from './Homepage';
import AddUser from './Users/AddUser';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column site-container">
        
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Skituljak</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/userlist">Korisnici</Nav.Link>
                <Nav.Link href="#services">prazno</Nav.Link>
                <Nav.Link href="#contact">prazno</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        
        <div>
          <Container>
            <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/userlist/adduser" element={<AddUser />} />
              <Route path="/..." element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
            </Routes>
          </Container>
        </div>

        
        <footer className="bg-dark text-light py-3 mt-auto">
          <Container className="text-center">
            <p className="mb-0">&copy; 2024 Skituljak. Sva prava pridržana.</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
