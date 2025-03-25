'use client'
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blog');
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error('Failed to fetch blogs');
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await axios.delete(`/api/blog`, {
        params: { id }
      });
      toast.success(response.data.msg);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-3xl font-semibold'>All Blogs</h1>
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='hidden sm:block px-6 py-3'>Author</th>
              <th scope='col' className='px-6 py-3'>Title</th>
              <th scope='col' className='px-6 py-3'>Date</th>
              <th scope='col' className='px-2 py-3'>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogTableItem
                  key={index}
                  mongoId={blog._id}
                  title={blog.title}
                  author={blog.author}
                  authorImg={blog.image} 
                  date={blog.date}
                  deleteBlog={deleteBlog}
                />
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center py-5 text-gray-600'>No blogs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;