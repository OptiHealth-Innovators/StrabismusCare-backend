export const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const userId = req.params.id;
    
    // Prevent updating sensitive fields like password or role through this endpoint
    const { password, role, email, ...updateData } = req.body;
    
    const updatedUser = {
      ...updateData,
      updatedAt: new Date()
    };
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updatedUser }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user", error: error.message });
  }
};
