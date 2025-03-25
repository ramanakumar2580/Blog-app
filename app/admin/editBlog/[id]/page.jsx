'use client'
import { assets } from '@/Assets/assets';
import { useParams, useRouter } from 'next/navigation'; 
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const EditBlogPage = () => {
  const { id } = useParams(); 
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
  });
  const [currentImage, setCurrentImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBlogData = async () => {
      const response = await axios.get('/api/blog', {
        params: { id }
      });
      setBlogData(response.data);
      setCurrentImage(response.data.image); // Set the current image for display
    };

    if (id) fetchBlogData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogData({ ...blogData, image: file });
    
    // Generate preview for the selected image
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('description', blogData.description);
    formData.append('category', blogData.category);

    // If a new image is provided, append it to the form data
    if (blogData.image) {
      formData.append('image', blogData.image);
    }

    const response = await axios.put(`/api/blog`, formData, {
      params: { id }
    });

    if (response.data.success) {
      router.push('/admin/blogList');
    }
  };

  return (
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <h1 className='text-3xl font-semibold text-center'>Edit Blog</h1>
      <form className='max-w-[600px] mx-auto mt-10' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-lg font-medium mb-2'>Title</label>
          <input 
            type='text' 
            name='title' 
            value={blogData.title} 
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg' 
          />
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-medium mb-2'>Description</label>
          <textarea 
            name='description' 
            value={blogData.description} 
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg' 
            rows='8' // Increased size of the description
          />
        </div>

        <div className='mb-4'>
          <label className='block text-lg font-medium mb-2'>Category</label>
          <input 
            type='text' 
            name='category' 
            value={blogData.category} 
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg' 
          />
        </div>

        {imagePreview && (
          <div className='mb-4'>
            <label className='block text-lg font-medium mb-2'>Updated Blog Image</label>
            <Image src={imagePreview} alt="Updated Blog Image" width={300} height={200} className="border" />
          </div>
        )}

        {!imagePreview && currentImage && (
          <div className='mb-4'>
            <label className='block text-lg font-medium mb-2'>Current Blog Image</label>
            <Image src={currentImage} alt="Current Blog Image" width={300} height={200} className="border" />
          </div>
        )}

        <div className='mb-4'>
          <label className='block text-lg font-medium mb-2'>Blog Image</label>
          <input 
            type='file' 
            name='image' 
            onChange={handleImageChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg' 
          />
        </div>

        <div className='flex justify-center'>
          <button type='submit' className='bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700'>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;