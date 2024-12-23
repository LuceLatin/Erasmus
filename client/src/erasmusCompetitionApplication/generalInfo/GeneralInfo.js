import { Button, Container, Form } from "react-bootstrap";
import { useState } from "react";
import {formatDate} from "../../erasmusCompetition/EditErasmusCompetition/EditErasmusCompetition";

export function GeneralInfo({ user, onSubmit }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <Container className="my-3 d-flex justify-content-center align-items-center flex-column">
            <h2 className="mb-4">Podaci o korisniku</h2>
            <Form className="w-50">
                {user.firstName && (
                    <Form.Group controlId="firstName" className="mb-3">
                        <Form.Label>Ime</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.lastName && (
                    <Form.Group controlId="lastName" className="mb-3">
                        <Form.Label>Prezime</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.username && (
                    <Form.Group controlId="username" className="mb-3">
                        <Form.Label>Korisničko ime</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            value={user.username}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.dateOfBirth && (
                    <Form.Group controlId="dateOfBirth" className="mb-3">
                        <Form.Label>Datum rođenja</Form.Label>
                        <Form.Control
                            type="date"
                            name="dateOfBirth"
                            value={formatDate(user.dateOfBirth)}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.OIB && (
                    <Form.Group controlId="OIB" className="mb-3">
                        <Form.Label>OIB</Form.Label>
                        <Form.Control
                            type="number"
                            name="OIB"
                            value={user.OIB}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.address && (
                    <Form.Group controlId="address" className="mb-3">
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={user.address}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.city && (
                    <Form.Group controlId="city" className="mb-3">
                        <Form.Label>Grad</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={user.city}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.country && (
                    <Form.Group controlId="country" className="mb-3">
                        <Form.Label>Država</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={user.country}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.email && (
                    <Form.Group controlId="email" className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            disabled
                        />
                    </Form.Group>
                )}
                {user.role && (
                    <Form.Group controlId="role" className="mb-3">
                        <Form.Label>Uloga</Form.Label>
                        <Form.Control
                            type="text"
                            name="role"
                            value={user.role}
                            disabled
                        />
                    </Form.Group>
                )}
                <Form.Group controlId="correctInfo" className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Uneseni podaci su točni"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                </Form.Group>
                <Button variant="primary" type="button" disabled={!isChecked} onClick={onSubmit}>
                    Dalje
                </Button>
            </Form>
        </Container>
    );
}