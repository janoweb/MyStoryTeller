const mongoose = require('mongoose');

const bookSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A book must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A book name must have less or equal then 40 characters'],
        minlength: [5, 'A book name must have more or equal then 10 characters']
    },
    category:{
        type: String,
        required: [true, 'A book must have a category'],
        enum: {
            values: ['nature', 'home', 'family', 'friends', 'holidais', 'school', 'music', 'animals'],
            message: 'Category is either: nature, home, family, friends, holidais, school, music or animals'
          }
    },
    age: {
        type: String,
        required: [true, 'The book must have a recomended age'],
        trim: true
    },
    free: { 
        type: Boolean,
        default: false
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']  
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        //required: [true, 'A tour must have a cover image']
    },
    images: [String],
    music: [String],
    voice: [String],
    text: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;