# CheckInMap

Cross-platform mobile app (iOS + Android) built with React Native + Expo and Firebase.

## What is shipped

**Milestone 1: Foundation + Profiles and Social**
- React Native + Expo (TypeScript), one codebase for iOS and Android.
- Firebase Auth (email/password), Firestore, optional Storage.
- Persisted login across app restarts.
- Profiles with display name, bio, location, avatar.
- Required onboarding fields: birthday and skill level (Casual player, College ball ready, I'll be on here all week).
- Follow / unfollow system, live counts, follower and following lists.

**Milestone 2: Map + GPS Check-ins**
- Google Maps (Android) / Apple Maps (iOS) via `react-native-maps`.
- Curated location markers with live visitor counts.
- Nearby list sorted by distance from the user.
- Location detail screen with description and "open in Maps".
- GPS-verified check-ins (must be within 100m of the location).
- Who-is-here-now visitor list, live visitor count.
- Check-in history shown on every profile.
- Auto-expire of stale active check-ins (TTL: 4 hours).

The map uses a hard-coded sample dataset (`src/data/sampleLocations.ts`) until the admin panel ships in Milestone 4.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Firebase project (free)

1. https://console.firebase.google.com -> new project.
2. **Build -> Authentication -> Sign-in method -> Email/Password -> Enable**.
3. **Build -> Firestore Database -> Create database -> Production mode -> pick a region.**
4. **Storage** is optional (skip for now if you want to avoid Blaze plan).

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in Firebase web app config values:

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=         # optional
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_KEY=         # optional during Expo Go dev
EXPO_PUBLIC_GOOGLE_MAPS_IOS_KEY=             # optional, iOS uses Apple Maps
EXPO_PUBLIC_DEV_LAT=                         # optional, dev map center
EXPO_PUBLIC_DEV_LNG=                         # optional, dev map center
```

### 4. Apply Firestore security rules

Firebase console -> Firestore -> Rules -> paste `firestore.rules` -> Publish.

Storage rules: only paste `storage.rules` if you enabled Storage in step 2.

## Run

### Expo Go on your real phone (free, recommended)

1. Install **Expo Go** from the App Store / Google Play.
2. `npm start`
3. Scan the QR code (iOS Camera, or Expo Go's Scan QR on Android).

Google Maps API keys are **not required** for Expo Go development:
- iOS uses Apple Maps automatically.
- Android in Expo Go uses Expo's shared dev key.

Keys are required when you do a production EAS Build. The client will provide their own keys before launch; replace the empty strings in `.env` and rebuild.

### Web

```bash
npm run web
```

Map screen is limited in the browser (no `react-native-maps`), but every other screen works.

## Project structure

```
src/
  components/          Button, TextField, Avatar, Icon, SelectField, DateField,
                       SkillBadge, FloatingTabBar, ScreenHeader
  config/              firebase.ts
  contexts/            AuthContext
  data/                sampleLocations.ts (seed data until admin panel ships)
  navigation/          Root, Auth, Onboarding, Main (with Home/Discover/Profile stacks)
  screens/
    auth/              Login, Signup, ForgotPassword
    onboarding/        CompleteProfile (forced after signup)
    MapScreen.tsx           Home tab. Map + horizontal nearby list.
    LocationDetailScreen.tsx  Location info, visitor list, check-in flow.
    UsersScreen.tsx         Discover tab. People list.
    UserProfileScreen.tsx   Other user's profile + their check-in history.
    MyProfileScreen.tsx     Own profile + own check-in history.
    EditProfileScreen.tsx   Edit name, bio, location, photo, birthday, skill.
    FollowListScreen.tsx    Followers / Following.
  services/            authService, userService, followService, storageService,
                       locationService, checkinService
  theme/               design tokens
  types/               shared TypeScript types
  utils/               dates.ts, distance.ts (haversine + check-in radius)
firestore.rules        ready to paste into Firebase console
storage.rules          optional
```

## Test plan for Milestone 2

1. **Onboarding**: sign up, the app forces you to a "Complete profile" screen. Required: birthday + skill level. Continue.
2. **Map**: Home tab shows a map centered near sample locations. Allow location permission. Your blue dot should appear.
3. **Markers**: tap any marker to open the location detail screen.
4. **Nearby list**: under the map, horizontal cards sorted by distance from your location.
5. **Check in too far**: from your real position, tap "Check in" on a location far from you. You should see a "Too far to check in" alert with the distance.
6. **Check in close**: to test successful check-in, set a sample location's coords to where you actually are by editing `src/data/sampleLocations.ts`, reload, and try again. You should see the success state and "Checked in just now".
7. **Visitor list**: on the same location, "Who is here now" should show your name and avatar with "Checked in just now".
8. **Check-in history**: open Profile tab. The check-in appears in your history with a green live dot.
9. **Other users**: sign in as a second account. From Discover, open their profile, you will see their check-in history if any.
10. **Check out**: tap "Check out". Visitor count decreases, live dot disappears from your history.

## What is next (Milestone 3 onward)

- Real-time visitor count and post feed per location (Firestore snapshots).
- Posts on locations (text + image).
- Push notifications: triggered by activity, scheduled events, followed-user check-ins.
- Badge engagement system.
- Admin panel (web) for the client to manage locations.
- Store submission.
