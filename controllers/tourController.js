const fs = require('fs')
const tourModel = require('../models/tourModel');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//Middleware for checking ID
const checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
        status: 'fail',
        message: 'Invalid id.'
    });
  }
  next();
}

//Middleware to checkBody
const checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price){
     return res.status(404).json({ message: 'No body!!!'});
  }
  next();
}

const getAllTours =  async (req, res) => {
 try{
  const tours = await tourModel.find();

 res.status(200).json({
  status: 'success',
  results: tours.length,
  data: { tours}
 })
 }
 catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
  })
 }
}

const getTourById = async (req, res) => {
  try{
    const tour = await tourModel.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour }
    });
  }
  catch(err){
    res.status(404).json({message: 'Invalid id.'});
  }
  
}

// const getTourById = (req, res) => {
//   const id = req.params.id * 1;
//   const tour = tours.find(el => el.id === id)
//   if(tour){
//       res.status(200).json({
//           status: 'success',
//           data: { tour }
//       });
//   }else{
//       res.status(404).json({message: 'Invalid id.'});
//   }
// }

const createTour = async (req, res) => {
  try{
    const newTour = await tourModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data:{
        tour: newTour
      }
    });
  }catch(err){
    res.status(400).json({
      status: 'error',
      message: 'Invalid dataset!'
    });
  }

  
    

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

const updateTour = (req, res) => {
  res.status(200).json({
      status: 'success',
      data: {
          tour: 'Info updated'
      }
  })
}

const deleteTour = (req, res) => {
  res.status(204).json({
      status: 'success',
      data: null
  })
}

module.exports = {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody
}