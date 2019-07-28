/* Initialization functions */
function init() {
  var onboardingStatus = getOnboardingStatus();
  if (onboardingStatus && !onboardingStatus.finished) {
    openOnboardingModal();
  }

  loadBasketsIntoView(true);

  var openIcon = document.getElementById('menu-open-icon');
  openIcon.addEventListener('keypress', handleKeyEnterOpenMenu);

  var createNewButton = document.getElementById('create-new-basket');
  createNewButton.addEventListener('keypress', handleKeyEnterCreateNew);
}


/* Global functions */
function openOverlay(template) {
  var overlayWrapper = document.getElementById('overlay-wrapper');
  overlayWrapper.innerHTML = template;

  var overlay = document.querySelector('.overlay');
  overlay.style.opacity = '1';

  var body = document.querySelector('body');
  body.style.overflow = 'hidden';
}

function closeOverlay() {
  var overlay = document.querySelector('.overlay');
  overlay.style.opacity = '0';

  var overlayWrapper = document.getElementById('overlay-wrapper');
  overlayWrapper.innerHTML = '';

  var body = document.querySelector('body');
  body.style.overflow = '';
}


/* Main view functions */
function loadBasketsIntoView(isInit) {
  var baskets = getBaskets();

  var contentLeft = document.querySelector('.content-left');
  var contentRight = document.querySelector('.content-right');
  var noList = contentLeft.querySelector('.no-list');
  var noChecklist = contentRight.querySelector('.no-checklist');
  var list = contentLeft.querySelector('.list ul');

  var listItem = list.querySelectorAll('.list__item');
  if (listItem) {
    listItem.forEach(function (el) {
      el.remove();
    });
  }

  if (baskets.length) {
    noList.style.display = 'none';
    noChecklist.style.display = 'none';

    baskets.forEach(function (basket) {
      var newListItem = document.createElement('li');
      newListItem.classList.add('list__item');
      newListItem.innerHTML = `
        ${basket.name}
        <span class="right">&#8250;</span>
        <button aria-label="Delete this Basket" onclick="event.stopPropagation(); openDeleteModal(${basket.id});">Del.</button>
        <button aria-label="Share this Basket" onclick="event.stopPropagation(); openShareModal(${basket.id});">Share</button>
      `;
      newListItem.addEventListener('click', function () {
        showBasket(basket.id);
      });
      list.appendChild(newListItem);
    });

    if (isInit) {
      loadBasketIntoView(baskets[0].id);
    }
  } else {
    noList.style = '';
    noChecklist.style = '';
  }
}

function loadBasketIntoView(id) {
  var basket = getBasket(id);

  var contentRight = document.querySelector('.content-right');
  var checklist = contentRight.querySelector('.checklist');
  checklist.style.display = 'block';

  const checklistItems = checklist.querySelectorAll('.checklist__item');
  Array.from(checklistItems).forEach(el => {
    el.remove();
  });

  var checklistActions = document.querySelector('.checklist__actions');
  checklistActions.innerHTML = `
    <button aria-label="Share this Basket" onclick="openShareModal(${id})">Share</button>
    <button aria-label="Delete this Basket" onclick="openDeleteModal(${id})">Delete</button>
  `;

  var basketTitle = checklist.querySelector('h3');
  basketTitle.textContent = basket.name;

  var addItemElement = document.querySelector('.checklist__add');
  addItemElement.innerHTML = `
    <div onclick="addNewItem(${id})">
      <i>+ add item</i>
    </div>
  `;

  basket.items.forEach(function (item) {
    var newItem = document.createElement('div');
    newItem.classList.add('checklist__item');
    newItem.innerHTML = `
      <label for="${item.id}" class="checker" ${item.checked ? 'checked="checked"' : ''}">
        <input
          class="checkbox"
          id="${item.id}"
          type="checkbox"
          ${item.checked ? 'checked="checked"' : ''}"
          onchange="onChangeBasketItemChecked(${id}, ${item.id}, this.checked)"
        />
        <div class="checked"></div>
      </label>
      <input
        type="text"
        placeholder="name your item"
        value="${item.name}"
        onchange="onChangeBasketItemName(${id}, ${item.id}, this.value)"
      />
      <span
        class="checklist__item-delete"
        onclick="onDeleteBasketItem(${id}, ${item.id})"
      >
        x
      </span>
    `;
    checklist.insertBefore(newItem, addItemElement);
  });
}

