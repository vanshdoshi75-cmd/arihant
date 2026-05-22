// src/components/admin/FacultyCard.tsx

export default function FacultyCard({
  faculty,
  onClick,
}: any) {

  return (

    <div
      onClick={onClick}
      className="border rounded-2xl p-5 cursor-pointer hover:bg-gray-50 transition"
    >

      <h3 className="text-xl font-bold">
        {faculty.name}
      </h3>

      <p className="mt-2 text-gray-700">
        {faculty.email}
      </p>

      <div className="mt-3">

        {faculty.assignments?.map(
          (
            item: any,
            index: number
          ) => (

            <div
              key={index}
              className="text-sm text-gray-500"
            >
              {item.batchName}
            </div>

          )
        )}

      </div>

    </div>
  );
}