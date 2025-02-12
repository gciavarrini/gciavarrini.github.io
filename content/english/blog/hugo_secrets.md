---
title: "How I Securely Used Google Analytics in Hugo with GitHub Secrets"
meta_title: "Securely Using Google Analytics in Hugo with GitHub Actions"
description: "Learn how to securely integrate Google Analytics with Hugo on GitHub Pages without exposing your tracking ID. A simple and effective approach using GitHub Secrets."
date: 2026-02-12T12:00:00Z
categories: ["Web Development", "Hugo", "GitHub Actions"]
author: "Gloria Ciavarrini"
tags: ["hugo", "github-pages", "google-analytics", "github-actions"]
draft: false
---

 
 
I wanted to use Google Analytics in my Hugo site hosted on GitHub Pages without
exposing my tracking ID in a public repository.

The solution? GitHub Secrets + a simple script to modify `hugo.toml` at build
time.

And guess what? It worked like a charm! 😎

## The Problem: Keeping My Google Analytics ID Secret

I'm using Hugo with the [Hugoplate
template](https://github.com/zeon-studio/hugoplate), and I wanted to enable
Google Analytics tracking. Hugo makes it easy to add your Google Analytics ID in
hugo.toml:

```
[services]
[services.googleAnalytics]
ID = 'G-MEASUREMENT_ID'
```

However, since my site is publicly hosted on GitHub, I didn't want to hardcode
my Google Analytics ID in the repo. Exposing the ID isn't a major security risk,
but keeping secrets out of public repositories is always a good practice.

## The Goal

✅ Use GitHub Secrets to store my Google Analytics ID securely.\
✅ Inject the ID dynamically at build time in GitHub Actions.\
✅ Ensure Hugo picks it up properly during deployment.

## The Solution

Injecting the ID in `hugo.toml` at Build Time!

### Step 1: Remove Google Analytics from hugo.toml

To allow our GitHub Actions workflow to inject the Google Analytics ID, I
removed the related section from `hugo.toml`.
```toml
[services]
[services.googleAnalytics]
ID = 'G-MEASUREMENT_ID'
```

🚨 Remove this section completely! 🚨

### Step 2: Store the Secret in GitHub

I added my Google Analytics ID as a GitHub Secret:

* Go to GitHub Repository → Settings → Secrets and variables → Actions
* Click "New repository secret"
* Add a new secret: \
    _Name_: `GA_MEASUREMENT_ID`\
    _Value_: `G-XXXXXXXXXX` (replace with your real Google Analytics ID)

### Step 3: Modify GitHub Actions Workflow

Hugoplate automatically generates a GitHub Actions workflow
(`.github/workflows/main.yml`) for building and publishing the website.

I added this step before building the Hugo site:

```yaml
- name: Inject Google Analytics ID
  env:
    GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
  run: |
    echo "[services]" >> hugo.toml
    echo "[services.googleAnalytics]" >> hugo.toml
    echo "ID = '${GA_MEASUREMENT_ID}'" >> hugo.toml
```

How This Works:

✅ Reads the secret from GitHub (`GA_MEASUREMENT_ID`).\
✅ Dynamically appends the Google Analytics ID to `hugo.toml`.\
✅ Hugo now recognizes the correct tracking
ID at build time!

## The Result: Success! 🎉

I deployed my site, and Hugo picked up the ID as expected!

🔥 No hardcoded secrets. 🔥 Google Analytics is running. 🔥 The repo stays clean
and secure.

Why This Approach is Awesome

✔ Secure: Secrets are stored in GitHub Secrets, not in the repo. ✔ Simple: Just
two lines of shell script to inject the ID. ✔ Flexible: Works for any Hugo
project using hugo.toml.

## Is This the Best Approach Ever? Probably Not. But It Works. 😎

Listen, I know this isn't the most sophisticated solution. A more advanced
approach might involve:

But here’s the thing—this method is super simple, and it works. No extra
dependencies, no complex setup. Just a couple of lines in GitHub Actions, and
boom—problem solved.

## Final Thoughts

If you're using Hugo + GitHub Pages and need Google Analytics without exposing
your tracking ID, this approach works like a charm 😉.

Let me know if you found this useful or have any questions! 🚀
