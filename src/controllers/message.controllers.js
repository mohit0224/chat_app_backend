import { io } from "../app.js";
import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import { checkUserIDInUsersAndReturnSocketId } from "../provider/socketProvider.provider.js";
import asyncHandler from "../utils/asynchandler.utils.js";
import { apiError, apiResponse } from "../utils/httpresponse.utils.js";

export const sendMessage = asyncHandler(async (req, res) => {
    const { id: senderID } = req.user;
    const { id: receiverID } = req.params;
    const message = req.body?.message?.trim();

    if (!message) {
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
        message: message,
    });

    const savedMessage = await newMessage.save();

    const senderSocketId = checkUserIDInUsersAndReturnSocketId(senderID);
    const receiverSocketId = checkUserIDInUsersAndReturnSocketId(receiverID);

    if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", savedMessage);
    }
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    conversation.messages.push(savedMessage._id);
    await conversation.save();

    const sender = await User.findById(senderID);
    const receiver = await User.findById(receiverID);

    if (!sender.conversation.includes(conversation._id)) {
        sender.conversation.push(conversation._id);
        await sender.save();
    }

    if (!receiver.conversation.includes(conversation._id)) {
        receiver.conversation.push(conversation._id);
        await receiver.save();
    }

    const senderConversationUser = await Conversation.find({
        participants: senderID,
    }).populate({
        path: "participants",
        match: { _id: { $ne: senderID } },
        select: "username email",
    });

    const receiverConversationUser = await Conversation.find({
        participants: receiverID,
    }).populate({
        path: "participants",
        match: { _id: { $ne: receiverID } },
        select: "username email",
    });

    if (senderSocketId) {
        io.to(senderSocketId).emit(
            "newConversationUser",
            senderConversationUser
        );
    }
    if (receiverSocketId) {
        io.to(receiverSocketId).emit(
            "newConversationUser",
            receiverConversationUser
        );
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
