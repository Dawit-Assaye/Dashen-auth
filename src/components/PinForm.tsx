"use client";

import { useFormik } from "formik";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PinForm() {
  const router = useRouter();

  const pinForm = useFormik({
    initialValues: {
      pin: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://sau.eaglelionsystems.com/v1.0/chatbirrapi/cpsauth/user/login",
          { password: values.pin },
          {
            headers: {
              sourceapp: "dashportal",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
            },
          }
        );
        // Store the token in cookies
        document.cookie = `token=${response.data.token}; path=/; max-age=3600`; // Expires in 1 hour
        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <form onSubmit={pinForm.handleSubmit} className="w-full max-w-sm">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Enter PIN
        </label>
        <input
          type="password"
          name="pin"
          onChange={pinForm.handleChange}
          value={pinForm.values.pin}
          className="w-full border rounded p-2"
          placeholder="Enter PIN"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-900 text-white px-4 py-2 rounded w-full"
      >
        Sign In
      </button>
      <p className="text-right text-sm text-blue-900 mt-2 cursor-pointer">
        Forget PIN?
      </p>
    </form>
  );
}
