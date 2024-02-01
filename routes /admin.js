const {Router} = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../database");
const {JWT_SECRET} = "secret";
const router = Router();
const jwt = require("jsonwebtoken");


router.post('/signup', async (req, res) => {
    
    const username = req.body.username;
    const password = req.body.password;
// functionm to check  weather admin are already exist?  
    await Admin.create({
        username: username,
        password: password
    })

    res.json({
        message: 'Admin created successfully'
    })
    
});
router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(JWT_SECRET);

    const user = await User.find({
        username,
        password
    })
    if (user) {
        const token = jwt.sign({
            username
        }, JWT_SECRET);

        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "Incorrect email and pass"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    // zod
    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price
    })

    res.json({
        message: 'Course created successfully', courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
     const response = await Course.find({});

    res.json({
        courses: response
    })

});


module.exports = router;
