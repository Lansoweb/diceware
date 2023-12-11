let words = []

function secureRandom(count) {
  return window.crypto.getRandomValues(new Uint32Array(1)) % count;
}

function genWords(numWords) {
  let numRollsPerWord = 5;

  words = []

  if (!numWords) { numWords = 1 }

  for (let i = 0; i < numWords; i += 1) {
    let rollResults = []

    for (let j = 0; j < numRollsPerWord; j += 1) {
      rollResults.push(secureRandom(6) + 1)
    }

    number = rollResults.join('');
    let word = ptbr[number];
    word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    words.push({
      word,
      number
    })
  }
}

function genDigits(numDigits) {
  if (! numDigits || numDigits < 1) {
    return;
  }

  let number = Math.floor(Math.random() * Math.pow(10, numDigits));
  number = String(number).padStart(numDigits, '0');
  let pos = Math.floor(Math.random() * words.length)

  return {
    number,
    pos
  }
}

function genSeparators(numSymbols) {
  let numRollsPerWord = 2;
  const symbols = []

  for (let i = 0; i < numSymbols; i += 1) {
    let rollResults = []

    for (let j = 0; j < numRollsPerWord; j += 1) {
      rollResults.push(secureRandom(6) + 1)
    }

    number = parseInt(rollResults.join(''),10);
    if ([16,24,36,46,54,56,61,63,64,66].includes(number)) {
      i--;
      continue;
    }

    symbols.push(special[number])
  }

  return symbols;
}

function capitalize(numCapitalize) {
  if (! numCapitalize || numCapitalize < 1) {
    return;
  }

  const chosen = [];
  do {
    let pos = Math.floor(Math.random() * words.length);

    if (chosen.includes(pos)) {
      continue;
    }

    chosen.push(pos);

    words[pos].word = words[pos].word = words[pos].word.charAt(0).toUpperCase() + words[pos].word.substring(1);
  } while (chosen.length < numCapitalize);
}

function displayWords (digits, separators) {
  const wordList = [];
  const full = [];

  let i = 0;
  $.each(words, function (index, obj) {
    $('#diceWords').append('<li class="list-group-item">' + obj.word + ' <span class="text-muted" style="font-size:10px">' + obj.number + '</span></li>')
    wordList.push(obj.word);
    i++;
  })

  wordList[digits.pos] = wordList[digits.pos] + digits.number;

  $.each(words, function (index, obj) {
    full.push(obj.word);
    full.push(separators.pop());
    i++;
  })

  document.getElementById('diceWordsCopyableSpace').innerText = wordList.join(' ');
  document.getElementById('diceWordsCopyableDash').innerText = wordList.join('-');
  document.getElementById('diceWordsCopyableSymbol').innerText = full.join('');
  $('#generated').slideDown()
}

function resetUI () {
  words = []
  $('#diceWords').html('')
  $('#diceWordsCopyable').text('')
  $('#diceWordsCopyableContainer').hide()
}

$(document).ready(function () {
  resetUI();
  new ClipboardJS('.btn-clipboard');
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  $('#btnGenerate').on('click', function (e) {
    const numWords = parseInt($('input[name="btnWords"]:checked').val(),10);
    const numDigits = parseInt($('input[name="btnNumbers"]:checked').val(),10);
    const numCaptilize = parseInt($('input[name="btnCapitalize"]:checked').val(),10);
    e.preventDefault()
    resetUI();
    genWords(numWords);
    capitalize(numCaptilize);
    const digits = genDigits(numDigits);
    const separators = genSeparators(words.length - 1);
    displayWords(digits, separators);
  })
})
