# How to Find Network Access in MongoDB Atlas

## Step-by-Step Instructions

### Step 1: Go to Project Level (Not Cluster Level)

You're currently on the **Cluster Overview** page. You need to go up one level to the **Project** level.

1. Look at the **top breadcrumb navigation**:
   ```
   ORGANIZATION Houssem's Org - 202... > PROJECT Project 0 > CLUSTER Cluster0
   ```

2. Click on **"PROJECT Project 0"** (the middle part of the breadcrumb)
   - This will take you to the Project overview page

### Step 2: Find Network Access in Left Sidebar

Once you're at the **Project** level, look at the **left sidebar**. You should see:

**SECURITY Section:**
- 🔒 **Network Access** ← Click this!
- 🔐 **Database Access**
- 🛡️ **Encryption at Rest**
- 🔑 **API Keys**

**Or look for these sections:**
- Security
- Access Management
- Network Access

### Alternative: Direct Link

If you can't find it, try this direct URL pattern:
```
https://cloud.mongodb.com/v2#/security/network/list
```

Or:
1. Go to: https://cloud.mongodb.com
2. Click on your **Project** (not the cluster)
3. Look for **"Security"** or **"Network Access"** in the left sidebar

### Step 3: Add IP Address

Once you're in **Network Access**:

1. Click **"Add IP Address"** button (top right)
2. Click **"Allow Access from Anywhere"**
3. Click **"Confirm"**

This adds `0.0.0.0/0` which allows all IPs.

## Visual Guide

**Current Location (Cluster Level):**
```
Left Sidebar shows:
- Overview ← You are here
- Data Explorer
- Real Time
- Cluster Metrics
```

**Where You Need to Go (Project Level):**
```
Left Sidebar shows:
- Clusters
- Database Access
- Network Access ← You need this!
- API Keys
- etc.
```

## Quick Navigation

1. **Click "PROJECT Project 0"** in the top breadcrumb
2. **Look for "Network Access"** in the left sidebar (under Security section)
3. **Click "Add IP Address"**
4. **Select "Allow Access from Anywhere"**
5. **Confirm**

---

**Network Access is at the PROJECT level, not the CLUSTER level!** 🔍

