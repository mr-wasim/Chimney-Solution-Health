import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function EditReport() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    clientName: "",
    product: "",
    score: "",
    visits: ""
  });
  const [loading, setLoading] = useState(true);

  // Fetch existing report by ID
  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`/api/admin/reports/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/admin/reports/${id}`, form);
      alert("Report updated successfully!");
      router.push("/report"); // Back to dashboard
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Product</label>
          <input
            type="text"
            name="product"
            value={form.product}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Score</label>
          <input
            type="number"
            name="score"
            value={form.score}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Visits</label>
          <input
            type="number"
            name="visits"
            value={form.visits}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
