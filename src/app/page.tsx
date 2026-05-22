"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {

const router = useRouter();

return (

<main className="min-h-screen bg-[#F8F4EF]">

{/* HERO */}

<div className="bg-[#5A1E1E] text-white py-24 px-6">

<div className="max-w-6xl mx-auto text-center">

<h1 className="text-6xl font-bold mb-6">
Arihant Coaching
</h1>

<p className="text-xl max-w-3xl mx-auto leading-9">

Empowering students with quality education,
personal guidance, regular tests, homework tracking,
and performance monitoring to help every student
reach their highest potential.

</p>

<button
onClick={() => router.push("/login")}
className="mt-10 bg-white text-[#5A1E1E] px-10 py-4 rounded-2xl text-xl font-bold hover:scale-105 transition"
>

Login

</button>

</div>

</div>


{/* ABOUT */}

<div className="max-w-6xl mx-auto p-8">

<div className="bg-white rounded-3xl shadow-xl p-10">

<h2 className="text-4xl font-bold text-[#5A1E1E] mb-6">
About Arihant Coaching
</h2>

<p className="text-gray-700 text-lg leading-9">

At Arihant Coaching, we believe education is more
than completing a syllabus. Our mission is to build
strong concepts, improve academic performance,
and guide students with discipline and consistency.

We provide:

</p>

<div className="grid md:grid-cols-2 gap-6 mt-8">

<div className="bg-[#F8F4EF] p-6 rounded-2xl">

<h3 className="font-bold text-2xl mb-3">
Regular Exams
</h3>

<p>
Track student performance with scheduled tests.
</p>

</div>

<div className="bg-[#F8F4EF] p-6 rounded-2xl">

<h3 className="font-bold text-2xl mb-3">
Homework Monitoring
</h3>

<p>
Faculty can assign and monitor homework progress.
</p>

</div>

<div className="bg-[#F8F4EF] p-6 rounded-2xl">

<h3 className="font-bold text-2xl mb-3">
Personal Attention
</h3>

<p>
Focused support for every student.
</p>

</div>

<div className="bg-[#F8F4EF] p-6 rounded-2xl">

<h3 className="font-bold text-2xl mb-3">
Result Tracking
</h3>

<p>
Detailed marks and academic reports.
</p>

</div>

</div>

</div>

</div>


{/* CONTACT */}

<div className="bg-white mt-16 py-12">

<div className="max-w-6xl mx-auto text-center">

<h2 className="text-4xl font-bold text-[#5A1E1E] mb-4">
Contact Us
</h2>

<p className="text-2xl">
📞 9537587535
Mr. Krushil Koradiya
</p>

<p className="text-gray-500 mt-4">
Feel free to contact us for admission inquiries.
</p>

</div>

</div>

</main>

);

}