import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface Member {
  id: number;
  name: string;
  gender: 'M' | 'F' | null;
  birth_date: string;
  banned: boolean;
  created_at: string;
  updated_at: string;
}

function getImage(type: 'M' | 'F' | null) {
  if(type === "M") return "/male.png"
  if(type === "F") return "/female.png"
  
  return "/other.png"
}

function BasicExample() {
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');
  const [birthDate, setBirthDate] = useState('');

  const loadMembers = () => {
    fetch('http://localhost:3000/api/members')
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error('Hiba az adatok lekérésekor:', error));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          gender: gender || null,
          birth_date: birthDate,
        }),
      });

      if (response.ok) {
        setName('');
        setGender('');
        setBirthDate('');
        loadMembers();
      }
    } catch (error) {
      console.error('Hiba történt a tag létrehozása során', error);
    }
  };

  const handlePay = async (memberId: number) => {
    try {
      await fetch(`http://localhost:3000/api/members/${memberId}/pay`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Hiba történt a befizetés során', error);
    }
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('tagfelvetel-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Petrik Könyvklub</h1>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={scrollToForm}>Új tag felvétele</Nav.Link>
                <Nav.Link href="https://petrik.hu/" target="_blank">Petrik honlap</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main>
        <Container className="mt-4">
          <Row>
            {members.map((member) => (
              <Col key={member.id} xs={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={getImage(member.gender)} />
                  <Card.Body>
                    <Card.Title as="h2">{member.name}</Card.Title>
                    <Card.Text>
                      <strong>Születési dátum:</strong> {new Date(member.birth_date).toLocaleDateString('hu-HU')}
                      <br />
                      <strong>Csatlakozás:</strong> {new Date(member.created_at).toLocaleDateString('hu-HU')}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handlePay(member.id)}>
                      Tagdíj befizetés
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <section id="tagfelvetel-form" className="mt-5 mb-5">
            <h2>Tagfelvétel</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Név</Form.Label>
                <Form.Control 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adja meg a tag nevét"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nem</Form.Label>
                <Form.Select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F' | '')}
                >
                  <option value="">Nincs megadva</option>
                  <option value="M">Férfi</option>
                  <option value="F">Nő</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
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
          </section>
        </Container>
      </main>

      <footer className="bg-light py-3 mt-5">
        <Container>
          <p className="text-center mb-0">Készítette: Simon Benjámin</p>
        </Container>
      </footer>
    </>
  );
}

export default BasicExample;