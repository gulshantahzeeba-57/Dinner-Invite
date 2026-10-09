# Dinner Invite

A small multi-step invitation website for asking a friend out to dinner at **Papa's Kitchen**. Built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Features

- **Invitation page** with Yes and No buttons. The No button runs away when you try to click it, and the Yes button grows each time.
- **Confetti poppers** when she says Yes.
- **Food picker** with 8 options. At least 3 must be selected.
- **Drinks picker** with 4 options and a field to add your own. At least 2 must be selected.
- **Date and time** selection. Both are required.
- **Places to visit after dinner** with a field to add your own. At least 2 must be selected.
- **Three light-hearted pages**: dinner rules, a hunger meter and a "who's paying?" question.
- **Final page** with a summary of every choice made and a Pay button.
- Fully responsive and works on mobile.
- Flat design with no gradients. Icons from Font Awesome.

## Project structure

```
dinner-invite/
├── index.html   # All pages (sections) and layout
├── style.css    # Theme, colors and responsive styles
├── script.js    # Page flow, selections, confetti and validation
└── README.md
```

## Run locally

1. Download or clone the repository.
2. Open `index.html` in any browser.

An internet connection is needed to load Google Fonts and Font Awesome.

## Deploy on GitHub Pages

1. Push the files to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder, then save.
4. Your site will be live at `https://<your-username>.github.io/<repository-name>/`.

Send that link to your friend.

## Customize

| What | Where |
| --- | --- |
| Colors | CSS variables at the top of `style.css` |
| Food, drink and place options | `buildChips(...)` calls in `script.js` |
| Minimum number of selections | The number passed to `buildChips(...)` (3, 2, 2) |
| Page text and headings | `index.html` |
| Funny messages | `meterMessages`, `youMessages` and `payMsgs` in `script.js` |
| Icons | Any free icon from [Font Awesome](https://fontawesome.com/search?o=r&m=free) |

## Tech

- HTML5
- CSS3
- Vanilla JavaScript
- [Font Awesome 6](https://fontawesome.com/)
- Google Fonts: Playfair Display and Inter

## License

Free to use and modify for personal projects.
