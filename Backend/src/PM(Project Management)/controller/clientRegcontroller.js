const LeadSchema = require("../models/clientRegistrationModel")
const connectToDatabase = require("../../HR Module/db/db")
const nodemailer = require("nodemailer")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
})
exports.createLeadForm = async (leadformdata, user) => {

    try {

        await connectToDatabase();

        const leadForm = new LeadSchema({
            ...leadformdata,
            addedBy: {
                name: user.name,
                role: user.role
            }
        });

        const savedData = await leadForm.save();

        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: leadformdata.email,
            subject: "Lead Form Submission",
            html: `<p>Dear ${leadformdata.firstName || "Client"},</p>
                   <p>Thank you for registering with us. Our team will contact you shortly.</p>
                   <p>Best regards,<br/>Your Company Name</p>`
        };
        await transporter.sendMail(clientMailOptions)

        // --- Send email to admin ---
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: 'arun@amergingtech.com', // Replace with actual admin email
            subject: 'New Client Registration',
            html: `<p>A new client has registered:</p>
                   <ul>
                     <li><strong>Name:</strong> ${leadformdata.firstName}</li>
                     <li><strong>Email:</strong> ${leadformdata.email}</li>
                     <li><strong>Email:</strong> ${leadformdata.company}</li>
                     <li><strong>Phone:</strong> ${leadformdata.phone || 'N/A'}</li>
                   </ul>`
        };

        await transporter.sendMail(adminMailOptions);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Lead Form submitted successfully',
                data: savedData,
            }),
        };

    } catch (e) {
        console.log("Error in LeadSchema", e)

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Errorsaving the lead form data',
                error: e.message
            })
        }
    }
};