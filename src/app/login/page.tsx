"use client";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
  db,
} from "@/firebase/firebaseConfig";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [showPassword, setShowPassword] =
  useState(false);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOGIN USER
  // =========================

  const loginUser = async () => {

    try {

      setLoading(true);

      let firebaseEmail = "";

      // =========================
      // ADMIN LOGIN
      // =========================

      if (
        username.toLowerCase() ===
        "admin@arihant.com"
      ) {

        firebaseEmail =
          "admin@arihant.com";
      }

      // =========================
      // CHECK STUDENTS
      // =========================

      if (!firebaseEmail) {

        const studentSnapshot =
          await getDocs(
            collection(
              db,
              "students"
            )
          );

        studentSnapshot.forEach(
          (doc) => {

            const data =
              doc.data();

            if (
              data.username?.toLowerCase() ===
              username.toLowerCase()
            ) {

              firebaseEmail =
                data.email;
            }
          }
        );
      }

      // =========================
      // CHECK FACULTY
      // =========================

      if (!firebaseEmail) {

        const facultySnapshot =
          await getDocs(
            collection(
              db,
              "faculty"
            )
          );

        facultySnapshot.forEach(
          (doc) => {

            const data =
              doc.data();

            if (
              data.username?.toLowerCase() ===
              username.toLowerCase()
            ) {

              firebaseEmail =
                data.email;
            }
          }
        );
      }

      if (!firebaseEmail) {

        alert(
          "Username not found"
        );

        setLoading(false);

        return;
      }

      // =========================
      // FIREBASE LOGIN
      // =========================

      await signInWithEmailAndPassword(
        auth,
        firebaseEmail,
        password
      );

      // =========================
      // REDIRECT
      // =========================

      if (
        username.toLowerCase() ===
        "admin@arihant.com"
      ) {

        router.push("/admin");

        return;
      }

      const facultySnapshot =
        await getDocs(
          collection(
            db,
            "faculty"
          )
        );

      let facultyFound =
        false;

      facultySnapshot.forEach(
        (doc) => {

          const data =
            doc.data();

          if (
            data.username?.toLowerCase() ===
            username.toLowerCase()
          ) {

            facultyFound =
              true;
          }
        }
      );

      if (facultyFound) {

        router.push(
          "/faculty"
        );

        return;
      }

      router.push(
        "/student"
      );

    } catch (error: any) {

      console.log(error);

      alert(
        error.message
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <main className="min-h-screen bg-[#F8F4EF] flex items-center justify-center p-6">

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-2xl md:text-4x1 font-bold text-center text-[#5A1E1E] mb-3">
          Arihant Coaching
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to continue
        </p>

        <div className="space-y-4">

          {/* USERNAME */}

          <input
            type="text"
            placeholder="Username"
            className="w-full border p-4 rounded-xl outline-none focus:border-[#5A1E1E]"
            value={username}
            onChange={(e)=>
              setUsername(
                e.target.value
              )
            }
          />

          {/* PASSWORD */}

          <div className="relative">

  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    className="w-full border p-4 rounded-xl outline-none focus:border-[#5A1E1E] pr-14"
    value={password}
    onChange={(e) =>
      setPassword(
        e.target.value
      )
    }
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(
        !showPassword
      )
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >

    {showPassword
      ? "🙈"
      : "👁️"}

  </button>

</div>

          <button
            onClick={loginUser}
            disabled={loading}
            className="w-full bg-[#5A1E1E] text-white py-3 md:py-4 rounded-xl text-base md:text-lg"
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

        </div>

      </div>

    </main>
  );
}