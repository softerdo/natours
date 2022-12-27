const fs = require('fs')
const express = require('express');

const app = express();

//middleware
app.use(express.json());

app.use((req, res, next) => {
    // console.log('Hola middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


//Functions
const getAllTours =  (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    });
}

const getTourById = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)
    if(tour){
        res.status(200).json({
            status: 'success',
            data: { tour }
        });
    }else{
        res.status(404).json({message: 'Invalid id.'});
    }
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
}

const patchTour = (req, res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id.'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Info updated'
        }
    })
}

const deleteTour = (req, res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid id'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
}

//Routes
app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour)

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(patchTour)
    .delete(deleteTour)




//Starting the server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
