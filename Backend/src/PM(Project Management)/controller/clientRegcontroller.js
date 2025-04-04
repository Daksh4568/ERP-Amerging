const LeadSchema = require("../models/clientRegistrationModel")
const connectToDatabase = require("../../HR Module/db/db")

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