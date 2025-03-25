'use client'
import SubsTableItem from '@/Components/AdminComponents/SubsTableItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchEmails = async () => {
    try {
      const response = await axios.get('/api/email');
      setEmails(response.data.emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to fetch subscriptions.");
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  const deleteEmail = async (mongoId) => {
    try {
      const response = await axios.delete('/api/email', {
        params: { id: mongoId }
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchEmails(); // Refresh list after deletion
      } else {
        toast.error("Error deleting email.");
      }
    } catch (error) {
      console.error("Error deleting email:", error);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1>All Subscriptions</h1>
      
      {loading ? (
        <p className="mt-4 text-gray-500">Loading subscriptions...</p>
      ) : (
        <div className='relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-left text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-3'>Email Subscription</th>
                <th scope='col' className='hidden sm:block px-6 py-3'>Date</th>
                <th scope='col' className='px-6 py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {emails.length > 0 ? (
                emails.map((item) => (
                  <SubsTableItem 
                    key={item._id} 
                    mongoId={item._id} 
                    deleteEmail={deleteEmail} 
                    email={item.email} 
                    date={item.date} 
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
