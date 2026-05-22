// src/components/admin/StudentCard.tsx

export default function StudentCard({
  student,
  onClick,
}: any) {

  return (

    <div
      onClick={onClick}
      className="border rounded-2xl p-5 cursor-pointer hover:bg-gray-50 transition"
    >

      <h3 className="text-xl font-bold">
        {student.name}
      </h3>

      <p className="mt-2 text-gray-700">
        {student.email}
      </p>

      <p className="mt-1 text-gray-500">
        {student.batchName}
      </p>

    </div>
  );
}