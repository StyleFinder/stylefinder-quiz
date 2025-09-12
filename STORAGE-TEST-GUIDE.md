# Browser Storage Testing Guide

This guide helps you test the browser storage functionality for the StyleFinder Quiz.

## Testing Steps

### 1. Initial Page Load Test
1. Open http://localhost:3001/quiz in your browser
2. ✅ **Expected**: Page loads with "Loading quiz..." spinner briefly, then shows User Info form
3. ✅ **Expected**: No resume banner appears (fresh start)

### 2. User Info Auto-Save Test
1. Fill in the Name field: "Test User"
2. Fill in the Email field: "test@example.com" 
3. ✅ **Expected**: Auto-save indicator appears briefly in bottom-right corner
4. **DO NOT** click "Continue to Section 1" yet

### 3. Browser Storage Persistence Test
1. Refresh the browser page (Ctrl+R / Cmd+R)
2. ✅ **Expected**: Resume banner appears at top of page
3. ✅ **Expected**: Banner shows "You have saved progress from just now"
4. ✅ **Expected**: Banner shows "Completed: User Info"
5. Click "Resume Assessment"
6. ✅ **Expected**: User Info form pre-populated with "Test User" and "test@example.com"

### 4. Section Navigation Test
1. Click "Continue to Section 1"
2. Answer a few questions in Section 1 (any True/False selections)
3. ✅ **Expected**: Auto-save indicator appears after each group completion
4. Navigate to Section 2 without completing Section 1
5. Go back to home page (http://localhost:3001)
6. Navigate back to quiz (http://localhost:3001/quiz)
7. ✅ **Expected**: Resume banner shows progress includes Section 1

### 5. Complete Quiz Test
1. Resume the quiz and complete all sections
2. Submit the quiz
3. ✅ **Expected**: Redirected to results page
4. Navigate back to quiz page
5. ✅ **Expected**: No resume banner appears (data cleared after completion)

### 6. Start Fresh Test
1. Fill out partial quiz data again
2. Refresh page to trigger resume banner
3. Click "Start Fresh" button
4. ✅ **Expected**: Form is cleared and no saved data remains
5. Refresh page again
6. ✅ **Expected**: No resume banner appears

### 7. Storage Limits Test
1. Open browser DevTools (F12)
2. Go to Application/Storage tab → Local Storage → http://localhost:3001
3. ✅ **Expected**: See `stylefinder_quiz_data` key with JSON data
4. Check data structure includes: version, timestamp, userData, quizProgress

### 8. Privacy/Incognito Mode Test
1. Open quiz in incognito/private browsing mode
2. Fill out partial quiz data
3. ✅ **Expected**: Storage works normally in most browsers
4. ✅ **Expected**: Graceful fallback if storage is disabled

### 9. Mobile Browser Test
1. Test on mobile Chrome/Safari
2. Fill partial quiz → refresh → resume
3. ✅ **Expected**: Same behavior as desktop
4. ✅ **Expected**: Resume banner is mobile-responsive

### 10. Data Expiration Test
1. Open DevTools → Application → Local Storage
2. Modify the `expiresAt` timestamp to be in the past
3. Refresh the page
4. ✅ **Expected**: No resume banner (expired data cleared)

## Browser Compatibility Testing

### Supported Browsers
- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 11+
- ✅ Edge 79+

### Storage Features
- ✅ localStorage available
- ✅ JSON serialization/parsing
- ✅ Storage quota handling
- ✅ Error handling for full storage

## Debugging Commands

### Check Storage in DevTools Console
```javascript
// View saved quiz data
console.log(localStorage.getItem('stylefinder_quiz_data'));

// Check storage availability
console.log('Storage available:', typeof(Storage) !== "undefined");

// Clear stored data manually
localStorage.removeItem('stylefinder_quiz_data');

// Check storage usage
console.log('Storage usage:', JSON.stringify(localStorage).length, 'characters');
```

### Browser Storage Limits
- **Most browsers**: 5-10MB per domain
- **Chrome**: 5MB default
- **Firefox**: 5MB default  
- **Safari**: 5MB default
- **Edge**: 5MB default

## Production Considerations

### For NameCheap Shared Hosting
1. ✅ **HTTPS Required**: localStorage only works over HTTPS in production
2. ✅ **Static Files**: Browser storage works with static file hosting
3. ✅ **CDN Compatible**: Storage works with CDN-served files
4. ✅ **Domain-Specific**: Data scoped to your domain only

### Privacy Compliance
1. ✅ **No Sensitive Data**: Only quiz responses stored locally
2. ✅ **User Consent**: Optional storage (graceful fallback)
3. ✅ **Auto-Expiry**: Data expires after 24 hours
4. ✅ **Manual Clear**: Users can clear data anytime

## Troubleshooting

### Common Issues

**Resume banner doesn't appear:**
- Check DevTools console for JavaScript errors
- Verify localStorage has data: `localStorage.getItem('stylefinder_quiz_data')`
- Check data isn't expired

**Auto-save indicator doesn't show:**
- Check browser allows localStorage
- Verify no JavaScript errors in console
- Check network tab for AJAX errors

**Form fields not pre-populated:**
- Verify resume function was called
- Check quiz data structure in localStorage
- Confirm React Hook Form defaultValues are set

**Storage quota exceeded:**
- Check total localStorage usage in DevTools
- Clear other site data if needed
- Quiz data should be under 10KB typically

## Success Criteria

✅ **All 10 test scenarios pass**  
✅ **Works in 4+ browser types**  
✅ **Mobile responsive**  
✅ **Graceful error handling**  
✅ **Privacy compliant**  
✅ **Production ready**

When all tests pass, the browser storage implementation is complete and ready for NameCheap deployment.