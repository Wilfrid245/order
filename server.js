require('dotenv').config();
console.log('Environment variables:', {
    email: process.env.EMAIL,
    password: process.env.PASSWORD ? '****' : 'not set'
});
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://wilfrid245.github.io/order/'],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Verify email configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP server connection error:', error);
    } else {
        console.log('SMTP server connection successful', success);
    }
});

// Order Route
app.post('/orders', (req, res) => {
    console.log('Received request body:', req.body);
    const { name, tel, email, order, quantity } = req.body;
    
    console.log('Email config:', {
        from: process.env.EMAIL,
        to: 'mswilfrid@gmail.com'
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: 'mswilfrid@gmail.com',
        subject: 'New Order Received',
        text: `
            Name: ${name}
            Phone Number: ${tel}
            Email: ${email || 'N/A'}
            Order: ${order}
            Quantity: ${quantity}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Detailed email error:', error);
            return res.status(500).json({ error: 'Error sending email.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Order submitted successfully.' });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
