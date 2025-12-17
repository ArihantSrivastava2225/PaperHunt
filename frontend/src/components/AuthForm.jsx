import { useForm } from "react-hook-form";

const AuthForm = ({ formType, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 w-80 sm:w-96"
    >
      {formType === "signup" && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            className="bg-[#111a3c] border border-cyan-800/40 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
            {...register("fullName", {
              required: "Full name is required",
              minLength: { value: 3, message: "Minimum 3 characters" },
              maxLength: { value: 24, message: "Maximum 24 characters" },
            })}
          />
          {errors.FullName && (
            <p className="text-red-400 text-sm -mt-2">{errors.FullName.message}</p>
          )}
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        className="bg-[#111a3c] border border-cyan-800/40 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email format",
          },
        })}
      />
      {errors.email && <p className="text-red-400 text-sm -mt-2">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Password"
        className="bg-[#111a3c] border border-cyan-800/40 rounded-lg px-4 py-2 text-black focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 7, message: "Minimum 7 characters" },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
            message: "Include uppercase, lowercase, number & special char",
          },
        })}
      />
      {errors.password && (
        <p className="text-red-400 text-sm -mt-2">{errors.password.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isSubmitting ? "Please wait..." : "Submit"}
      </button>
    </form>
  );
};

export default AuthForm;
