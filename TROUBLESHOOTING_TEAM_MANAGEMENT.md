# Troubleshooting Team Management

## Issue: Teams not adding to database

### Steps to Debug:

1. **Check WebSocket Server is Running**
   ```bash
   npm run ws-server
   ```
   Should see: "WebSocket server running on port 8080"

2. **Check MongoDB Connection**
   Look for: "MongoDB connected to: mongodb+srv://..."
   
3. **Open Team Management Page**
   - Host creates game
   - Click "Open Team Management"
   - Check browser console (F12)
   
4. **Check Console Logs**
   
   **Browser Console Should Show:**
   ```
   WebSocket connected for team management
   Sending join message: {type: "team_manager_join", ...}
   Team management received message: {type: "joined_game", ...}
   Updating game state: {...}
   ```
   
   **Server Console Should Show:**
   ```
   Client connected: [uuid]
   Received: {type: "team_manager_join", ...}
   Team manager joined game: [code]
   ```

5. **Test Team Creation**
   - Click "Test Create Team" button
   - Check browser console for: "Sending team action: ..."
   - Check server console for: "Received team management action: ..."

### Common Issues:

#### Issue 1: WebSocket Not Connecting
**Symptoms:** "WebSocket State: 0" or "Not connected"
**Solution:**
- Ensure WebSocket server is running on port 8080
- Check if port 8080 is available
- Try: `netstat -ano | findstr :8080` (Windows)

#### Issue 2: Game Not Found
**Symptoms:** Error message "Game not found"
**Solution:**
- Verify game code is correct
- Check MongoDB has the game document
- Ensure game is marked as `isActive: true`

#### Issue 3: Teams Not Saving
**Symptoms:** Teams appear but disappear on refresh
**Solution:**
- Check server console for "Saving game to database..."
- Check for MongoDB connection errors
- Verify MongoDB credentials are correct

#### Issue 4: No Response from Server
**Symptoms:** No messages received after sending action
**Solution:**
- Check WebSocket connection state
- Verify message format is correct
- Check server console for errors

### Manual Testing:

1. **Open test-websocket.html in browser**
   - Should connect to WebSocket server
   - Click "Test Create Team"
   - Check if team is created

2. **Check MongoDB Directly**
   ```javascript
   // In MongoDB Compass or shell
   db.games.find({isActive: true})
   ```
   - Verify teams array is updated

3. **Check Network Tab**
   - Open browser DevTools → Network → WS
   - See WebSocket messages being sent/received

### Debug Panel Information:

The team management page now includes a debug panel showing:
- Game Code
- Connection Status
- Game Loaded Status
- Teams Count
- Waiting Players Count
- WebSocket State

### Quick Fixes:

1. **Restart WebSocket Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run ws-server
   ```

2. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R
   - Clear cache and reload

3. **Check MongoDB Connection**
   - Verify connection string in `.env.local`
   - Test connection in MongoDB Compass

4. **Verify Game Code**
   - Ensure using correct 4-digit code
   - Check host interface for correct code

### Expected Behavior:

1. **Create Team:**
   - Enter team name → Click Create
   - Team appears in list immediately
   - Server logs: "Created team: [name]"
   - Database updated with new team

2. **Add Player:**
   - Click team button next to waiting player
   - Player moves to team list
   - Server logs: "Added [player] to [team]"
   - Database updated with player in team

3. **Remove Player:**
   - Click Remove button
   - Player returns to waiting list
   - Server logs: "Removed [player] from [team]"
   - Database updated

### If Still Not Working:

1. Check all console logs (browser + server)
2. Verify WebSocket connection is established
3. Test with test-websocket.html
4. Check MongoDB connection
5. Restart both servers (Next.js + WebSocket)
6. Clear browser cache completely

### Contact Points:

- Browser Console: F12 → Console tab
- Server Console: Terminal running `npm run ws-server`
- Network Tab: F12 → Network → WS tab
- MongoDB: Check database directly

The debug panel and console logs should help identify exactly where the issue is occurring.