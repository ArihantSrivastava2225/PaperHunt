import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";

const SignIn = () => {
  const [formType, setFormType] = useState("signin");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangeFormType = () => {
    setFormType((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  const handleAuthSubmit = async (data) => {
    const url =
      formType === "signup"
        ? "/api/auth/signup"
        : "/api/auth/signin";

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      console.log(result);
      alert(result.message);
      if (result.success) {
        dispatch(setCredentials(result.user));
        navigate("/discover", { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Left illustration section */}


      {/* Right form section */}
      <section className="flex flex-1 justify-center items-center">
        <div className="bg-[#0e153a]/70 backdrop-blur-lg border border-cyan-900/50 rounded-2xl p-10 shadow-lg shadow-cyan-800/20 flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-semibold tracking-wide text-cyan-300">
            {formType === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <AuthForm formType={formType} onSubmit={handleAuthSubmit} />
          <p className="text-gray-400 text-sm">
            {formType === "signin" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={handleChangeFormType}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={handleChangeFormType}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
