 import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
import Book from './interface';
import fs, { writeFile } from 'fs';
import path from 'path';

const app = express()
app.use(express.json());

/* GET home page. */
const fileDir = path.join(__dirname, "../../src/database.json")


let books = require("../../src/database.json");


router.get('/', function(req:Request, res:Response, next:NextFunction) {
  // const getData = fs.readFile('./src/database.json', "utf-8", function(err, data){
    // data = JSON.parse(data)
    writeToFile(fileDir, books)
    res.status(200).send(books);
  // });
})


router.get('/:id', function(req:Request, res:Response, next:NextFunction) {
  const item = books.find((elem: Book) => elem.bookId === parseInt(req.params.id));
  if(!item) res.status(404).send("Book with ID not found")
  res.send(item)
});


router.post('/', (req:Request, res:Response, next:NextFunction) => {
  // const { error } = validateCustomer(req.body); 
  // if(error) return res.status(400).send(error.details[0].message);

  const postBook = {
    Title: req.body.Title,
    Author: req.body.Author,
    datePublished: req.body.datePublished,
    Description: req.body.Description,
    pageCount: req.body.pageCount,
    Genre: req.body.Genre,
    bookId: books.length + 1,
    Publisher: req.body.Publisher
  };
  books.push(postBook);
  writeToFile(fileDir, books)
  res.send(books);
});


router.put('/:id', (req:Request, res:Response, next:NextFunction)=> {
  let item = books.find((elem:Book) =>elem.bookId === parseInt(req.params.id))
  if(!item) res.status(404).send('Book not found')
  let body = req.body;
  const toUpdate = updateBook(item, body)
  writeToFile(fileDir, books)
  res.send(toUpdate)
})

router.delete('/:id', (req:Request, res:Response, next:NextFunction) => {
  const item = books.find((elem:Book) => elem.bookId === parseInt(req.params.id))
  if(!item) res.status(404).send('Book not found')
  const index = books.indexOf(item)
  books.splice(index, 1);
  writeToFile(fileDir, books);
  res.send('Book Deleted')
})



function updateBook (book: Book, updatedBook:Book) {
  book.Title = updatedBook.Title ? updatedBook.Title : book.Title;
  book.Author = updatedBook.Author ? updatedBook.Author : book.Author;
  book.datePublished = updatedBook.datePublished ? updatedBook.datePublished : book.datePublished;
  book.Description = updatedBook.Description ? updatedBook.Description : book.Description;
  book.pageCount = updatedBook.pageCount ? updatedBook.pageCount : book.pageCount;
  book.Genre = updatedBook.Genre ? updatedBook.Genre : book.Genre;
  book.Publisher = updatedBook.Publisher ? updatedBook.Publisher : book.Publisher;
  return book
}


function writeToFile (fileDir:string, content:any) {
  fs.writeFile(fileDir, JSON.stringify(content, null, 3), (err) => {
    if(err) throw Error
    console.log("successful")
  })
}
export default router;
