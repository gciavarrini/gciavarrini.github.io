---
title: "Bringing structure to chaos: lessons from a multi-component open source project"
meta_title: "Bringing structure to chaos: lessons from a multi-component open source project"
description: "When I joined a complex multi-component open source project, there was a gap between the architects' vision and what engineers could work from. Here's what worked: incremental approach, written enhancements, and pushing back on scope."
excerpt: "When I joined a complex multi-component open source project, there was a gap between the architects' vision and what engineers could work from. Here's what worked: incremental approach, written enhancements, and pushing back on scope."
date: 2026-02-25T10:00:00Z
image: "/images/blog/bringing-structure-to-chaos/bringing-structure-to-chaos.png"
categories: ["Open Source", "Software Engineering", "Teamwork"]
author: "Gloria Ciavarrini"
tags: ["open source", "multi-component", "architecture", "incremental", "documentation"]
draft: false
---

When I joined a complex open source project with many components, I expected to
spend my first weeks understanding the architecture and diving into code.
Instead, I found a gap: the architects had a clear vision (Miro boards,
diagrams, the big picture) but it wasn't translating into something engineers
could work from. The gap was in process and communication, not in intent. The
team was spinning in meetings where you leave and still don't know what was
decided. Here's what we did to bring structure back.

## The situation


<div style="text-align: center;">
  <img src="/images/blog/bringing-structure-to-chaos/confused2.png" alt="Chaos and confusion when vision and implementation are out of sync">
</div>


The project had multiple repositories, each with a different role. The
architects had mapped the ideal end state. Everyone was trying. But several
things were getting in the way:

**Vision vs. implementation.** The focus was on the final solution, not the
journey. The discussion kept jumping to specific, complex details without a
shared starting point. Engineers needed to know where to begin, but we kept
landing on edge cases and future states.

**Abstract demos.** The team tried demos to validate direction. The demos were
too abstract: they didn't reflect the real complexity of building from scratch.
They looked good on the surface but didn't help engineers understand what to
implement next.

**Repeated conversations.** A couple of engineers were already on the project,
but the same topics kept coming up. Without a written record of decisions and
scope, discussions went in circles.

**Underestimated complexity.** There was technical uncertainty. The gap between
"we want this" and "here's how we build it step by step" was large. It wasn't a
lack of understanding on anyone's part; it was a process gap.

## What we did

We shifted toward structure and incremental delivery.

### Write it down

I started writing enhancement proposals and encouraged others to do the same.
Putting ideas in writing forced clarity. Each enhancement focused on a specific
topic, so discussions became concrete instead of vague. People could disagree on
the page, not in endless meetings.

### Define the basis first, then make it complex

<div style="text-align: center;">
  <img src="/images/blog/bringing-structure-to-chaos/define_basis.png" alt="Define the basis first, then make it complex">
</div>

We pushed for an incremental approach: define the minimum viable foundation
before adding complexity. That meant agreeing on what "minimum value" meant and
resisting the urge to solve everything at once. Once we had that baseline, we
could layer on more.

### Push back on scope

<div style="text-align: center;">
  <img src="/images/blog/bringing-structure-to-chaos/push_back.png" alt="Push back on scope">
</div>

When we identified the minimum value, we explicitly pushed back on additional
work. Saying "not yet" was important. Nobody loves hearing it, but it kept the
team from chasing new features before the foundation was solid.

### Focus the conversation

By tying discussions to specific enhancements, we gave people something concrete
to react to. Instead of abstract architecture debates, we had "this enhancement
proposes X. What do you think?" That made progress measurable.

## Lessons learned

<div style="text-align: center;">
  <img src="/images/blog/bringing-structure-to-chaos/learn.png" alt="Lessons learned">
</div>

1. **Architects and engineers need different artifacts.** Miro boards and
   high-level diagrams help with vision. Engineers need written specs,
   enhancement proposals, and a clear sequence of work. Both matter; they serve
   different purposes. Neither approach is wrong.

2. **The journey matters as much as the destination.** A clear end state is
   useless if nobody knows how to get there. Define the first step, then the
   next, before worrying about the final shape.

3. **Abstract demos can mislead.** Demos that hide complexity feel reassuring
   but don't help implementation. Prefer demos that reflect real constraints, or
   pair them with written enhancement proposals that spell out the work.

4. **Writing forces clarity.** Enhancement proposals don't have to be perfect.
   The act of writing exposes gaps and disagreements early. It's cheaper than
   discovering them mid-implementation.

5. **"Not yet" is a valid answer.** Pushing back on scope isn't negativity. It's
   protecting focus. Agree on minimum value first, then expand.

## If you're joining (or leading) a complex project

- Ask: "What's the smallest thing we can ship that delivers value?" If nobody
  can answer, that's the first conversation.
- Propose written enhancements, even rough ones. Get feedback in writing. It
  breaks the cycle of repeated verbal discussions.
- Separate "what we want eventually" from "what we're building now." Keep a
  backlog of future ideas, but don't let it blur the current scope.
- When demos feel too polished, ask: "What would it take to build this? What's
  missing?" Surface the real complexity.

Complex multi-component projects are hard. Bringing structure doesn't mean
having all the answers. It means creating a process where the team can find them
together.

The real work happened in the details: our first enhancement draft, the
definition of minimum value that took three meetings to nail down, and the
conversations that required more than a blog post to unpack. Those deserve
their own space, and I hope to give them that in future posts.

<p class="image-attribution">Images in this post were generated with Google Gemini.</p>
