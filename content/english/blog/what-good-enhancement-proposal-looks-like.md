---
title: "What a good enhancement proposal looks like"
meta_title: "What a good enhancement proposal looks like"
description: "A simple template for enhancement docs: context, goals and non-goals, proposal, alternatives, open questions, plus where to host them."
excerpt: "A simple template for enhancement docs: context, goals and non-goals, proposal, alternatives, open questions, plus where to host them."
date: 2026-04-22T10:00:00Z
image: "/images/blog/what-good-enhancement-proposal-looks-like/header.png"
categories: ["Open Source", "Software Engineering", "Teamwork"]
author: "Gloria Ciavarrini"
tags: ["open source", "enhancement", "documentation", "template", "git"]
draft: false
---

*This is the third post in a series on bringing structure to complex projects.
Start with [Bringing structure to chaos](/blog/bringing-structure-to-chaos/).
The [first 30 days checklist](/blog/first-30-days-chaotic-project/) pushes for
momentum: getting something on the page early. What follows here is the shape
that makes that write-up survive review.*

Once the blank page isn't blank anymore, the risk shifts. You can have text and
still get vague feedback, or the same debate twice, because nobody knows what
they're being asked to decide. I use a simple template: context and boundaries
first, then the proposal and the rest, so reviewers can react to something
specific: what we're committing to, what we're not, and where I still need
input.

## Start with something specific to react to

"We should improve the API" starts a **debate**. "We add a GET that returns X"
starts a **review**. "We ship the risky part first; we queue the wide refactor"
in a heading starts a **review** too.

<div style="text-align: center;">
  <img src="/images/blog/what-good-enhancement-proposal-looks-like/what-2-small.png"
  alt="Illustration split in two: chaotic speech bubbles and tangled arrows versus a calm document with clear blocks and a single straight arrow, with a small rubber duck on each side.">
</div>


Each line should let someone picture what would change without guessing it.

A vague line like *"we should clean up the architecture"* does not say what to
change first. A concrete line like *"We ship the smaller change this sprint and
we schedule the bigger refactor for later"* says what comes first and what
waits.  People can argue about that order, but they should not have to guess
what *"clean up"* meant.

*Pretty sentences are optional; clarity is not.*

## A simple template

{{< notice "tip" >}} The **labels** matter more than the tool.  {{< /notice >}}

Below are five sections you can lift into a doc, an issue template, or a file in
git.

**1. Context (a short paragraph)**  
*Why does this matter? What problem does it solve?*

Answer in a few sentences. If you need pages of background, the slice is
probably too big. Help people decide quickly whether to care.

**2. Goals and non-goals**  
**Goals:** What you expect this enhancement to deliver: the outcomes or
behaviors you're actually committing to.  
**Non-goals:** What is explicitly *out of scope*, even if it's tempting or comes
up in review. In my experience, reviewers often try to fold more into a single
doc; a visible **Non-goals** list is how I set the boundary and limit what this
round of discussion is allowed to absorb. Without it, everything becomes one
endless enhancement.

**3. The proposal**  
What you're asking to build or change: user-visible behavior, APIs, data,
config, architectural changes. What stays the same. Bullets or numbered steps
beat walls of text; add a diagram or pseudocode when it cuts ambiguity.

**4. Alternatives considered**  
What else you looked at and why you're not doing those. That heads off "what
about X?" If you didn't explore alternatives, say so.

**5. Open questions**  
Where you need input or a decision. That invites comments and signals the doc is
a draft, not a decree.

## Where the document lives: fast comments vs. a durable record


The template above is about *what* goes in the write-up. This section is about
*where* that document lives: a Google Doc, a wiki page, a markdown file in git,
or another home. What changes is **speed of feedback** versus **how easy it is
to find the decision later**.

<div style="text-align: center;">
  <img src="/images/blog/what-good-enhancement-proposal-looks-like/what-3-small.png"
  alt="Illustration split in two: many comment bubbles and motion lines for fast feedback versus a neat stack of papers and a closed binder for a durable record, with a small seesaw between them and rubber ducks on each side.">