function showBasket(id) {
  loadBasketIntoView(id);

  var contentLeft = document.querySelector('.content-left');
  contentLeft.style.position = 'absolute';
  contentLeft.style.left = '-100%';

  var contentRight = document.querySelector('.content-right');
  contentRight.style.position = 'relative';
  contentRight.style.right = '0';
}

function closeBasket() {
  var contentLeft = document.querySelector('.content-left');
  contentLeft.style.position = 'relative';
  contentLeft.style.left = '0';

  var contentRight = document.querySelector('.content-right');
  contentRight.style.position = 'absolute';
  contentRight.style.right = '-100%';

  var checklist = contentRight.querySelector('.checklist');
  checklist.style.display = 'none';
}


/* Application functions */
function handleKeyEnterCloseMenu(event) {
  if (event.key === 'Enter') {
    closeMenu();
  }
};

function handleKeyEnterOpenMenu(event) {
  if (event.key === 'Enter') {
    openMenu();
  }
};

function handleKeyEnterCreateNew(event) {
  if (event.key === 'Enter') {
    openCreateModal();
  }
};

function handleKeyEnterShare(event) {
  if (event.key === 'Enter') {
    openShareModal();
  }
};

function openMenu() {
  var openIcon = document.getElementById('menu-open-icon');
  openIcon.style.display = 'none';
  openIcon.tabIndex = '-1';
  openIcon.removeEventListener('keypress', handleKeyEnterOpenMenu);

  var closeIcon = document.getElementById('menu-close-icon');
  closeIcon.style.display = 'inline';
  closeIcon.tabIndex = '0';
  closeIcon.addEventListener('keypress', handleKeyEnterCloseMenu);

  var header = document.getElementById('header');
  header.classList.add('header-menu');

  var template = `
    <div class="overlay menu-overlay" role="dialog" aria-modal="true">
      <div class="container">
        <div class="menu-content">
          <h2>Menu</h2>
          <ul>
            <li tabindex="0"><a>My Baskets</a></li>
          </ul>
          <ul class="menu-bottom">
            <li tabindex="0">
              <a aria-label="View your profile"><img class="user-logo" src="./assets/user.png" />&nbsp;&nbsp;<b>Sam</b></a>
            </li>
            <li tabindex="0">
              <a aria-label="Setup your Basket and share with friends">Settings</a>
            </li>
            <li tabindex="0">
              <a aria-label="More information about Basket">Help</a>
            </li>
            <li tabindex="0">
              <a>Sign out</a>
            </li>
          </ul>
        </div>
      </div>
      <footer class="footer-mobile">
        <div class="container">
          <div class="footer-content">
            <img src="./assets/logo.png" />
            Basket | 2019 &copy; Michiel Bouw
          </div>
          </div>
      </footer>
    </div>
  `;

  openOverlay(template);

  // focus on first nav item
  document.querySelector('.menu-content li').focus();

  const liItems = document.querySelectorAll('.menu-content li');
  Array.from(liItems).forEach(el => {
    el.addEventListener('click', closeMenu);
    el.addEventListener('keypress', handleKeyEnterCloseMenu);
  });
}

function closeMenu() {
  var openIcon = document.getElementById('menu-open-icon');
  openIcon.style.display = 'inline';
  openIcon.tabIndex = '0';
  openIcon.addEventListener('keypress', handleKeyEnterOpenMenu);

  var closeIcon = document.getElementById('menu-close-icon');
  closeIcon.style.display = 'none';
  closeIcon.tabIndex = '-1';
  openIcon.removeEventListener('keypress', handleKeyEnterCloseMenu);

  var header = document.getElementById('header');
  header.classList.remove('header-menu');

  closeOverlay();
}

