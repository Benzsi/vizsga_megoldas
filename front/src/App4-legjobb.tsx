import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";
import { Member } from "./types";




const API_BASE_URL = 'http://localhost:3000/api';

function getImage(type: 'M' | 'F' | null) {
  if(type === "M") return "/male.png"
  if(type === "F") return "/female.png"

  return "/other.png"
}

function BasicExample() {

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/members`)
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error('Hiba a lekéréskor', error));
  }, []);

  return (
    <>
      <header>
            <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">
              <h1>Petrik Könyvklub</h1>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Új tag felvétele</Nav.Link>
                <Nav.Link href="https://petrik.hu/" target="">Petrik honlap</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main>
          <Container>
            <Row>
              {members.map((member) =>(
              <Col key={member.id} xs={12} md={6} lg={4} className="mb-4">
              <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={getImage(member.gender)} />
            <Card.Body>
              <Card.Title><h2>{member.name}</h2></Card.Title>
              <Card.Text>
                <p>Születési dátum: {new Date(member.birth_date).toLocaleDateString("hu-HU")}</p>
                <br></br>
                <p>Csatlakozas: {new Date(member.created_at).toLocaleDateString("hu-HU")}</p>
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
          </Col>
          ) )}
          </Row>
         </Container>
      </main>
      <section>
        <Container>
          <h2>Tagfelvétel</h2>
        <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Név</Form.Label>
        <Form.Control 
          type="text"
          placeholder="Enter email" />
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
        Tagfelvétel
      </Button>
    </Form>
    </Container>
      </section>
      <footer>
        <Container>
          <p>nev</p>
        </Container>
      </footer>
    </>
  )

}

export default BasicExample;