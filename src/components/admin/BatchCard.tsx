"use client";

import { useState } from "react";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "@/firebase/firebaseConfig";

export default function BatchCard({
  batch,
  onClick,
}: any) {

  const [editing,
    setEditing] =
    useState(false);

  const [subjects,
    setSubjects] =
    useState<string[]>(
      batch.subjects || []
    );

  const [newSubject,
    setNewSubject] =
    useState("");

  // =========================
  // ADD SUBJECT
  // =========================

  const addSubject = () => {

    if (!newSubject) return;

    setSubjects([
      ...subjects,
      newSubject,
    ]);

    setNewSubject("");
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
  // SAVE BATCH
  // =========================

  const saveBatch = async () => {

    try {

      await updateDoc(
        doc(
          db,
          "batches",
          batch.id
        ),
        {
          subjects,
        }
      );

      alert(
        "Batch Updated"
      );

      setEditing(false);

    } catch (error) {

      console.log(error);

      alert(
        "Failed to update"
      );
    }
  };

  return (

    <div className="border p-6 rounded-2xl bg-white shadow">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div
          onClick={onClick}
          className="cursor-pointer"
        >

          <h3 className="text-2xl font-bold">
            {batch.name}
          </h3>

        </div>

        <button
          onClick={() =>
            setEditing(
              !editing
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >

          {editing
            ? "Cancel"
            : "Edit"}

        </button>

      </div>

      {/* SUBJECTS */}

      <div className="mt-5 flex flex-wrap gap-3">

        {subjects.map(
          (
            subject,
            index
          ) => (

            <div
              key={index}
              className="bg-gray-200 px-4 py-2 rounded-xl flex items-center gap-3"
            >

              {subject}

              {editing && (

                <button
                  onClick={() =>
                    removeSubject(
                      subject
                    )
                  }
                  className="text-red-500"
                >
                  ✕
                </button>

              )}

            </div>

          )
        )}

      </div>

      {/* EDIT AREA */}

      {editing && (

        <div className="mt-6">

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="New Subject"
              value={newSubject}
              onChange={(e) =>
                setNewSubject(
                  e.target.value
                )
              }
              className="border p-3 rounded-xl flex-1"
            />

            <button
              onClick={addSubject}
              className="bg-green-600 text-white px-5 rounded-xl"
            >
              Add
            </button>

          </div>

          <button
            onClick={saveBatch}
            className="mt-5 bg-[#5A1E1E] text-white px-6 py-3 rounded-xl"
          >
            Save Changes
          </button>

        </div>

      )}

    </div>
  );
}