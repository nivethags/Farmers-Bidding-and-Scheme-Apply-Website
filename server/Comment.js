//
// app.get('/products/:id', (req, res) => {
//     const productId = req.params.id;
  
//     // Query to fetch the product from the database based on productId
//     const query = 'SELECT * FROM products WHERE id = ?';
  
   
  
//       db.query(query, [productId], (err, results) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Database Query Error' });
//         }
  
//         if (results.length === 0) {
//           return res.status(404).json({ error: 'Product not found' });
//         }
  
//         // Return the product data in the response
//         res.json(results[0]);
//       });
//     })

  
//addproducts
// app.post('/addproduct', (req, res) => {
//     const data = req.body;

//     // console.log("name",req.body.formData.prdname);
//     // console.log("price",req.body.formData.prdprice);
//     // console.log("quantity",req.body.formData.prdquantity);
//     // console.log("image",req.body.formData.image);
//     // console.log("id",req.body.formData.id);

//     // if (!id || !prdname || !prdprice || !prdquantity || !image) {
//     //     return res.status(400).json({ error: 'All fields are required.' });
//     // }

//     if (!req.file) {
//         return res.status(400).json({ error: 'Image file is required.' });
//     }

//     const imageFile = req.file;
//     const imagePath = `uploads/${imageFile.filename}`;
//     const sql = `INSERT INTO products (id,name,price,quantity, image) VALUES (?, ?, ?, ?, ?)`;
//     const values = [
//         data.id,
//         data.prdname,
//         data.prdprice,
//         data.prdquantity,
//         imagePath
//     ];
 
//     db.query(sql, values, (err, result) => {
       
//         if (err) {

//             fs.unlinkSync(imagePath);

//             if (err.code === 'ER_DUP_ENTRY') {
//                 res.send("ID Already Exist.");
//                 return;
//             } 
//              if(values[0]===null||values[0]===undefined||values[1]===null||values[1]===undefined||values[2]===null||values[2]===undefined||values[3]===null||values[3]===undefined||values[4]===null||values[4]===undefined||values[5]===null||values[5]===undefined||values[6]===null||values[6]===undefined){
//                 console.log("id",values[0]);
//                 res.send("Fill All Data....");
//                 return;
                
//             }
//             else {
//                 console.log("error",err.stack);
//                 res.status(500).json({ error: err.stack});
//                 return ;
//             }
           
//         } 
//         else {
//             console.log("Data added....");
//             res.send("Sucussfully Added....");
//         }
//         });
// });




// app.post('/addproduct',upload.single('image'),(req,res)=>{
//     console.log(req.body.id);
//     const data=req.body;
//     console.log(data);
//     if(!req.file){
//         return res.status(400).json({error:'Image is required.'});
//     }
//     const imageFile=req.file;
//     const imagePath=`uploads/${imageFile.filename}`;
//     const sql='INSERT INTO products (name,price,quantity,id,image)VALUES (?,?,?,?,?)';
//     const values=[data.prdname,data.prdprice,data.prdquantity,data.id,imagePath]
//     db.query(sql,values,(err,result)=>{
//         if(err){
//             fs.unlinkSync(data.image);
            
//             if(err.code === 'ER_DUP_ENTRY'){
//                 res.send("ID ALREADY EXIST.");
//                 return;
//             }
//             if(values[0]===null||values[0]===undefined||values[1]===null||values[1]===undefined||values[2]===null||values[2]===undefined||values[3]===null||values[3]===undefined||values[4]===null||values[4]===undefined||values[5]===null||values[5]===undefined||values[6]===null||values[6]===undefined){
//                 console.log("id",values[0]);
//                 res.send("Fill All Data....");
//                 return;
//             }
//             else{
//                 console.log("error",err.stack);
//                 res.status(500).json({error:err.stack})
//                 return;
//             }
//         }
//         else{
//             console.log("Data Added....");
//             res.send("Successfully Added.....");
//         }
//     })  
// })





// app.post('/getlimitprd',(req,res)=>{
//     const prdlimit=req.body.numberOfProducts;
// console.log(prdlimit);
//     const sql='select * from products LIMIT ? ';

//     db.query(sql,[prdlimit],(error,result)=>{
//         if(error){
//             res.status(500).send(error.stack);            return;
//         }
//         if(result.length===0){
//             res.status(404).send("No results found");
//             return;
//         }
//         console.log("sending");
//         console.log("res",result);
//         // console.log("res",JSON.parse(result));
//         res.json(result);
//         return;

//     })

// })

