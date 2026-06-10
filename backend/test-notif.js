import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import { createNotification } from './src/services/notification.service.js';
import User from './src/models/user/user.model.js';
import mongoose from 'mongoose';

async function testNotification() {
    await connectDB();

    const user = await User.findOne({ role: /DEV/i });
    if (!user) {
        console.log("No DEV user found to test with.");
        process.exit(0);
    }

    console.log(`Sending test notification to ${user.name} (${user._id})`);

    try {
        const notif = await createNotification({
            recipient: user._id,
            title: "Test Notification",
            message: "This is a test notification from the debug script.",
            type: "info",
            link: "/dev/notifications"
        });
        console.log("Notification created successfully:", notif);
    } catch (err) {
        console.error("Failed to create notification:", err);
    }

    process.exit(0);
}

testNotification();
