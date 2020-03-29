const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    

    const result = validate(req.body);

    if (result.error) {        
        res.status(400).send(result.error.details[0].message);
        return;
    };

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);    
    console.log(courses);
});

app.put('/api/courses/:id', (req, res) => {    
    // Look up the course
    let course = courses.find(course => course.id === parseInt(req.params.id));    
    
    // If not existing, return 404 - Bad request
    if (!course) {
        res.status(400).send('Course not found.');
        return;
    };

    const result = validate(req.body);

    if (result.error) {        
        res.status(400).send(result.error.details[0].message);
        return;
    };

    // Update course
    let courseIndex = course.id - 1    
    courses[courseIndex].name = req.body.name;    

    // Return the updated course
    res.send(courses[courseIndex]);

    console.log(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send("The course with the given ID doesn't exist.")
    res.send(course);
});

function validate (value) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(value, schema);
    return result;
}; 

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));