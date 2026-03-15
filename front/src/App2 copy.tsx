import { useEffect, useState } from "react"
import { Member } from "./types"
import { Button, Card, Col, Container, Form, Nav, Navbar, Row } from "react-bootstrap";

const API_BASE_URL = "http://localhost:3000/api"

function getImage(type: 'M' | 'F' | null) {
  if(type === "M") return "/male.png"
  if(type === "F") return "/female.png"
  return "/other.png"
}


function BasicExample() {

  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<'M' | 'F' | ''>("");
  const [birthDate, setBirthDate] = useState("");

  const loadMembers = () => {
    fetch(`${API_BASE_URL}/members`)
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error("Hiba a lekéréskor", error))
  };

  useEffect(() => {
    loadMembers();
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const memberData: any = {
      name,
      birth_date: birthDate,
    };

    if (gender) {
      memberData.gender = gender;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        // Sikeres létrehozás
        setName("");
        setGender("");
        setBirthDate("");
        loadMembers(); // Újratöltjük a listát
      }
    } catch (error) {
      console.error("Hiba a létrehozás során", error);
    }
  };

  const handlePayment = async (memberId: number) => {
    try {
      await fetch(`${API_BASE_URL}/members/${memberId}/pay`, {
        method: 'POST',
      });
    } catch (error) {
      console.error("Hiba a befizetés során", error);
    }
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
                <Nav.Link href="#tagfelvetel">Új tag felvétele</Nav.Link>
                <Nav.Link href="https://petrik.hu/" target="_blank">Petrik honlap</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container>
          <Row>
            {members.map((member) => (
              <Col key={member.id} xs={12} md={6} lg={4} className="mb-4">
                  <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={getImage(member.gender)} />
                    <Card.Body>
                      <Card.Title><h2>{member.name}</h2></Card.Title>
                      <Card.Text>
                        <p>Születési Dátum: {new Date(member.birth_date).toLocaleDateString("hu-HU")}</p>
                        <p>Csatlakozási dátum: {new Date(member.created_at).toLocaleDateString("hu-HU")}</p>
                      </Card.Text>
                      <Button 
                        variant="primary" 
                        onClick={() => handlePayment(member.id)}
                      >
                        Tagdíj befizetés
                      </Button>
                    </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
      <section id="tagfelvetel">
        <Container className="my-5">
          <h2 className="mb-4">Tagfelvétel</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Név</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Add meg a nevet" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>Nem</Form.Label>
              <Form.Select 
                value={gender}
                onChange={(e) => setGender(e.target.value as 'M' | 'F' | '')}
              >
                <option value="">Nem megadva</option>
                <option value="M">Férfi</option>
                <option value="F">Nő</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBirthDate">
              <Form.Label>Születési dátum</Form.Label>
              <Form.Control 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Tagfelvétel
            </Button>
          </Form>
        </Container>
      </section>
      <footer className="bg-light py-3 mt-5">
        <Container>
          <p className="text-center mb-0">Simon Benjámin</p>
        </Container>
      </footer>
    
    </>
  )

}

export default BasicExample