function openCreateModal() {
  var template = `
    <div class="overlay" role="dialog" aria-modal="true">
      <div class="container container-box">
        <h3>You are about to create a new Basket</h3>
        <p>name: <input type="text" placeholder="enter a name here" /></p>
        <div class="content-action">
          <button onclick="closeOverlay()">Cancel</button>
          <button class="button-primary" onclick="confirmCreateBasket()">Create now</button>
        </div>
      </div>
    </div>
  `;

  openOverlay(template);

  // focus on input
  document.querySelector('.overlay input').focus();
}

function confirmCreateBasket() {
  var input = document.querySelector('.overlay input');
  var name = input.value || 'My Basket';

  var newId = addBasket(name);

  closeOverlay();

  loadBasketsIntoView();
  loadBasketIntoView(newId);
}

function openShareModal(id) {
  var template = `
    <div class="overlay" role="dialog" aria-modal="true">
      <div class="container container-box">
        <h3>Share your Basket</h3>
        <p>To share this list with friends and family just add them with one click.</p>
        <label for="share1" class="checker">
          <input class="checkbox" id="share1" type="checkbox">
          <div class="checked"></div>
        </label>
        Alice
        <br />
        <label for="share2" class="checker">
          <input class="checkbox" id="share2" type="checkbox">
          <div class="checked"></div>
        </label>
        Bob
        <br />
        <label for="share3" class="checker">
          <input class="checkbox" id="share3" type="checkbox">
          <div class="checked"></div>
        </label>
        Carol
        <br />
        <label for="share4" class="checker">
          <input class="checkbox" id="share4" type="checkbox">
          <div class="checked"></div>
        </label>
        David
        <div class="content-action">
          <button onclick="closeOverlay()">Cancel</button>
          <button class="button-primary" onclick="confirmShare(${id})">Share now</button>
        </div>
      </div>
    </div>
  `;

  openOverlay(template);

  // focus on CTA button
  document.querySelector('.overlay button.button-primary').focus();
}

function confirmShare(id) {
  console.log('Sharing is technically not possible right now.', id);

  closeOverlay();
}

function openDeleteModal(id) {
  // TODO get basket name by id

  var template = `
    <div class="overlay" role="dialog" aria-modal="true">
      <div class="container container-box">
        <h3>Delete your Basket</h3>
        <p>Are you sure you want to delete this Basket?</p>
        <div class="content-action">
          <button onclick="closeOverlay()">Cancel</button>
          <button class="button-primary" onclick="confirmDelete(${id})">Delete now</button>
        </div>
      </div>
    </div>
  `;

  openOverlay(template);

  // focus on CTA button
  document.querySelector('.overlay button.button-primary').focus();
}

function confirmDelete(id) {
  deleteBasket(id);

  closeOverlay();
  closeBasket();

  loadBasketsIntoView(true);
}

function addNewItem(basketId) {
  var newItemId = createBasketItem(basketId);

  var checklist = document.querySelector('.checklist');
  var newItem = document.createElement('div');
  newItem.classList.add('checklist__item');
  newItem.innerHTML = `
    <label for="${newItemId}" class="checker">
      <input
        class="checkbox"
        id="${newItemId}"
        type="checkbox"
        onchange="onChangeBasketItemChecked(${basketId}, ${newItemId}, this.checked)"
      />
      <div class="checked"></div>
    </label>
    <input
      type="text"
      placeholder="name your item"
      onchange="onChangeBasketItemName(${basketId}, ${newItemId}, this.value)"
    />
    <span
      onclick="onDeleteBasketItem(${basketId}, ${newItemId})"
    >
      x
    </span>
  `;
  checklist.insertBefore(newItem, document.querySelector('.checklist__add'));

  var newInput = newItem.querySelector('input[type="text"]');
  if (newInput) {
    newInput.focus();
  }
}

