/* global Store */
const HTMLBuild = (function() {
  //HTMLBuilders
  // Generate bookmarks list (HTML)
  function generateBookmarksListHTML(arrayOfBookmarks, filterValue) {
    return mapFilterBookmarks(
      filterBookmarks(arrayOfBookmarks, filterValue)
    );
  }

  // Build bookmark list
  function buildBookmarkList(bookmark) {
    let hiddenStatus = Store.checkHiddenStatus(bookmark);
    return renderBuilders(bookmark, hiddenStatus);
  }

  // Build HTML, return item's HTML
  function renderBuilders(bookmark, hiddenStatus) {
    return `
    ${buildListItem(bookmark)}
    ${buildBookmarkLabel(bookmark)}
    ${buildDiv(hiddenStatus)}
      ${buildBookmarkDescription(bookmark)}
      ${buildBookmarkURL(bookmark)}${buildEdit()}
      ${buildDelete(bookmark)}
    ${buildListCloseTags()}
    `;
  }

  // Build <li> for IDs
  function buildListItem(bookmark) {
    return `<li class='bookmark-item js-bookmark-item' data-id=${bookmark.id}>`;
  }

  // Close <divs> and <li>
  function buildListCloseTags() {
    return `</aside>
    </li>`;
  }

  // Build <div> with hidden status
  function buildDiv(hiddenStatus) {
    return `<aside class='bookmark-body ${hiddenStatus}' role="complementary">`;
  }

  // Build Bookmark Labels
  function buildBookmarkLabel(bookmark) {
    return `<section class='bookmark-header js-bookmark-header'><button class='header-button'>${
      bookmark.title
    } ${buildRating(bookmark)}</button></section>`;
  }

  // Build HTML for URLs
  function buildBookmarkURL(bookmark) {
    return `<a href='${bookmark.url}'>${buildVisit()}</a>`;
  }

  // Visit button
  function buildVisit() {
    return '<button class="js-btn-visit" aria-label="Visit site">VISIT</button>';
  }

  // Edit button
  function buildEdit() {
    return '<button class="edit-btn js-btn-edit" aria-label="Edit bookmark">EDIT</button>';
  }

  // Delete button
  function buildDelete() {
    return '<button class="bookmark-button js-btn-delete" aria-label="Delete bookmark">DELETE</button>';
  }

  // Description
  function buildBookmarkDescription(bookmark) {
    return checkForDescription(bookmark)
      ? `<p>Description: ${bookmark.desc}</p>`
      : '';
  }

  // Check for description
  function checkForDescription(bookmark) {
    if (bookmark.desc) return true;
    return false;
  }

  // Rating
  function buildRating(bookmark) {
    return checkForRating(bookmark)
      ? ` ${buildStars(bookmark.rating)}`
      : '';
  }

  // Check for rating
  function checkForRating(bookmark) {
    if (bookmark.rating) return true;
    return false;
  }

  // Stars
  function buildStars(rating) {
    const ariaLabel = `<span aria-label="rating: ${rating} stars">`;
    const starsArray = [ariaLabel];
    const closeSpan = '</span>';

    for (let i = 0; i < rating; i++) {
      addStar(starsArray, rating);
    }
    starsArray.push(closeSpan);
    return starsArray.join('');
  }
  function addStar(array) {
    array.push('<i class="fa fa-star" aria-hidden="true"></i>');
  }

  // Filter based on rating
  function filterBookmarks(arrayOfBookmarks, filterValue) {
    return arrayOfBookmarks.filter(bookmark => bookmark.rating >= filterValue);
  }

  // Map filter bookmarks to HTML
  function mapFilterBookmarks(arrayOfBookmarks) {
    return arrayOfBookmarks.map(buildBookmarkList);
  }

  // Build HTML for new form
  function buildUpdatedForm() {
    return `
      <form id='js-edit-form'>
      <div>
      <legend>Update Bookmark</legend>
        <div class='col-6'>
          <!-- Title -->
          <label for='js-form-title'>Title</label>
          <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Enter Title'></li>
          <!-- Description -->
          <label for='js-form-description'>Description</label>
          <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="Add Description"></textarea>
        </div>
        <div class='col-6'>
        <!-- URL -->
          <label for='js-form-url'>URL</label>
          <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='starting with https://'></li>
          <!-- Rating -->
          <label for='js-form-rating' id='rating-label'>Rating: </label>
          <select id='js-form-rating' name='rating' aria-labelledby='rating-label'>
            <option value='5'>5</option>
            <option value='4'>4</option>
            <option value='3'>3</option>
            <option value='2'>2</option>
            <option value='1'>1</option>
          </select>
        </div>
        <!-- Add/Cancel button -->
        <div class='add-btn-container col-12'>
          <button type='submit' id='js-update-bookmark' class='add-button'>UPDATE BOOKMARK</button>
          <button type='button' id='js-cancel-bookmark'>CANCEL</button>
        </div>
        </div>
      </form>
      `;
  }

  // Build new bookmark form
  function buildNewForm() {
    return `
    <form id='js-new-item-form'>
    <div>
    <legend>New Bookmark</legend>
      <div class='col-6'>
        <!-- Title -->
        <label for='js-form-title'>Title</label>
        <li class='new-item-li'><input type='text' id='js-form-title' name='title' placeholder='Add Title'></li>
        <!-- Description -->
        <label for='js-form-description'>Description</label>
        <li class='new-item-li'><textarea id='js-form-description' name='description' placeholder="Add Description"></textarea>
      </div>
      <div class='col-6'>
      <!-- URL -->
        <label for='js-form-url'>URL</label>
        <li class='new-item-li'><input type='url' id='js-form-url' name='url' placeholder='starting with https://'></li>
        <!-- Rating -->
        <label for='js-form-rating' id='rating-label'>Rating: </label>
        <select id='js-form-rating' name='rating' aria-labelledby='rating-label'>
          <option value='5' selected>5</option>
          <option value='4'>4</option>
          <option value='3'>3</option>
          <option value='2'>2</option>
          <option value='1'>1</option>
        </select>
      </div>
      <!-- Add button -->
      <div class='add-btn-container col-12'>
        <button type='submit' id='js-add-bookmark' class='add-button'>Click to Add!</button>
        <button type='button' id='js-cancel-bookmark'>Cancel</button>
      </div>
      </div>
    </form>
    `;
  }

  return {
    buildUpdatedForm,
    buildNewForm,
    generateBookmarksListHTML
  };
})();