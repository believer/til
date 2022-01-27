---
title: newline in vim substitutions
description: When doing substitutions in vim use \r instead of \n
date: 2022-01-26
tags:
  - learning
  - til
layout: layouts/post.njk
---

When doing substitutions in vim use `\r` instead of `\n`. `\n` inserts a null character in the text while `\r` will match a carriage return.

If you are _searching_ for a newline, you'd still use `\n`.

---

- StackOverFlow. (2008-09-16) [Link](https://stackoverflow.com/questions/71323/how-to-replace-a-character-by-a-newline-in-vim)
