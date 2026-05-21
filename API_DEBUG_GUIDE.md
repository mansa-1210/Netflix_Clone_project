# Netflix Clone - API Debugging Guide

## Current Issue

All movie sections show "Failed to load movies" - the TMDB API calls are failing globally.

---

## How to Debug

### Step 1: Open Browser DevTools Console

1. **Open the app:** http://localhost:5173
2. **Press F12** to open DevTools
3. **Click Console tab**
4. **Look for messages starting with `[TitleCards]` or `[Player]`**

---

### Step 2: Check Console Output

#### What to Look For

**Expected Console Output:**
```
[TitleCards] Loading now_playing from: https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1
[TitleCards] Auth token present: true
[TitleCards] Token length: 207
[TitleCards] Response status for now_playing: 200 OK
[TitleCards] Fetched now_playing: 20 movies
[TitleCards] Successfully loaded 20 movies for now_playing
```

#### Possible Error Messages

**Error 1: 401 Unauthorized**
```
[TitleCards] Response status for now_playing: 401 Unauthorized
[TitleCards] Fetch error for now_playing: API error: 401 - Unauthorized
```
**Cause:** Invalid or expired TMDB API token
**Solution:** Get new token from https://www.themoviedb.org/settings/api

**Error 2: 404 Not Found**
```
[TitleCards] Response status for now_playing: 404 Not Found
```
**Cause:** Wrong endpoint URL
**Solution:** Check endpoint in code

**Error 3: Token Not Present**
```
[TitleCards] Auth token present: false
```
**Cause:** TMDB_Access_Key not imported or empty
**Solution:** Check src/config.js has valid token

**Error 4: Network Error**
```
[TitleCards] Fetch error for now_playing: TypeError: Failed to fetch
```
**Cause:** Network connectivity issue or CORS problem
**Solution:** Check internet connection, restart dev server

---

### Step 3: Network Tab Inspection

1. Open DevTools **Network tab**
2. Reload page (F5)
3. Look for requests to `api.themoviedb.org`
4. **Click on the request**
5. Check:
   - **Status:** Should be 200 (not 401, 404, 500)
   - **Headers:** Authorization header present?
   - **Response:** Contains movie data?

---

### Step 4: Test API Directly

Open browser console (F12) and run:

```javascript
// Test TMDB API directly
const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwODAzMmVmYzNjODlkYTBhZDNiNzJhYzcwODhkMTE3OSIsIm5iZiI6MTc3ODc0Mjg2OS45MTM5OTk4LCJzdWIiOiI2YTA1NzY1NWI3ZmY0ZWE3MTc0NjllMTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2NZKu2H4uBNL7JW34kJI1pDIrMTgAqS-rsNZ3dcsnpw";

fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => console.log('Data:', data))
.catch(e => console.error('Error:', e));
```

**Expected Output:** Object with `results` array containing movies

---

## Common Issues & Fixes

### Issue 1: Token Invalid or Expired

**Symptom:** 401 Unauthorized error

**Fix:**
1. Go to https://www.themoviedb.org/
2. Log in with your account
3. Go to Settings → API
4. Get new Bearer token
5. Update `src/config.js` with new token
6. Restart dev server (npm run dev)

### Issue 2: Network Connection Failing

**Symptom:** "Failed to fetch" error

**Fix:**
1. Check internet connection
2. Try visiting https://api.themoviedb.org in browser
3. If blocked, check firewall/proxy
4. Restart dev server
5. Clear browser cache (Ctrl+Shift+Del)

### Issue 3: CORS Issues

**Symptom:** CORS error in console

**Fix:**
- CORS should be handled by TMDB
- Try different browser
- Check if on VPN/proxy blocking requests
- Restart dev server

### Issue 4: Wrong Endpoint

**Symptom:** 404 Not Found error

**Fix:**
- Check endpoint URLs in code
- Should be: `https://api.themoviedb.org/3/movie/...`
- NOT: `https://api.themoviedb.org/...` (missing `/3/`)

---

## Verification Steps

### Step 1: Check Console
✅ Look for `[TitleCards]` prefix logs
✅ Verify token is present
✅ Check response status is 200

### Step 2: Check Network Tab
✅ TMDB requests show 200 status
✅ Response contains `results` array
✅ Response has movie objects with id/title/poster

### Step 3: Test Endpoint
✅ Use browser console test above
✅ Should return movie data
✅ No authorization errors

### Step 4: Restart and Retry
✅ Stop dev server (Ctrl+C)
✅ Clear npm cache: `npm cache clean --force`
✅ Restart: `npm run dev`
✅ Hard refresh browser (Ctrl+Shift+R)

---

## What Each Console Message Means

| Message | Meaning | Status |
|---------|---------|--------|
| `[TitleCards] Loading ...` | Starting API fetch | ℹ️ Info |
| `Auth token present: true` | Token found in config | ✅ Good |
| `Response status: 200` | API call successful | ✅ Good |
| `Fetched X movies` | Data received | ✅ Good |
| `Response status: 401` | Invalid/expired token | ❌ Fix |
| `Auth token present: false` | Token missing | ❌ Fix |
| `Failed to fetch` | Network error | ❌ Fix |

---

## Quick Diagnostic Test

Run this in console to check everything:

```javascript
// Quick diagnostic
console.log('=== NETFLIX CLONE API DIAGNOSTIC ===');
console.log('URL:', window.location.href);
console.log('Checking API connectivity...');

// Test endpoint
fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
  headers: {
    'accept': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwODAzMmVmYzNjODlkYTBhZDNiNzJhYzcwODhkMTE3OSIsIm5iZiI6MTc3ODc0Mjg2OS45MTM5OTk4LCJzdWIiOiI2YTA1NzY1NWI3ZmY0ZWE3MTc0NjllMTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.2NZKu2H4uBNL7JW34kJI1pDIrMTgAqS-rsNZ3dcsnpw'
  }
})
.then(r => {
  if (r.ok) {
    console.log('✅ API WORKING - Status:', r.status);
  } else {
    console.log('❌ API ERROR - Status:', r.status);
  }
  return r.json();
})
.then(data => {
  if (data.results) {
    console.log('✅ DATA RECEIVED -', data.results.length, 'movies');
  } else {
    console.log('❌ NO DATA IN RESPONSE');
  }
})
.catch(e => console.log('❌ NETWORK ERROR:', e.message));
```

---

## If Still Not Working

1. **Clear everything:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Hard refresh browser:**
   - Press Ctrl+Shift+R (Windows)
   - Or Cmd+Shift+R (Mac)

3. **Check config.js:**
   - Verify TMDB token is there
   - Verify it's exported correctly

4. **Check internet:**
   - Open https://api.themoviedb.org in browser
   - Should load (may show forbidden, but should connect)

5. **Restart everything:**
   - Stop dev server
   - Close browser
   - Restart dev server
   - Open fresh browser tab

---

## For Help

Copy console output and check against examples above. Each message tells you exactly what's wrong!

**Message prefix meanings:**
- `[TitleCards]` = Movie list loading issue
- `[Player]` = Video player loading issue
- Status codes = HTTP response codes
  - 200 = Success
  - 401 = Authentication failed
  - 404 = Not found
  - 500 = Server error

---

**Status:** Use this guide to diagnose and fix the API loading issue.
