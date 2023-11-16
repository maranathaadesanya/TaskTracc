const router = require('express').Router();
const todoItemsModel = require('../Models/todoItems');
const userModel = require('../Models/UserModel'); // Import the user model

// Route to add a Todo Item to the database for a specific user
router.post('/api/item', async (req, res) => {
  try {
    // Assuming the user is authenticated and their ID is accessible via req.user.id
    const userId = req.user.id; // Get the authenticated user's ID

    // Create a new todo item associated with the user ID
    const newItem = new todoItemsModel({
      item: req.body.item,
      user: userId // Link the todo item to the user who created it
    });

    // Save this item in the database
    const saveItem = await newItem.save();
    res.status(200).json(saveItem);
  } catch (err) {
    res.json(err);
  }
});

// Route to get all Todo Items for a specific user from the database
router.get('/api/items', async (req, res) => {
  try {
    // Assuming the user is authenticated and their ID is accessible via req.user.id
    const userId = req.user.id; // Get the authenticated user's ID

    // Find all todo items associated with the authenticated user
    const allTodoItems = await todoItemsModel.find({ user: userId });
    res.status(200).json(allTodoItems);
  } catch (err) {
    res.json(err);
  }
});

// Route to update a Todo Item for a specific user
router.put('/api/item/:id', async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const itemId = req.params.id; // Get the item ID from the request parameters

    // Find the todo item by its ID and associated user ID, then update it
    const updateItem = await todoItemsModel.findOneAndUpdate(
      { _id: itemId, user: userId },
      { $set: req.body },
      { new: true }
    );

    if (!updateItem) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    res.status(200).json(updateItem);
  } catch (err) {
    res.json(err);
  }
});

// Route to delete a Todo Item for a specific user
router.delete('/api/item/:id', async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const itemId = req.params.id; // Get the item ID from the request parameters

    // Find and delete the todo item by its ID and associated user ID
    const deleteItem = await todoItemsModel.findOneAndDelete({ _id: itemId, user: userId });

    if (!deleteItem) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
