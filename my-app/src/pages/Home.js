import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Categories from "../components/Categories";
import LatestJobs from "../components/LatestJobs";
import TopFreelancers from "../components/TopFreelancers";
import NigerianCities from "../components/NigerianCities";
import { Footer } from "../components/Footer";
import { fetchUsers, registerUser, initializePayment } from "../api/api";

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "freelancer",
  });
  const [paymentAmount, setPaymentAmount] = useState(1000); // default amount
  const [message, setMessage] = useState("");

  // Fetch users on load
  useEffect(() => {
    fetchUsers()
      .then((res) => {
        console.log("API response:", res.data);
        setUsers(res.data.data || []); // safe check if backend returns data
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle registration form input
  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(newUser);
      setMessage("User registered successfully!");
      console.log(res.data);
      setUsers((prev) => [...prev, res.data.data]); // update local users list
      setNewUser({ full_name: "", email: "", password: "", role: "freelancer" });
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Check console.");
    }
  };

  const handlePayment = async () => {
    try {
      const res = await initializePayment({
        email: users[0]?.email || "test@example.com",
        amount: paymentAmount,
        user_id: users[0]?.id || 1,
      });
      console.log("Payment initialized:", res.data);
      alert("Payment initialized! Check console for details.");
    } catch (err) {
      console.error(err);
      alert("Payment failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <Categories />
      <LatestJobs />
      <TopFreelancers />
      <NigerianCities />

      {/* -------- Backend Test Section -------- */}
      <div className="p-6 bg-gray-100 mt-8">
        <h2 className="text-xl font-bold mb-4">All Users:</h2>
        {users.length === 0 ? (
          <p>No users found yet.</p>
        ) : (
          <ul>
            {users.map((user) =>
              user ? (
                <li key={user.id}>
                  {user.full_name} ({user.role})
                </li>
              ) : null
            )}
          </ul>
        )}

        <h2 className="text-xl font-bold mt-6 mb-2">Register New User:</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-2 max-w-sm">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={newUser.full_name}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Register
          </button>
        </form>
        {message && <p className="mt-2">{message}</p>}

        <h2 className="text-xl font-bold mt-6 mb-2">Test Payment:</h2>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handlePayment}
            className="p-2 bg-green-500 text-white rounded"
          >
            Pay {paymentAmount}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
