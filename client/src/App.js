import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import UserList from './Users/UserList';
import Homepage from './Homepage';
import AddUser from './Users/AddUser';
import AddErasmusCompetition from "./erasmusCompetition/AddErasmusCompetition/AddErasmusCompetition";
import CompetitionsList from "./erasmusCompetition/CompetitionsList/CompetitionsList";
import EditErasmusCompetition from "./erasmusCompetition/EditErasmusCompetition/EditErasmusCompetition"
import PastCompetitions from "./erasmusCompetition/PastCompetitions/PastCompetitions"
import CompetitionDetails from './CompetitionDetails/CompetitionDetails';
import {Header} from "./components/header/Header";
import {Footer} from "./components/footer/Footer";
import Login from './Authentication/login';
import {UserProfile} from "./userProfile/userProfile";
import {useGetCurrentUser} from "./hooks/useGetCurrentUser";
import {AuthenticatedRoute} from "./components/authenticatedRoute/authenticatedRoute";
import {ErasmusCompetitionApplication} from "./erasmusCompetitionApplication/erasmusCompetitionApplication";

function App() {
    const { user, loading } = useGetCurrentUser();

    if (loading) {
        return <div>Loading...</div>;
    }
  return (
      <div className="App d-flex flex-column site-container">
        <Header />
        <div>
          <Container>
            <Routes>
            <Route path="/" element={<Homepage />} />
            <Route element={<AuthenticatedRoute user={user} />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/add" element={<AddUser />} />
                <Route path="/erasmus-competitions/add" element={<AddErasmusCompetition />} />
                <Route path="erasmus-competitions/" element={<CompetitionsList/>} />
                <Route path="/competitions/edit/:id" element={<EditErasmusCompetition />} />
                <Route path="/erasmus-competitions/past" element={<PastCompetitions />} />
                <Route path="/erasmus-competitions/:id" element={<CompetitionDetails />} />
                <Route path="/erasmus-competitions/:id/apply" element={<ErasmusCompetitionApplication />} />
                <Route path="/me" element={ <UserProfile user={user}/> } />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/..." element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
            </Routes>
          </Container>
        </div>
        <Footer />
      </div>
  );
}

export default App;
