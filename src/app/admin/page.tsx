"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
updateDoc,
doc,
deleteDoc,
} from "firebase/firestore";

import { db, auth } from "@/firebase/firebaseConfig";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import BatchCard from "@/components/admin/BatchCard";

import StudentCard from "@/components/admin/StudentCard";

import FacultyCard from "@/components/admin/FacultyCard";

import StudentProfileModal from "@/components/admin/StudentProfileModal";

import FacultyProfileModal from "@/components/admin/FacultyProfileModal";

export default function AdminPage() {

  // =========================
  // MAIN STATES
  // =========================

  const [batches, setBatches] =
    useState<any[]>([]);

  const [selectedBatch,
    setSelectedBatch] =
    useState<any>(null);

  const [students,
    setStudents] =
    useState<any[]>([]);

  const [facultyList,
    setFacultyList] =
    useState<any[]>([]);

  const [selectedStudent,
    setSelectedStudent] =
    useState<any>(null);

  const [selectedFaculty,
    setSelectedFaculty] =
    useState<any>(null);

    // =========================
// ATTENDANCE STATES
// =========================

const [attendanceBatch,
  setAttendanceBatch] =
  useState("");

const [attendanceStudents,
  setAttendanceStudents] =
  useState<any[]>([]);

const [attendanceData,
  setAttendanceData] =
  useState<any>({});

  // =========================
  // CREATE BATCH STATES
  // =========================

  const [standard,
    setStandard] =
    useState("");

  const [medium,
    setMedium] =
    useState("");

  const [subjectInput,
    setSubjectInput] =
    useState("");

  const [subjects,
    setSubjects] =
    useState<string[]>([]);

  // =========================
  // STUDENT STATES
  // =========================

  const [studentName,
    setStudentName] =
    useState("");

  const [studentEmail,
    setStudentEmail] =
    useState("");

  const [studentContact,
    setStudentContact] =
    useState("");

  const [studentBatch,
    setStudentBatch] =
    useState("");

  // =========================
  // FACULTY STATES
  // =========================

  const [facultyName,
    setFacultyName] =
    useState("");

  const [facultyEmail,
    setFacultyEmail] =
    useState("");

  const [facultyBatch,setFacultyBatch]=
useState("");

const [availableSubjects,
setAvailableSubjects]=
useState<string[]>([]);

const [selectedSubjects,
setSelectedSubjects]=
useState<string[]>([]);

const [facultyAssignments,
setFacultyAssignments]=
useState<any[]>([]);

  // =========================
  // LOAD BATCHES
  // =========================

  useEffect(() => {

    loadBatches();

  }, []);

  const loadBatches = async () => {

    const snapshot =
      await getDocs(
        collection(db, "batches")
      );

    const data: any[] = [];

    snapshot.forEach((docu) => {

      data.push({
        id: docu.id,
        ...docu.data(),
      });

    });

    setBatches(data);
  };

  // =========================
  // ADD SUBJECT
  // =========================

  const addSubject = () => {

    if (!subjectInput) return;

    setSubjects([
      ...subjects,
      subjectInput,
    ]);

    setSubjectInput("");
  };

  // =========================
  // REMOVE SUBJECT
  // =========================

  const removeSubject = (
    subject: string
  ) => {

    setSubjects(
      subjects.filter(
        (item) =>
          item !== subject
      )
    );
  };

  // =========================
  // CREATE BATCH
  // =========================

  const createBatch = async () => {

    try {

      if (
        !standard ||
        !medium ||
        subjects.length === 0
      ) {

        alert("Fill all fields");

        return;
      }

      const batchName =
        `${standard} ${medium}`;

      await addDoc(
        collection(db, "batches"),
        {
          name: batchName,
          standard,
          medium,
          subjects,
          createdAt:
            new Date(),
        }
      );

      alert("Batch Created");

      setStandard("");
      setMedium("");
      setSubjects([]);

      loadBatches();

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // LOAD BATCH DETAILS
  // =========================

  const loadBatchDetails = async (
    batch: any
  ) => {

    setSelectedBatch(batch);

    // STUDENTS

    const studentQuery =
      query(
        collection(db, "students"),
        where(
          "batchId",
          "==",
          batch.id
        )
      );

    const studentSnapshot =
      await getDocs(studentQuery);

    const studentData: any[] = [];

    studentSnapshot.forEach((docu) => {

      studentData.push({
        id: docu.id,
        ...docu.data(),
      });

    });

    setStudents(studentData);

    // FACULTY

    const facultySnapshot =
      await getDocs(
        collection(db, "faculty")
      );

    const facultyData: any[] = [];

    facultySnapshot.forEach((docu) => {

      const data = docu.data();

      const assigned =
        data.assignments?.find(
          (item: any) =>
            item.batchId === batch.id
        );

      if (assigned) {

        facultyData.push({
          id: docu.id,
          ...data,
        });
      }
    });

    setFacultyList(facultyData);
  };

  // =========================
// ADD STUDENT
// =========================

const addStudent = async () => {

  try {

    if(
      !studentName ||
      !studentEmail ||
      !studentContact ||
      !studentBatch
    ){
      alert("Fill all fields");
      return;
    }

    // auto username
    const username =
      studentName
      .toLowerCase()
      .replace(/\s/g,"")
      +"@arihant.com";

    // unique password
    const password =
      "Ari"+
      Math.floor(
        1000 + Math.random()*9000
      )+
      "@"+
      Math.random()
      .toString(36)
      .substring(2,5);

    // firebase auth account
const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    studentEmail,
    password
  );

const uid =
  userCredential.user.uid;

    const batchData =
      batches.find(
        (batch)=>
        batch.id===studentBatch
      );

    await addDoc(
      collection(db,"students"),
      {
        uid,

        name:studentName,

        email:studentEmail,

username,

password,

contact:
studentContact,

        role:"student",

        batchId:studentBatch,

        batchName:
        batchData?.name || "",

        attendanceRecords:{},

        attendancePercentage:0,

        feesPaid:0,

        totalFees:0,

        createdAt:new Date()
      }
    );

alert(
`Student Added Successfully

Username: ${username}

Password: ${password}`
);

setStudentName("");
setStudentEmail("");
setStudentContact("");
setStudentBatch("");

} catch(error:any){

  console.log(error);

  alert(error.message);

}

};


  // =========================
  // HANDLE FACULTY BATCH
  // =========================

  const handleFacultyBatch = (
    batchId: string
  ) => {

    setFacultyBatch(batchId);

    setSelectedSubjects([]);

    const batchData =
      batches.find(
        (batch) =>
          batch.id === batchId
      );

    if (batchData) {

      setAvailableSubjects(
        batchData.subjects || []
      );
    }
  };

  // =========================
  // TOGGLE SUBJECT
  // =========================

  const toggleSubject = (
    subject: string
  ) => {

    if (
      selectedSubjects.includes(subject)
    ) {

      setSelectedSubjects(
        selectedSubjects.filter(
          (item) =>
            item !== subject
        )
      );

    } else {

      setSelectedSubjects([
        ...selectedSubjects,
        subject,
      ]);
    }
  };

  // =========================
// ADD BATCH + SUBJECT SET
// =========================

const addFacultyAssignment =
() => {

 if(
   !facultyBatch ||
   selectedSubjects.length===0
 ){

   alert(
     "Select batch and subjects"
   );

   return;
 }

 const batchData =
 batches.find(
   (batch)=>
   batch.id===facultyBatch
 );

 const exists =
 facultyAssignments.find(
   (item)=>
   item.batchId===facultyBatch
 );

 if(exists){

   alert(
    "Batch already added"
   );

   return;
 }

 setFacultyAssignments([

   ...facultyAssignments,

   {
      batchId:facultyBatch,

      batchName:
      batchData?.name||"",

      subjects:
      selectedSubjects
   }

 ]);

 setFacultyBatch("");

 setSelectedSubjects([]);

 setAvailableSubjects([]);

};

  // =========================
  // ADD FACULTY
  // =========================

  const addFaculty = async () => {

 try {

   if(
     facultyAssignments.length===0
   ){

      alert(
       "Add batch assignments"
      );

      return;
   }

   const username =
facultyName
.toLowerCase()
.replace(/\s/g,"")
+ "@arihant.com";

const password =
"Fac" +
Math.floor(
1000 + Math.random()*9000
) +
"@" +
Math.random()
.toString(36)
.substring(2,5);

const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    facultyEmail,
    password
  );

const uid =
  userCredential.user.uid;

   await addDoc(
      collection(
        db,
        "faculty"
      ),
      {

        uid,

        name:
        facultyName,

        email:
        facultyEmail,

        username,

        password,

        role:
        "faculty",

        assignments:
        facultyAssignments,

        createdAt:
        new Date()
      }
   );

   alert(
`Faculty Added Successfully

Username: ${username}

Password: ${password}`
);

setFacultyName("");

setFacultyEmail("");

setFacultyAssignments([]);

setFacultyBatch("");

setSelectedSubjects([]);

} catch(error:any){

   console.log(error);

   alert(
     error.message
   );
}

  };

  // =========================
// LOAD ATTENDANCE STUDENTS
// =========================

const loadAttendanceStudents = async (
  batchId: string
) => {

  setAttendanceBatch(batchId);

  const q = query(
    collection(db, "students"),
    where("batchId", "==", batchId)
  );

  const snapshot =
    await getDocs(q);

  const data: any[] = [];

  const attendanceObj: any = {};

  snapshot.forEach((docu) => {

    const student = {
      id: docu.id,
      ...docu.data(),
    };

    data.push(student);

    attendanceObj[docu.id] =
      "Present";
  });

  setAttendanceStudents(data);

  setAttendanceData(attendanceObj);
};

// =========================
// CHANGE ATTENDANCE
// =========================

const changeAttendance = (
  studentId: string,
  value: string
) => {

  setAttendanceData({
    ...attendanceData,
    [studentId]: value,
  });
};

// =========================
// SAVE ATTENDANCE
// =========================

const saveAttendance = async () => {

  try {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    for (const student of attendanceStudents) {

      const status =
        attendanceData[student.id];

      const oldRecords =
        student.attendanceRecords || {};

      const updatedRecords = {
        ...oldRecords,
        [today]: status,
      };

      const totalDays =
        Object.keys(updatedRecords).length;

      const presentDays =
        Object.values(updatedRecords).filter(
          (value) =>
            value === "Present"
        ).length;

      const percentage =
        totalDays > 0
          ? Math.round(
              (presentDays / totalDays) * 100
            )
          : 0;

      await updateDoc(
        doc(db, "students", student.id),
        {
          attendanceRecords:
            updatedRecords,

          attendancePercentage:
            percentage,
        }
      );
    }

    alert("Attendance Saved");

    if (selectedBatch) {
      loadBatchDetails(selectedBatch);
    }

  } catch (error) {

    console.log(error);

    alert("Error saving attendance");
  }
};

// =========================
// UPDATE SINGLE ATTENDANCE
// =========================

const updateStudentAttendance = async (
  studentId: string,
  selectedDate: string,
  status: string
) => {

  try {

    const studentData =
      students.find(
        (s) => s.id === studentId
      );

    const oldRecords =
      studentData?.attendanceRecords || {};

    const updatedRecords = {
      ...oldRecords,
      [selectedDate]: status,
    };

    const totalDays =
      Object.keys(updatedRecords).length;

    const presentDays =
      Object.values(updatedRecords).filter(
        (value) =>
          value === "Present"
      ).length;

    const percentage =
      totalDays > 0
        ? Math.round(
            (presentDays / totalDays) * 100
          )
        : 0;

    await updateDoc(
      doc(db, "students", studentId),
      {
        attendanceRecords:
          updatedRecords,

        attendancePercentage:
          percentage,
      }
    );

    alert(
      "Attendance Updated"
    );

    if (selectedBatch) {

      loadBatchDetails(
        selectedBatch
      );
    }

  } catch (error) {

    console.log(error);

    alert(
      "Error updating attendance"
    );
  }
};

// =========================
// DELETE STUDENT
// =========================

const deleteStudent = async (
  studentId:string,
  studentName:string
)=>{

const confirmDelete =
window.confirm(
`Are you sure you want to delete ${studentName} ?`
);

if(!confirmDelete) return;

try{

const studentData =
students.find(
(s)=>s.id===studentId
);

if(studentData?.uid){

const response = await fetch(
"/api/delete-user",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
uid:studentData.uid
})
}
);

const result =
await response.json();

console.log(result);

if (!result.success) {
  alert("Auth delete failed: " + result.error);
  return;
}

// WAIT 5 SECONDS
await new Promise(
  (resolve) =>
    setTimeout(resolve, 5000)
);

}

