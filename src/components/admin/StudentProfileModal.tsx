"use client";

import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

export default function StudentProfileModal({
  student,
  onClose,
}: any) {

  if (!student) return null;

  const [name, setName] =
    useState(student.name || "");

  const [contact, setContact] =
    useState(student.contact || "");

  const [feesPaid, setFeesPaid] =
    useState(student.feesPaid || 0);

  const [totalFees, setTotalFees] =
    useState(student.totalFees || 0);

  const saveStudent = async () => {

    await updateDoc(
      doc(db, "students", student.id),
      {
        name,
        contact,
        feesPaid: Number(feesPaid),
        totalFees: Number(totalFees),
      }
    );

    alert("Student Updated");
  };

  const sendWhatsapp = () => {

    const cleanNumber =
      contact.replace(/\D/g, "");

    const message =
`Hello ${name},

Your Arihant Coaching login details:

Username: ${student.username}
Password: ${student.password}

Please keep it safe.`;

    const url =
      `https://wa.me/91${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (

    <div className="bg-white rounded-3xl p-8 w-full max-w-4xl">

      <div className="bg-white rounded-3xl p-4 md:p-8 w-full max-w-4xl my-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl md:text-4xl font-bold">
            Student Profile
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <p className="font-bold mb-2">Name</p>
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="border p-3 rounded-xl w-full"
            />
          </div>

          <div>
            <p className="font-bold mb-2">Contact</p>
            <input
              value={contact}
              onChange={(e) =>
                setContact(e.target.value)
              }
              className="border p-3 rounded-xl w-full"
            />
          </div>

          <div>
            <p className="font-bold mb-2">Email</p>
            <p className="border p-3 rounded-xl bg-gray-100">
              {student.email}
            </p>
          </div>

          <div>
            <p className="font-bold mb-2">Batch</p>
            <p className="border p-3 rounded-xl bg-gray-100">
              {student.batchName}
            </p>
          </div>

          <div>
            <p className="font-bold mb-2">Username</p>
            <p className="border p-3 rounded-xl bg-green-50 font-bold">
              {student.username}
            </p>
          </div>

          <div>
            <p className="font-bold mb-2">Password</p>
            <p className="border p-3 rounded-xl bg-green-50 font-bold">
              {student.password}
            </p>
          </div>

          <div>
            <p className="font-bold mb-2">Fees Paid</p>
            <input
              type="number"
              value={feesPaid}
              onChange={(e) =>
                setFeesPaid(e.target.value)
              }
              className="border p-3 rounded-xl w-full"
            />
          </div>

          <div>
            <p className="font-bold mb-2">Total Fees</p>
            <input
              type="number"
              value={totalFees}
              onChange={(e) =>
                setTotalFees(e.target.value)
              }
              className="border p-3 rounded-xl w-full"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          <div className="bg-green-50 p-4 rounded-xl">
            <p>Total Present</p>
            <h3 className="text-3xl font-bold">
              {
                Object.values(
                  student.attendanceRecords || {}
                ).filter(
                  (value) => value === "Present"
                ).length
              }
            </h3>
          </div>

          <div className="bg-red-50 p-4 rounded-xl">
            <p>Total Absent</p>
            <h3 className="text-3xl font-bold">
              {
                Object.values(
                  student.attendanceRecords || {}
                ).filter(
                  (value) => value === "Absent"
                ).length
              }
            </h3>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl">
            <p>Attendance %</p>
            <h3 className="text-3xl font-bold">
              {student.attendancePercentage || 0}%
            </h3>
          </div>

        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-8">

          <button
            onClick={saveStudent}
            className="w-full md:w-auto bg-[#5A1E1E] text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>

          <button
            onClick={sendWhatsapp}
            className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            Send Login on WhatsApp
          </button>

          <button
            onClick={onClose}
            className="w-full md:w-auto bg-gray-300 px-6 py-3 rounded-xl"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}