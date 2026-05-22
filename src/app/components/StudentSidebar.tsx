"use client";

import Link from "next/link";

import {
  FaHome,
  FaClipboardCheck,
  FaBook,
  FaFileAlt,
  FaMoneyBill,
  FaCalendarAlt,
  FaPen,
  FaSignOutAlt,
} from "react-icons/fa";

export default function StudentSidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#5A1E1E] text-white p-6 hidden md:block">

      {/* Logo/Title */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold">
          Arihant
        </h1>

        <p className="text-sm text-gray-300 mt-1">
          Coaching Classes
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

        <Link
          href="/student"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaHome />
          Dashboard
        </Link>

        <Link
          href="/student/attendance"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaClipboardCheck />
          Attendance
        </Link>

        <Link
          href="/student/results"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaBook />
          Results
        </Link>

        <Link
          href="/student/homework"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaPen />
          Homework
        </Link>

        <Link
          href="/student/materials"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaFileAlt />
          Study Materials
        </Link>

        <Link
          href="/student/fees"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaMoneyBill />
          Fees
        </Link>

        <Link
          href="/student/timetable"
          className="flex items-center gap-3 hover:bg-[#D88B2B] px-4 py-3 rounded-xl transition"
        >
          <FaCalendarAlt />
          Timetable
        </Link>

        <button className="flex items-center gap-3 mt-10 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl transition">
          <FaSignOutAlt />
          Logout
        </button>

      </nav>
    </aside>
  );
}