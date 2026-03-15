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
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");

  const loadMembers = () => {
    fetch(`${API_BASE_URL}/members`)
     .then(response => response.json())
     .then(data => setMembers(data))
     .catch(error => console.error("hiba", error))
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const handlePayment = async (memberId: number) => {
    setPaymentSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/members/${memberId}/pay`, {
        method: "POST",
      });

      if (!response.ok) {
        return;
      }

      setPaymentSuccessMessage("Sikeres befizetés!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Befizetesi hiba", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`${API_BASE_URL}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        gender: gender || null,
        birth_date: birthDate,
      }),
    });

    setName("");
    setGender("");
    setBirthDate("");
    loadMembers();
  };

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
            {paymentSuccessMessage && (
              <Row className="mb-3">
                <Col>
                  <div className="alert alert-success" role="alert">
                    {paymentSuccessMessage}
                  </div>
                </Col>
              </Row>
            )}
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
              <Button variant="primary" onClick={() => handlePayment(member.id)}>
                Tagdíj befizetés
              </Button>
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
        <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formName">
        <Form.Label>Név</Form.Label>
        <Form.Control 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Név" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGender">
        <Form.Label>Nem</Form.Label>
        <Form.Select
          value={gender}
          onChange={(e) => setGender(e.target.value as "M" | "F" | "")}
        >
          <option value="">Nincs megadva</option>
          <option value="M">Férfi</option>
          <option value="F">Nő</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBirthDate">
        <Form.Label>Születési dátum</Form.Label>
        <Form.Control
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)} />
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