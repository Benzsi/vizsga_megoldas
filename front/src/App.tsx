import { useState, useEffect, useRef } from 'react'
import { Member, CreateMemberDto, ValidationError } from './types'

// Backend API alap URL
const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  // Állapotok (state-ek)
  const [members, setMembers] = useState<Member[]>([]); // Tagok listája
  const [formData, setFormData] = useState<CreateMemberDto>({ // Űrlap adatai
    name: '',
    birth_date: '',
  });
  const [errors, setErrors] = useState<string[]>([]); // Hibaüzenetek
  const [successMessage, setSuccessMessage] = useState(''); // Sikeres művelet üzenete
  const formRef = useRef<HTMLFormElement>(null); // Űrlap referencia (scroll-hoz)

  // Alkalmazás betöltésekor lekéri a tagokat
  useEffect(() => {
    fetchMembers();
  }, []);

  // Tagok lekérése a backend API-ról
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      // Hiba esetén üres marad a lista
    }
  };

  // Új tag felvétele
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Alapértelmezett form submit megakadályozása
    setErrors([]); // Hibák törlése
    setSuccessMessage(''); // Siker üzenet törlése

    try {
      // POST kérés az /api/members végpontra
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Ha a válasz nem OK (validációs hiba)
      if (!response.ok) {
        const errorData: ValidationError = await response.json();
        const errorMessages = Array.isArray(errorData.message) 
          ? errorData.message 
          : [errorData.message || 'Hiba történt'];
        setErrors(errorMessages); // Hibaüzenetek megjelenítése
        return;
      }

      // Sikeres létrehozás
      await fetchMembers(); // Táblázat újratöltése
      setFormData({ name: '', birth_date: '' }); // Űrlap alaphelyzetbe
      formRef.current?.reset(); // Form mező reset
    } catch (error) {
      setErrors(['Hiba történt a tagfelvétel során']);
    }
  };

  // Tagdíj befizetés kezelése
  const handlePayment = async (memberId: number) => {
    setSuccessMessage('');
    setErrors([]);

    try {
      // POST kérés az /api/members/{id}/pay végpontra
      const response = await fetch(`${API_BASE_URL}/members/${memberId}/pay`, {
        method: 'POST',
      });

      // Ha a válasz nem OK (pl. már fizetett ebben a hónapban)
      if (!response.ok) {
        const errorData = await response.json();
        setErrors([errorData.message || 'Hiba történt a befizetés során']);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Görgetés az oldal tetejére
        return;
      }

      // Sikeres befizetés
      setSuccessMessage('Sikeres befizetés!');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Görgetés az oldal tetejére
    } catch (error) {
      setErrors(['Hiba történt a befizetés során']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Nem szerinti kép kiválasztása
  const getGenderImage = (gender: 'M' | 'F' | null) => {
    if (gender === 'M') return '/male.png'; // Férfi
    if (gender === 'F') return '/female.png'; // Nő
    return '/other.png'; // Nincs megadva
  };

  // Dátum formázása magyar formátumra
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU');
  };

  // Görgetés az űrlaphoz
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Fejléc */}
      <header className="bg-dark text-white p-3">
        <div className="container">
          <h1>Petrik Könyvklub</h1>
          {/* Navigációs sáv */}
          <nav>
            <a href="#form" onClick={scrollToForm} className="text-white me-3">Új tag felvétele</a>
            <a href="https://petrik.hu/" target="_blank" className="text-white">Petrik honlap</a>
          </nav>
        </div>
      </header>

      <main className="container my-4">
        {/* Sikeres befizetés üzenet */}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
        {/* Hibaüzenetek megjelenítése */}
        {errors.length > 0 && (
          <div className="alert alert-danger">
            {errors.map((error, index) => <div key={index}>{error}</div>)}
          </div>
        )}

        {/* Tagok listája - reszponzív grid: mobil 1, tablet 2, desktop 3 oszlop */}
        <section className="mb-5">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {members.map((member) => (
              <div key={member.id} className="col">
                <article className="card">
                  <div className="card-body text-center">
                    {/* Nem szerinti kép */}
                    <img src={getGenderImage(member.gender)} alt="Nem" width="60" height="60" className="mb-2" />
                    {/* Tag neve címsorként */}
                    <h2 className="h5">{member.name}</h2>
                    {/* Születési dátum */}
                    <p><strong>Születési dátum:</strong> {formatDate(member.birth_date)}</p>
                    {/* Csatlakozási idő */}
                    <p><strong>Csatlakozás:</strong> {formatDate(member.created_at)}</p>
                    {/* Tagdíj befizetés gomb */}
                    <button className="btn btn-primary w-100" onClick={() => handlePayment(member.id)}>
                      Tagdíj befizetés
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* Tagfelvételi űrlap */}
        <section className="bg-light p-4 rounded" id="form">
          <h2>Tagfelvétel</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="mt-3" style={{maxWidth: '500px'}}>
            {/* Név mező */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Név:</label>
              <input type="text" id="name" className="form-control" required 
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            {/* Nem mező */}
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">Nem:</label>
              <select id="gender" className="form-select" value={formData.gender || ''}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value ? e.target.value as 'M' | 'F' : undefined })}>
                <option value="">Nincs megadva</option>
                <option value="M">Férfi</option>
                <option value="F">Nő</option>
              </select>
            </div>
            {/* Születési dátum mező */}
            <div className="mb-3">
              <label htmlFor="birth_date" className="form-label">Születési dátum:</label>
              <input type="date" id="birth_date" className="form-control" required 
                value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} />
            </div>
            {/* Tagfelvétel gomb */}
            <button type="submit" className="btn btn-success">Tagfelvétel</button>
          </form>
        </section>
      </main>

      {/* Lábléc */}
      <footer className="bg-dark text-white text-center p-3">
        <p className="m-0">Készítette: Simon Benjámin</p>
      </footer>
    </>
  )
}

export default App
