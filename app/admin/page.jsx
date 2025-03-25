"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  // Fetch Blogs
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setBlogs(data.blogs || []);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Blog Count */}
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-lg font-semibold">Total Blogs: {blogs.length}</h2>

      {/* Recent Blogs Section */}
      <div className="w-full max-w-2xl text-center mt-6">
        <h3 className="text-xl font-semibold mb-3">Recent Blogs</h3>
        {blogs.length > 0 ? (
          <ul className="space-y-2">
            {blogs.slice(0, 5).map((blog) => (
              <li
                key={blog._id}
                className="border p-3 rounded-md shadow-md bg-white"
              >
                <h4 className="font-medium">{blog.title}</h4>
                <p className="text-gray-600 text-sm">{blog.createdAt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No blogs available.</p>
        )}
      </div>

      {/* Add Blog Button - BELOW Recent Blogs */}
      <button
        onClick={() => router.push("/admin/addBlog")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition my-6"
      >
        ➕ Add Blog
      </button>
    </div>
  );
}
