# Clipsify - Your Media Platform 🎬

A modern, full-stack media management platform built with Next.js, featuring image and video uploads, user authentication, and a beautiful dashboard interface.

## 🌐 Live Demo

**Deployed Application:** [https://clipsify-keerthiga.vercel.app/](https://clipsify-keerthiga.vercel.app/)

## ✨ Features

### 🔐 Authentication
- **Multiple Sign-In Options**: Email/Password, Google OAuth, GitHub OAuth
- **Secure Sessions**: NextAuth.js integration with MongoDB
- **Protected Routes**: Dashboard routes with authentication middleware
- **Callback URLs**: Seamless redirection after login

### 📸 Media Management
- **Image Upload**: Upload and manage images with ImageKit integration
- **Video Upload**: Upload and manage videos with thumbnail generation
- **File Organization**: Separate views for images and videos
- **Metadata Management**: Add titles and descriptions to uploads
- **User-Specific Content**: View only your uploaded media

### 🎨 User Interface
- **Modern Design**: Glassmorphism effects with purple gradient theme
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode**: Beautiful dark theme throughout
- **Smooth Animations**: Micro-interactions and transitions
- **Interactive Components**: Dropdowns, modals, and dynamic forms

### 👤 User Profile
- **Profile Customization**: Update name, bio, and location
- **Avatar Management**: Upload and update profile pictures
- **Profile Completion**: Track profile completion status
- **Session Updates**: Real-time profile updates

### 📊 Dashboard
- **Analytics**: View upload statistics and activity
- **Quick Actions**: Easy access to upload and manage content
- **Recent Uploads**: See your latest images and videos
- **Welcome Messages**: Personalized greetings

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.10** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icon library
- **Radix UI** - Accessible components

### Backend
- **Next.js API Routes** - Serverless functions
- **NextAuth.js** - Authentication
- **MongoDB** - Database (via Mongoose)
- **ImageKit** - Media storage and CDN

### Deployment
- **Vercel** - Hosting and CI/CD
- **MongoDB Atlas** - Cloud database

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or Atlas)
- ImageKit account
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/reels-platform.git
   cd reels-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # GitHub OAuth (optional)
   GITHUB_ID=your_github_id
   GITHUB_SECRET=your_github_secret
   
   # ImageKit
   NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
   NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
   PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
reels-platform/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── components/      # Dashboard-specific components
│   │       ├── home/           # Dashboard home page
│   │       ├── image/          # Image management
│   │       ├── video/          # Video management
│   │       ├── profile/        # User profile
│   │       └── fileUpload/     # Upload interface
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── image/             # Image API routes
│   │   ├── video/             # Video API routes
│   │   ├── profile/           # Profile API routes
│   │   └── stats/             # Analytics endpoints
│   ├── components/            # Shared components
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── about/                 # About page
│   └── layout.tsx             # Root layout
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # MongoDB connection
│   └── api-client.ts         # API utilities
├── models/
│   ├── User.ts               # User model
│   ├── Image.ts              # Image model
│   └── Video.ts              # Video model
└── public/                   # Static assets
```

## 🔧 Configuration

### ImageKit Setup
1. Create an account at [ImageKit.io](https://imagekit.io/)
2. Get your URL endpoint, public key, and private key
3. Add them to your `.env.local` file

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://clipsify-keerthiga.vercel.app/api/auth/callback/google`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `https://clipsify-keerthiga.vercel.app/api/auth/callback/github`

## 🚢 Deployment

The application is deployed on Vercel. To deploy your own instance:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy!

3. **Update OAuth Redirect URLs**
   - Update Google OAuth redirect URI to your Vercel URL
   - Update GitHub OAuth callback URL to your Vercel URL
   - Update `NEXTAUTH_URL` in Vercel environment variables

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | ✅ |
| `NEXTAUTH_URL` | Application URL | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ |
| `GITHUB_ID` | GitHub OAuth app ID | ❌ |
| `GITHUB_SECRET` | GitHub OAuth app secret | ❌ |
| `NEXT_PUBLIC_URL_ENDPOINT` | ImageKit URL endpoint | ✅ |
| `NEXT_PUBLIC_PUBLIC_KEY` | ImageKit public key | ✅ |
| `PRIVATE_KEY` | ImageKit private key | ✅ |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key (duplicate) | ✅ |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key (duplicate) | ✅ |

## 🎯 Features in Detail

### Authentication Flow
- Users can sign up with email/password or use OAuth providers
- Protected routes redirect to login with callback URL
- Session persists across page refreshes
- Secure password hashing with bcrypt

### Media Upload
- Drag-and-drop file upload
- File type validation (images/videos)
- Size limit: 100MB
- Automatic thumbnail generation for videos
- Metadata storage in MongoDB

### Profile Management
- Update personal information
- Upload profile picture
- Track profile completion
- Real-time updates

### Dashboard
- View upload statistics
- Quick access to all features
- Recent uploads display
- Responsive grid layout

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Keerthiga**

- Website: [https://clipsify-keerthiga.vercel.app/](https://clipsify-keerthiga.vercel.app/)
- GitHub: [@keerthiga](https://github.com/keerthiga)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [ImageKit](https://imagekit.io/) - Media CDN
- [MongoDB](https://www.mongodb.com/) - Database
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components

---

**Built with ❤️ using Next.js and TypeScript**
