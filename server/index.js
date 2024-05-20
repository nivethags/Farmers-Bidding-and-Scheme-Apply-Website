const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require("multer");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const nodemailler = require('nodemailer');
const { env } = require('process');
const { resourceLimits } = require('worker_threads');
require('dotenv').config();
const app = express();
const PDFDocument = require('pdfkit');


app.use("/uploads", express.static("uploads"));
app.use('/profile/', express.static('profile'));

app.use(express.json());
app.use(cors());


const storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname);
        }
    }
)

const upload = multer({
    storage: storage,
    // limits:5*1024*1024
})

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'agriconn',
});

db.connect(err => {
    if (err) {
        console.log("error in connecting database....", err);
    }
    else {
        console.log("Database Connected....");
    }
})

const transporter = nodemailler.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: 'enter your sender mail id',
        pass: "enter your passkey",
    },
})


const sendConformationMail = (values) => {
    db.query('SELECT email from user ', (error, result) => {
        if (error) {
            console.log("error in sending mail");
        }
        else {
            result.forEach(user => {
                sendEmail(values, user.email);
            });
            console.log("setting data");
        }

    })
}


const sendEmail = (values, recepientEmail) => {

    const imagePath = `http://localhost:5000/${values[2]}`;
    const mailOption = {
        from: {
            name: 'Agri Connect',
            address: process.env.USER
        },
        to: recepientEmail,
        subject: 'Exciting News: New Product Added to Our Collection!',
        text: 'Stay Tuned',
        html: `
            <div>
                <h4>Exciting News: New Products Added!</h4>
                <p>Dear Valued Customer,</p>
                <p>We are thrilled to announce that we've just added several new products to our collection! Whether you're looking for tools, seeds, or accessories, we have something for everyone.</p>
                <p>Here are a few highlights:</p>
                 <ul>
                     <li><strong>Fruits</strong></li>
                     <li><strong>Vegitables</strong> </li>
                     <li><strong>Grocesseries</strong> </li>
                     
                 </ul>
                <p>Visit our website today to explore our latest offerings and take advantage of our special promotions. Don't miss out!</p>
                <p>Thank you for choosing Agri Connect. We appreciate your continued support!</p>
                <p>Best Regards,</p>
                <p>The Agri Connect Team</p>
            </div>
        `
    }
    

    transporter.sendMail(mailOption, (error, result) => {
        if (error) {
            console.log("email is not sent ", error);
        }
        else {
            console.log("mail sent to all");
        }
    })

}

// SignUp (Create Account)

app.post('/createacc', (req, res) => {
    console.log("started....");
    const { name, mail, password } = req.body.userdata; // Destructure user data directly
    const userid = uuidv4();
    const values = [userid, name, mail, password]; // Use destructured variables directly

    const sql = 'INSERT INTO user (id,name, email, password) VALUES (?, ?, ?, ?)'; // Change 'email' to 'mail'

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.send("Change username");
            } else {
                console.log("database error from createaccount", err.stack);
                res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            // console.log("Data added....");
            res.send(`Successfully Registered ${name}`);
        }
    });
});



app.post('/login', (req, res) => {
    const { mail, password } = req.body;
    const query = `SELECT * FROM user WHERE email = ? AND password = ?`;
    db.query(query, [mail, password], (error, results) => {
        if (error) {
            console.log("Error executing MySQL query :", error);
            res.status(500).json({ success: false, message: 'Internal Server Error ' })
            return;
        }
        if (results.length > 0) {
            console.log("true login");
            res.json({ success: true, message: 'Login successful', userid: results[0].id });
        } else {
            console.log("false login");
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});



// display bid products
app.get('/ownerproduct/:userid', (req, res) => {

    const userid = req.params.userid;
    db.query('SELECT * FROM product WHERE available=1 AND ownerid = ? ', [userid], (err, result) => {
        if (err) {
            console.log("error from ownerproduct", err.stack)
            res.send(err);
            return;
        }
        // console.log("sending owner Products ");
        res.json(result);
    });
})

app.get('/getallprd/:userid', (req, res) => {

    const userid = req.params.userid;
    db.query('SELECT * FROM product WHERE available=1 AND ownerid != ?', [userid], (err, result) => {
        if (err) {
            console.log("error from getallprd", err.stack)
            res.send(err);
            return;
        }
        // console.log("sending");
        res.json(result);
    });
})

app.get('/viewcustomer/:userid/:prdid',(req,res)=>{
    const userid=req.params.userid;
    const prdid=req.params.prdid;
    console.log("view customer ",userid,prdid);
    const sql='SELECT * FROM productbid WHERE productid=?';
    db.query(sql,[prdid],(error,result)=>{
        if(error){
            console.log("error from viewcustomer",error.stack);
            res.send(error);
            return;
        }
        else{
            if(result.length==0){
                console.log("Stil now Bid is not updated");
                res.send("Bid is not Happened");
                return;
            }
            else{
                console.log(result);
                res.json(result);
            }
        }
    })
})

app.get('/productbid/:productId', (req, res) => {
    const productId = req.params.productId;
    const query = `SELECT pb.id, pb.productid, pb.userid, pb.currentbid, u.name FROM productbid pb JOIN user u ON pb.userid = u.id WHERE pb.productid = ?`;
    console.log(productId);
    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: 'No data found for the product ID' });
        return;
      }
      console.log(results);
      res.json(results);
    });
  });
  