try{

// delete student document
await deleteDoc(
doc(
db,
"students",
studentId
)
);

// delete all student results
const resultQuery =
query(
collection(db,"results"),
where(
"studentId",
"==",
studentId
)
);

const resultSnapshot =
await getDocs(
resultQuery
);

for(
const resultDoc
of resultSnapshot.docs
){

await deleteDoc(
doc(
db,
"results",
resultDoc.id
)
);

}

alert(
"Student deleted successfully"
);

if(selectedBatch){

loadBatchDetails(
selectedBatch
);

}

}catch(error){

console.log(error);

alert(
"Error deleting student"
);

}

setStudents([]);

if(selectedBatch){

loadBatchDetails(
selectedBatch
);

}

}catch(error){

console.log(error);

alert(
"Error deleting student"
);

}

};

// =========================
// DELETE FACULTY
// =========================

const deleteFaculty = async (
facultyId:string,
facultyName:string
)=>{

const confirmDelete =
window.confirm(
`Are you sure you want to delete ${facultyName} ?`
);

if(!confirmDelete) return;

try{

const facultyData =
facultyList.find(
(f)=>f.id===facultyId
);

if(facultyData?.uid){

const response = await fetch(
"/api/delete-user",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
uid:facultyData.uid
})
}
);

const result =
await response.json();

