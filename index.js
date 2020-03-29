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

    // Validate
    const { error } = validate(req.body);  // Using object destructuring to get straight to the property we are interested in

    // If not existing, return 404 - Bad request    
    if (error) return res.status(400).send(result.error.details[0].message);   

    // Add course
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);

    // Return the added course (by convention we always return the object in question)
    res.send(course);           
});

app.put('/api/courses/:id', (req, res) => {    
    
    // Look up the course
    let course = courses.find(c => c.id === parseInt(req.params.id));      
    
    // Validate    
    const { error } = validate(req.body);  // Using object destructuring to get straight to the property we are interested in
        
    // If not existing, return 404 - Bad request    
    if (error) return res.status(400).send(result.error.details[0].message);  

    // Update course   
    course.name = req.body.name;   

    // Return the updated course (by convention we always return the object in question)
    res.send(course);    
});

app.get('/api/courses/:id', (req, res) => {

    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));

    // If not existing, return 404 - Bad request    
    if (!course) res.status(404).send("The course with the given ID doesn't exist.");

    // Return the course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {

    // Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));   
    
    // If not existing, return 404 - Bad request
    if (!course) res.status(404).send("The course with the given ID doesn't exist.");

    // Find Index of Course object in question and remove this object from the courses array
    const index = courses.indexOf(course);   
    courses.splice(index, 1);    

    // Return the deleted course (by convention we always return the object in question)
    res.send(course);
});

function validate (course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);     
}; 



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));