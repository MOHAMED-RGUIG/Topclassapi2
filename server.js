require("dotenv").config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const db = require("./db");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://topclass1.vercel.app/' , // Replace with your frontend's URL
methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials:true}));

const productsRoute = require('./routes/productsRoute');
const userRoute = require('./routes/userRoute');
const ordersRoute = require('./routes/ordersRoute');

app.use('/api/products/', productsRoute);
app.use('/api/users/', userRoute);
app.use('/api/orders/', ordersRoute);

// Endpoint to send email
app.post('/send-email', (req, res) => {
    console.log('Request received:', req.body);
    const { email, subject, text, pdfData } = req.body;

    // Decode the base64 PDF data
    const pdfBuffer = Buffer.from(pdfData, 'base64');

    // Create a Nodemailer transporter using your email provider's SMTP settings
    let transporter = nodemailer.createTransport({
        host: process.env.SMTPHOST,
        port: process.env.SMTPPORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTPUSER,
            pass: process.env.SMTPPASS,
        },
    });

    // Setup email data
    let mailOptions = {
        from: process.env.SMPTUSER,
        to: email,
        subject: subject,
        text: text,
        attachments: [
            {
                filename: 'order.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.get("/", async (req, res) => {
    res.send("Server working!!!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
