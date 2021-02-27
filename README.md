# Boop Bot
A Discord bot written in NodeJS as part of my A-Commit-A-Day challenge.\
<br/>

# What is "A-Commit-A-Day"?
A-Commit-A-Day is a challenge I've coined which pushes programmers
to make at least one commit to their Github every day.

>Why A-Commit-A-Day?

I have had trouble motivating myself to start working on projects.
College and studying has kept me occupied as of late, and I have
had little time to think about what I want to make. Additonally,
I have ADHD and have difficulties remembering any ideas I might
come up with unless I have them down on paper. This has resulted
in an activity gap in my commit history, which is something I would
like to amend in order to keep myself invigorated.

>Should I Give A-Commit-A-Day A Try?

If you are like me, and you have trouble keeping yourself up to
speed on development technologies and project ideas, I would
definitely give A-Commit-A-Day a shot. It never hurts to try!

>So what, you can just add a comment to your code and call it a (commit-a) day? (hehe, I like puns)

Definitely not. The point of A-Commit-A-Day is to remind your brain to work on something programming-related at least once a day. That being said, you have
to either enjoy programming or have the willpower to commit to it to fulfill
the challenge.

With that in mind, it is a good idea to keep a roadmap of your programs. In my
case, I've created a constantly growing to-do list for Boop Bot, which I update
whenever I run into a bug or come up with an idea for a feature or a way I can
optimize my code.

>I'm not really sure what to make though?

If you're a bit lost and cannot decide what you want to try out, take a look
at a couple of articles to give you some ideas:
- UCF: [Top 10 Coding Projects For Beginners](https://bootcamp.ce.ucf.edu/blog/top-10-coding-projects-for-beginners/)
- Medium: [12 Great Ideas for Programming Projects That People Will Use](https://betterprogramming.pub/12-ideas-for-programming-projects-too-dangerous-not-to-build-514e3212ab77) 
- Linux Training Acdemy: [Over 1,500 Coding Project Ideas](https://www.linuxtrainingacademy.com/projects/)

<br/>

# Contributing
I am not currently looking for contributors to the project. This is something
I would like to pursue on my own, however any feedback would be extremely
helpful and appreciated.\
<br/>

# Installation
Since Boop Bot is open source, it would only be fair for me to write a guide
on starting the bot.

Boop Bot is written in NodeJS, so first make sure you have NodeJS installed.\
[Windows (x64)](https://nodejs.org/dist/v14.16.0/node-v14.16.0-x64.msi)\
[Linux/Mac (package manager guide)](https://nodejs.org/en/download/package-manager/)

When that is done, navigate to your cloned boop_bot folder and type
```cmd
npm install && npm i -g nodemon
```
`npm install` will install all of the necessary packages required
to run Boop Bot, and `npm i -g nodemon` installs 
[nodemon](https://www.npmjs.com/package/nodemon), which is required
to run the bot in developer mode.\
Next, [create a Discord bot account](https://discord.com/developers/applications) and write this to `.env` in the project root:
```
TOKEN=YOUR_TOKEN_HERE
```
Next, check out Firebase and create a [Firestore]('https://firebase.google.com/docs/firestore/quickstart'), then [download your service key](https://firebase.google.com/docs/admin/setup), put the json file in the `services` directory and name it `serviceAccountKey.json`. `.env` and `serviceAccountKey.json` are both
in `.gitignore`, so you won't have to worry about accidentally pushing them.

When all is set and done, open your terminal in the boop_bot directory and
type `npm test` to start the bot.\
<br/>

# Changelog
### 1.0.0 - Feb 23, 2021
- Initial release, added readme and restructured folders for readability
and scalability.
### 1.0.1 - Feb 24, 2021
- Added printme command.
- Reformatted commandhandler convention.
- Patched up readme slightly. (I found some typos and such)
### 1.0.2 - Feb 25, 2021
- Reminders <30s are saved to memory as timeouts so they can be
send sooner.
# 1.0.3 - Feb 26, 2021
- Added error catcher to index.js (for no good reason, just wanted to follow good practices)
- Cleaned up packages (removed redundant references, etc.)
- I wasn't motivated to do much more today. I feel unmotivated at the moment. Hopefully that will change tomorrow.

# Roadmap
\+ - Implemented\
\- - Pending or in the works
```diff
TODO - Features
+ fix argument length ("some text" only saves "some")
+ throw error for invalid alias stamp
+ load reminders <30s to cache
- newline support in $b remind
+ update command help tab
- clear expired reminders on bot startup
- add multiple reminds support
- add $b getreminds and $b removeremind
- dynamic time support for $b remind (i.e. $b remind 2h30m clean room)
+ add printme command
```

```diff
TODO - Meta
+ Categorize each section of the application into separate folders
+ Encapsulate commands in their own files, all in /commands/
+ create folder /src/ and put all code in there
+ build coherent readme (talk about a-commit-a-day and stuff)
+ clean up packages (i.e. remove firestore from firebase.js)
- optimize message embeds (save them to cache instead of re-creating every time a command is run)
+ encapsulate string functions into stringutils.js
+ restructure commandhandler to abide by javascript convention
- clean up intellisense in commandhandler.js
```