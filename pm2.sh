# Install pm2 and start server.js
npm install pm2@latest -g
pm2 start server.js

# Store current user username in a variable
user=$(whoami)

# Set pm2 to start on boot
sudo env PATH=$PATH:/root/.nvm/versions/node/v18.12.1/bin /root/.nvm/versions/node/v18.12.1/bin/pm2 startup systemd -u $user --hp /home/$user

# Save current pm2 configuration
pm2 save

# Start the service
systemctl start pm2-$user