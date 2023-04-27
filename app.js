const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const path=require('path');
const fs=require("fs")
const models=require("./models");
const user=models.User;
const{Parser}=require("json2csv");
const ejs=require('ejs');

const port=process.env.port ||3000;
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

const static_path=path.join(__dirname,"../","public");
app.use(express.static(static_path));


app.post('/create',async(req,res)=>{
    try {
        const{name,roll,email}=req.body;
        const us=await user.findOne({where:{email:email}});
        if(us){
           res.status(500).json({msg:"email already exist"});
           return;
        }
        const dat=await user.create({
            name:name,
            roll:roll,
            email:email
        });
        res.status(200).json({msg:"user create sucessfullly", data:dat});
    } catch (error) {
        console.log(error);
    }
})
//...................................
// app.get('/',async(req,res)=>{
//     try {
//         const parserobj=new Parser();
//     const usdat=await user.findAll();
//     const fields = ['name', 'role', 'email'];
//         const delimiter = ',';
//         const csv = parserobj.parse(usdat, { fields, delimiter });
//       const filePath = path.join(__dirname, 'data.csv');
//      fs.writeFileSync(filePath,csv);
//      console.log(csv);
//     res.status(200).json({csv:csv});
//     } catch (error) {
//         console.log(error);
//     }
// })
//..............................



app.get('/', async (req, res) => {
    const users = await user.findAll();
    res.render('cs', { users });
  });
  
  app.post('/download', async(req, res, )=>{

    const users = await user.findAll();

        const data = JSON.parse(JSON.stringify(users));

        //convert JSON to CSV Data

        const fields = ['id','name', 'roll', 'email'];

        const json_data = new Parser({fields});

        const csv_data = json_data.parse(data);

        const filePath = path.join(__dirname, 'sample_data.csv');

        fs.writeFileSync(filePath,csv_data);

        res.setHeader("Content-Type", "text/csv");

        res.setHeader("Content-Disposition", "attachment; filename=sample_data.csv");

        res.status(200).end(csv_data);

    });








app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });