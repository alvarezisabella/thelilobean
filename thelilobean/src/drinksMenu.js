import strawberryMatchaLatteImage from './assets/menu/strawberry-matcha-latte.png';
// import matchaLatteImage from './assets/menu/matcha-latte.jpg';
import spanishLatteImage from './assets/menu/spanish-latte.png';
// import biscoffLatteImage from './assets/menu/biscoff-latte.jpg';
// import churroLatteImage from './assets/menu/churro-latte.jpg';
// import cinnamonToastCrunchLatteImage from './assets/menu/cinnamon-toast-crunch-latte.jpg';
// import caramelMacchiatoImage from './assets/menu/caramel-macchiato.jpg';
// import caramelLatteImage from './assets/menu/caramel-latte.jpg';
// import brownSugarShakenEspressoImage from './assets/menu/brown-sugar-shaken-espresso.jpg';
// import seaSaltCaramelShakenEspressoImage from './assets/menu/sea-salt-caramel-shaken-espresso.jpg';


export const drinks = {
  'strawberry-matcha-latte': {
    name: 'Strawberry Matcha Latte',
    imageUrl: strawberryMatchaLatteImage,
    sizes: [
      { label: '16oz', imageUrl: strawberryMatchaLatteImage },
      { label: '20oz', imageUrl: strawberryMatchaLatteImage },
    ],
    category: 'Matcha',
    included: ['Whole Milk', 'Matcha Powder', 'Agave', 'Strawberry Puree'],
  },
  'matcha-latte': {
    name: 'Matcha Latte',
    imageUrl: strawberryMatchaLatteImage,
    sizes: [
      { label: '16oz', imageUrl: strawberryMatchaLatteImage },
      { label: '20oz', imageUrl: strawberryMatchaLatteImage },
    ],
    category: 'Matcha',
    included: ['Whole Milk', 'Matcha Powder', 'Agave'],
  },
  'spanish-latte': {
    name: 'Spanish Latte',
    imageUrl: spanishLatteImage,
    sizes: [
        { label: '16oz', imageUrl: spanishLatteImage },
        { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Sweetened Condensed Milk'],
    },
  'biscoff-latte': {
    name: 'Biscoff Latte',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Biscoff Syrup'],
  },
  'churro-latte': {
    name: 'Churro Latte',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Churro Syrup'],
  },
  'cinnamon-toast-crunch-latte': {
    name: 'Cinnamon Toast Crunch Latte',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Cinnamon Toast Crunch Syrup'],
  },
  'caramel-macchiato': {
    name: 'Caramel Macchiato',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Caramel Syrup', 'Caramel Drizzle'],
  },
  'caramel-latte': {
    name: 'Caramel Latte',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Whole Milk', 'Espresso', 'Caramel Syrup'],
  },
  'brown-sugar-shaken-espresso': {
    name: 'Brown Sugar Shaken Espresso',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Espresso', 'Brown Sugar Syrup', 'Ice'],
  },
  'sea-salt-caramel-shaken-espresso': {
    name: 'Sea Salt Caramel Shaken Espresso',
    imageUrl: spanishLatteImage,
    sizes: [
      { label: '16oz', imageUrl: spanishLatteImage },
      { label: '20oz', imageUrl: spanishLatteImage },
    ],
    category: 'Espresso',
    included: ['Espresso', 'Sea Salt Caramel Syrup', 'Ice'],
  },
};

export const categoryOrder = ['Espresso', 'Matcha'];