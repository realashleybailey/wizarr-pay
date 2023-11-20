import axios from "axios";

/**
 * Create a new invitation in Wizarr
 * 
 * @param {object} newInvitation 
 * @returns {Promise<string>} code
 */
const createInvitation = async (newInvitation) => {
    // Create form data for request
    const formData = new FormData();

    // Append all data to form data
    for (const key in newInvitation) {
        if (newInvitation[key] == null) continue;
        formData.append(key, newInvitation[key]);
    }

    // Token for Wizarr API
    const API_URL = process.env.WIZARR_URL;
    const TOKEN = process.env.WIZARR_API_TOKEN;

    // Send request to Wizarr API to create new invitation
    const wizarrResponse = await axios(`${API_URL}/api/invitations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
        },
        data: formData,
    });

    // Check if request was successful
    if (wizarrResponse && wizarrResponse.status != 200) {
        throw new Error("Error calling Wizarr API:", wizarrResponse);
    }

    // Check if response has code
    if (!wizarrResponse.data.code) {
        throw new Error("Error creating invitation:", wizarrResponse);
    }

    // Debug Logging for response
    if (process.env.DEBUG) {
        console.log("Wizarr Response:", await wizarrResponse.data);
    }

    // Return the code from the response.data
    return wizarrResponse.data.code;
};

export { createInvitation };