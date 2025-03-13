---
title: "How to Securely Use Secrets in Hugo with GitHub Actions"
meta_title: "Securely Using Secrets in Hugo with GitHub Actions"
description: "Learn how to securely integrate sensitive information in Hugo on
GitHub Pages without exposing it in your repository. A simple and effective
approach using GitHub Secrets." 
date: 2025-02-12T10:00:00Z
image: "/images/blog/hugo_logo.png"
categories: ["Web Development", "Hugo", "GitHub Actions"]
author: "Gloria Ciavarrini"
tags: ["hugo", "github-pages", "github-actions", "secrets"]
draft: false 
---

In this post, I'll explain how to securely use sensitive information in Hugo
site hosted on GitHub Pages without exposing it in a public repository.

## The Problem
Keeping Sensitive Information Secret When developing a Hugo site, you might need
to include sensitive information like API keys or database credentials.
Hardcoding these values in `hugo.toml` can expose them if your repository is
public. 

## The Goal
✅ Use GitHub Secrets to store sensitive information securely.\
✅ Inject the information dynamically at build time in GitHub Actions.\
✅ Ensure Hugo picks it up properly during deployment. 

## The Solution 

Injecting sensitive information into `hugo.toml` at Build Time! 🚀

### Step 1: Remove Sensitive Information from `hugo.toml`
To allow our GitHub Actions workflow to inject the sensitive information, remove
any related sections from `hugo.toml`. For example, if you have something like:

```toml
[services] 
[services.exampleService]
secretKey = 'YOUR_SECRET_KEY'
```
🚨 Remove this section completely! 🚨

### Step 2: Store the Secret in GitHub
Add your sensitive information as a GitHub Secret:

* Go to GitHub Repository → Settings → Secrets and variables → Actions
* Click "_New repository secret_"
* Add a new secret:
  *  Name: `EXAMPLE_SECRET_KEY`
  *  Value: `your_real_secret_value`

### Step 3: Modify GitHub Actions Workflow
Some Hugo templates, ie. Hugoplate, automatically generate a GitHub Actions
workflow (`.github/workflows/main.yml`) for building and publishing the website.

Add this step before building the Hugo site:

```yaml
- name: Inject Secret Key
  env: EXAMPLE_SECRET_KEY: ${{secrets.EXAMPLE_SECRET_KEY }}
  run: |
   echo "[services]" >> hugo.toml
   echo "[services.exampleService]" >> hugo.toml
   echo "secretKey = '${EXAMPLE_SECRET_KEY}'" >> hugo.toml
```

#### How This Works:
✅ Reads the secret from GitHub (EXAMPLE_SECRET_KEY). \
✅ Dynamically appends the secret key to `hugo.toml`.\
✅ Hugo now recognizes the correct value at build time!

### The Result: Success! 🎉

I deployed my site, and Hugo picked up the secret value as expected!\
🔥 No hardcoded secrets.\
🔥 The repository stays clean and secure.

## Why This Approach is Awesome 
✔ **Secure**: Secrets are stored in GitHub Secrets, not in the repo.\
✔ **Simple**: Just a few lines of shell script to inject the value.\
✔ **Flexible**: Works for any Hugo project using `hugo.toml`.

## Final Thoughts 
If you're using Hugo + GitHub Pages and need to handle sensitive information
without exposing it, this approach works effectively. Let me know if you found
this useful or have any questions! 🚀