"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter }
from "next/navigation";

import {
  auth,
  db,
} from "@/firebase/firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export default function StudentPage() {

  const router = useRouter();

  const [authLoading, setAuthLoading] =
    useState(true);

  // =========================
  // STATES
  // =========================

  const [studentData, setStudentData] =
    useState<any>(null);

    const [homeworks, setHomeworks] =
  useState<any[]>([]);

  const [results, setResults] =
    useState<any[]>([]);

  const [exams, setExams] =
    useState<any[]>([]);

  const [rankings, setRankings] =
    useState<any[]>([]);
    

  const [selectedResultExam, setSelectedResultExam] =
    useState("");

  const [selectedRankingExam, setSelectedRankingExam] =
    useState("");

  // =========================
  // LOAD STUDENT
  // =========================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth,
        async (user) => {

        if (!user) {

          router.push("/");

          setAuthLoading(false);

          return;
        }

        // LOAD STUDENT

        const studentSnapshot =
          await getDocs(
            collection(db, "students")
          );

        let currentStudent: any =
          null;

        studentSnapshot.forEach((doc) => {

          const data = doc.data();

          if (
            data.email === user.email
          ) {

            currentStudent = {
              id: doc.id,
              ...data,
            };

            setStudentData(
              currentStudent
            );
          }
        });

        if (!currentStudent) {

          setAuthLoading(false);

          return;
        }

        // =========================
        // LOAD EXAMS
        // =========================

        const examQuery =
          query(
            collection(db, "exams"),
            where(
              "batchId",
              "==",
              currentStudent.batchId
            )
          );

        const examSnapshot =
          await getDocs(examQuery);

        const examData: any[] = [];

        examSnapshot.forEach((doc) => {

          examData.push({
            id: doc.id,
            ...doc.data(),
          });

        });

        const today = new Date();

const upcomingOnly = examData.filter((exam)=>{

  const examDate = new Date(
    exam.examDate
  );

  return examDate >= today;

});

setExams(upcomingOnly);

 // =========================
// LOAD HOMEWORK
// only pending homework
// =========================

const homeworkQuery =
query(
collection(db,"homework"),
where(
"batchId",
"==",
currentStudent.batchId
)
);

const homeworkSnapshot =
await getDocs(
homeworkQuery
);

const homeworkData:any[]=[];

for(
const hwDoc
of homeworkSnapshot.docs
){

const hw={

id:hwDoc.id,
...hwDoc.data()

};

const statusRef=
doc(
db,
"homeworkStatus",
`${hw.id}_${currentStudent.id}`
);

const statusSnap=
await getDoc(
statusRef
);

if(
statusSnap.exists()
){

const statusData=
statusSnap.data();

if(
statusData.status==="done"
){

continue;
}

}

homeworkData.push(hw);

}

setHomeworks(
homeworkData
);

        // =========================
        // LOAD RESULTS
        // =========================

        const resultQuery =
          query(
            collection(db, "results"),
            where(
              "studentId",
              "==",
              currentStudent.id
            )
          );

        const resultSnapshot =
          await getDocs(resultQuery);

        const resultData: any[] = [];

        resultSnapshot.forEach((doc) => {

          resultData.push({
            id: doc.id,
            ...doc.data(),
          });

        });

        setResults(resultData);

        // =========================
        // LOAD RANKINGS
        // =========================

        const rankingQuery =
          query(
            collection(db, "results"),
            where(
              "batchId",
              "==",
              currentStudent.batchId
            )
          );

        const rankingSnapshot =
          await getDocs(rankingQuery);

        const allResults: any[] = [];

        rankingSnapshot.forEach((doc) => {

          allResults.push(
            doc.data()
          );

        });

        setRankings(allResults);

        setAuthLoading(false);

      });

    return () => unsubscribe();

  }, [router]);

  // =========================
  // FILTERED RESULTS
  // =========================

  const filteredResults =
    selectedResultExam
      ? results.filter(
          (result) =>
            result.examName ===
            selectedResultExam
        )
      : results;

  // =========================
  // FILTERED RANKINGS
  // =========================

  const filteredRankings =
    useMemo(() => {

      const filtered =
        selectedRankingExam
          ? rankings.filter(
              (item) =>
                item.examName ===
                selectedRankingExam
            )
          : rankings;

      const totals: any = {};

      filtered.forEach((item) => {

        if (
          !totals[item.studentName]
        ) {

          totals[item.studentName] = 0;
        }

        totals[item.studentName] +=
          item.marks;
      });

     return Object.entries(totals)
  .map(
    ([name, total]) => ({
      name,
      total: Number(total),
    })
  )
        .sort(
          (a: any, b: any) =>
            b.total - a.total
        );

    }, [
      rankings,
      selectedRankingExam,
    ]);

  // =========================
  // CALCULATIONS
  // =========================

  const totalObtained =
    filteredResults.reduce(
      (sum, item) =>
        sum + item.marks,
      0
    );

  const totalMarks =
    filteredResults.reduce(
      (sum, item) =>
        sum + item.totalMarks,
      0
    );

  const overallPercentage =
    totalMarks > 0
      ? (
          (totalObtained /
            totalMarks) *
          100
        ).toFixed(1)
      : 0;

  // =========================
  // LOADING
  // =========================

  if (authLoading || !studentData) {

    return (
      <main className="min-h-screen flex items-center justify-center text-4xl font-bold">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] p-3 md:p-6">

      {/* PROFILE */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h1 className="text-2xl md:text-5xl font-bold text-[#5A1E1E]">
          {studentData.name}
        </h1>

        <p className="text-xl mt-3">
          {studentData.batchName}
        </p>

        <p className="text-xl mt-2">
          Overall Percentage:
          {" "}
          <span className="font-bold">
            {overallPercentage}%
          </span>
        </p>

      </div>

      {/* ATTENDANCE OVERVIEW */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 mb-10">

        <div className="bg-green-50 rounded-2xl p-5">

          <p className="text-gray-500">
            Total Present
          </p>

          <h3 className="text-4xl font-bold mt-2 text-green-700">
            {
              Object.values(
                studentData.attendanceRecords || {}
              ).filter(
                (value) => value === "Present"
              ).length
            }
          </h3>

        </div>

        <div className="bg-red-50 rounded-2xl p-5">

          <p className="text-gray-500">
            Total Absent
          </p>

          <h3 className="text-4xl font-bold mt-2 text-red-700">
            {
              Object.values(
                studentData.attendanceRecords || {}
              ).filter(
                (value) => value === "Absent"
              ).length
            }
          </h3>

        </div>

        <div className="bg-blue-50 rounded-2xl p-5">

          <p className="text-gray-500">
            Attendance %
          </p>

          <h3 className="text-4xl font-bold mt-2 text-blue-700">
            {studentData.attendancePercentage || 0}%
          </h3>

        </div>

      </div>

      {/* UPCOMING EXAMS */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Upcoming Exams
        </h2>

        <div className="space-y-4">

          {exams.map((exam) => (

            <div
              key={exam.id}
              className="bg-gray-100 p-4 rounded-xl"
            >

              <h3 className="font-bold text-xl">
                {exam.examName}
              </h3>

              <p>
                Subject:
                {" "}
                {exam.subject}
              </p>

              <p>
                Date:
                {" "}
                {exam.examDate}
              </p>

              <p>
                Total Marks:
                {" "}
                {exam.totalMarks}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* HOMEWORK */}

<div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

  <h2 className="text-3xl font-bold mb-6">
    Homework
  </h2>

  <div className="space-y-4">

    {homeworks.length === 0 ? (

      <p className="text-gray-500">
        No homework assigned
      </p>

    ) : (

      homeworks.map((hw)=>(

        <div
          key={hw.id}
          className="bg-yellow-50 rounded-xl p-5"
        >

          <h3 className="text-2xl font-bold">
            {hw.title}
          </h3>

          <p className="mt-2">
            Subject:
            {" "}
            {hw.subject}
          </p>

          <p className="mt-2 text-gray-700">
            {hw.description}
          </p>

          <p className="text-sm text-gray-500 mt-3">
            By:
            {" "}
            {hw.facultyName}
          </p>

        </div>

      ))

    )}

  </div>

</div>

      {/* RESULTS */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-3xl font-bold">
            Results
          </h2>

          <select
            value={selectedResultExam}
            onChange={(e) =>
              setSelectedResultExam(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          >

            <option value="">
              All Exams
            </option>

            {[
              ...new Set(
                results.map(
                  (result) =>
                    result.examName
                )
              ),
            ].map((examName: any) => (

              <option
                key={examName}
                value={examName}
              >
                {examName}
              </option>

            ))}

          </select>

        </div>

        <div className="overflow-auto">

          <table className="w-full">

            <thead className="bg-[#5A1E1E] text-white">

              <tr>

                <th className="p-4 text-left">
                  Exam
                </th>

                <th className="p-4 text-left">
                  Subject
                </th>

                <th className="p-4 text-left">
                  Marks
                </th>

                <th className="p-4 text-left">
                  Percentage
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredResults.map((result) => (

                <tr
                  key={result.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {result.examName}
                  </td>

                  <td className="p-4">
                    {result.subject}
                  </td>

                  <td className="p-4">
                    {result.marks}/
                    {result.totalMarks}
                  </td>

                  <td className="p-4">
                    {result.percentage}%
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* RANKINGS */}

      <div className="bg-white rounded-3xl shadow-xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-3xl font-bold">
            Batch Rankings
          </h2>

          <select
            value={selectedRankingExam}
            onChange={(e) =>
              setSelectedRankingExam(
                e.target.value
              )
            }
            className="border p-3 rounded-xl"
          >

            <option value="">
              All Exams
            </option>

            {[
              ...new Set(
                rankings.map(
                  (result) =>
                    result.examName
                )
              ),
            ].map((examName: any) => (

              <option
                key={examName}
                value={examName}
              >
                {examName}
              </option>

            ))}

          </select>

        </div>

        <div className="overflow-auto">

          <table className="w-full">

            <thead className="bg-[#5A1E1E] text-white">

              <tr>

                <th className="p-4 text-left">
                  Rank
                </th>

                <th className="p-4 text-left">
                  Student
                </th>

                <th className="p-4 text-left">
                  Total Marks
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredRankings.map(
                (student, index) => (

                  <tr
                    key={index}
                    className="border-b"
                  >

                    <td className="p-4">
                      #{index + 1}
                    </td>

                    <td className="p-4">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.total}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}