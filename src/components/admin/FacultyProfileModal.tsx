"use client";

export default function FacultyProfileModal({
  faculty,
  onClose,
}: any) {

  if (!faculty) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 overflow-y-auto">

      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-4xl font-bold">
            Faculty Profile
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        {/* BASIC DETAILS */}

        <div className="space-y-5 text-lg">

          <p>
            <strong>Name:</strong>
            {" "}
            {faculty.name}
          </p>

          <p>
            <strong>Email:</strong>
            {" "}
            {faculty.email}
          </p>

          <div>

            <strong>
              Assigned Subjects
            </strong>

            <div className="mt-5 space-y-4">

              {faculty.assignments?.map(
                (
                  item: any,
                  index: number
                ) => (

                  <div
                    key={index}
                    className="border rounded-2xl p-5"
                  >

                    <p>
                      <strong>Batch:</strong>
                      {" "}
                      {item.batchName}
                    </p>

                    <p className="mt-2">
                      <strong>Subjects:</strong>
                      {" "}
                      {item.subjects.join(", ")}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-10 bg-[#5A1E1E] text-white px-8 py-4 rounded-xl"
        >
          Close
        </button>

      </div>

    </div>
  );
}