# Smults or (a.k.a Steem MULti Tags Search)

[steemit.com](https://steemit.com) allows searches by using only ONE tag while [busy.org](https://busy.org/) searches by single user's name. This is inconvenient for those who need to look for more specific posts. [Smults](https://smults-search.appspot.com) allows for multiple tags search, the ability to mark first tag as category, and the ability to filter by author.

## Introduction
Click image to view youtube video  
[![Smults Intro video](https://github.com/Alvin-Voo/smults/raw/master/Screenshot1.png)](http://www.youtube.com/watch?v=SWYt4bGmN7w)

## Getting Started
For development:

```
> git clone https://github.com/Alvin-Voo/smults.git
> yarn
> yarn run dev or yarn run next

```
For production:

```
> yarn run next_build
> yarn run next_start or yarn start
```

For testing:

```
> yarn test (for overall testing) 
> yarn test --verbose --coverage (to print out each test cases and coverage report)
```


### RoadMap
1. Route as the source of truth?
- for e.g. https://smults-search.appspot.com/search?tags=tag1,tag2,tag3
