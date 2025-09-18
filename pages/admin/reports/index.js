import { useState, useEffect } from "react";
import axios from "axios";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null); // for modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get("/api/admin/reports");
    setReports(res.data);
  };

  const handleEditClick = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/admin/reports/${selectedReport._id}`, selectedReport);
      setShowModal(false);
      fetchReports(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reports</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Client</th>
            <th>Product</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td>{r.clientName}</td>
              <td>{r.product}</td>
              <td>{r.initialScore}</td>
              <td>
                <button
                  className="px-3 py-1 bg-blue-200 rounded mr-2"
                  onClick={() => handleEditClick(r)}
                >
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-200 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Edit Report</h2>

            <input
              type="text"
              value={selectedReport.clientName}
              onChange={(e) =>
                setSelectedReport({ ...selectedReport, clientName: e.target.value })
              }
              className="w-full border mb-2 p-2"
            />

            <input
              type="text"
              value={selectedReport.product}
              onChange={(e) =>
                setSelectedReport({ ...selectedReport, product: e.target.value })
              }
              className="w-full border mb-2 p-2"
            />

            <input
              type="number"
              value={selectedReport.initialScore}
              onChange={(e) =>
                setSelectedReport({ ...selectedReport, initialScore: e.target.value })
              }
              className="w-full border mb-2 p-2"
            />

            <textarea
              value={selectedReport.notes || ""}
              onChange={(e) =>
                setSelectedReport({ ...selectedReport, notes: e.target.value })
              }
              className="w-full border mb-2 p-2"
              placeholder="Notes"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
