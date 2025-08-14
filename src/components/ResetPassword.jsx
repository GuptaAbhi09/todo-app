import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get session info from URL (supabase token)
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get("access_token");
    if (access_token) {
      setSession(access_token);
    } else {
      toast.error("Invalid or expired reset link.");
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!session) return;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded-md mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
