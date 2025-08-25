class AuthController {
    constructor(userModel) {
        this.userModel = userModel;
    }

    async register(req, res) {
        const { username, password, email } = req.body;

        try {
            // Check if user already exists
            const existingUser = await this.userModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await hashPassword(password);

            // Create new user
            const newUser = await this.userModel.create({
                username,
                password: hashedPassword,
                email
            });

            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    }

    async login(req, res) {
        const { username, password } = req.body;

        try {
            // Find user by username
            const user = await this.userModel.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare password
            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Successful login
            res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    }
}

export default AuthController;