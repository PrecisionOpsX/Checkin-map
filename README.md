# CheckInMap (Milestone 1)

Cross-platform mobile app (iOS + Android) built with React Native + Expo and Firebase. This is **Milestone 1** of the full v1 build.

## What Milestone 1 includes

**Foundation**
- React Native + Expo (TypeScript) project, one codebase for iOS and Android.
- Firebase integration: Auth, Firestore, Storage.
- Authentication flow: signup, login, password reset (email link).
- Persisted login: closing and reopening the app keeps the user signed in.
- Navigation shell: auth stack and main tab stack (Home, Discover, Profile).

**Profiles and Social**
- Profile creation on signup (display name, email).
- Profile editing: display name, bio, location, avatar (uploaded to Firebase Storage).
- View other users' profiles.
- Follow / unfollow system with live follower and following counts.
- Followers and Following lists, tappable to navigate to that user.

The **Home tab** currently shows a placeholder card; the map and check-in features arrive in Milestone 2.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project (free)

1. Go to https://console.firebase.google.com and create a new project.
2. In the project, enable:
   - **Authentication** -> Sign-in method -> **Email/Password** (enable it).
   - **Firestore Database** -> Create database -> Start in production mode -> pick a region.
   - **Storage** -> Get started -> Start in production mode -> pick a region.
3. In Project Settings -> General -> Your apps, click the web icon (`</>`) to register a web app. Copy the config values.

### 3. Configure environment variables

Copy `.env.example` to `.env` and paste the values from your Firebase web app config:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### 4. Apply security rules

In the Firebase console:

- **Firestore -> Rules**: paste contents of `firestore.rules` and Publish.
- **Storage -> Rules**: paste contents of `storage.rules` and Publish.

## Run the app (free, online testing)

### Option A: Expo Go on your real phone (recommended)

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android).
2. In the project root:
   ```bash
   npm start
   ```
3. Scan the QR code that appears in the terminal:
   - **iOS**: open Camera app and point at the QR code.
   - **Android**: open Expo Go and tap "Scan QR code".
4. The app loads in Expo Go in a few seconds.

Both your phone and computer must be on the same Wi-Fi network. If they are not, run `npm start --tunnel` to use Expo's free tunnel.

### Option B: Web preview in browser

```bash
npm run web
```

Most features (auth, profiles, follows, avatar upload) work in the browser. The map in Milestone 2 will require a real device.

### Option C: Android emulator or iOS simulator

If you have Android Studio or Xcode installed:

```bash
npm run android
# or
npm run ios
```

## Test plan for Milestone 1

1. **Signup**: create two accounts with different emails (use Account B on a second device, browser tab, or by signing out and creating Account B).
2. **Login persistence**: close and reopen the app, you stay logged in.
3. **Password reset**: tap "Forgot password" and check your email for the Firebase reset link.
4. **Profile edit**: from the Profile tab, tap Edit profile, change display name, bio, location, and upload an avatar from your photo library.
5. **Discover**: switch to the Discover tab, you should see the other account.
6. **Follow**: tap the other user's profile and tap Follow. Watch the followers count increment on their profile.
7. **Followers / Following lists**: tap the followers or following stat on either profile.
8. **Sign out**: from Profile, tap Sign out, you return to the login screen.

## Project structure

```
src/
  components/       Button, TextField, Avatar
  config/           firebase.ts client setup
  contexts/         AuthContext (auth state + profile)
  navigation/       Root, Auth, Main navigators
  screens/
    auth/           Login, Signup, ForgotPassword
    HomeScreen.tsx
    UsersScreen.tsx
    UserProfileScreen.tsx
    MyProfileScreen.tsx
    EditProfileScreen.tsx
    FollowListScreen.tsx
  services/         authService, userService, followService, storageService
  theme/            tokens (colors, spacing, radius, fonts)
  types/            shared TypeScript types
```

## Next: Milestone 2

- Google Maps integration with curated location markers
- Location permissions (iOS and Android)
- Location detail screen, nearby list sorted by distance
- GPS-verified check-in flow
- "Who is here now" visitor list per location
- Live visitor count and check-in history on profiles
