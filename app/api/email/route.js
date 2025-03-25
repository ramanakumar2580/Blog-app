import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

//  API: Add a new subscriber
export async function POST(request) {
    try {
        await ConnectDB();

        const formData = await request.formData();
        const email = formData.get("email");

        if (!email) {
            return NextResponse.json({ success: false, msg: "Email is required" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, msg: "Invalid email format" }, { status: 400 });
        }

        const existingEmail = await EmailModel.findOne({ email });
        if (existingEmail) {
            return NextResponse.json({ success: false, msg: "Email already subscribed" }, { status: 400 });
        }

        await EmailModel.create({ email });

        return NextResponse.json({ success: true, msg: "Email Subscribed" }, { status: 201 });

    } catch (error) {
        console.error("Error in POST /api/email:", error);
        return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
    }
}

// API: Get all emails
export async function GET() {
    try {
        await ConnectDB();
        const emails = await EmailModel.find({}).lean();
        return NextResponse.json({ success: true, emails }, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/email:", error);
        return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
    }
}

//  API: Delete a subscriber email
export async function DELETE(request) {
    try {
        await ConnectDB();
        const id = request.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, msg: "Email ID is required" }, { status: 400 });
        }

        const deletedEmail = await EmailModel.findByIdAndDelete(id);
        if (!deletedEmail) {
            return NextResponse.json({ success: false, msg: "Email not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, msg: "Email Deleted" }, { status: 200 });

    } catch (error) {
        console.error("Error in DELETE /api/email:", error);
        return NextResponse.json({ success: false, msg: "Server error" }, { status: 500 });
    }
}

//  Function to send emails to all subscribers
export async function sendEmailToSubscribers(blogTitle, blogLink) {
    try {
        await ConnectDB();
        const subscribers = await EmailModel.find({});

        if (subscribers.length === 0) return;

        const recipientEmails = subscribers.map(sub => sub.email).join(",");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmails,
            subject: `New Blog: ${blogTitle}`,
            html: `<p>A new blog has been published: <strong>${blogTitle}</strong></p>
                   <p>Read it here: <a href="${blogLink}" target="_blank">${blogLink}</a></p>
                   <p>Thank you for subscribing!</p>`
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error("Error sending emails:", error);
    }
}
