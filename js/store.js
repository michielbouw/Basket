var initalStore = {
  baskets: [],
  onboarding: {
    currentIndex: 1,
    finished: false
  }
};

var localStorageKeyBaskets = 'basket-store-baskets';
var localStorageKeyOnboarding = 'basket-store-onboarding';

function writeToLocalStorage(localStorageKey, value) {
  localStorage.setItem(localStorageKey, JSON.stringify(value));
}

function readFromLocalStorage(localStorageKey) {
  return JSON.parse(localStorage.getItem(localStorageKey) || null);
}

function getOnboardingStatus() {
  return readFromLocalStorage(localStorageKeyOnboarding) || initalStore.onboarding;
}

function setOnboardingIndex(index) {
  var newOnboarding = readFromLocalStorage(localStorageKeyOnboarding) || initalStore.onboarding;
  newOnboarding.currentIndex = index;
  writeToLocalStorage(localStorageKeyOnboarding, newOnboarding);
}

function setFinishedOnboarding() {
  var newOnboarding = {
    currentIndex: 1,
    finished: true
  };
  writeToLocalStorage(localStorageKeyOnboarding, newOnboarding);
}

function getBaskets() {
  return readFromLocalStorage(localStorageKeyBaskets) || initalStore.baskets;
}

function setBaskets(baskets) {
  writeToLocalStorage(localStorageKeyBaskets, baskets);
}

function getBasket(id) {
  return getBaskets().find(function (basket) {
    return basket.id === +id;
  });
}

function addBasket(name) {
  const baskets = getBaskets() || [];
  var lastId = baskets.length
    ? baskets[baskets.length - 1].id
    : 0;
  var newId = lastId + 1;

  baskets.push({
    id: newId,
    name: name,
    items: []
  });
  setBaskets(baskets);

  return newId;
}

function deleteBasket(id) {
  setBaskets((getBaskets() || []).filter(function (basket) {
    return basket.id !== +id;
  }));
}

function createBasketItem(basketId, newName) {
  var newId;

  setBaskets((getBaskets() || []).map(function (basket) {
    if (basket.id === +basketId) {
      var lastId = basket.items.length
        ? basket.items[basket.items.length - 1].id
        : 0;
      newId = lastId + 1;

      basket.items.push({
        id: newId,
        name: newName || '',
        checked: false
      });
    }

    return basket;
  }));

  return newId;
}

function deletBasketItem(basketId, itemId) {
  setBaskets((getBaskets() || []).map(function (basket) {
    if (basket.id === +basketId) {
      basket.items = basket.items.filter(function (item) {
        return item.id !== +itemId;
      });
    }

    return basket;
  }));
}


function updateBasketItemName(basketId, itemId, newName) {
  setBaskets((getBaskets() || []).map(function (basket) {
    if (basket.id === +basketId) {
      basket.items = basket.items.map(function (item) {
        if (item.id === +itemId) {
          item.name = newName;
        }

        return item;
      });
    }

    return basket;
  }));
}

function updateBasketItemChecked(basketId, itemId, isChecked) {
  setBaskets((getBaskets() || []).map(function (basket) {
    if (basket.id === +basketId) {
      basket.items = basket.items.map(function (item) {
        if (item.id === +itemId) {
          item.checked = isChecked;
        }

        return item;
      });
    }

    return basket;
  }));
}
