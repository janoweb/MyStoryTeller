const Book = require('./../model/bookModel');
const { query } = require('express');

exports.topBook = async (req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingsAverage';
    req.query.fields = 'name,category,age,imageCover,ratingsAverage';
    next();
}


exports.getAllBooks = async (req, res) => {
    try{
        //BUILD THE QUERY
        //1- filtering:
        // Creating an new object with the query params.
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        // Excluding fields to ignore them in the queryObj
        excludeFields.forEach(el => delete queryObj[el])

        //1.cont. Operators, advanced filtering:
        let queryString = JSON.stringify(queryObj);
        //replace the operator to be readable for mongodb adding $
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Book.find(JSON.parse(queryString));

        //2- Sorting:
        if(req.query.sort){
            // Dealing witha query with multiple sorts.
            const sortBy = req.query.sort.split(',').join(' ');
            // Dorting
            query = query.sort(sortBy);
        }else{
            // Default sorting
            query = query.sort('-ratingsAverage');
        }

        //3- Field limiting:
        if(req.query.fields){
            // Selecting the fields in the query.
            const fields =  req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            // Excluding internal mongoDB fields.
            query = query.select('-__v');
        }

        //4- Pagination.
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 20;
        // Skiping results to show the page resquested.
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        if (req.query.page){
            const numberBooks = await Book.countDocuments();
            if( skip >= numberBooks ) throw new Error('This page does not exits');
        }

        //EXECUTE THE QUERY:
        const books = await query;

        //SEND THE QUERY:
        res.status(200).json({
            status: 'success',
            result: books.length,
            data: {
                books
            }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }  
}
exports.getBook = async (req, res) => {

    try{
        const book = await Book.findById(req.params.id);
        
        res.status(200).json({
            status: 'success',
            data: {
            book
            }
        })

    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
exports.createBook = async (req, res) => {
    try{
        const newBook = await Book.create(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                book: newBook
            }
        });
    } catch (err) {
        res.status(400).json({ 
            status: 'fail',
            message: err
        })
    }
}

exports.updateBook = async (req, res) => {  
    try{
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                book
            }   
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }  
}
exports.deleteBook = async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null  
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }  
}