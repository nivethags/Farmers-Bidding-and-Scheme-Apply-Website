const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mysql = require("mysql2");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');




app.use(cors());
app.use(express.json());
app.use(upload.single('image'));




app.post('/addproduct', (req, res) => {
    console.log('Request Body:', req.body.product);
    const data = JSON.parse(req.body.product);

    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required.' });
    }

    const imageFile = req.file;
    const imagePath = `uploads/${imageFile.filename}`; // Assuming the images are stored in the 'uploads' directory
    const cat_img = `uploads/category_image/${imageFile.filename}`;
    const sql = `INSERT INTO products (id, price, brand, description, image , category) VALUES (?, ?, ?, ?, ?, ? )`;
    const values = [
        data.id,
        data.price,
        data.brand,
        data.description,
        imagePath,
        data.category
    ];

    connection.query(sql, values, (err, result) => {
       
        if (err) {
           
            if (err.code === 'ER_DUP_ENTRY') {
                // deleteImage(imagePath);
                fs.unlinkSync(imagePath);
                res.send("ID Already Exist.");
                return;
            } 
             if(values[0]===null||values[0]===undefined||values[1]===null||values[1]===undefined||values[2]===null||values[2]===undefined||values[3]===null||values[3]===null||values[4]===null||values[4]===undefined||values[5]===null||values[5]===undefined||values[6]===null||values[6]===undefined){
                console.log("id",values[0]);
                // deleteImage(imagePath);
                fs.unlinkSync(imagePath);
                res.send("Fill All Data....");
                return;
                
            }
            else {
                console.log("error",err.stack);
                res.status(500).json({ error: "Internal Server Error" });
                // deleteImage(imagePath);
                fs.unlinkSync(imagePath);
                return ;
            }
           
        } 
        else {
            console.log("Data added....");
            res.send("Sucussfully Added....");
        }
        });
});