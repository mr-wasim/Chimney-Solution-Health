import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("/api/admin/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      await axios.delete(`/api/admin/reports/${id}`);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-gray-600">
        Loading reports...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-gray-600">
        No reports found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Reports Dashboard</h1>
      <table className="w-full border rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Visits</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{r.clientName}</td>
              <td className="px-4 py-2">{r.product}</td>
              <td className="px-4 py-2">{r.score}</td>
              <td className="px-4 py-2">{r.visits}</td>
              <td className="px-4 py-2 space-x-2">
                {/* Edit Page Link Fixed */}
                <Link href={`/report/edit/${r._id}`}>
                  <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteReport(r._id)}
                  className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
