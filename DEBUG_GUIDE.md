# 🔧 Debug Guide for Discharge System Issues

## Issues to Debug
1. Nurse not receiving notifications after doctor approval
2. Discharge button not working efficiently

## Debug Steps

### Step 1: Check Browser Console

**For Doctor Discharge Button:**
1. Open browser (Chrome/Firefox)
2. Login as doctor@zerowait.com / doctor123
3. Open Developer Tools (F12)
4. Go to Console tab
5. Navigate to Patient List → Select Patient
6. Click "Discharge" button
7. **Expected Console Logs:**
   ```
   Initiating discharge for patient: [Patient Name]
   Calling discharge service...
   Discharge workflow created: [workflow object]
   ```
8. **If no logs:** Button click handler not working

**For Nurse Notifications:**
1. Login as nurse@zerowait.com / nurse123
2. Open Developer Tools (F12)
3. Go to Console tab
4. Navigate to Nurse Dashboard
5. **Expected Console Logs:**
   ```
   Loading nurse notifications...
   Nurse notifications loaded: [array of notifications]
   Loading nurse workflows...
   All workflows: [array of workflows]
   Nurse workflows filtered: [filtered array]
   ```
6. Wait 10 seconds, should see logs repeat
7. **If no logs:** Real-time updates not working

### Step 2: Test Doctor Approval Flow

1. **Doctor initiates discharge:**
   - Click discharge button
   - Wait for AI processing (3 seconds)
   - Review and click "Approve"
   - **Expected Console:**
     ```
     Approval received: doctor, Doctor: true, Nurse: false
     Sending nurse approval notification...
     Nurse approval notification sent!
     ```

2. **Nurse checks notifications:**
   - Open nurse dashboard in new tab
   - Wait 10 seconds for real-time update
   - **Expected Console:**
     ```
     Loading nurse notifications...
     Nurse notifications loaded: [should include new notification]
     ```

### Step 3: Manual Notification Test

If automatic notifications don't work, test manually:

1. **Open Browser Console on Nurse Dashboard**
2. **Run this command:**
   ```javascript
   // Test notification service directly
   const notificationService = DischargeNotificationService.getInstance();
   const testNotification = {
     id: 'test-123',
     workflowId: 'test-workflow',
     department: 'nursing',
     type: 'approval-required',
     title: 'Test Notification',
     message: 'This is a test notification',
     priority: 'high',
     createdAt: new Date(),
     read: false,
     actionRequired: true,
     actionUrl: '/test'
   };
   
   // Add notification
   if (!notificationService.notifications.has('nursing')) {
     notificationService.notifications.set('nursing', []);
   }
   notificationService.notifications.get('nursing').push(testNotification);
   
   // Trigger update
   console.log('Test notification added:', testNotification);
   ```

### Step 4: Check Common Issues

**Issue 1: Import Problems**
```javascript
// Check if services are imported correctly
console.log('DischargeService:', typeof DischargeService);
console.log('NotificationService:', typeof DischargeNotificationService);
// Should show: function, function
```

**Issue 2: Service Instance**
```javascript
// Check if singleton instances work
const service1 = DischargeService.getInstance();
const service2 = DischargeService.getInstance();
console.log('Same instance:', service1 === service2); // Should be true
```

**Issue 3: State Updates**
```javascript
// Check if React state updates
// In nurse dashboard, add temporary debug:
useEffect(() => {
  console.log('Notifications state updated:', notifications);
  console.log('Workflows state updated:', workflows);
}, [notifications, workflows]);
```

## Quick Fixes

### Fix 1: If discharge button not working
```typescript
// In PatientDetailView, ensure button has proper handler
<button 
  onClick={handleInitiateDischarge}  // Make sure this is set
  disabled={isInitiatingDischarge}
  className="..."
>
  {isInitiatingDischarge ? 'Initiating...' : 'Discharge'}
</button>
```

### Fix 2: If notifications not updating
```typescript
// In NurseDashboard, force immediate update
useEffect(() => {
  const loadImmediately = async () => {
    await loadNotifications();
    await loadWorkflows();
  };
  
  loadImmediately(); // Load immediately
  loadImmediately(); // Load again after 10 seconds
  
  const interval = setInterval(loadImmediately, 10000);
  return () => clearInterval(interval);
}, []);
```

### Fix 3: If real-time updates fail
```typescript
// Add manual refresh button
<button 
  onClick={() => {
    loadNotifications();
    loadWorkflows();
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Refresh
</button>
```

## Expected Working Flow

1. **Doctor clicks discharge** → Console shows workflow creation
2. **AI processes** → Modal opens with content
3. **Doctor approves** → Console shows approval sent
4. **Nurse receives** → Console shows notification loaded
5. **Nurse approves** → Status changes to processing
6. **Departments work** → Status changes to completed

## Troubleshooting Checklist

- [ ] Browser console shows no errors
- [ ] Doctor discharge button creates workflow
- [ ] Doctor approval triggers notification
- [ ] Nurse dashboard loads notifications
- [ ] Real-time updates every 10 seconds
- [ ] Notification badge appears on bell
- [ ] Discharge approvals section shows patient
- [ ] Quick action buttons are clickable
- [ ] All imports are working correctly

## Test Results Log

**Doctor Discharge Button:**
- Button click: ✅ / ❌
- Workflow created: ✅ / ❌
- Console logs: ✅ / ❌

**Nurse Notifications:**
- Initial load: ✅ / ❌
- Real-time updates: ✅ / ❌
- Notification display: ✅ / ❌
- Badge counter: ✅ / ❌

**Quick Actions:**
- Button clicks: ✅ / ❌
- Console logs: ✅ / ❌
- Navigation ready: ✅ / ❌

Run through this checklist and report which items are ❌ to identify the specific issue.
