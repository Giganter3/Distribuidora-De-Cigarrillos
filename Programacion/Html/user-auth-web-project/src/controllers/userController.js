class UserController {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async getUserProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user
            const user = await this.userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async updateUserProfile(req, res) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user
            const updatedData = req.body; // Assuming the updated data is sent in the request body
            const user = await this.userModel.findByIdAndUpdate(userId, updatedData, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }
}

export default UserController;