app.get('/productss/:id', (req, res) => {
    const productId = req.params.id;
    const sql = `SELECT * FROM product WHERE id=?`;
    db.query(sql, [productId], (error, results) => {
        if (error) {
            console.error('Error fetching  from product details:', error);
            res.send("error", error.stack);
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.send("id does not exist");
        }
    })

})

app.post('/addproduct', upload.single('image'), (req, res) => {
    const data = req.body;
    const imageFile = req.file;
    const prdid = uuidv4();

    if (!imageFile) {
        return res.status(400).json({ error: 'Image is required.' });
    }

    const imagePath = `uploads/${imageFile.filename}`;
    const sql = 'INSERT INTO product (id,name,image,startingPrice,quantity,timer,ownerid) VALUES (?, ?, ?, ?, ?,?,?)';
    const values = [prdid, data.prdname, imagePath, data.prdprice, data.prdquantity, data.timer, data.owner];

    db.query(sql, values, (err, result) => {
        if (err) {
            fs.unlinkSync(imagePath); // Delete the uploaded file if an error occurs during insertion

            if (err.code === 'ER_DUP_ENTRY') {
                return res.send("ID ALREADY EXISTS.");
            } else {
                console.error("Database Error from addproduct:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        } else {
            // console.log("Data Added:", result);
            storage.filename = null;
            sendConformationMail(values);
            return res.send("Successfully Added.");


        }
    });
});

app.get('/gettime/:productId', (req, res) => {
    const id = req.params.productId;
    const sql = 'SELECT * FROM product WHERE id=?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error("Error from gettime:", error);
            return res.status(500).json({ message: "Internal server error" });
        } else {
            if (result.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            console.log("result from gettime", result);
            return res.json(result[0]);
        }
    });
});

app.put('/updatecurrenttime/:time', (req, res) => {
    const sec = req.params.time;
    const productId = req.body.prdid;
    const sql = `UPDATE product SET currenttime = ? WHERE id = ?`;
    db.query(sql, [sec, productId], (error, result) => {
        if (error) {
            console.error("Error from updating current time:", error);
            return res.status(500).send("Error updating current time");
        } else {
            return res.send("Current time updated");
        }
    });

});

app.get('/getprofile', (req, res) => {

})

app.get('/getuserdata/:userid', (req, res) => {
    const userId = req.params.userid;
    console.log("mail from getuserdata", userId);
    const sql = 'select * from user where id=?';

    db.query(sql, [userId], (error, result) => {
        if (error) {
            console.log("error in database in getuserdata", error.stack);
            return;
        }
        // console.log("userdata", result[0]);
        res.json(result[0]);
    })
})


// Product  count

app.get('/countprd/:userid', (req, res) => {
    const userId = req.params.userid;
    db.query('SELECT COUNT(ownerid) AS prd_count FROM product WHERE ownerid=? ', [userId], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // console.log("count results", results)
        const prdCount = results[0].prd_count;
        res.json({ prdCount });
    });
});


