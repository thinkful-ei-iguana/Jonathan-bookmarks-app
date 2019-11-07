/* global Store, Bookmarks, API, $ */
$(function() {
  // Bind event listeners
  Bookmarks.bindEventListeners();
  // Make API call to server, get all bookmarks currently saved
  API.getBookmarks(bookmarks => {
    // Loop through bookmarks, add to Store
    bookmarks.forEach(bookmark => Store.addBookmarkToStore(bookmark));
    // Render
    Bookmarks.render();
    console.log(bookmarks);
  });
});