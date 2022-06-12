const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');

// Route 1 : For the fetching notes Login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
   try {

      // Find the notes corresponding user id
      const notes = await Notes.find({ user: req.user.userId })
      res.status(200).json(notes)
   }
   catch (err) {
      console.log(err.message)
      res.status(500).send("Something went wrong")
   }

})

// Route 2 : For the adding notes Login required
router.post('/addnotes', fetchuser, [
   body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
   body('description', "Description must be at least 5 characters long").isLength({ min: 5 })
], async (req, res) => {
   try {

      const { title, description, tag } = req.body

      //  Checking the user input title and description when its empty or the above conditons are not satisfied this will execute
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      // When above conditions are satisfied creating the new note using the note schema
      const note = new Notes({
         title, description, tag, user: req.user.userId
      })

      // After creating the note saving the note in the database, saving note is an asynchronous function
      const createdNote = await note.save()

      res.json(createdNote)
   }
   catch (err) {
      console.log(err.message)
      res.status(500).send("Something went wrong")
   }

})


// Route 3 : For the updating notes Login required
router.put('/updatenotes/:id', fetchuser, async (req, res) => {

   try {
   // Destructuring the title,description and tag storing the object called newNote
   // Copying the req.body object in the newNote 
   // {title ,description,tag} means you can access without newNote.title and newNote.description like this so on for tag
   const newNote = { title, description, tag } = req.body

   // Finding the note by the :id parameter come from the url
   let note = await Notes.findById(req.params.id)

   // If note doesnt exist on corresponding note id so return bad request 
   if (!note) {
      return res.status(401).send("Note not found")
   }

   // If corresponding from url id has user is not same as url user returning the you can not edit some other people notes bad request
   if (note.user.toString() !== req.user.userId) {
      return res.status(401).send("Note allowed to edit this note")
   }

   // If all goes fine then updating the note first parameter of findById is id and second is update {also a object} and third is optional is new means it returns a updated note in the corrresponding variable
   note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

   res.send(note)
}
catch (err) {
   console.log(err.message)
   res.status(500).send("Something went wrong")
}
})

// Route 4 : For the deleting notes Login required
router.delete('/deletenotes/:id', fetchuser, async (req, res) => {


   try {
   
   // Finding the note by the :id parameter come from the url
   let note = await Notes.findById(req.params.id)

   // If note doesnt exist on corresponding note id so return bad request 
   if (!note) {
      return res.status(401).send("Note not found")
   }

   // If corresponding from url id has user is not same as url user returning the you can not edit some other people notes bad request
   if (note.user.toString() !== req.user.userId) {
      return res.status(401).send("Note allowed to delete this note")
   }
   note = await Notes.findByIdAndDelete(req.params.id)

   res.status(200).json({ Success: "Note has been deleted",note: note })
}
catch (err) {
   console.log(err.message)
   res.status(500).send("Something went wrong")
}
})
module.exports = router