</div>



**Collaborative docs (e.g. Google Docs)**  
*Pros:* Comments are frictionless; good for brainstorming and early drafts;
non-engineers can weigh in without touching git.  
*Cons:* Threads pile up; it's hard to see the final call; months later you may
still be asking "what did we agree?" Linking from code or release notes is
clumsy compared to a stable file path.

**Git (design docs next to code, or a dedicated enhancements repo)**  
*Pros:* History is visible; review can mirror code review; one searchable place;
issues and PRs can point at a path that doesn't move.  
*Cons:* Slower for people who don't live in git; you need light discipline so
proposals don't go stale.

**Other common options in open source**  
[**GitHub**](https://github.com) / [**GitLab**](https://gitlab.com): issue
templates for a first cut, [GitHub
Discussions](https://docs.github.com/discussions) or [GitLab
Epics](https://docs.gitlab.com/ee/user/group/epics/) for broader debate, then a
PR or MR into `docs/` or an enhancements repo when the text stabilizes. Same
platform as the code, so links stay natural.  
[**HackMD**](https://hackmd.io/) / [**HedgeDoc**](https://hedgedoc.org/)
(formerly CodiMD): collaborative Markdown in the browser; good for live
sessions, then freeze the result into git so the canonical copy isn't split
across edit sessions.  
[**Discourse**](https://www.discourse.org/) or mailing lists (e.g.
[python-ideas](https://mail.python.org/mailman3/lists/python-ideas.python.org/)).
Lists are not a leftover from the past: the Linux kernel and many other projects
still run review and patch submission over email. Long async threads for
feedback; the durable decision still usually lands in a tracked document
(PEP-style, KEP-style, or markdown in a repo).

I started with Google Docs for velocity. After a while, scattered comments and
reopened threads made it hard to treat any single doc as **the** record. I
switched to an **enhancement repository** so the merged markdown is the source
of truth: discussion happens in PRs, and the file is what we actually decided.

That pattern shows up under different names elsewhere. Kubernetes uses
[Enhancement Proposals (KEPs)](https://github.com/kubernetes/enhancements); the
Rust project uses [RFCs](https://github.com/rust-lang/rfcs); Python's public
design process centers on [PEPs](https://peps.python.org/). Different rules and
cadence, same idea: **written proposals with a lifecycle**, not one-off chat.

If you use a dedicated repo, a few habits keep it honest:

- **One proposal, one file** (predictable names help: number or slug, your
  call).
- **Merge means "this is the current agreed text."** Resolve debate by editing
  the document, not only by closing threads in other tools.
- **Link both ways:** from implementation work to the enhancement, and from the
  enhancement to tracking issues.
- **A template** at the repo root makes drafts comparable and lowers the bar for
  new authors.

Heavy process kills adoption. Aim for **clear** and **findable**, not a new
bureaucracy.

## Keep it short

Aim for one to two pages. Use headings so people can scan. Link to related
issues, docs, or other enhancements. If it keeps growing, split the work, not
the essay.

## Before I ask for review

Three things I want clear before other people spend time on it. I am not chasing
perfection, only a draft people can actually respond to.

1. **Actionable.** A reader knows what we'd do next, or what they'd disagree
   with.
2. **Concrete.** Two implementers would land in the same ballpark.
3. **Bounded.** Goals and non-goals are explicit so the doc doesn't become a
   grab bag, or trail off into "and we could also…"

Enhancement proposals don't have to be perfect. Writing still exposes gaps
early; that's cheaper than finding them mid-implementation. A rough draft that
gets comments beats a polished one that never leaves your desk. The same lesson
as in the first post, worth repeating.

---

The next post is about a phrase I still choose carefully: "not yet," and how to
say it when the same plan keeps picking up new work, without sounding negative
or dismissive.
