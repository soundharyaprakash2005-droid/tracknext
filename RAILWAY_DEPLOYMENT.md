# Railway Configuration for TrackNext
# https://railway.app

# Step 1: Connect your GitHub repository to Railway
# Step 2: Set environment variables in Railway dashboard:
#   - MONGODB_URI (from MongoDB Atlas)
#   - MONGODB_DB_NAME (default: tracknext)
#   - NODE_ENV=production
#   - PORT=3000

# Step 3: Railway will automatically:
#   - Install Node.js dependencies (npm install)
#   - Run the start script (node server.js)
#   - Deploy on port 3000

# Your deployment URL will be: https://tracknext-{random}.railway.app

# To deploy:
# 1. Create Railway account: https://railway.app
# 2. Connect GitHub repo
# 3. Add environment variables
# 4. Deploy

# For MongoDB Atlas:
# 1. Create cluster at https://www.mongodb.com/cloud/atlas
# 2. Create database user
# 3. Add Railway IP to Network Access (or use 0.0.0.0/0 for testing)
# 4. Copy connection string to MONGODB_URI
