"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";

export default function StudentProfileModal({
  student,
  onClose,
}: any) {

  // -------------------------
  // STATE
  // -------------------------

  const [name, setName] =
    useState("");

  const [contact, setContact] =
    useState("");

  const [feesPaid, setFeesPaid] =
    useState(0);

  const [totalFees, setTotalFees] =
    useState(0);

  const [results, setResults] =
    useState<any[]>([]);

  // -------------------------
  // LOAD STUDENT INTO FORM
  // Runs when modal student changes
  // -------------------------

  useEffect(() => {

    if (!student) return;

    setName(
      student.name || ""
    );

    setContact(
      student.contact || ""
    );

    setFeesPaid(
      student.feesPaid || 0
    );

    setTotalFees(
      student.totalFees || 0
    );

  }, [student]);

  // -------------------------
  // LOAD RESULTS
  // -------------------------

  useEffect(() => {

    if (!student?.id) return;

    const loadResults =
      async () => {

        try {

          const resultQuery =
            query(
              collection(
                db,
                "results"
              ),
              where(
                "studentId",
                "==",
                student.id
              )
            );

          const snapshot =
            await getDocs(
              resultQuery
            );

          const resultData:
            any[] = [];

          snapshot.forEach(
            (docItem) => {

              resultData.push({
                id:
                  docItem.id,

                ...docItem.data(),
              });

            }
          );

          setResults(
            resultData
          );

        } catch (
          error
        ) {

          console.log(
            error
          );

        }
      };

    loadResults();

  }, [student?.id]);

  // -------------------------
  // SAFE RETURN
  // AFTER ALL HOOKS
  // -------------------------

  if (!student)
    return null;

  // -------------------------
  // SAVE
  // -------------------------

  const saveStudent =
    async () => {

      try {

        await updateDoc(
          doc(
            db,
            "students",
            student.id
          ),
          {
            name,

            contact,

            feesPaid:
              Number(
                feesPaid
              ),

            totalFees:
              Number(
                totalFees
              ),
          }
        );

        alert(
          "Student Updated Successfully"
        );

      } catch (
        error
      ) {

        console.log(
          error
        );

      }
    };

  // -------------------------
  // ATTENDANCE
  // -------------------------

  const records =
    student.attendanceRecords ||
    {};

  const totalDays =
    Object.keys(
      records
    ).length;

  const totalPresent =
    Object.values(
      records
    ).filter(
      (value) =>
        value ===
        "Present"
    ).length;

  const totalAbsent =
    Object.values(
      records
    ).filter(
      (value) =>
        value ===
        "Absent"
    ).length;

  const attendancePercentage =
    totalDays > 0
      ? Math.round(
          (totalPresent /
            totalDays) *
            100
        )
      : 0;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">

      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl">

        {/* HEADER */}

        <div className="flex justify-between mb-8">

          <h2 className="text-4xl font-bold">
            Student Profile
          </h2>

          <button
            onClick={
              onClose
            }
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        {/* BASIC DETAILS */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <p className="font-bold">
              Name
            </p>

            <input
              value={name}
              onChange={(e)=>
                setName(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl w-full"
            />

          </div>

          <div>

            <p className="font-bold">
              Email
            </p>

            <p>
              {student?.email}
            </p>

          </div>

          <div>

            <p className="font-bold">
              Contact
            </p>

            <input
              value={
                contact
              }
              onChange={(e)=>
                setContact(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl w-full"
            />

          </div>

          <div>

            <p className="font-bold">
              Batch
            </p>

            <p>
              {
                student?.batchName
              }
            </p>

          </div>

          <div>

            <p className="font-bold">
              Fees Paid
            </p>

            <input
              type="number"
              value={
                feesPaid
              }
              onChange={(e)=>
                setFeesPaid(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="border p-3 rounded-xl w-full"
            />

          </div>

          <div>

            <p className="font-bold">
              Total Fees
            </p>

            <input
              type="number"
              value={
                totalFees
              }
              onChange={(e)=>
                setTotalFees(
                  Number(
                    e.target
                      .value
                  )
                )
              }
              className="border p-3 rounded-xl w-full"
            />

          </div>

        </div>

        {/* ATTENDANCE */}

        <div className="mt-10">

          <h3 className="text-3xl font-bold mb-6">
            Attendance
          </h3>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="bg-green-50 rounded-2xl p-6">

              <p>
                Present
              </p>

              <h2 className="text-5xl font-bold">
                {
                  totalPresent
                }
              </h2>

            </div>

            <div className="bg-red-50 rounded-2xl p-6">

              <p>
                Absent
              </p>

              <h2 className="text-5xl font-bold">
                {
                  totalAbsent
                }
              </h2>

            </div>

            <div className="bg-blue-50 rounded-2xl p-6">

              <p>
                Attendance %
              </p>

              <h2 className="text-5xl font-bold">
                {
                  attendancePercentage
                }%
              </h2>

            </div>

          </div>

        </div>

        {/* RESULTS */}

        <div className="mt-10">

          <h3 className="text-3xl font-bold mb-6">
            Exam Results
          </h3>

          {
            results.length > 0 ? (

              <table className="w-full border">

                <thead>

                  <tr className="bg-gray-100">

                    <th className="border p-3">
                      Exam
                    </th>

                    <th className="border p-3">
                      Subject
                    </th>

                    <th className="border p-3">
                      Marks
                    </th>

                    <th className="border p-3">
                      Total
                    </th>

                    <th className="border p-3">
                      %
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {results.map(
                    (
                      result,
                      index
                    ) => {

                      const percentage =
                        (
                          result.marks /
                          result.totalMarks
                        ) * 100;

                      return (

                        <tr
                          key={
                            result.id ||
                            index
                          }
                        >

                          <td className="border p-3">
                            {
                              result.examName
                            }
                          </td>

                          <td className="border p-3">
                            {
                              result.subject
                            }
                          </td>

                          <td className="border p-3">
                            {
                              result.marks
                            }
                          </td>

                          <td className="border p-3">
                            {
                              result.totalMarks
                            }
                          </td>

                          <td className="border p-3">
                            {
                              percentage.toFixed(
                                2
                              )
                            }%
                          </td>

                        </tr>

                      );
                    }
                  )}

                </tbody>

              </table>

            ) : (

              <p className="text-gray-500">
                No Exam Results Found
              </p>

            )
          }

        </div>

        {/* BUTTONS */}

        <div className="flex gap-4 mt-10">

          <button
            onClick={
              saveStudent
            }
            className="bg-[#5A1E1E] text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>

          <button
            onClick={
              onClose
            }
            className="bg-gray-300 px-6 py-3 rounded-xl"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
}