import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/Assets/assets";

const BlogTableItem = ({ authorImg, title, author, date, deleteBlog, mongoId }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [portalElement, setPortalElement] = useState(null);

    // Manage portal container lifecycle
    useEffect(() => {
        if (showConfirm) {
            const el = document.createElement('div');
            document.body.appendChild(el);
            setPortalElement(el);
            return () => {
                document.body.removeChild(el);
                setPortalElement(null);
            };
        }
    }, [showConfirm]);

    const handleDelete = () => {
        if (!mongoId) {
            alert("Error: Blog ID is missing!");
            return;
        }
        setShowConfirm(true);
    };

    const confirmDelete = () => {
        deleteBlog(mongoId);
        setShowConfirm(false);
    };

    return (
        <>
            {/* Table Row */}
            <tr className="border-b hover:bg-gray-100 transition text-gray-700">
                <th scope="row" className="px-6 py-4 text-left font-medium whitespace-nowrap">
                    <div className="flex items-center gap-3">
                        <Image
                            width={40}
                            height={40}
                            src={authorImg || assets?.profile_icon}
                            alt={author || "Profile Image"}
                            className="rounded-full border border-gray-300"
                        />
                        <span>{author || "No Author"}</span>
                    </div>
                </th>
                <td className="px-6 py-4">{title || "No Title"}</td>
                <td className="px-6 py-4">{date ? new Date(date).toDateString() : "No Date"}</td>
                <td className="px-6 py-4">
                    <div className="flex gap-4">
                        <Link href={`/admin/editBlog/${mongoId}`} className="text-blue-500 hover:underline">
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </div>
                </td>
            </tr>

            {/* Portal-based Modal */}
            {showConfirm && portalElement && createPortal(
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        <p className="text-lg font-semibold">Are you sure you want to delete this blog?</p>
                        <div className="flex justify-center gap-4 mt-4">
                            <button 
                                onClick={() => setShowConfirm(false)} 
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>,
                portalElement
            )}
        </>
    );
};

export default BlogTableItem;