# GitHub Actions Deployment Setup

## Required GitHub Secrets

To enable automatic deployment, you need to configure the following secrets in your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository: https://github.com/talhahameed-28/Takshila-2
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SSH_HOST` | Your Hostinger server IP address | `123.456.789.012` |
| `SSH_USERNAME` | Your SSH username | `u123456789` |
| `SSH_PASSWORD` | Your SSH password | `your_password` |
| `SSH_PORT` | SSH port number | `22` (or your custom port) |

## How It Works

The GitHub Actions workflow will automatically:
1. ✅ Trigger when you push code to `main` or `deploy` branch
2. ✅ Checkout your code
3. ✅ Setup Node.js environment
4. ✅ Install dependencies
5. ✅ Run `npm run build` to create the dist folder
6. ✅ Copy `dist/index.html` and `dist/assets` to `/var/www/takshila.cloud` on your server
7. ✅ Overwrite existing files automatically

## Usage

Simply push your code:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The deployment will start automatically. You can monitor the progress in the **Actions** tab of your GitHub repository.

## Security Note

For better security, consider using SSH keys instead of passwords. You can update the workflow to use the `key` parameter instead of `password`.
