import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';

interface Member {
  id: number;
  name: string;
  gender: 'M' | 'F' | null;
  birth_date: string;
  banned: boolean;
  created_at: string;
  updated_at: string;
}

function BasicExample() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Adatok lekérése a backend-ből
    fetch('http://localhost:3000/api/members')
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error('Hiba az adatok lekérésekor:', error));
  }, []);

  return (
    <>
    <header>
      <nav>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        </nav>
        <Container>
        <h1>Petrik</h1>
        </Container>
      </header>
      <main>
      <Container className="mt-4">
        <Row>
          {members.map((member) => (
            <Col key={member.id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title><h2>{member.name}</h2></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {member.gender === 'M' ? 'Férfi' : member.gender === 'F' ? 'Nő' : 'Nincs megadva'}
                  </Card.Subtitle>
                  <Card.Text>
                    Születési dátum: {new Date(member.birth_date).toLocaleDateString('hu-HU')}
                    <br />
                    Státusz: {member.banned ? 'Kitiltva' : 'Aktív'}
                  </Card.Text>
                  <Button variant="primary">Go somewhere</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      </main>
      <Container fluid="md">
        <Row>
          <Col>
            <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    <footer>
      <p>Author: Hege Refsnes</p>
      <p><a href="mailto:hege@example.com">hege@example.com</a></p>
    </footer>
          </Col>
        </Row>
      </Container>
      
    </>
  );
}

export default BasicExample;