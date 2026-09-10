import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch all leads
  const fetchLeads = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/leads"
      );

      const data = await response.json();

      setLeads(data);
    } catch (error) {
      console.log("Error fetching leads:", error);
    }
  };

  // View lead
  const viewLead = (lead) => {
    setSelectedLead(lead);
  };

  // Load leads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Update lead
  const updateLead = async (id, status, notes) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
            notes: notes,
          }),
        }
      );

      const updatedLead = await response.json();

      setLeads((previousLeads) =>
        previousLeads.map((lead) =>
          lead._id === updatedLead._id
            ? updatedLead
            : lead
        )
      );
    } catch (error) {
      console.log("Error updating lead:", error);
    }
  };

  // Delete lead
  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      setLeads((previousLeads) =>
        previousLeads.filter((lead) => lead._id !== id)
      );

    } catch (error) {
      console.log("Error deleting lead:", error);
    }
  };

    // Export leads as CSV
  const exportLeads = () => {
    if (leads.length === 0) {
      alert("There are no leads to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Message",
      "Status",
      "Notes",
    ];

    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.message,
      lead.status,
      lead.notes || "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "crm-leads.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  // Add new lead
  const addLead = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLead),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create lead");
      }

      const createdLead = await response.json();

      setLeads((previousLeads) => [
        createdLead,
        ...previousLeads,
      ]);

      setNewLead({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setShowAddForm(false);

      alert("Lead added successfully!");

    } catch (error) {
      console.log("Error creating lead:", error);
      alert("Unable to create lead. Please check the server.");
    }
  };

  // Search
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search)
  );

  // Statistics
  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "new"
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === "contacted"
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted"
  ).length;

  const lostLeads = leads.filter(
    (lead) => lead.status === "lost"
  ).length;

  return (
    <div className="dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>
          <h1>CRM Dashboard</h1>

          <p>
            Manage your leads and track your customers.
          </p>
        </div>

        <div className="dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

      </div>


      {/* Statistics */}

      <div className="stats-container">

        <div className="stat-card">
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>

        <div className="stat-card">
          <h3>New Leads</h3>
          <p>{newLeads}</p>
        </div>

        <div className="stat-card">
          <h3>Contacted</h3>
          <p>{contactedLeads}</p>
        </div>

        <div className="stat-card">
          <h3>Converted</h3>
          <p>{convertedLeads}</p>
        </div>

        <div className="stat-card">
          <h3>Lost</h3>
          <p>{lostLeads}</p>
        </div>

      </div>


      {/* Leads Section */}

      <div className="leads-section">

        <div className="leads-header">

          <h2>All Leads</h2>

          <div className="header-buttons">

            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="add-lead-button"
            >
                + Add New Lead
            </button>

            <button onClick={exportLeads}>
                Export CSV
            </button>

            <button onClick={fetchLeads}>
                Refresh Leads
            </button>

          </div>

        </div>


        {/* Add Lead Form */}

        {showAddForm && (
          <form
            className="add-lead-form"
            onSubmit={addLead}
          >

            <h2>Add New Lead</h2>

            <input
              type="text"
              placeholder="Name"
              value={newLead.name}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  name: e.target.value,
                })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={newLead.email}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={newLead.phone}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  phone: e.target.value,
                })
              }
              required
            />

            <textarea
              placeholder="Message"
              value={newLead.message}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  message: e.target.value,
                })
              }
              required
            />

            <div className="form-buttons">

              <button type="submit">
                Add Lead
              </button>

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>
        )}


        {/* Search */}

        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="search-box"
        />


        {/* Table */}

        {leads.length === 0 ? (

          <p>No leads found.</p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredLeads.map((lead) => (

                  <tr key={lead._id}>

                    <td>{lead.name}</td>

                    <td>{lead.email}</td>

                    <td>{lead.phone}</td>

                    <td>{lead.message}</td>

                    <td>

                      <select
                        value={lead.status}
                        onChange={(e) =>
                          updateLead(
                            lead._id,
                            e.target.value,
                            lead.notes
                          )
                        }
                        className={`status-select ${lead.status}`}
                      >

                        <option value="new">
                          New
                        </option>

                        <option value="contacted">
                          Contacted
                        </option>

                        <option value="converted">
                          Converted
                        </option>

                        <option value="lost">
                          Lost
                        </option>

                      </select>

                    </td>

                    <td>

                      <textarea
                        value={lead.notes || ""}
                        placeholder="Add note..."
                        onChange={(e) => {

                          const updatedNotes =
                            e.target.value;

                          setLeads(
                            (previousLeads) =>
                              previousLeads.map(
                                (item) =>
                                  item._id === lead._id
                                    ? {
                                        ...item,
                                        notes:
                                          updatedNotes,
                                      }
                                    : item
                              )
                          );

                        }}
                      />

                    </td>

                    <td>

                      <button
                        onClick={() =>
                          viewLead(lead)
                        }
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          updateLead(
                            lead._id,
                            lead.status,
                            lead.notes
                          )
                        }
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          deleteLead(lead._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* Lead Details Popup */}

      {selectedLead && (

        <div className="modal-overlay">

          <div className="lead-modal">

            <h2>Lead Details</h2>

            <p>
              <strong>Name:</strong>{" "}
              {selectedLead.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedLead.email}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedLead.phone}
            </p>

            <p>
              <strong>Message:</strong>{" "}
              {selectedLead.message}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedLead.status}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {selectedLead.notes || "No notes"}
            </p>

            <button
              onClick={() =>
                setSelectedLead(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

         <div className="dashboard-footer">
        <p>Mini CRM • Lead Management System</p>
      </div>

    </div>
  );
}

export default AdminDashboard;