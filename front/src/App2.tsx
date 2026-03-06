import { useState, useEffect, useRef } from "react";
/*
 ÁLTALÁNOS SABLON
 - API hívás
 - lista megjelenítés
 - form
 - művelet gomb
*/
const API_BASE_URL = "http://localhost:3000/api";

function App() {

  // Lista elemek
  const [items, setItems] = useState<any[]>([]); //exported interface schema

  // Űrlap adatok
  const [formData, setFormData] = useState<any>({}); //ami kell az urlaphoz

  // Hibák
  const [errors, setErrors] = useState<string[]>([]); //ez igy jo

  // Siker üzenet
  const [successMessage, setSuccessMessage] = useState(""); //ez igy jo
  const formRef = useRef<HTMLFormElement>(null); //scrollhoz kell 

  // Betöltéskor lekérés
  useEffect(() => {
    fetchItems();
  }, []);

  // API lekérés
  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint`); //backend fo tabla endpoint
      const data = await response.json();
      setItems(data);
    } catch {
      setErrors(["Nem sikerült betölteni az adatokat"]);
    }
  };

  // Új elem létrehozása
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint`, { //backend fo tabla endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        const messages = Array.isArray(errorData.message)
          ? errorData.message
          : [errorData.message];
        setErrors(messages);
        return;
      }
      await fetchItems();
      setFormData({}); //alaphelyzet scheema names name: """,
      formRef.current?.reset();
      setSuccessMessage("Sikeres létrehozás!");
    } catch {
      setErrors(["Hiba történt a mentés során"]);
    }
  };
  // Kártya gomb művelet
  const handleAction = async (id: number) => {
    setErrors([]);
    setSuccessMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/endpoint/${id}/action`, { //backend fo tabla endpoint
        method: "POST"
      });
      if (!response.ok) {
        const errorData = await response.json();
        setErrors([errorData.message || "Hiba történt"]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setSuccessMessage("Sikeres művelet!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors(["Hiba történt"]);
    }
  };

  function getImage(type) { //mi alapjan dol el type helyere

  if(type === "A") return "/imageA.png"
  if(type === "B") return "/imageB.png"

  return "/default.png"

}
  // Görgetés az űrlaphoz
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      {/* HEADER */}
      <header className="p-3">
        <div className="container">
          <h1>Alkalmazás neve</h1>
          <nav>
            <a href="#form" onClick={scrollToForm} className="me-3">
              Új elem
            </a>
            <a href="https://petrik.hu/" target="_blank" className="">
              Petrik honlap
            </a>
          </nav>
        </div>
      </header>
      <main className="container my-4">
        {/* Siker üzenet */}
        {successMessage &&
          <div className="alert alert-success">
            {successMessage}
          </div>
        }
        {/* Hibák */}
        {errors.length > 0 &&
          <div className="alert alert-danger">
            {errors.map((error, index) =>
              <div key={index}>{error}</div>
            )}
          </div>
        }
        {/* LISTA */}
        <section className="mb-5">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
            {items.map((item) => (
              <div key={item.id} className="col">
                <article className="card">
                  <div className="card-body text-center">
                    <img
                      src={getImage(item.type)} 
                      width="80"
                      className="mb-2"
                    />
                    <h2 className="h5">{item.name}</h2>
                    <p>{item.description}</p>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAction(item.id)}
                    >
                      Művelet
                    </button>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
        {/* FORM */}
        <section id="form" className="bg-light p-4 rounded">
          <h2>Új elem</h2>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ maxWidth: "500px" }}
            className="mt-3"
          >
            <div className="mb-3">
              <label className="form-label">Név</label>
              <input
                type="text"
                className="form-control"
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
              />
            </div>
            <button className="btn btn-success">
              Mentés
            </button>
          </form>
        </section>
      </main>
      {/* FOOTER */}
      <footer className="text-center p-3">
        <p className="m-0">
          Készítette: Saját Név
        </p>
      </footer>
    </>
  );
}
export default App;