// display limited bid products
app.post('/getlimitprd', (req, res) => {
    const prdlimit = req.body.numberOfProducts;

    const sql = 'SELECT * FROM product WHERE available=1 LIMIT ?';

    db.query(sql, [prdlimit], (error, result) => {
        if (error) {
            console.error('Error fetching limited products:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }

        // console.log('Sending limited products:', result);
        res.json(result);
    });
});

//get all details from profile component

app.get('/getdes/:mail', (req, res) => {
    const userid = req.params.mail;
    // console.log("mail_id", userid);
    const sql = 'SELECT * FROM user where email=?';

    db.query(sql, [userid], (result, error) => {
        // console.log(result);
        if (error) {
            console.error('Error fetching from getdes:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        // console.log('Sending limited products:', result);
        res.json(result);
    })
})


// Multer configuration for file upload
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'profile/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const profileUpload = multer({
    storage: profileStorage
});

// Update user profile route
app.put('/updatedata/:userid', profileUpload.single('image'), (req, res) => {
    // console.log(req.body);
    // console.log(req.body.formData);
    const userId = req.params.userid;
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;
    const imagePath = image ? `profile/${image}` : null;
    const sql = `UPDATE user SET name=?, email=?, password=?, image=? WHERE id=?`;

    db.query(sql, [username, email, password, imagePath, userId], (err, result) => {
        if (err) {
            fs.unlinkSync(imagePath); // Delete the uploaded file if an error occurs during insertion
        } else {
            // console.log("Profile Updated:", result);
            // profileStorage.filename=null;
            return res.send("Successfully Updated.");

        }
    });
});

app.get('/checkbid/:prdid/:userid',(req,res)=>{
    const {prdid,userid}=req.params;
    console.log(userid,prdid);
    db.query('SELECT * FROM productbid WHERE userid=? AND productid=?',[userid,prdid],(error,result)=>{
        if(error){
            console.log("error in bid availability",error.stack);
            return res.json({messge:`error in check bid avilability ${error}`})
        }
        else{
            if(result.length==0){
                console.log("available");
                return res.json({status:true,message:'available'})
            }
            else{
                console.log("not available");
                return res.json({status:false,message:'not available'})
            }
           
        }

    })

})

app.post('/addbid', (req, res) => {
    const bid_id = uuidv4();
    const { productId, userId, price } = req.body;
    const sql = 'INSERT INTO productbid (id, productId, userId, currentBid) VALUES (?, ?, ?, ?)';

    db.query(sql, [bid_id, productId, userId, price], (error, result) => {
        if (error) {
            console.error("Error adding bid:", error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log("Bid added:", bid_id, productId, userId, price);
            res.json({ message: 'Bid added successfully' });
        }
    });
});

app.get('/getbiddetails/:id', (req, res) => {
    const prd_id = req.params.id;
    const sql = ' SELECT * FROM productbid WHERE productid = ? ORDER BY productid, currentbid DESC LIMIT 1; ';
    db.query(sql, [prd_id], (error, result) => {
        if (error) {
            console.log("error from get all data from get product details ", error.stack);
            return res.status(400).json({ error: 'error' });
        }
        else {
            if (result.length == 0) {
                console.log('empty result');
                return res.json({previous:false})
            }
            else {
                return res.json({previous:true,answer:result[0]});
            }
            // console.log("resullt",result[0]);
        }
    })
})

app.get('/getproductdetails/:id', (req, res) => {
    const prd_id = req.params.id;
    const sql = 'SELECT * FROM product WHERE id =? ';
    db.query(sql, [prd_id], (error, result) => {
        if (error) {
            console.log("error", error);
            return res.status(400).json({ error: "error" });
        }
        else {
            console.log("product result",result[0]);
            res.json(result[0]);
        }
    })
}
)


app.post('/update-time/:id', (req, res) => {
    const { time } = req.body;
    const id = req.params.id;
    const sql = `UPDATE product SET currenttime = ? WHERE id = ?`;
    db.query(sql, [time, id], (err, result) => {
        if (err) {
            console.error('Error updating time:', err.stack);
            res.status(500).send('Error updating time');
        } else {
            res.send('Time updated successfully');
        }
    });
});


app.get('/product-time/:productId', (req, res) => {
    const productId = req.params.productId;
    console.log("product from get time", productId);
    const sql = `SELECT timer, currenttime FROM product WHERE id = ?`;

    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error fetching product time:', err);
            res.status(500).send('Error fetching product time');
        } else {
            if (result[0] === 82400) {

            }
            res.json(result[0]);
        }
    });
});

// set expired 
app.put('/productoutdate/:productid', (req, res) => {
    const id = req.params.productid;
    const sql = 'UPDATE product set available =0 where id=? ';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log("error from update available", error.stack);
            return res.status(400).json({ error: 'error' });
        }
        res.send("available updated")
    })
})

// fetch expired products

app.get('/expired/:userid', (req, res) => {
    const id = req.params.userid;
    console.log("id", id);
    const sql = 'SELECT * FROM product WHERE ownerid=? AND available=0';
    console.log("expired");
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log("error from fetching expired product", error.stack);
            return res.status(400).json({ error: 'error' });
        }
        console.log(result[0]);
        res.json(result[0]);
    })
})

