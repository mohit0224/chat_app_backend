import { io } from "../app.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { checkUserIDInUsersAndReturnSocketId } from "../provider/socketProvider.provider.js";
import asyncHandler from "../utils/asynchandler.utils.js";
import { apiError, apiResponse } from "../utils/httpresponse.utils.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const { id: senderID } = req.user;
    const { id: receiverID } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === "") {
        throw new apiError(400, "Message is required");
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderID, receiverID] },
    });

    if (!conversation) {
        conversation = new Conversation({
            participants: [senderID, receiverID],
            messages: [],
        });
    }

    const newMessage = new Message({
        senderID,
        receiverID,
        message: message.trim(),
    });

    const savedMessage = await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const senderSocketId = checkUserIDInUsersAndReturnSocketId(senderID);
    const receiverSocketId = checkUserIDInUsersAndReturnSocketId(receiverID);

    if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", savedMessage);
    }
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    res.status(201).json(
        new apiResponse(201, "Message sent successfully !!", savedMessage)
    );
});

export const getMessage = asyncHandler(async (req, res) => {
    const { id: senderID } = req.user; //! Sender's ID
    const { id: receiverID } = req.params; //! Receiver's ID

    const conversation = await Conversation.findOne({
        participants: { $all: [senderID, receiverID] },
    }).populate("messages");

    if (!conversation) {
        throw new apiError(
            404,
            "Conversation not found. Create a conversation first."
        );
    }

    res.status(200).json(
        new apiResponse(
            200,
            "Messages fetched successfully!",
            conversation.messages
        )
    );
});