function onDeleteBasketItem(basketId, itemId) {
  deletBasketItem(basketId, itemId);

  loadBasketIntoView(basketId);
}

function onChangeBasketItemName(basketId, itemId, value) {
  updateBasketItemName(basketId, itemId, value);
}

function onChangeBasketItemChecked(basketId, itemId, isChecked) {
  updateBasketItemChecked(basketId, itemId, isChecked);

  loadBasketIntoView(basketId);
}


/* Onboarding functions */
function openOnboardingModal() {
  var template = `
    <div class="overlay" role="dialog" aria-modal="true" style="opacity: 1">
      <div class="container container-box onboarding-box">
        <div class="onboarding-box__visual">
          <label for="trigger1" class="checker">
            <input class="checkbox" id="trigger1" type="checkbox" checked="checked">
            <div class="checked"></div>
          </label>
          <div class="visual-line visual-line-70"></div>
          <br />
          <label for="trigger2" class="checker">
            <input class="checkbox" id="trigger2" type="checkbox" checked="checked">
            <div class="checked"></div>
          </label>
          <div class="visual-line visual-line-80"></div>
          <br />
          <label for="trigger3" class="checker">
            <input class="checkbox" id="trigger3" type="checkbox">
            <div class="checked"></div>
          </label>
          <div class="visual-line visual-line-70"></div>
          <br />
          <label for="trigger4" class="checker">
            <input class="checkbox" id="trigger4" type="checkbox" checked="checked">
            <div class="checked"></div>
          </label>
          <div class="visual-line visual-line-80"></div>
          <br />
          <label for="trigger5" class="checker">
            <input class="checkbox" id="trigger5" type="checkbox">
            <div class="checked"></div>
          </label>
          <div class="visual-line visual-line-60"></div>
        </div>

        <div>
          <h2 class="onboarding-box__title">
            Welcome to <img src="./assets/logo.png" />Basket
          </h2>

          <p class="onboarding-box__content">
            Basket your online shopping list to help
            you manage and shop together with your friends
            and family.
            <br /><br />
            Create your first Bakset to get going!
          </p>
        </div>

        <button
          class="onboarding-box__button button-primary"
          onclick="nextStepOnboarding()"
        >
          Create a Basket
        </button>
        <button
          class="onboarding-box__skip"
          onclick="nextStepOnboarding(true)"
          aria-label="Skip this introduction, you can always come back via help in the main menu"
        >
          Skip tour
        </button>

        <div class="onboarding-box__steps">
          1 of 4
        </div>
      </div>
    </div>`;

  openOverlay(template);

  // focus on CTA button
  document.querySelector('.overlay .onboarding-box__button').focus();
}