console.log(result);

// WAIT 3 SECONDS

await new Promise(
(resolve)=>
setTimeout(resolve,3000)
);

}

await deleteDoc(
doc(
db,
"faculty",
facultyId
)
);

alert(
"Faculty deleted successfully"
);

if(selectedBatch){

loadBatchDetails(
selectedBatch
);

}

}catch(error){

console.log(error);

alert(
"Error deleting faculty"
);

}

};

const deleteBatch = async (
  batchId: string,
  batchName: string
) => {

  const confirmDelete =
    window.confirm(
      `Are you sure you want to delete ${batchName}?`
    );

  if (!confirmDelete) return;

  try {

    await deleteDoc(
      doc(db, "batches", batchId)
    );

    alert("Batch deleted successfully");

    setSelectedBatch(null);

    loadBatches();

  } catch (error) {

    console.log(error);

    alert("Error deleting batch");
  }
};

  return (

   <main className="min-h-screen bg-[#F8F4EF] p-3 md:p-6">

      <h1 className="text-3xl md:text-5xl font-bold text-[#5A1E1E] mb-10">
        Admin Dashboard
      </h1>

      {/* ========================= */}
      {/* CREATE BATCH */}
      {/* ========================= */}

      <div className="bg-white rounded-2xl md:text-3xl shadow-xl p-6 mb-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Create Batch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            className="border p-4 rounded-xl"
            value={standard}
            onChange={(e) =>
              setStandard(
                e.target.value
              )
            }
          >

            <option value="">
              Select Standard
            </option>

            <option>9th</option>
            <option>10th</option>
            <option>11th</option>
            <option>12th</option>

          </select>

          <select
            className="border p-4 rounded-xl"
            value={medium}
            onChange={(e) =>
              setMedium(
                e.target.value
              )
            }
          >

            <option value="">
              Select Medium
            </option>

            <option>English</option>
            <option>Gujarati</option>

          </select>

          <div className="flex flex-col md:flex-row gap-2">
  <input
    type="text"
    className="border p-3 rounded-xl flex-1"
    placeholder="Add Subject"
  />

  <button
    className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl"
  >
    Add
  </button>
</div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          {subjects.map(
            (subject, index) => (

              <div
                key={index}
                className="bg-gray-200 px-4 py-2 rounded-xl flex items-center gap-3"
              >

                {subject}

                <button
                  onClick={() =>
                    removeSubject(subject)
                  }
                  className="text-red-500"
                >
                  ✕
                </button>

              </div>

            )
          )}

        </div>

        <button
          onClick={createBatch}
          className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
        >
          Create Batch
        </button>

      </div>

      {/* ========================= */}
      {/* ADD STUDENT */}
      {/* ========================= */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Add Student
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Student Name"
            className="border p-4 rounded-xl"
            value={studentName}
            onChange={(e) =>
              setStudentName(
                e.target.value
              )
            }
          />

          <input
type="email"
placeholder="Student Gmail"
className="border p-4 rounded-xl"
value={studentEmail}
onChange={(e)=>
setStudentEmail(
e.target.value
)
}
/>
          <input
            type="text"
            placeholder="Contact"
            className="border p-4 rounded-xl"
            value={studentContact}
            onChange={(e) =>
              setStudentContact(
                e.target.value
              )
            }
          />

          <select
            className="border p-4 rounded-xl"
            value={studentBatch}
            onChange={(e) =>
              setStudentBatch(
                e.target.value
              )
            }
          >

            <option value="">
              Select Batch
            </option>

            {batches.map((batch) => (

              <option
                key={batch.id}
                value={batch.id}
              >
                {batch.name}
              </option>

            ))}

          </select>

        </div>

        <button
          onClick={addStudent}
          className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
        >
          Add Student
        </button>

      </div>

      {/* ========================= */}
      {/* ADD FACULTY */}
      {/* ========================= */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Add Faculty
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Faculty Name"
            className="border p-4 rounded-xl"
            value={facultyName}
            onChange={(e) =>
              setFacultyName(
                e.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Faculty Email"
            className="border p-4 rounded-xl"
            value={facultyEmail}
            onChange={(e) =>
              setFacultyEmail(
                e.target.value
              )
            }
          />

          <select
            className="border p-4 rounded-xl"
            value={facultyBatch}
            onChange={(e) =>
              handleFacultyBatch(
                e.target.value
              )
            }
          >

            <option value="">
              Select Batch
            </option>

            {batches.map((batch) => (

              <option
                key={batch.id}
                value={batch.id}
              >
                {batch.name}
              </option>

            ))}

          </select>

        </div>

        <div className="mt-6 flex flex-wrap gap-4">

 {availableSubjects.map(
 (subject,index)=>(

<button
key={index}
onClick={()=>
toggleSubject(subject)
}
className={`px-5 py-3 rounded-xl ${
selectedSubjects.includes(
subject
)
?
"bg-[#5A1E1E] text-white"
:
"bg-gray-200"
}`}
>
{subject}
</button>

))
}

</div>

<button
onClick={
addFacultyAssignment
}
className="w-full md:w-auto mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
>
Add Batch Assignment
</button>


<div className="mt-6 space-y-4">

{facultyAssignments.map(
(item,index)=>(

<div
key={index}
className="border rounded-2xl p-5"
>

<h3 className="font-bold">
{item.batchName}
</h3>

<div className="flex flex-wrap gap-2 mt-3">

{item.subjects.map(
(subject:string)=>(
<div
key={subject}
className="bg-gray-200 px-4 py-2 rounded-xl"
>
{subject}
</div>
)
)}

</div>

<button
className="mt-4 text-red-600"
onClick={()=>
setFacultyAssignments(
facultyAssignments.filter(
(_,i)=>
i!==index
)
)
}
>
Remove
</button>

</div>

))
}

</div>

        <button
          onClick={addFaculty}
          className="mt-8 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
        >
          Save Faculty
        </button>

      </div>

      {/* ========================= */}
{/* MARK ATTENDANCE */}
{/* ========================= */}

<div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

  <h2 className="text-2xl md:text-3xl font-bold mb-6">
    Mark Attendance
  </h2>

  <select
    className="border p-4 rounded-xl w-full mb-6"
    value={attendanceBatch}
    onChange={(e) =>
      loadAttendanceStudents(
        e.target.value
      )
    }
  >

    <option value="">
      Select Batch
    </option>

    {batches.map((batch) => (

      <option
        key={batch.id}
        value={batch.id}
      >
        {batch.name}
      </option>

    ))}

  </select>

  {attendanceStudents.length > 0 && (

    <div className="space-y-4">

      {attendanceStudents.map(
        (student) => (

          <div
            key={student.id}
            className="border rounded-2xl p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between"
          >

            <div>

              <h3 className="font-bold text-xl">
                {student.name}
              </h3>

              <p className="text-gray-500">
                {student.contact}
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={() =>
                  changeAttendance(
                    student.id,
                    "Present"
                  )
                }
                className={`px-5 py-2 rounded-xl ${
                  attendanceData[
                    student.id
                  ] === "Present"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Present
              </button>

              <button
                onClick={() =>
                  changeAttendance(
                    student.id,
                    "Absent"
                  )
                }
                className={`px-5 py-2 rounded-xl ${
                  attendanceData[
                    student.id
                  ] === "Absent"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Absent
              </button>

            </div>

          </div>

        )
      )}

      <button
        onClick={saveAttendance}
        className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
      >
        Save Attendance
      </button>

    </div>

  )}

</div>

      {/* ========================= */}
      {/* BATCH LIST */}
      {/* ========================= */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          All Batches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {batches.map((batch) => (

    <div
      key={batch.id}
      onClick={() =>
        loadBatchDetails(batch)
      }
      className={`cursor-pointer border-4 rounded-3xl transition ${
        selectedBatch?.id === batch.id
          ? "border-[#5A1E1E]"
          : "border-transparent"
      }`}
    >

<BatchCard
  batch={batch}
/>

<button
  onClick={(e) => {
    e.stopPropagation();

    deleteBatch(
      batch.id,
      batch.name
    );
  }}
  className="w-full bg-red-600 text-white px-5 py-3 rounded-b-3xl"
>
  Delete Batch
</button>

    </div>

  ))}

</div>

      </div>

{/* ========================= */}
{/* BATCH DETAILS */}
{/* ========================= */}

{selectedBatch && (

  <div className="space-y-10">

    {/* ========================= */}
    {/* BATCH OVERVIEW */}
    {/* ========================= */}

    <div className="bg-white rounded-3xl shadow-xl p-8">

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        <div>

          <h2 className="text-4xl font-bold text-[#5A1E1E]">
            {selectedBatch.name}
          </h2>

          <p className="text-gray-500 mt-2">
            Standard: {selectedBatch.standard}
            {" • "}
            Medium: {selectedBatch.medium}
          </p>

        </div>

        <button
          onClick={() =>
            setSelectedBatch(null)
          }
          className="bg-red-500 text-white px-5 py-3 rounded-xl"
        >
          Close
        </button>

      </div>

      {/* SUBJECTS */}

      <div className="mt-8">

        <h3 className="text-2xl font-bold mb-4">
          Subjects
        </h3>

        <div className="flex flex-wrap gap-3">

          {selectedBatch.subjects?.map(
            (
              subject: string,
              index: number
            ) => (

              <div
                key={index}
                className="bg-gray-200 px-4 py-2 rounded-xl"
              >
                {subject}
              </div>

            )
          )}

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">

        <div className="bg-blue-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Total Students
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {students.length}
          </h3>

        </div>

        <div className="bg-green-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Total Faculty
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {facultyList.length}
          </h3>

        </div>

        <div className="bg-orange-50 rounded-2xl p-6">

          <p className="text-gray-500">
            Subjects
          </p>

          <h3 className="text-5xl font-bold mt-3">
            {selectedBatch.subjects?.length || 0}
          </h3>

        </div>

      </div>

    </div>

    {/* ========================= */}
{/* STUDENTS */}
{/* ========================= */}

<div className="bg-white rounded-3xl shadow-xl p-6">

  <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6"></div>

    <h2 className="text-2xl md:text-3xl font-bold">
      Students
    </h2>

    <div className="text-gray-500">
      {students.length} Students
    </div>

  </div>

  {students.length > 0 ? (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

      {students.map((student,index) => (

        <div
          key={student.id}
          className="border rounded-2xl p-5 hover:shadow-lg transition"
        >

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <div>

              <h3 className="text-2xl font-bold">
                {student.name}
              </h3>

              <p className="text-gray-500 mt-1">
                {student.contact}
              </p>

              <p className="text-green-600 font-semibold mt-1">
  Attendance:
  {" "}
  {student.attendancePercentage || 0}%
</p>

            </div>

           <div className="flex flex-col md:flex-row gap-2">

<button
onClick={() =>
setSelectedStudent(student)
}
className="w-full md:w-auto bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
>
View & Edit
</button>

<button
onClick={()=>
deleteStudent(
student.id,
student.name
)
}
className="bg-red-600 text-white px-5 py-3 rounded-xl"
>
Delete
</button>

</div>
            <div className="mt-3 space-y-3">

  <input
    type="date"
    id={`attendance-date-${student.id}`}
    className="border p-2 rounded-xl w-full"
  />

  <div className="flex flex-col md:flex-row gap-2">

    <button
      onClick={() => {

        const selectedDate =
          (
            document.getElementById(
              `attendance-date-${student.id}`
            ) as HTMLInputElement
          )?.value;

        if (!selectedDate) {

          alert("Select Date");

          return;
        }

        updateStudentAttendance(
          student.id,
          selectedDate,
          "Present"
        );
      }}
      className="bg-green-600 text-white px-4 py-2 rounded-xl"
    >
      Present
    </button>

    <button
      onClick={() => {

        const selectedDate =
          (
            document.getElementById(
              `attendance-date-${student.id}`
            ) as HTMLInputElement
          )?.value;

        if (!selectedDate) {

          alert("Select Date");

          return;
        }

        updateStudentAttendance(
          student.id,
          selectedDate,
          "Absent"
        );
      }}
      className="bg-red-600 text-white px-4 py-2 rounded-xl"
    >
      Absent
    </button>

  </div>

</div>

          </div>

        </div>

      ))}

    </div>

  ) : (

    <div className="text-gray-500">
      No Students Found
    </div>

  )}

</div>
)}

  {/* ========================= */}
    {/* FACULTY */}
    {/* ========================= */}

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">

        <h2 className="text-2xl md:text-3xl font-bold">
          Faculty
        </h2>

        <div className="text-gray-500">
          {facultyList.length} Faculty Members
        </div>

      </div>

      {facultyList.length > 0 ? (

        <div className="space-y-5">

          {facultyList.map((faculty, index) => (

            <div
              key={faculty.id}
              className="border rounded-2xl p-6"
            >

              <div className="space-y-4">

                <input
                  type="text"
                  value={faculty.name}
                  onChange={(e) => {

                    const updated =
                      [...facultyList];

                    updated[index].name =
                      e.target.value;

                    setFacultyList(updated);
                  }}
                  className="w-full border p-3 rounded-xl"
                />

                <input
                  type="email"
                  value={faculty.email}
                  onChange={(e) => {

                    const updated =
                      [...facultyList];

                    updated[index].email =
                      e.target.value;

                    setFacultyList(updated);
                  }}
                  className="w-full border p-3 rounded-xl"
                />

              </div>

              {/* ASSIGNMENTS */}

              <div className="mt-6 space-y-4">

                {faculty.assignments?.map(
                  (
                    assignment: any,
                    assignmentIndex: number
                  ) => (

                    <div
                      key={assignmentIndex}
                      className="bg-gray-100 rounded-xl p-5"
                    >

                      <p className="text-gray-500">
                        Batch
                      </p>

                      <h4 className="font-bold text-lg">
                        {assignment.batchName}
                      </h4>

                      <div className="mt-4">

                        <p className="text-gray-500 mb-2">
                          Subjects
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {assignment.subjects.map(
                            (
                              subject: string,
                              subjectIndex: number
                            ) => (

                              <div
                                key={subjectIndex}
                                className="bg-white border px-4 py-2 rounded-xl"
                              >
                                {subject}
                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* BUTTONS */}
<div className="flex flex-col md:flex-row gap-3 mt-6">

<button
onClick={() =>
setSelectedFaculty(
faculty
)
}
className="bg-blue-600 text-white px-5 py-3 rounded-xl"
>
View Profile
</button>

<button
className="w-full md:w-auto bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
>
Save Changes
</button>

<button
onClick={()=>
deleteFaculty(
faculty.id,
faculty.name
)
}
className="bg-red-600 text-white px-5 py-3 rounded-xl"
>
Delete
</button>

</div>

              </div>


          ))}

        </div>

      ) : (

        <div className="text-gray-500">
          No Faculty Found
        </div>

      )}

    </div>

      {/* ========================= */}
      {/* MODALS */}
      {/* ========================= */}

      <StudentProfileModal
        student={selectedStudent}
        onClose={() =>
          setSelectedStudent(null)
        }
      />

      <FacultyProfileModal
        faculty={selectedFaculty}
        onClose={() =>
          setSelectedFaculty(null)
        }
      />

    </main>
  );
}