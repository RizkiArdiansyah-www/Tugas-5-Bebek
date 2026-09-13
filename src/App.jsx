import {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const productSchema = z.object({
  title: z.string().min(1, { message: "Nama masakan harus diisi" }),
  asal: z.string().min(1, { message: "Asal masakan harus diisi" }),
  WaktuMasak: z.coerce.number().min(1, { message: "Waktu masak harus diisi" }),
});

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes?limit=9")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.recipes.map((recipe) => ({
          id: recipe.id,
          title: recipe.name,
          asal: recipe.cuisine,
          WaktuMasak: recipe.cookTimeMinutes,
        })));
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data");
        setLoading(false);
      });
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data) => {
    const newTask = {
      id: products.length + 1,
      title: data.title,
      asal: data.asal,
      WaktuMasak: data.WaktuMasak
    };
    setProducts((prev) => [...prev, newTask]);
    reset();
  };

  if (loading) return <p>Memuat data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="page-shell">
      <section className="intro">
        <p className="">MASAKAN</p>
        <h1>Daftar Masakan</h1>
      </section>

      <section className="content-grid">
        <div className="product-panel">
          <ul className="product-list">
            {products.map((p) => (
              <li className="product-item" key={p.id}>
                <div>
                  <span className="product-tag">{p.asal}</span>
                  <span className="product-title">{p.title}</span>
                </div>
                <strong>{p.WaktuMasak} menit</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-panel">
          <h2>Tambah Masakan</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="title">Nama Masakan</label>
            <input id="title" {...register("title")} placeholder="Contoh: Nasi Goreng" />
            {errors.title && <p className="error-message">{errors.title.message}</p>}

            <label htmlFor="asal">Asal Masakan</label>
            <input id="asal" {...register("asal")} placeholder="Contoh: Indonesia" />
            {errors.asal && <p className="error-message">{errors.asal.message}</p>}

            <label htmlFor="WaktuMasak">Waktu Masak (menit)</label>
            <input id="WaktuMasak" {...register("WaktuMasak", { valueAsNumber: true })} type="number" placeholder="Contoh: 30" />
            {errors.WaktuMasak && <p className="error-message">{errors.WaktuMasak.message}</p>}

            <button type="submit">+ Tambah Masakan</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default App;