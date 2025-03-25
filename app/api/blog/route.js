import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import EmailModel from "@/lib/models/EmailModel";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";

// Connect to Database
const LoadDB = async () => {
  await ConnectDB();
};

LoadDB();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails to all subscribers
async function sendEmailToSubscribers(blogTitle, blogLink) {
  try {
    await ConnectDB();
    const subscribers = await EmailModel.find({});

    if (subscribers.length === 0) return;

    const recipientEmails = subscribers.map((sub) => sub.email).join(",");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmails,
      subject: `New Blog Published: ${blogTitle}`,
      html: `<p>A new blog has been published: <strong>${blogTitle}</strong></p>
             <p>Read it here: <a href="${blogLink}" target="_blank">${blogLink}</a></p>
             <p>Thank you for subscribing!</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

// API: Get all blogs or a single blog by ID
export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");

  if (blogId) {
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ success: false, msg: "Blog not found" });
    }
    return NextResponse.json(blog);
  } else {
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs });
  }
}

// API: Upload a new blog
export async function POST(request) {
  const formData = await request.formData();
  const timestamp = Date.now();

  const image = formData.get("image");
  if (!image) {
    return NextResponse.json({ success: false, msg: "Image is required" });
  }

  const imageByteData = await image.arrayBuffer();
  const buffer = Buffer.from(imageByteData);
  const path = `./public/${timestamp}_${image.name}`;
  await writeFile(path, buffer);
  const imgUrl = `/${timestamp}_${image.name}`;

  const blogData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    author: formData.get("author"),
    image: imgUrl,
    authorImg: formData.get("authorImg"),
  };

  const newBlog = await BlogModel.create(blogData);
  console.log("Blog Saved");

  // Send email notification to subscribers
  const blogLink = `https://yourwebsite.com/blog/${newBlog._id}`;
  await sendEmailToSubscribers(blogData.title, blogLink);

  return NextResponse.json({ success: true, msg: "Blog Added" });
}

// API: Update a blog
export async function PUT(request) {
  const formData = await request.formData();
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, msg: "Blog ID is required" });
  }

  const blog = await BlogModel.findById(id);
  if (!blog) {
    return NextResponse.json({ success: false, msg: "Blog not found" });
  }

  let imgUrl = blog.image; // Keep the old image if no new image is provided

  const newImage = formData.get("image");
  if (newImage && newImage.name) {
    // Delete old image from the public folder
    if (blog.image) {
      const oldImagePath = `./public${blog.image}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
    }

    // Save new image
    const timestamp = Date.now();
    const imageByteData = await newImage.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${newImage.name}`;
    await writeFile(path, buffer);
    imgUrl = `/${timestamp}_${newImage.name}`;
  }

  // Update blog details
  const updatedData = {
    title: formData.get("title") || blog.title,
    description: formData.get("description") || blog.description,
    category: formData.get("category") || blog.category,
    author: formData.get("author") || blog.author,
    image: imgUrl,
    authorImg: formData.get("authorImg") || blog.authorImg,
  };

  await BlogModel.findByIdAndUpdate(id, updatedData);
  return NextResponse.json({ success: true, msg: "Blog Updated" });
}

// API: Delete a blog (Updated to properly delete the saved image)
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ success: false, msg: "Blog ID is required" });
  }

  const blog = await BlogModel.findById(id);
  if (!blog) {
    return NextResponse.json({ success: false, msg: "Blog not found" });
  }

  // Delete image from the public folder
  if (blog.image) {
    const imagePath = `./public${blog.image}`;
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully:", imagePath);
        }
      });
    } else {
      console.warn("Image not found:", imagePath);
    }
  }

  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, msg: "Blog Deleted" });
}