function nextStepOnboarding(isSkipped) {
  var onboardingStatus = getOnboardingStatus();
  var currentOnboadingIndex = onboardingStatus ? onboardingStatus.currentIndex : 1;

  if (!isSkipped) {
    switch (currentOnboadingIndex) {
      case 3:
        console.log('Sharing with email adresses is technically not possible right now.');
        break;
      case 1:
      case 2:
      case 4:
      default:
        break;
    }
  }

  currentOnboadingIndex++;
  setOnboardingIndex(currentOnboadingIndex);

  if (currentOnboadingIndex > 4) {
    setFinishedOnboarding();
    closeOverlay();
    loadBasketsIntoView(true);
    return;
  }

  if (isSkipped) {
    currentOnboadingIndex = 4;
    setOnboardingIndex(currentOnboadingIndex);

    var buttonSkip = document.querySelector('.onboarding-box__skip');
    buttonSkip.style.display = 'none';
  }

  var onboardingBox = document.querySelector('.onboarding-box');
  var onboardingVisual = document.querySelector('.onboarding-box__visual');
  var title = document.querySelector('.onboarding-box__title');
  var content = document.querySelector('.onboarding-box__content');
  var button = document.querySelector('.onboarding-box__button');
  button.blur();
  var steps = document.querySelector('.onboarding-box__steps');
  steps.innerHTML = currentOnboadingIndex.toString() + ' of 4';

  // TODO add content per step
  switch (currentOnboadingIndex) {
    case 2:
      content.innerHTML = `
        We already an item for you. Now let\'s add some more. You only have to type something in the fields above.
        <br /><br />
        Isn\'t it bananas! 🍌
      `;
      button.textContent = 'Next';

      title.style.display = 'none';
      var newTitle = document.createElement('h2');
      newTitle.classList.add('onboarding-box__title');
      newTitle.textContent = 'My first Basket';

      var newBasketId = addBasket('My first Basket');
      var firstItemId = createBasketItem(newBasketId, 'bananas');
      var secondItemId = createBasketItem(newBasketId, '');
      var thridItemId = createBasketItem(newBasketId, '');
      var fourthItemId = createBasketItem(newBasketId, '');

      onboardingBox.insertBefore(newTitle, onboardingVisual);
      onboardingVisual.style.width = '100%';
      onboardingVisual.innerHTML = `
        <label for="${firstItemId}" class="checker">
          <input
            class="checkbox"
            id="${firstItemId}"
            type="checkbox"
            onchange="onChangeBasketItemChecked(${newBasketId}, ${firstItemId}, this.checked)"
          />
          <div class="checked"></div>
        </label>
        <input
          type="text"
          placeholder="add item"
          value="bananas"
          onchange="onChangeBasketItemName(${newBasketId}, ${firstItemId}, this.value)"
        />
        <br />
        <label for="${secondItemId}" class="checker">
         <input
            class="checkbox"
            id="${secondItemId}"
            type="checkbox"
            onchange="onChangeBasketItemChecked(${newBasketId}, ${secondItemId}, this.checked)"
          />
          <div class="checked"></div>
        </label>
        <input
          type="text"
          placeholder="add item"
          onchange="onChangeBasketItemName(${newBasketId}, ${secondItemId}, this.value)"
        />
        <br />
        <label for="${thridItemId}" class="checker">
          <input
            class="checkbox"
            id="${thridItemId}"
            type="checkbox"
            onchange="onChangeBasketItemChecked(${newBasketId}, ${thridItemId}, this.checked)"
          />
          <div class="checked"></div>
        </label>
        <input
          type="text"
          placeholder="add item"
          onchange="onChangeBasketItemName(${newBasketId}, ${thridItemId}, this.value)"
        />
        <br />
        <label for="${fourthItemId}" class="checker">
          <input
            class="checkbox"
            id="${fourthItemId}"
            type="checkbox"
            onchange="onChangeBasketItemChecked(${newBasketId}, ${fourthItemId}, this.checked)"
          />
          <div class="checked"></div>
        </label>
        <input
          type="text"
          placeholder="add item"
          onchange="onChangeBasketItemName(${newBasketId}, ${fourthItemId}, this.value)"
        />
      `;

      var buttonSkip = document.querySelector('.onboarding-box__skip');
      buttonSkip.style.display = 'none';

      break;
    case 3:
      content.innerHTML = `
        To share you Basket with friends and family just invite them to join.
        <br /><br />
        Sharing is caring.
      `;
      button.textContent = 'Next';
      title.textContent = 'Share your Basket';

      onboardingVisual.innerHTML =
        '<textarea rows="1" placeholder="add an email address here"></textarea>';

      break;
    case 4:
    default:
      content.innerHTML = `
        You are now ready to manage and shop together with your friends and family!
        <br /><br />
        You can always come back here via help in the main menu.
      `;
      button.textContent = 'Start';
      title.innerHTML = '<img src="./assets/logo.png" />Basket';

      onboardingVisual.style.display = 'none';

      break;
  }
}


/* Initialize the app */
init();