// fetch 
app.get('/editproduct/:userid', (req, res) => {
    const id = req.params.userid;
    console.log("editproduct", id);
    const sql = 'SELECT * FROM product WHERE ownerid=? '
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log("error from fetch data for editproduct ", error.stack);
        }
        else {
            // console.log(result)
            res.json(result);
        }
    })
})

app.get('/searchproduct/:key', (req, res) => {
    const value = req.params.key;
    db.query('SELECT name FROM product WHERE name=?', [value], (error, result) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log(result[0]);
            res.send(result[0]);
        }
    })
})

app.post('/forgetpassword', (req, res) => {
    const { email } = req.body;
    console.log(email);
    // Check if the email exists in the database
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            console.log("Email not found");
            res.status(404).json({ error: 'Email not found' });
        } else {
            res.status(200).json({ message: 'Reset password instructions sent' });
        }
    });
});

// Define API endpoint to fetch scheme data
app.get('/schemes', (req, res) => {
    const sql = 'SELECT * FROM Scheme';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching scheme data:', err);
            res.status(500).json({ error: 'Failed to fetch scheme data' });
            return;
        }
        //   console.log(results);
        res.json(results);
    });
});

app.get('/scheme/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'select * from Scheme where id=?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.error('Error fetching scheme data:', err);
            res.status(500).json({ error: 'Failed to fetch scheme data' });
            return;
        }
        // console.log(result);
        res.json(result[0])
    })
})

app.post('/applyscheme/:id', (req, res) => {
    const id = uuidv4();
    const scheme_id = req.params.id;

    const { name, aadharnumber, phonenumber, mailid, age, dateofbirth, pan, image, chitta } = req.body.formdata;
    const userId = req.body.userid;

    // Get file paths from the request
    const imageFilePath = req.body.formdata.image; // Assuming image file path is sent in the request
    const chittaFilePath = req.body.formdata.chitta;

    const sql = 'INSERT into UserScheme VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';

    db.query(sql, [id, userId, scheme_id, name, aadharnumber, phonenumber, mailid, age, dateofbirth, pan, image, chitta], (error, result) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Handle duplicate entry error
                console.log("error in duplicate", error.stack);
                return res.status(400).json({ error: 'Duplicate entry' });
            } else {
                // Handle other errors
                console.log("error in apply scheme in database", error.stack);
                return res.status(500).json({ error: 'Database error in apply scheme' });
            }
        }
        else {
            // Generate PDF with form data
            const doc = new PDFDocument();
            doc.pipe(res);

            // Add form data to the PDF
            doc.fontSize(16).text(`Name: ${name}`, 50, 50);
            doc.fontSize(16).text(`Aadhar Number: ${aadharnumber}`, 50, 70);
            doc.fontSize(16).text(`Phone Number: ${phonenumber}`, 50, 90);
            // Add more form data as needed

            if (imageFilePath) {
                const imageData = fs.readFileSync(imageFilePath);
                doc.image(imageData, 50, 150, { width: 200 });
            }
            if (chittaFilePath) {
                const chittaData = fs.readFileSync(chittaFilePath);
                doc.image(chittaData, 300, 150, { width: 200 });
            }
            // End the PDF document
            doc.end();
        }
    })

})

app.post('/checkscheme/:id', (req, res) => {
    const userId = req.params.id;
    // console.log(req.body.id);
    const scheme_id = req.body.schemeid;
    const sql = 'SELECT * FROM UserScheme WHERE userId =? AND scheme_id=?';
    db.query(sql, [userId, scheme_id], (error, result) => {
        if (error) {
            console.log('error in checking scheme availabillity', error);
            return res.status(400).json({ error: 'error in checking scheme availabillity' });
        }
        else {
            if (result.length == 0) {
                console.log("available");
                res.json({ result: true })
            }
            else {
                console.log("not available");
                res.json({ result: false })
            }
        }
    })
})
app.get('/buyerdetail/:id', (req, res) => {
    const userId = req.params.id;
    const sql = 'SELECT COUNT(*) AS buyer_count FROM productbid WHERE userid = ?'
    db.query(sql, [userId], (error, result) => {
        if (error) {
            console.log("error from count buyer");
            return res.status(400).json({ error: 'error from count buyer' })
        }
        else {
            console.log('result from buyerdetail', result);
            return res.send(result[0]);
        }
    })
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
