---
id: 20
title: Set up Tavily web search API for research automation
status: done
priority: high
created: 2026-02-16T04:30:56.035292274+08:00
updated: 2026-02-19T02:30:57.978395646+08:00
started: 2026-02-17T02:32:14.155574413+08:00
completed: 2026-02-19T02:30:57.978395386+08:00
tags:
    - infra
    - research
class: standard
---

Overnight research was blocked due to lack of web search API. Tavily recommended in skill docs. 

**Update 2026-02-17:** 
- Built-in web_search requires Brave API (not configured)
- web-search-pro skill supports Tavily, Exa, Serper, SerpAPI
- Tavily offers 1000 free searches/month (sufficient for research)
- Need to set TAVILY_API_KEY in ~/.openclaw/.env

**Action needed:** Mat approves setting up Tavily free tier (no cost, just time to register).

Updated with findings: Tavily has 1000 free searches/month - no cost, just need to register. Need Mat to create Tavily account and provide API key.

[[2026-02-18]] Wed 20:06
Tavily API key obtained and stored in .env. Skill integration pending - test with deep-research-pro or web-search-pro.
