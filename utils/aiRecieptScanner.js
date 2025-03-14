import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function processReciept(file) {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });
    console.log(file);
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert ArrayBuffer to Base64
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Name of each item
      - amount of each item (just the amount, no currency symbol and if any other currency other than INR is their convert it to INR)
      - Date, if any otherwise give null (in ISO format)
      - Description of items purchased, if any (brief summary)
      
      List all the items with their details in a json format.
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "createdAt": "ISO date string",
        "description": "string",
        "name": "string"
      }
      If the image is not a reciept, return an empty object. (By a reciept i meant a bill or something used to purchase something)
      If its not a recipt, return an empty object.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    try {
      // Parse the cleanedText into a JSON array
      const jsonData = JSON.parse(cleanedText);
    //   const jsonData = JSON.parse(`[${cleanedText}]`);

      // Return or log the JSON data
      console.log(jsonData);
      return jsonData; // If in a function
    } catch (parseError) {
      toast.error("Error parsing JSON response:", parseError);
    //   throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    toast.error("Error scanning receipt:", error);
    // throw new Error("Failed to scan receipt");
  } 
}
