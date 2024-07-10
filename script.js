document.addEventListener('DOMContentLoaded', function () {
  const colors = [
    { name: 'Bleu' },
    { name: 'Bleu clair' },
    { name: 'Jaune' },
    { name: 'Rouge' },
    { name: 'Vert' },
    { name: 'Noir' },
    { name: 'Blanc' },
    { name: 'Transparent' },
    { name: 'Orange' },
    { name: 'Marron' },
    { name: 'Gris' },
    { name: 'Or' },
    { name: 'Violet' },
    { name: 'Rose' },
  ]

  // Définition des traductions pour chaque langue
  const translations = {
    Bleu: {
      en: 'Blue',
      fr: 'Bleu',
      de: 'Blau',
    },
    'Bleu clair': {
      en: 'Light Blue',
      fr: 'Bleu clair',
      de: 'Hellblau',
    },
    Jaune: {
      en: 'Yellow',
      fr: 'Jaune',
      de: 'Gelb',
    },
    Rouge: {
      en: 'Red',
      fr: 'Rouge',
      de: 'Rot',
    },
    Vert: {
      en: 'Green',
      fr: 'Vert',
      de: 'Grün',
    },
    Noir: {
      en: 'Black',
      fr: 'Noir',
      de: 'Schwarz',
    },
    Blanc: {
      en: 'White',
      fr: 'Blanc',
      de: 'Weiß',
    },
    Transparent: {
      en: 'Transparent',
      fr: 'Transparent',
      de: 'Transparent',
    },
    Orange: {
      en: 'Orange',
      fr: 'Orange',
      de: 'Orange',
    },
    Marron: {
      en: 'Brown',
      fr: 'Marron',
      de: 'Braun',
    },
    Gris: {
      en: 'Gray',
      fr: 'Gris',
      de: 'Grau',
    },
    Or: {
      en: 'Gold',
      fr: 'Or',
      de: 'Gold',
    },
    Violet: {
      en: 'Purple',
      fr: 'Violet',
      de: 'Violett',
    },
    Rose: {
      en: 'Pink',
      fr: 'Rose',
      de: 'Rosa',
    },
  }

  const app = document.getElementById('app')
  const colorInputs = document.getElementById('color-inputs')
  const totalWeightInput = document.getElementById('totalWeight')
  const toggleModeButton = document.getElementById('toggleMode')
  const resultsBody = document.getElementById('results-body')
  const modeTitle = document.getElementById('mode-title')
  const weightHeader = document.getElementById('weight-header')
  const langSelect = document.getElementById('lang-select') // Sélecteur de langue
  const totalReachedMessage = document.getElementById('total-reached-message') // Élément pour afficher le message

  let isPercentageMode = true
  let percentages = Array(colors.length).fill(0)
  let weights = Array(colors.length).fill(0)
  let totalWeight = 500

  const updateInputs = () => {
    colorInputs.innerHTML = ''
    colors.forEach((color, index) => {
      const inputWrapper = document.createElement('div')
      inputWrapper.className = 'mb-4'

      // Traduction du label de l'input de couleur
      const label = document.createElement('label')
      label.className = 'block text-sm font-medium text-gray-700'
      label.textContent = getTranslation(color.name) // Utiliser fonction pour traduire le nom de couleur
      label.setAttribute('data-lang', color.name) // Ajouter attribut data-lang pour traduction

      const input = document.createElement('input')
      input.type = 'number'
      input.className =
        'mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
      input.value = isPercentageMode ? percentages[index] : weights[index]
      input.addEventListener('input', (e) =>
        handleInputChange(index, e.target.value),
      )
      inputWrapper.appendChild(label)
      inputWrapper.appendChild(input)
      colorInputs.appendChild(inputWrapper)
    })
  }

  const handleInputChange = (index, value) => {
    if (isPercentageMode) {
      percentages[index] = Math.max(0, parseFloat(value)) || 0
    } else {
      weights[index] = Math.max(0, parseFloat(value)) || 0
    }
    updateResults()
    checkTotalReached() // Vérifier si le total est atteint après chaque modification
  }

  const updateResults = () => {
    totalWeight = parseFloat(totalWeightInput.value) || 0
    let totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0)
    let totalWeightInGrams = weights.reduce((acc, curr) => acc + curr, 0)
    let calculatedWeights = percentages.map(
      (percentage) => (totalWeight * percentage) / 100,
    )

    resultsBody.innerHTML = ''
    colors.forEach((color, index) => {
      let weight = isPercentageMode ? calculatedWeights[index] : weights[index]
      let percentage = isPercentageMode
        ? percentages[index]
        : (weights[index] / totalWeight) * 100
      if (weight > 0) {
        const row = document.createElement('tr')
        const colorCell = document.createElement('td')
        colorCell.className = 'py-3 px-4 border-b border-gray-200'
        colorCell.textContent = getTranslation(color.name) // Utiliser fonction pour traduire le nom de couleur
        colorCell.setAttribute('data-lang', color.name) // Ajouter attribut data-lang pour traduction
        const weightCell = document.createElement('td')
        weightCell.className = 'py-3 px-4 border-b border-gray-200'
        weightCell.textContent = isPercentageMode
          ? weight.toFixed(2) + ' g'
          : percentage.toFixed(2) + ' %'
        row.appendChild(colorCell)
        row.appendChild(weightCell)
        resultsBody.appendChild(row)
      }
    })
  }

  const updateTableHeader = () => {
    weightHeader.textContent = isPercentageMode
      ? 'Weight (grams)'
      : 'Percentage (%)'
  }

  const toggleMode = () => {
    isPercentageMode = !isPercentageMode
    modeTitle.textContent = isPercentageMode
      ? 'Color Percentages'
      : 'Color Weights'
    toggleModeButton.textContent = isPercentageMode
      ? 'Enter in Grams'
      : 'Enter in Percentages'
    updateInputs()
    updateResults()
    updateTableHeader()
  }

  totalWeightInput.addEventListener('input', updateResults)
  toggleModeButton.addEventListener('click', toggleMode)

  updateInputs()
  updateResults()
  updateTableHeader()

  // Fonction pour obtenir la traduction d'une clé donnée
  function getTranslation(key) {
    const lang = langSelect.value // Récupérer la langue sélectionnée
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang]
    }
    return key // Retourne la clé d'origine si la traduction n'est pas trouvée
  }

  // Fonction pour vérifier si le total est atteint et afficher un message
  function checkTotalReached() {
    let message = ''
    if (isPercentageMode) {
      let totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0)
      if (totalPercentage >= 100) {
        message = 'Total percentage reached 100%'
        disableInputs() // Désactiver les inputs
      } else {
        message = '' // Remettre le message à vide si le total n'est pas atteint
        enableInputs() // Activer les inputs
      }
    } else {
      let totalWeightInGrams = weights.reduce((acc, curr) => acc + curr, 0)
      if (totalWeightInGrams >= totalWeight) {
        message = `Total weight reached ${totalWeight} grams`
        disableInputs() // Désactiver les inputs
      } else {
        message = '' // Remettre le message à vide si le total n'est pas atteint
        enableInputs() // Activer les inputs
      }
    }
    totalReachedMessage.textContent = message // Mettre à jour le texte du message
  }

  // Fonction pour désactiver les inputs
  function disableInputs() {
    colorInputs.querySelectorAll('input').forEach((input) => {
      input.disabled = true
    })
  }

  // Fonction pour activer les inputs
  function enableInputs() {
    colorInputs.querySelectorAll('input').forEach((input) => {
      input.disabled = false
    })
  }
})
