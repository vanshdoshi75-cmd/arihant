"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/firebase/firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

export default function FacultyPage() {

  // =========================
  // STATES
  // =========================

  const [facultyData, setFacultyData] =
    useState<any>(null);

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [selectedBatch,
    setSelectedBatch] =
    useState("");

  const [availableSubjects,
    setAvailableSubjects] =
    useState<string[]>([]);

  const [selectedSubject,
    setSelectedSubject] =
    useState("");

  // =========================
  // EXAM STATES
  // =========================

  const [examName, setExamName] =
    useState("");

  const [examDate, setExamDate] =
    useState("");

  const [totalMarks, setTotalMarks] =
    useState("");

  // =========================
  // HOMEWORK STATES
  // =========================

  const [homeworkBatch,
  setHomeworkBatch] =
  useState("");

const [homeworkSubjects,
  setHomeworkSubjects] =
  useState<string[]>([]);

const [homeworkSubject,
  setHomeworkSubject] =
  useState("");

  const [homeworkTitle,
    setHomeworkTitle] =
    useState("");

  const [homeworkDescription,
    setHomeworkDescription] =
    useState("");

    const [homeworks,
setHomeworks] =
useState<any[]>([]);

const [selectedHomeworkId,
setSelectedHomeworkId] =
useState("");

const [
markHomeworkBatch,
setMarkHomeworkBatch
] = useState("");

const [homeworkStatus,
setHomeworkStatus] =
useState<any>({});

  // =========================
  // STUDENTS
  // =========================

  const [students, setStudents] =
    useState<any[]>([]);

  // =========================
  // EXAMS
  // =========================

  const [exams, setExams] =
    useState<any[]>([]);

  const [selectedExam,
    setSelectedExam] =
    useState<any>(null);

  // =========================
  // MARKS
  // =========================

  const [marksData, setMarksData] =
    useState<any>({});

  // =========================
  // LOAD FACULTY
  // =========================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth,
        async (user) => {

        if (!user) return;

        const facultySnapshot =
          await getDocs(
            collection(db, "faculty")
          );

        facultySnapshot.forEach((doc) => {

          const data = doc.data();

          if (data.email === user.email) {

            setFacultyData({
              id: doc.id,
              ...data,
            });

            setAssignments(
              data.assignments || []
            );
          }
        });

      });

    return () => unsubscribe();

  }, []);

  // =========================
  // HANDLE BATCH CHANGE
  // =========================

  const handleBatchChange = async (
    batchId: string
  ) => {

    setSelectedBatch(batchId);

    setSelectedSubject("");

    // FIND ASSIGNMENT

    const assignment =
      assignments.find(
        (item) =>
          item.batchId === batchId
      );

    if (assignment) {

      setAvailableSubjects(
        assignment.subjects
      );
    }

    // LOAD STUDENTS

    const studentQuery =
      query(
        collection(db, "students"),
        where("batchId", "==", batchId)
      );

    const studentSnapshot =
      await getDocs(studentQuery);

    const studentData: any[] = [];

    studentSnapshot.forEach((doc) => {

      studentData.push({
        id: doc.id,
        ...doc.data(),
      });

    });

    setStudents(studentData);

    // LOAD EXAMS

 const examQuery =
  query(
    collection(db, "exams"),
    where("batchId", "==", batchId),
    where(
      "subject",
      "in",
      assignment?.subjects || [""]
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

    

    setExams(examData);

    const hwQuery =
query(
collection(db,"homework"),
where(
"batchId",
"==",
batchId
)
);

const hwSnapshot =
await getDocs(hwQuery);

const hwData:any[]=[];

hwSnapshot.forEach((doc)=>{

hwData.push({
id:doc.id,
...doc.data()
});

});

setHomeworks(hwData);

  };

  // =========================
  // CREATE EXAM
  // =========================

  const createExam = async () => {

    try {

      if (
        !selectedBatch ||
        !selectedSubject ||
        !examName ||
        !examDate ||
        !totalMarks
      ) {

        alert("Fill all fields");

        return;
      }

      const batchAssignment =
        assignments.find(
          (item) =>
            item.batchId === selectedBatch
        );

      await addDoc(
        collection(db, "exams"),
        {
          batchId: selectedBatch,

          batchName:
            batchAssignment?.batchName || "",

          subject: selectedSubject,

          examName,

          examDate,

          totalMarks:
            Number(totalMarks),

          facultyEmail:
            facultyData.email,

          facultyName:
            facultyData.name,

          createdAt: new Date(),
        }
      );

      alert("Exam Created");

      setExamName("");

      setExamDate("");

      setTotalMarks("");

      handleBatchChange(selectedBatch);

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
  // SELECT EXAM
  // =========================

  const selectExam = (
    examId: string
  ) => {

    const foundExam =
      exams.find(
        (exam) =>
          exam.id === examId
      );

    setSelectedExam(foundExam);
  };

  const updateExam = async () => {

  if (!selectedExam) return;

  try {

    await updateDoc(
      doc(
        db,
        "exams",
        selectedExam.id
      ),
      {

        examName:
          selectedExam.examName,

        examDate:
          selectedExam.examDate,

        totalMarks:
          Number(
            selectedExam.totalMarks
          )

      }
    );

    alert(
      "Exam Updated"
    );

    handleBatchChange(
      selectedBatch
    );

  } catch (error) {

    console.log(error);

  }

};

  // =========================
  // HANDLE MARK CHANGE
  // =========================

  const handleMarksChange = (
    studentId: string,
    value: string
  ) => {

    if (!selectedExam) return;

    const num =
      Number(value);

    if (
      num < 0 ||
      num > selectedExam.totalMarks
    ) {

      alert(
        `Marks must be between 0 and ${selectedExam.totalMarks}`
      );

      return;
    }

    setMarksData({
      ...marksData,
      [studentId]: value,
    });
  };

  // =========================
  // SAVE RESULTS
  // =========================

  const saveResults = async () => {

    try {

      if (!selectedExam) {

        alert("Select Exam");

        return;
      }

      for (const student of students) {

        const marks =
          Number(
            marksData[student.id] || 0
          );

          const existingQuery =
  query(
    collection(db, "results"),
    where(
      "examId",
      "==",
      selectedExam.id
    ),
    where(
      "studentId",
      "==",
      student.id
    )
  );

const existingSnapshot =
  await getDocs(existingQuery);

if (!existingSnapshot.empty) {

  continue;
}

        await addDoc(
          collection(db, "results"),
          {
            examId:
              selectedExam.id,

            examName:
              selectedExam.examName,

            subject:
              selectedExam.subject,

            batchId:
              selectedBatch,

            studentId:
              student.id,

            studentName:
              student.name,

            marks,

            totalMarks:
              selectedExam.totalMarks,

            percentage:
              (
                (marks /
                  selectedExam.totalMarks) *
                100
              ).toFixed(1),

            facultyName:
              facultyData.name,

            createdAt:
              new Date(),
          }
        );

      }

      alert("Results Uploaded");

    } catch (error) {

      console.log(error);
    }
  };

  // =========================
// HOMEWORK BATCH CHANGE
// =========================

const handleMarkHomeworkBatch =
async(batchId:string)=>{

setMarkHomeworkBatch(
batchId
);

setSelectedHomeworkId("");


// load students of selected batch

const studentQuery =
query(
collection(
db,
"students"
),
where(
"batchId",
"==",
batchId
)
);

const studentSnapshot =
await getDocs(
studentQuery
);

const studentData:any[]=[];

studentSnapshot.forEach(
(doc)=>{

studentData.push({

id:doc.id,

...doc.data()

});

}
);

setStudents(
studentData
);


// load homework only of batch

const hwQuery=
query(
collection(
db,
"homework"
),
where(
"batchId",
"==",
batchId
)
);

const hwSnapshot=
await getDocs(
hwQuery
);

const hwData:any[]=[];

hwSnapshot.forEach(
(doc)=>{

hwData.push({

id:doc.id,

...doc.data()

});

}
);

setHomeworks(
hwData
);

};

const handleHomeworkBatch =
(batchId:string)=>{

setHomeworkBatch(
  batchId
);

setHomeworkSubject("");

const assignment =
assignments.find(
(item)=>
item.batchId===batchId
);

setHomeworkSubjects(
assignment?.subjects || []
);

};

const handleHomeworkSelect =
async(homeworkId:string)=>{

setSelectedHomeworkId(
homeworkId
);

const statusData:any={};

for(
const student of students
){

const statusRef=
doc(
db,
"homeworkStatus",
`${homeworkId}_${student.id}`
);

const statusSnap=
await getDoc(
statusRef
);

if(
statusSnap.exists()
){

statusData[
student.id
]=
statusSnap.data().status;

}else{

statusData[
student.id
]="pending";

}

}

setHomeworkStatus(
statusData
);

};

  // =========================
  // ADD HOMEWORK
  // =========================

const addHomework = async () => {

  try {

    if (
      !homeworkBatch ||
      !homeworkSubject ||
      !homeworkTitle ||
      !homeworkDescription
    ) {

      alert(
        "Select Batch, Subject & Fill Fields"
      );

      return;
    }

    await addDoc(
      collection(db,"homework"),
      {
        batchId:
          homeworkBatch,

        subject:
          homeworkSubject,

        title:
          homeworkTitle,

        description:
          homeworkDescription,

        facultyName:
          facultyData.name,

        createdAt:
          new Date(),
      }
    );

    alert(
      "Homework Added"
    );

    setHomeworkTitle("");

    setHomeworkDescription("");

    setHomeworkBatch("");

    setHomeworkSubject("");

  } catch (error) {

    console.log(error);

  }

};

const saveHomeworkStatus =
async()=>{

try{

if(
!selectedHomeworkId
){

alert(
"Select homework"
);

return;

}

for(
const student
of students
){

await setDoc(

doc(
db,
"homeworkStatus",
`${selectedHomeworkId}_${student.id}`
),

{

homeworkId:
selectedHomeworkId,

studentId:
student.id,

studentName:
student.name,

status:
homeworkStatus[
student.id
] || "pending"

}

);

}

alert(
"Homework Updated"
);

}catch(error){

console.log(error);

}

};

  // =========================
  // LOADING
  // =========================

  if (!facultyData) {

    return (
      <main className="min-h-screen flex items-center justify-center text-4xl font-bold">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] p-6">

      {/* HEADER */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h1 className="text-5xl font-bold text-[#5A1E1E]">
          {facultyData.name}
        </h1>

      </div>

      {/* SELECT BATCH */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Select Batch
        </h2>

        <select
          className="border p-4 rounded-xl w-full"
          value={selectedBatch}
          onChange={(e) =>
            handleBatchChange(
              e.target.value
            )
          }
        >

          <option value="">
            Select Batch
          </option>

          {assignments.map(
            (assignment, index) => (

              <option
                key={index}
                value={assignment.batchId}
              >
                {assignment.batchName}
              </option>

            )
          )}

        </select>

      </div>

      {/* CREATE EXAM */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

        <h2 className="text-3xl font-bold mb-6">
          Create Exam
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <select
            className="border p-4 rounded-xl"
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(
                e.target.value
              )
            }
          >

            <option value="">
              Select Subject
            </option>

            {availableSubjects.map(
              (subject, index) => (

                <option
                  key={index}
                  value={subject}
                >
                  {subject}
                </option>

              )
            )}

          </select>

          <input
            type="text"
            placeholder="Exam Name"
            className="border p-4 rounded-xl"
            value={examName}
            onChange={(e) =>
              setExamName(
                e.target.value
              )
            }
          />

          <input
            type="date"
            className="border p-4 rounded-xl"
            value={examDate}
            onChange={(e) =>
              setExamDate(
                e.target.value
              )
            }
          />

          <input
            type="number"
            placeholder="Total Marks"
            className="border p-4 rounded-xl"
            value={totalMarks}
            onChange={(e) =>
              setTotalMarks(
                e.target.value
              )
            }
          />

        </div>

        <button
          onClick={createExam}
          className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
        >
          Create Exam
        </button>

      </div>

      {/* SELECT EXAM */}

<div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

  <h2 className="text-3xl font-bold mb-6">
    Select Exam
  </h2>

  <select
    className="border p-4 rounded-xl w-full"
    onChange={(e)=>
      selectExam(
        e.target.value
      )
    }
  >

    <option value="">
      Select Exam
    </option>

    {exams.map((exam)=>(

      <option
        key={exam.id}
        value={exam.id}
      >

        {exam.examName}
        {" • "}
        {exam.subject}
        {" • "}
        {exam.examDate}

      </option>

    ))}

  </select>

</div>


{/* EXAM DETAILS */}

{selectedExam && (

<div className="bg-blue-50 rounded-3xl p-6 mb-10">

<h2 className="text-3xl font-bold mb-4">
Exam Details
</h2>

<div className="grid md:grid-cols-2 gap-5">

<div>

<p className="text-gray-500">
Exam Name
</p>

<input
className="border p-3 rounded-xl w-full"
value={
selectedExam.examName
}
onChange={(e)=>

setSelectedExam({

...selectedExam,

examName:e.target.value

})

}
/>

</div>

<div>

<p className="text-gray-500">
Subject
</p>

<h3 className="text-2xl font-bold">
{selectedExam.subject}
</h3>

</div>

<div>

<p className="text-gray-500">
Date
</p>

<input
type="date"
className="border p-3 rounded-xl w-full"
value={
selectedExam.examDate
}
onChange={(e)=>

setSelectedExam({

...selectedExam,

examDate:e.target.value

})

}
/>

</div>

<div>

<p className="text-gray-500">
Total Marks
</p>

<input
type="number"
className="border p-3 rounded-xl w-full"
value={
selectedExam.totalMarks
}
onChange={(e)=>

setSelectedExam({

...selectedExam,

totalMarks:e.target.value

})

}
/>

</div>

</div>

<button
onClick={updateExam}
className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
>

Update Exam

</button>

</div>

)}

      {/* MARK ENTRY */}

      {selectedExam && (

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

          <h2 className="text-3xl font-bold mb-6">
            Upload Marks
          </h2>

          <div className="overflow-auto">

            <table className="w-full">

              <thead className="bg-[#5A1E1E] text-white">

                <tr>

                  <th className="p-4 text-left">
                    Student ID
                  </th>

                  <th className="p-4 text-left">
                    Student Name
                  </th>

                  <th className="p-4 text-left">
                    Marks
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b"
                  >

                    <td className="p-4">
                      {student.id}
                    </td>

                    <td className="p-4">
                      {student.name}
                    </td>

                    <td className="p-4">

                      <input
                        type="number"
                        className="border p-3 rounded-lg w-32"
                        value={
                          marksData[
                            student.id
                          ] || ""
                        }
                        onChange={(e) =>
                          handleMarksChange(
                            student.id,
                            e.target.value
                          )
                        }
                      />

                      <p className="text-sm text-gray-500 mt-1">
  Max:
  {" "}
  {selectedExam.totalMarks}
</p>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <button
            onClick={saveResults}
            className="mt-8 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
          >
            Save Results
          </button>

        </div>

      )}

      {/* HOMEWORK */}

      <div className="bg-white rounded-3xl shadow-xl p-6">

        <h2 className="text-3xl font-bold mb-6">
          Add Homework
        </h2>

        <div className="grid gap-4">

<select
className="border p-4 rounded-xl"
value={homeworkBatch}
onChange={(e)=>
handleHomeworkBatch(
e.target.value
)
}
>

<option value="">
Select Batch
</option>

{assignments.map(
(assignment,index)=>(

<option
key={index}
value={assignment.batchId}
>
{assignment.batchName}
</option>

)
)}

</select>


<select
className="border p-4 rounded-xl"
value={homeworkSubject}
onChange={(e)=>
setHomeworkSubject(
e.target.value
)
}
>

<option value="">
Select Subject
</option>

{homeworkSubjects.map(
(subject,index)=>(

<option
key={index}
value={subject}
>
{subject}
</option>

)
)}

</select>


<input
type="text"
placeholder="Homework Title"
className="border p-4 rounded-xl"
value={homeworkTitle}
onChange={(e)=>
setHomeworkTitle(
e.target.value
)
}
/>

<textarea
placeholder="Homework Description"
className="border p-4 rounded-xl"
rows={5}
value={homeworkDescription}
onChange={(e)=>
setHomeworkDescription(
e.target.value
)
}
/>

<button
onClick={addHomework}
className="bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
>
Add Homework
</button>

</div>

      </div>

{/* MARK HOMEWORK STATUS */}

<div className="bg-white rounded-3xl shadow-xl p-6 mt-10">

<h2 className="text-3xl font-bold mb-6">
Mark Homework
</h2>


<select
className="border p-4 rounded-xl w-full mb-4"
value={markHomeworkBatch}
onChange={(e)=>
handleMarkHomeworkBatch(
e.target.value
)
}
>

<option value="">
Select Batch
</option>

{assignments.map(
(assignment,index)=>(

<option
key={index}
value={
assignment.batchId
}
>

{assignment.batchName}

</option>

)
)}

</select>


<select
className="border p-4 rounded-xl w-full mb-6"
value={selectedHomeworkId}
onChange={(e)=>
handleHomeworkSelect(
e.target.value
)
}
>

<option value="">
Select Homework
</option>

{homeworks.map(
(hw)=>(

<option
key={hw.id}
value={hw.id}
>

{hw.title}

{" - "}

{hw.subject}

</option>

)
)}

</select>


{selectedHomeworkId && (

<>

<div className="space-y-4">

{students.map(
(student)=>(

<div
key={student.id}
className="flex justify-between items-center border rounded-xl p-4"
>

<h3 className="font-bold">
{student.name}
</h3>

<select
className="border p-2 rounded-xl"
value={
homeworkStatus[
student.id
] || "pending"
}
onChange={(e)=>

setHomeworkStatus({

...homeworkStatus,

[student.id]:
e.target.value

})

}
>

<option value="pending">
Not Done
</option>

<option value="done">
Done
</option>

</select>

</div>

)
)}

</div>

<button
onClick={
saveHomeworkStatus
}
className="mt-6 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
>

Save Homework Status

</button>

</>

)}

</div>

    </main>
  );
}