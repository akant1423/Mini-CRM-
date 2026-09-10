import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

function App() {

    if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Your message has been submitted successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Contact Us</h1>

        <p className="subtitle">
          Have a project in mind? Send us a message.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Message</label>
          <textarea
            name="message"
            placeholder="Write your message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>

          <button type="submit">
            Submit Lead
          </button>
        </form>

        {success && <p className="success">{success}</p>}

        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;