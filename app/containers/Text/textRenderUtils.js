export const getClassNameForMain = (
	formattedSource,
	userSettings,
	textDirection,
	menuIsOpen,
) => {
	const readersMode = userSettings.getIn([
		'toggleOptions',
		'readersMode',
		'active',
	]);
	const oneVersePerLine = userSettings.getIn([
		'toggleOptions',
		'oneVersePerLine',
		'active',
	]);
	const justifiedClass = userSettings.getIn([
		'toggleOptions',
		'justifiedText',
		'active',
	])
		? 'justify'
		: '';
	const isRtl = textDirection === 'rtl' ? 'rtl' : '';
	const menuOpenClass = menuIsOpen ? ' menu-is-open' : '';

	// formattedSource.main && !readersMode && !oneVersePerLine ? '' : `chapter ${justifiedClass}`

	return formattedSource.main && !readersMode && !oneVersePerLine
		? `${isRtl}${menuOpenClass}`
		: `chapter ${justifiedClass} ${isRtl}${menuOpenClass}`;
};

export const getClassNameForTextContainer = (
	isScrollingDown,
	subFooterOpen,
) => {
	let classNames = 'text-container';

	if (isScrollingDown) {
		classNames += ' scrolled-down';
	}

	if (subFooterOpen && !isScrollingDown) {
		classNames += ' sub-footer-open';
	}

	return classNames;
};

export const getInlineStyleForTextContainer = (
	isLargeBp,
	isAudioPlayerBp,
	isMobileBp,
	isScrollingDown,
	audioSource,
	audioPlayerState,
) => {
	let headerHeight = 136;

	if (isScrollingDown) {
		headerHeight -= 5;
	}

	if (isLargeBp) {
		headerHeight += 25;

		if (!audioSource || !audioPlayerState) {
			headerHeight -= 56;
		}
	} else if (isAudioPlayerBp) {
		headerHeight += 30;

		if (!audioSource || !audioPlayerState) {
			headerHeight -= 96;
		}
	} else if (isMobileBp) {
		headerHeight += 50;

		if (!audioSource || !audioPlayerState) {
			headerHeight -= 85;
		}
	}

	return {
		height: `calc(100vh - ${headerHeight}px)`,
		maxHeight: `calc(100vh - ${headerHeight}px)`,
	};
};

export const isStartOfBible = (books, activeBookId, activeChapter) => {
	if (!books || !books.length) {
		return false;
	}
	const book = books[0];

	if (!book) {
		return false;
	}
	const chapter = book.chapters[0];
	const bookId = book.book_id;

	return bookId === activeBookId && chapter === activeChapter;
};

export const isEndOfBible = (books, activeBookId, activeChapter) => {
	if (!books || !books.length) {
		return false;
	}
	const book = books[books.length - 1];

	if (!book) {
		return false;
	}
	const chapters = book.chapters;
	const chapter = chapters[chapters.length - 1];

	const bookId = book.book_id;

	return bookId === activeBookId && chapter === activeChapter;
};

// Because the system captures the verse numbers this needs to be used
export const calcDistance = (last, first, plainText) => {
	// l: lastVerse, f: firstVerse, p: isPlainText
	// If the last verse is equal to the first verse then I don't need a diff
	if (last === first) return 0;
	let stringDiff = '';

	for (let i = first + 1; i <= last; i += 1) {
		// Adds the length of each verse number
		stringDiff += i.toFixed(0);
		// Adds characters for text to account for spaces in verse numbers
		stringDiff += plainText ? '11' : '11';
		// console.log(i);
	}
	// console.log('string diff', stringDiff);
	// Gets the total length of the distance needed
	return stringDiff.length;
	// return l - f;
};

export const getReference = (
	verseStart,
	verseEnd,
	activeBookName,
	activeChapter,
) =>
	`${activeBookName} ${activeChapter}:${
		verseStart === verseEnd || !verseEnd
			? verseStart
			: `${verseStart}-${verseEnd}`
	}`;