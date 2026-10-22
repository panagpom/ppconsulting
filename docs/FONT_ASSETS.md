# Website typography

English headings: Merriweather. Greek headings: Georgia, then Times New Roman, as chosen by the user because Merriweather does not cover Greek. Body text, navigation, buttons and forms: Lato in both languages.

All font files are served locally. The source starter theme definitions remain available; PPConsulting advisory selects the font stacks described here.

Merriweather comes from the pinned `@fontsource/merriweather` dependency. Normal weights 400, 600 and 700 and italic 400 are imported. Its licence is copied to apps/site/public/fonts/merriweather/OFL.txt.

The `@fontsource/lato` package only supplies latin/latin-ext web subsets. Lato 2.015 full TTF sources include Greek. The project uses Latin/Greek WOFF2 exports from the upstream Google Fonts repository, pinned to commit 5d3b76120a319730fda218cc7410174a462b32cb. Source URLs, SHA-256 hashes, glyph checks and final sizes are recorded in apps/site/public/fonts/lato/sources.json. The OFL licence is shipped beside the fonts. The web subset retains Latin, Latin extended, Greek, Greek extended, combining marks, punctuation, currencies and arrows; other scripts use the normal CSS fallback.

The temporary conversion tools live under .generated/font-tools and are excluded from the repository; no system fonts or global Python packages were installed. Runtime serving does not depend on those tools.

The local typography skill searches returned no verified match for the requested pairing or Greek fallback. The implementation follows the user's pairing, the font metadata and the existing general typography/reflow baseline.

Sources:

- [Lato coverage and upstream files](https://fontsource.org/fonts/lato/about)
- [Merriweather coverage](https://fontsource.org/fonts/merriweather/about)
- [Google Fonts Lato source](https://github.com/google/fonts/tree/5d3b76120a319730fda218cc7410174a462b32cb/ofl/lato)
